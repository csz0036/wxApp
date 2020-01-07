
const path = require('path')
const fs = require('fs')
const conf = require('../../config')
const through2 = require('through2')
const parser = require('mpvue-loader/lib/parser')
const log = require('fancy-log')
const scriptCompiler = require('./script')
const templateCompiler = require('./template')
const stylesCompiler = require('./styles')
const jsonCompiler = require('./json')

let appOptions = {}
let pages = []
let currentLen = -1

function sfc (options) {
  let config = Object.assign({}, {
    sourceMap: false
  }, options)

  return through2.obj(function (file, enc, cb) {
    let content = file.contents.toString()
    let filePath = path.parse(file.relative)
    let fileName = path.basename(file.path)
    // 将vue文件转换成节点树
    let parts = parser(content, fileName, config.sourceMap)
    if(currentLen === -1){
      currentLen = pages.length
    }
    // 处理script
    scriptCompiler.call(this, parts.script, file, config.sourceMap, config.useBabel)
    // 处理模板
    templateCompiler.call(this, parts.template, filePath)
    // 处理样式
    stylesCompiler.call(this, parts.styles, filePath)
    // 处理json配置
    let jsonCompileResult = jsonCompiler.call(this, parts.script, file)
    if (typeof jsonCompileResult === 'string') {
      const idx = pages.indexOf(jsonCompileResult)
      if(idx === -1){
        pages.push(jsonCompileResult)
      }else{
        pages[idx] = jsonCompileResult
      }
    } else if (typeof jsonCompileResult === 'object') {
      appOptions = jsonCompileResult
    }

    return cb()
  }, cb => {
    currentLen = pages.length
    // 合并生成app.json，统一添加路由
    // 分包处理
    let options = {
      pages: [],
      subpackages: [],
    }
    let subpackages = {}
    for (let i = 0; i < pages.length; i++) {
      let item = pages[i]
      let key = item.split('/')[0]
      if(key === 'pages'){
        if(item !== config.indexPage){
          options[key].push(item)
        }
      }else{
        if(subpackages[key]){
          subpackages[key].push(item)
        }else{
          subpackages[key] = [ item ]
        }
      }
    }
    for (let key in subpackages){
      let subItem = subpackages[key]
      let obj = Object.assign({}, conf.packages[key], {
        pages: [],
        root: key
      })
      for (let i = 0; i < subItem.length; i++) {
        let pageItem = subItem[i].split('/')
        pageItem.shift()
        obj.pages.push(pageItem.join('/'))
      }
      options.subpackages.push(obj)
    }

    options.preloadRule = conf.preloadRule

    // 设置首页
    const indexOfPage = options.pages.indexOf(conf.indexPage)
    if(indexOfPage > -1){
      options.pages.splice(indexOfPage, 1)
    }
    options.pages.unshift(conf.indexPage)

    let appConfig = JSON.stringify(Object.assign({}, appOptions, options), null, 2)

    let appPath = path.posix.join(process.cwd(), conf.outputPath, 'app.json')
    fs.writeFile(appPath, appConfig, err => {
      if(err) return log.error(err)
    })

    cb()
  })
}

module.exports = sfc

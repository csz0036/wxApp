const gulp = require('gulp')
const del = require('del')
const config = require('../../config')
const path = require('path')
const fs = require('fs')
const log = require('fancy-log')

const sfcTask = require('./sfcTask')
const styleTask = require('./styleTask')
const scriptTask = require('./scriptTask')
const copyTask = require('./copyTask')

const assertsPath = 'src'
const outputPath = config.outputPath

function deleteRouterPath (file){
  const appPath = `${outputPath}/app.json`
  const relative = file

  const root = relative.split('/')[1]

  fs.readFile(appPath, 'utf8', (err, data) => {
    if(err) return err
    let json = JSON.parse(data)
    if(root === 'pages'){
      const fileSource = file.replace(assertsPath + '/', '').replace('.vue', '')
      let idx = json.pages.indexOf(fileSource)
      if(idx > -1){
        json.pages.splice(idx, 1)
      }
    }else {
      json.subpackages.forEach(item => {
        if(item.root === root){
          const fileSource = file.replace(assertsPath + '/' + root + '/', '').replace('.vue', '')
          let idx = item.pages.indexOf(fileSource)
          if(idx > -1){
            item.pages.splice(idx, 1)
          }
        }
      })
    }
    let options = JSON.stringify(json, null, 2)
    fs.writeFile(appPath, options, err => {
      if(err) return log.error(err)
    })
  })
}

// watch
const watchHandler = (type, file) => {
  const extname = path.extname(file)
  if (type === 'removed') {
    let tmp
    if (extname === '.scss') {
      tmp = [file.replace(assertsPath + '/', outputPath + '/').replace(extname, '.wxss')]
    } else if (extname === '.vue') {
      tmp = ['.js', '.wxss', '.wxml', '.json'].map(item => {
        return file.replace(assertsPath + '/', outputPath + '/').replace(extname, item)
      })
      // 重新生成app.json
      deleteRouterPath(file)
    } else {
      [tmp] = [file.replace(assertsPath + '/', outputPath + '/')]
    }
    if (typeof tmp === 'string') {
      del(tmp)
    } else {
      del([...tmp])
    }

    log.error(`----- : ${file}已删除`)

  } else {
    switch (extname) {
      case '.vue':
        sfcTask()
        break
      case '.scss':
        // styleTask()
        break
      case '.js':
        scriptTask()
        break
      default:
        copyTask()
    }
  }
}

// 监听文件
module.exports = watchTask = (cb) => {
  const watcher = gulp.watch([assertsPath])

  watcher.on('change', file => {
    watchHandler('change', file)
  })
    .on('add', file => {
      watchHandler('add', file)
    })
    .on('unlink', file => {
      watchHandler('removed', file)
    })

  cb()
}

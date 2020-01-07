
const utils = require('../utils')
const path = require('path')
const generator = require('@babel/generator').default
const traverseScript = require('../utils/visitors').traverseScript
const transform = require('../utils/visitors').transform

module.exports = function scriptCompiler(part, file, sourceMap, useBabel = false) {
  if(!part) return

  let options = {
    ast: true,
    inputSourceMap: sourceMap ? part.map : false,
  }

  let result = transform(part.content, file, options)

  traverseScript(result.ast)

  const { code } = generator(result.ast)
  let opt = {
    sourceMaps: sourceMap ? 'both' : false,
    babelrc: useBabel
  }
  if(sourceMap){
    opt.inputSourceMap = result.map
  }

  // 编译es5
  const es5code = transform(code, file, opt).code

  const filePath = path.parse(file.relative)
  let tempFile = utils.createFile(filePath, 'js', es5code)

  this.push(tempFile)
}

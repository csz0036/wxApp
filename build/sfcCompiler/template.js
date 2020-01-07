
const utils = require('../utils')
const beautifyHtml = require('js-beautify').html

module.exports = function scriptCompiler(part, filePath) {
  if(!part) return
  part.content = beautifyHtml(part.content)
  let tempFile = utils.createFile(filePath, 'wxml', part)
  this.push(tempFile)
}

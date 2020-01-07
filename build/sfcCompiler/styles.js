
const utils = require('../utils')

module.exports = function scriptCompiler(part, filePath) {
  if(!part.length) return

  let tempFile = utils.createFile(filePath, 'scss', part[0])

  this.push(tempFile)
}

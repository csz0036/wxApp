
const path = require('path')
const utils = require('../utils')

const configVisitor = require('../utils/visitors').configVisitor
const transform = require('../utils/visitors').transform


module.exports = function jsonCompiler(part, file) {
  if(!part) return

  let options = {
    ast: true
  }

  const result = transform(part.content, file, options)
  let opts = configVisitor(result.ast)
  let config = opts[0]
  let filePath = path.parse(file.relative)
  let tempFile = utils.createFile(filePath, 'json', JSON.stringify(config, null, 2))

  if(opts[1] === 'App'){
    return config
  }
  this.push(tempFile)

  if(opts[1] === 'Page'){
    let path = filePath.dir + '/' + filePath.name
    path = path.replace(/\\/g, '/')
    return path
  }
}

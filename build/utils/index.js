
const path = require('path')
const config = require('../../config/build')
const Vinyl = require('vinyl')
const NODE_ENV = process.env.NODE_ENV

const changeExt = (filePath, ext) => {
  const dir = path.posix.format(path.posix.parse(filePath.dir))
  const name = path.posix.format(path.posix.parse(filePath.name))
  return path.posix.join(assertsPath(), dir, name + '.' + ext)
}

const outputPath = () => {
  return config.env[NODE_ENV].dist
}

const assertsPath = () => {
  return path.posix.join(config.src)
}

// 判断文件类型
const getType = file => {
  return path.parse(file.relative).ext.substring(1)
}
// 判断是否为 scss
const isScss = file => {
  return getType(file) === 'scss' || getType(file) === 'css'
}


const isScript = file => {
  return getType(file) === 'js'
}

const createFile = (filePath, ext, part, map) => {
  let params = {
    base: path.posix.join(process.cwd(), config.src),
    path: changeExt(filePath, ext),
  }
  if(map){
    map.file = path.format(filePath)
    params.sourceMap = map
  }
  if(ext === 'json' || ext === 'js'){
    params.contents = Buffer.from(part)
  }else{
    params.contents = Buffer.from(part.content)
  }

  return new Vinyl(params)
}

module.exports = {
  outputPath,
  assertsPath,
  isScss,
  isScript,
  createFile,
  NODE_ENV
}

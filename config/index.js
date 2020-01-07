

const config = require('./build')
const path = require('path')
const NODE_ENV = process.env.NODE_ENV

const obj = config.env[NODE_ENV]
const assertsPath = path.posix.join(config.src)

const opts = {
  build: {
    assertsPath,
    outputPath: obj.dist,
    useEsLint: false,
    sourceMap: false,
    uglify: false,
    babel: false,
    ts: true,
    indexPage: 'pages/index'
  },
  dev: {
    assertsPath,
    outputPath: obj.dist,
    useEsLint: false,
    sourceMap: true,
    uglify: false,
    babel: false,
    ts: true,
    indexPage: 'pages/index'
  }
}

module.exports = NODE_ENV === 'prod' ? opts.build : opts.dev

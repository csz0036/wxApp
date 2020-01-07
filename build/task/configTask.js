
const gulp = require('gulp')
const changed = require('gulp-changed')
const through2 = require('through2')
const rename = require('gulp-rename')
const debug = require('gulp-debug')
const config = require('../../config')
const build = require('../../config/build')

const assertsPath = config.assertsPath
const outputPath = config.outputPath
const NODE_ENV = process.env.NODE_ENV

module.exports = configTask = () => {
  return gulp.src('config/build.js')
    .pipe(changed(outputPath))
    .pipe(function () {
      return through2.obj(function (file, enc, cb) {
        let obj = Object.assign({}, build.env[NODE_ENV], {
          version: build.version,
          NODE_ENV
        })
        obj = 'export default ' + JSON.stringify(obj, null, 2)
        file.contents = Buffer.from(obj)
        this.push(file)
        return cb()
      })
    }())
    .pipe(rename({
      basename: 'config'
    }))
    .pipe(debug({
      title: '----- 编译完成：'
    }))
    .pipe(gulp.dest(assertsPath))
}

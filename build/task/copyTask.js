
const gulp = require('gulp')
const config = require('../../config')
const changed = require('gulp-changed')
const debug = require('gulp-debug')

const assertsPath = config.assertsPath
const outputPath = config.outputPath

module.exports = copyTask = () => {
  return gulp.src([assertsPath + '/**/*.*', '!' + assertsPath + '/**/*.{scss,ts,js,json,vue}'])
    .pipe(changed(outputPath))
    .pipe(debug({
      title: '----- 编译完成：'
    }))
    .pipe(gulp.dest(outputPath))
}

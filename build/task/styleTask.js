
const path = require('path')
const gulp = require('gulp')
const config = require('../../config')
const utils = require('../utils')
const sass = require('gulp-sass')
const posCss = require('gulp-postcss')
const pxToRpx = require('postcss-px2rpx')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')
const debug = require('gulp-debug')
const changed = require('gulp-changed')
const gulpIf = require('gulp-if')
const cleanCss = require('gulp-clean-css')

const assertsPath = config.assertsPath
const outputPath = config.outputPath
const isUglify = config.uglify

module.exports = styleTask = () => {
  return gulp.src([assertsPath + '/**/*.scss', '!' + assertsPath + '/styles/*.scss'])
    .pipe(changed(outputPath, {extension: '.wxss'}))
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'expanded',
      includePaths: ['src/styles/']
    })
      .on('error', sass.logError))
    .pipe(posCss([pxToRpx]))
    .pipe(plumber())
    .pipe(rename({
      'extname': '.wxss'
    }))
    .pipe(gulpIf(file => {
      return isUglify && utils.isScss(file)
    }, cleanCss()))
    .pipe(debug({
      title: '----- 编译完成：'
    }))
    .pipe(gulp.dest(outputPath))
}

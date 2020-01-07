
const gulp = require('gulp')
const sfcCompiler = require('../sfcCompiler/sfc')
const utils = require('../utils')
const config = require('../../config')
const gulpIf = require('gulp-if')
const sass = require('gulp-sass')
const debug = require('gulp-debug')
const changed = require('gulp-changed')
const plumber = require('gulp-plumber')
const postCss = require('gulp-postcss')
const pxToRpx = require('postcss-px2rpx')
const esLint = require('gulp-eslint')
const uglify = require('gulp-uglify')
const cleanCss = require('gulp-clean-css')
const fibers = require('fibers')
const rename = require('gulp-rename')

const assertsPath = config.assertsPath
const outputPath = config.outputPath
const useEsLint = config.useEsLint
const isUglify = config.uglify
const useBabel = config.babel

module.exports = sfcTask = () => {
  return gulp.src(assertsPath + '/**/*.vue')
    .pipe(changed(outputPath, {extension: '.js'}))
    .pipe(plumber())
    .pipe(gulpIf(useEsLint, esLint({
      useEslintrc: true
    })))
    .pipe(gulpIf(useEsLint, esLint.failOnError()))
    .pipe(sfcCompiler({
      sourceMap: config.sourceMap,
      useBabel
    }))
    .pipe(gulpIf(file => {
      return isUglify && utils.isScript(file)
    }, uglify()))
    .pipe(gulpIf(
      file => {
        return utils.isScss(file)
      },
      sass({
        fibers: fibers,
        errLogToConsole: true,
        outputStyle: 'compressed',
        includePaths: ['src/styles/', 'src/pages/']
      }).on('error', sass.logError)
    ))
    .pipe(gulpIf(file => {
      return isUglify && utils.isScss(file)
    }, cleanCss()))
    .pipe(gulpIf(file => utils.isScss(file), postCss([pxToRpx])))
    .pipe(gulpIf(file => utils.isScss(file), rename({
      extname: '.wxss'
    })))
    .pipe(debug({
      title: '----- 编译完成：'
    }))
    .pipe(gulp.dest(outputPath))
}

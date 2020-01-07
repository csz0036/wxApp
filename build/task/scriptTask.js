
const gulp = require('gulp')
const config = require('../../config')
const changed = require('gulp-changed')
const debug = require('gulp-debug')
const sourceMap = require('gulp-sourcemaps')
const esLint = require('gulp-eslint')
const plumber = require('gulp-plumber')
const gulpIf = require('gulp-if')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')

const assertsPath = config.assertsPath
const outputPath = config.outputPath
const useEsLint = config.useEsLint
const isSourceMap = config.sourceMap
const isUglify = config.uglify
const useBabel = config.babel

module.exports = scriptTask = () => {
  return gulp.src([assertsPath + '/**/*.js'])
    .pipe(changed(outputPath))
    .pipe(plumber())
    .pipe(
      gulpIf(useBabel, babel())
    )
    .pipe(gulpIf(useEsLint, esLint({
      useEslintrc: true
    })))
    .pipe(gulpIf(useEsLint, esLint.failOnError()))
    .pipe(gulpIf(isSourceMap, sourceMap.write()))
    .pipe(gulpIf(isUglify, uglify()))
    .pipe(debug({
      title: '----- 编译完成：'
    }))
    .pipe(gulp.dest(outputPath))
}

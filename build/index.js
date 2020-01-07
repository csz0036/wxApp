
const gulp = require('gulp')
const sfcTask = require('./task/sfcTask')
const imagesTask = require('./task/imagesTask')
const copyTask = require('./task/copyTask')
const watchTask = require('./task/watchTask')
const cleanTask = require('./task/cleanTask')
const scriptTask = require('./task/scriptTask')
const configTask = require('./task/configTask')

gulp.task('default', gulp.series(
  cleanTask,
  configTask,
  gulp.parallel(
    sfcTask,
    imagesTask,
    copyTask,
    scriptTask,
    configTask,
  ),
  watchTask
))

gulp.task('build', gulp.series(
  cleanTask,
  configTask,
  gulp.parallel(
    sfcTask,
    imagesTask,
    copyTask,
    scriptTask,
    configTask,
  )
))

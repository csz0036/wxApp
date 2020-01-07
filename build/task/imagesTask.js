
const gulp = require('gulp')
const config = require('../../config')
const imageMin = require('gulp-imagemin')
const pngQuant = require('imagemin-pngquant')
const cache = require('gulp-cache')
const debug = require('gulp-debug')

const assertsPath = config.assertsPath + '/images'
const outputPath = config.outputPath + '/images'

module.exports = imagesTask = () => {
  return gulp.src(assertsPath + '/*.{png,jpe?g}')
    .pipe(cache(imageMin({
      optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
      progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
      interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
      multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
      svgoPlugins: [{ removeViewBox: false }], //不要移除svg的viewbox属性
      use: [pngQuant()] //使用pngquant深度压缩png图片
    })))
    .pipe(debug({
      title: '----- 编译完成：'
    }))
    .pipe(gulp.dest(outputPath))
}

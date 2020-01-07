
const del = require('del')
const utils = require('../utils')

const outputPath = utils.outputPath()

module.exports = cleanTask = () => del([
  outputPath + '/**',
  `!${outputPath}/project.config.json`,
  `!${outputPath}/app.json`,
])


const t = require('@babel/types')
const babel = require('@babel/core')
const traverse = require('@babel/traverse').default
const log = require('fancy-log')

const NODE_ENV = process.env.NODE_ENV
const fileTypes = {
  page: 'Page',
  app: 'App',
  component: 'Component'
}

// 处理config
const configVisitor = node => {
  let config = {}
  let result = 'Page'
  traverse(node, {
    ObjectProperty (_path) {
      let { key, value } = _path.node

      let keyField = getKeyOrValueFieldByExpression(key)

      if (keyField === 'fileType') {
        result = getFileType(keyField, value)
        value = result
        if(result === 'Component'){
          config = {
            component: true
          }
        }
        return
      }

      if (keyField !== 'config') return
      if (!value) return
      if (!t.isObjectExpression(value)) {
        log.error('config 属性不是一个 ObjectExpression 类型')
        return
      }

      let configProgram = t.program([
        t.expressionStatement(t.assignmentExpression('=', t.identifier('$config'), value))
      ])
      let { code: $config = {} } = babel.transformFromAstSync(configProgram, '', {
        code: true,
        ast: false,
        babelrc: false
      })
      eval($config)
      config = Object.assign({}, config, $config)
    }
  })
  return [config, result]
}

const getKeyOrValueFieldByExpression = keyOrValue => {
  // Example {config: {key, value}}
  if (t.isIdentifier(keyOrValue)) {
    return keyOrValue.name
  }
  // Example {'config': {key, value}}
  if (t.isStringLiteral(keyOrValue)) {
    return keyOrValue.value
  }
  return ''
}

// 获取文件类型
const getFileTypeVisitor = node => {
  let result = fileTypes.page
  traverse(node, {
    ObjectProperty (_path) {
      let { key, value } = _path.node

      let keyField = getKeyOrValueFieldByExpression(key)
      if (keyField === 'fileType') {
        result = fileTypes[getKeyOrValueFieldByExpression(value).toLowerCase()]
      }
    }
  })
  return result
}
// 处理js
const traverseScript = node => {
  let fileType = getFileTypeVisitor(node)
  traverse(node, {
    ExportDefaultDeclaration (_path) {
      let currentNode = _path.node.declaration

      if(fileType === 'App' || fileType === 'Component'){
        _path.replaceWith(
          t.callExpression(
            t.identifier(fileType),
            [currentNode]
          )
        )
      }else{
        _path.replaceWith(
          t.callExpression(
            t.identifier('Page'),
            [t.callExpression(
              t.identifier('getApp().initMixin'),
              [currentNode]
            )]
          )
        )
      }
    }
  })
}

const getFileType = (keyField, value) => {
  return fileTypes[getKeyOrValueFieldByExpression(value).toLowerCase()]
}

const transform = (content, file, opts = {}) => {
  let options = {
    filename: file.path,
    filenameRelative: file.relative,
    sourceFileName: file.relative,
    babelrc: false,
    babelrcRoots: ['.'],
    ...opts
  }
  return babel.transformSync(content, options)
}

module.exports = {
  configVisitor,
  traverseScript,
  transform
}

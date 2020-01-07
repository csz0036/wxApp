## 简介
一款基于gulp的微信小程序项目结构<br>
采用单文件组件的形式开发，内置了standard eslint代码规范、内置 flow.js 的类型检测<Br>
采用部分`iView`组件

## 规范
### 通用
+ 单文件组件以 `.vue` 后缀结尾
+ 文件名称同意用语义化单词命名，多单词之间用 `-` 连接， 例如：倒计时组件，命名为 `count-down.vue`
### 组件
+ 小程序组件的开发都保存在 `src/components` 目录下
+ 组件的引入， 统一在用组件名称之前加 `i-` 开头， 例如：倒计时组件的引入，组件命名为 `i-count-down`

### js
+ 变量定义使用驼峰式、语义化的单词命名，不要使用缩略的字符等
+ 尽量使用箭头函数，如无必要不要单独保存 `this`
+ 尽量不要重复调用 setData 方法，可以合并的尽量合并
+ 不需要渲染到页面上的变量， 不要定义在 `data` 对象中，不要使用 `setData` ，定义在 `$data` 中

### template
+ 不要使用无意义的节点
+ `class` 的定义使用语义化单词用 `-` 进行连接， 例如： `header-content`

### style
+ 使用 `scss` 进行css的预处理

## 单文件模板
采用单文件组件的方式进行开发

### 文件以 `.vue` 结尾

### 文件结构
``` html
<template>
  <view>Hello world!</view>
</template>
<script>
import add from '../utils/index'

export default {
  config: {
    // 配置项, pages 字段可省略
  },
  // 文件类型， page -> page页， component -> 组件， app -> app根文件
  // 如为page页面，可省略该字段
  // 如fileType = 'app'， template标签省略
  fileType: 'page',
  onLoad(){
    add(1)
  }
}
</script>

<style lang="scss">
  view{
    color: #ff0000;
  }
</style>
```

## 运行
``` bash

// 运行监控
npm run dev

// 开发生产
npm run prod

// 打包
npm run build

// dab
npm run qa


```

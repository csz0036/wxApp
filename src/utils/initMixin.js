
const isArray = v => Array.isArray(v)
const isFunction = v => typeof v === 'function'
const isObject = v => v instanceof Object

export default vm => {
  let mixins = getApp().globalData.mixins || []
  if(vm.mixins){
    mixins = mixins.concat(vm.mixins)
  }
  if (mixins.length === 0) return vm
  let result = vm
  for (let i = 0; i < mixins.length; i++) {
    let mixinItem = mixins[i]
    for (let j in mixinItem) {
      let identify = j
      let mixinItemProperty = mixinItem[j]
      if (isArray(result[identify]) && isArray(mixinItemProperty)) {
        result[identify] = [...result[identify], ...mixinItemProperty]
        continue
      }

      if(isFunction(result[identify])){
        continue
      }

      if (isObject(result[identify]) && isObject(mixinItemProperty)) {
        result[identify] = Object.assign({}, result[identify], mixinItemProperty)
        continue
      }

      result[identify] = mixinItemProperty
    }
  }
  return result
}

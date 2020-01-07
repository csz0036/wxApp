
let app = getApp()

// 分割小数点
export const getNumberSplit = num => {
  num = num * 1
  if (!num) return ['0', '00']
  let temp = (num / 100).toFixed(2)
  return temp.split('.')
}


// formId收集
export const collectFormIds = id => {
  let formIds = app.globalData.formIds
  formIds.push(id)
  if(formIds.length > 20){
    formIds.shift()
  }
  app.globalData.formIds = formIds
}
// 校验手机号码
export const checkMobile = mobile => {
  const regExp = /^1[1-9][0-9]\d{8}$/
  return regExp.test(mobile)
}
// 身份证校验
export const isIdCard = card => {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(card)
}
// 银行卡校验
export const isBankCard = card => {
  const reg = /(^\d{16,20}$)/
  return reg.test(card)
}

// 符号替换电话某几位
// str:字符串
// satrt,end:开始、结束位置
// cha: 替换的符号
export const hidePhone = (str, start, end, cha) => {
  let len = end - start
  let newStr = ''
  for(let i = 0; i < len; i++){
    newStr += cha
  }
  return str.substring(0, start) + newStr + str.substring(end, str.length)
}

// 校验手机号码
export const isMobile = mobile => {
  const myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
  return myreg.test(mobile)
}

// 输入框禁止输入emoji表情
export const filterEmoji = name => {
  const myreg = /^[\u4e00-\u9fa5_a-zA-Z]+$/
  return myreg.test(name)
}

/**
 * @description 设置工具栏的字体和背景颜色
 * @param {String} color 十六进制颜色
 * @returns {String} 设置的结果颜色
 */
export const setNavigationBarColor = (color) => {
  if (!/^#[A-Fa-f0-9]{6}$/.test(color)) return '#000000'

  let frontColor = '#000000'

  let r = color.slice(1, 3)
  let g = color.slice(3, 5)
  let b = color.slice(5, 7)

  if (r && g && b) {
    let c = (parseInt(r, 16) + parseInt(g, 16) + parseInt(b, 16)) / 3

    if (c < 128) frontColor = '#ffffff'
  }

  wx.setNavigationBarColor({
    frontColor,
    backgroundColor: color,
    animation: {
      duration: 400,
      timingFunc: 'easeOut'
    }
  })

  return frontColor
}

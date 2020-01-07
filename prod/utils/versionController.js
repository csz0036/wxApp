
import request from './request'
import config from '../config'

const compareVersion = app => {
  if (wx.canIUse('getUpdateManager')) {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(res => {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        updateManager.onUpdateReady(() => {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否马上重启小程序？',
            success: res => {
              if (res.confirm) {
                updateManager.applyUpdate()
                app.globalData.isUpdate = true
              }
            }
          })
        })
        // 新的版本下载失败
        updateManager.onUpdateFailed(function () {
          wx.showModal({
            title: '已经有新版本了哟~',
            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
          })
        })
      }
    })
  } else {
    wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    })
  }
}

const combination = (obj, app) => {
  let memberId = wx.getStorageSync('userInfo').memberId + ''
  // 清除storage
  if(obj.wx_storageKeys.toLowerCase() === 'all'){
    wx.setStorage({
      key: 'clearStorageKey',
      data: obj.wx_storageKeys.toLowerCase()
    })
  }else if(obj.wx_storageKeys && obj.wx_memberId && obj.wx_memberId !== '-1'){
    if(obj.wx_memberId === memberId){
      wx.setStorage({
        key: 'clearStorageKey',
        data: obj.wx_storageKeys
      })
    }
  }
  // 强制更新
  if (obj.wx_updata * 1 === 1) {
    // 判断版本号是否更新
    if (compareVersionNum(obj.wx_variable, config.version)) {
      // 判断是否指定用户
      if (obj.wx_memberId && obj.wx_memberId !== '-1') {
        if (obj.wx_memberId === memberId) {
          compareVersion(app)
        }
      } else {
        compareVersion(app)
      }
    }
  }
}

const compareVersionNum = (target, current) => {
  let targetArr = target.split('.')
  let currentArr = current.split('.')

  for (let i = 0; i < targetArr.length; i++) {
    if(targetArr[i] > currentArr[i]){
      return true
    }else if(targetArr[i] < currentArr[i]){
      return false
    }
  }

  return false
}

export const clearStorage = str => {
  if(wx.removeStorageSync === 'all'){
    wx.clearStorageSync()
    wx.removeStorageSync('clearStorageKey')
    return
  }
  let arr = str.split(',')
  for (let i = 0; i < arr.length; i++) {
    wx.removeStorageSync(arr[i])
  }
  wx.removeStorageSync('clearStorageKey')
}

export const getPlatformConfig = app => {
  request('/platform/getMiniProgramConfig', {}, {
    self: app
  }).then(res => {
    if (res.body) {
      combination(res.body, app)
    }
  })
}

const getPlatformConfigRe = app => {
  getPlatformConfig(app)
  setTimeout(() => {
    getPlatformConfigRe(app)
  }, 600000)
}

export default getPlatformConfigRe

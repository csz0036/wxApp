

import config from '../config'
import { changeNetworkState } from '../store/actions'

const request = (url, data = {}, opts = {
  self: '',
  baseUrl: '',
  mockUrl: '',
  filterCheckedNetworkType: false, // 是否跳过检查网络状态，在错误日志上报时不需要检查状态
  showError: true,
  method: 'POST'
}) => {
  let base = opts.baseUrl || config.baseUrl
  let app = opts.self || getApp()
  const store = app.store

  return new Promise((resolve, reject) => {
    let req = {
      url: opts.mockUrl ? opts.mockUrl : base + url,
      method: opts.method || 'POST',
      data,
      header: {
        'content-type': 'application/json',
        'AFFILIATE-TYPE': app.globalData.affiliate_type,
        'PLATFORM-TYPE': 'MP'
      },
      success: res => {
        if(store.getState().offLine && !opts.filterChecktNetworkType){
          store.dispatch(changeNetworkState(false))
        }
        // console.time(`requestTime:${url}`)
        if(res.data && res.data.head){
          const error = res.data && res.data.head && res.data.head.error
          switch (error) {
            case 0:
              resolve(res.data)
              break
            case -1402:
              app.onError("危险的操作行为")
              wx.redirectTo({
                url: '/pages/index'
              })
              break
            case 402:
              reject(res.data)
              wx.navigateTo({
                url: `/pages/launch/index?isLogin=${1}`
              })
              break
            case 401:
              reject(res.data)
              wx.navigateTo({
                url: `/pages/launch/index?isLogin=${1}`
              })
              break
            default:
              wx.hideLoading()
              if(opts.showError){
                wx.showToast({
                  title: res.data.head.message || '',
                  icon: 'none',
                  duration: 2000
                })
              }
              // app.globalData.fundebug.notify('接口错误：', res.data.head.message)
              reject(res.data)
          }
          // console.timeEnd(`requestTime:${url}`)
        }else{
          wx.hideLoading()
          if(opts.showError){
            wx.showToast({
              title: '网络状态不好，请稍等再试',
              icon: 'none',
              duration: 2000
            })
          }
          // app.globalData.funDebug.notify('接口错误：', JSON.stringify(res.data))
          reject(res.data)
        }
      },
      fail: err => {
        wx.hideLoading()
        if(!store.getState().offLine){
          if(opts.showError){
            wx.showToast({
              title: '网络状态不好，请稍等再试',
              icon: 'none',
              duration: 2000
            })
          }
          store.dispatch(changeNetworkState(true))
        }

        if(opts.baseUrl){
          // 判断是否为网络超时
          wx.getNetworkType({
            success: res => {
              if(res.networkType === 'unknown' || res.networkType === 'none'){
                store.dispatch(changeNetworkState(true))
              }
            }
          })
          reject(err)
        }else {
          request(url, data, {
            self: app,
            baseUrl: 'https://api.songshupinpin.com/',
            filterCheckedNetworkType: true
          }).catch(() => {
            reject(err)
          })
        }
      }
    }
    if(!req.header['LT-TOKEN']){
      const userToken = app.globalData.userInfo && app.globalData.userInfo.token ? app.globalData.userInfo.token : ''
      if(userToken){
        req.header['LT-TOKEN'] = userToken
      }
    }
    if(!req.header['LZADWX'] && app.globalData.community && app.globalData.community.communityId){
      req.header['LZADWX'] = app.globalData.community.communityId
    }
    // formId 收集
    req.header.formIds = JSON.stringify(app.globalData.formIds)

    wx.request(req)
  })
}

export default request

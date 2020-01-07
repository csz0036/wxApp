
import request from './request'
import { SET_NEED_AUTH } from '../store/actionTypes'
import { actionAppLaunch, setReceiveMobile, setReceiveName, setUserInfo } from '../store/actions'

export default class Auth {
  static app
  static userInfo
  static mobile

  static setGlobalData () {
    let app = getApp()
    // 保存用户信息
    app.store.dispatch(setUserInfo(this.userInfo))

    if (this.userInfo.avatarUrl) {
      // 赋值收款人信息
      app.store.dispatch(setReceiveName())
      app.store.dispatch(setReceiveMobile())
    }
  }

  static wxLogin (resolve) {
    // wx.clearStorage()
    wx.login({
      success: res => {
        if(res.code){
          this.getAuth(res, resolve)
        }else{
          setTimeout(() => {
            this.wxLogin(resolve)
          }, 1000)
        }
      },
      fail: err => {
        wx.showToast({
          title: '小程序获取信息失败，请您退出后重新登录',
          icon: 'none'
        })
        console.warn(err)
      }
    })
  }

  static init (self) {
    this.app = self
    this.userInfo = wx.getStorageSync('userInfo')
    return new Promise(resolve => {
      if(self.globalData.isUpdate){
        this.wxLogin(resolve)
        self.globalData.isUpdate = false
      } else if (!this.userInfo || !this.userInfo.token) {
        wx.removeStorageSync('userInfo')
        wx.removeStorageSync('userToken')
        this.wxLogin(resolve)
      } else if(self.globalData.userInfo && self.globalData.userInfo.token){
        resolve()
      }else{
        this.wxLogin(resolve)
      }
    })
  }

  // 登录
  static getAuth (res, resolve) {
    let app = getApp()
    let param = {
      code: res.code,
      prodType: 'SSPP'
    }
    request('/shop-member/miniProgram/auth', param, {
      self: app
    }).then(data => {
      app.store.dispatch(actionAppLaunch())
      // 判断是否为新用户, 0 -> 新用户, 1 -> 老用户
      if (data.body.accountStatus === 0) {
        if (data.body.mobile) {
          this.mobile = data.body.mobile
        }
        app.store.dispatch({
          type: SET_NEED_AUTH,
          payload: true
        })
      } else {
        // 显示授权窗口
        app.store.dispatch({
          type: SET_NEED_AUTH,
          payload: false
        })
      }
      this.userInfo = Object.assign({}, this.userInfo, data.body)
      // 设置全局变量
      this.setGlobalData()
      resolve(data.body)
    }).catch(err => {
      console.warn(err)
      setTimeout(() => {
        this.wxLogin(resolve)
      }, 1000)
    })
  }
}

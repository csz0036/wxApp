

import { changeCommunityAction } from '../store/actions'
import { SET_CAN_GPS, SET_HAS_DEFAULT_COMMUNITY } from '../store/actionTypes'

export default class Location {
  static newCommunityId
  static historyCommunity
  static currentCommunity
  static community

  static init (app, query) {
    this.newCommunityId = this.getCommunityId(query)
    let hasCommunity = this.hasCommunity(app)
    console.log('分享的社区：', this.newCommunityId)
    return new Promise(resolve => {
      // 没有默认社区
      if(this.newCommunityId){
        // 分享进入
        this.requestCommunityInfo(app, this.newCommunityId, resolve)
      }else{
        if(hasCommunity) {
          // 拥有默认社区的处理
          this.requestCommunityInfo(app, this.currentCommunity.communityId, resolve)
        }else{
          // 不是分享，检查gps是否开启
          this.checkGPS(app, resolve)
        }
      }
    })
  }

  static requestCommunityInfo(app, communityId, resolve){
    app.store.dispatch(changeCommunityAction(communityId)).then(resolve)
  }

  static hasCommunity(app){
    this.currentCommunity = this.newCommunityId || wx.getStorageSync('community')
    app.store.dispatch({
      type: SET_HAS_DEFAULT_COMMUNITY,
      payload: !!this.currentCommunity
    })
    return !!this.currentCommunity
  }

  static getCommunityId (opts) {
    if(!opts) return ''
    if (opts.communityId) {
      return opts.communityId
    } else if (opts.community) {
      if (JSON.parse(opts.community) && JSON.parse(opts.community).communityId) {
        return JSON.parse(opts.community).communityId
      }
      return opts.community
    }
    return ''
  }

  static getCityName (data) {
    return data.fullAddress && data.fullAddress.split(',')[1]
  }

  static addToHistory (app, community) {
    let historyCommunity = app.globalData.historyCommunity
    for (let i = 0; i < historyCommunity.length; i++) {
      if(historyCommunity[i].community.communityId === community.community.communityId && i === 1){
        historyCommunity[i] = community
        return
      }
    }
    if (historyCommunity.length > 1) {
      historyCommunity.shift()
    }

    historyCommunity.push(this.community)
    app.globalData.historyCommunity = historyCommunity
    wx.setStorage({
      key: 'historyCommunity',
      data: historyCommunity
    })
  }

  // 检测是否开启定位
  static checkGPS(app, cb){
    wx.authorize({
      scope: 'scope.userLocation',
      success: () => {
        console.log('get GPS success')
        wx.getLocation({
          success: res => {
            console.log('get GPS location success')
            app.globalData.location = {
              lat: res.latitude,
              lng: res.longitude
            }
            app.store.dispatch({
              type: SET_CAN_GPS,
              payload: true
            })
            cb()
          },
          fail: () => {
            console.log('get GPS location fail')
            app.store.dispatch({
              type: SET_CAN_GPS,
              payload: false
            })
            cb()
          }
        })
      },
      fail: () => {
        console.log('get GPS fail')
        app.store.dispatch({
          type: SET_CAN_GPS,
          payload: false
        })
        cb()
      }
    })
  }

  static openSetting(app){
    return new Promise((resolve, reject) => {
      wx.showModal({
        content: '团购服务需要您的地理位置',
        confirmText: '去开启',
        confirmColor: '#FF673F',
        success: res => {
          if(res.confirm){
            wx.openSetting({
              success: res => {
                if(res.authSetting['scope.userLocation']){
                  wx.getLocation({
                    success: res => {
                      console.log('get GPS location success')
                      getApp().globalData.location = {
                        lat: res.latitude,
                        lng: res.longitude
                      }
                      getApp().store.dispatch({
                        type: SET_CAN_GPS,
                        payload: true
                      })
                      resolve(res)
                    },
                    fail: err => {
                      console.log('get GPS fail')
                      getApp().store.dispatch({
                        type: SET_CAN_GPS,
                        payload: false
                      })
                      reject(err)
                    }
                  })
                } else {
                  reject(res)
                }
              },
              fail: err => {
                reject(err)
              }
            })
          } else if (res.cancel) {
            reject(res)
          }
        },
        fail (err) {
          reject(err)
        }
      })
    })
  }

  static getSetting(needHideToast = false){
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          console.log(res)
          if(res.authSetting['scope.userLocation']){
            wx.getLocation({
              success: res => {
                console.log('get GPS location success')
                getApp().globalData.location = {
                  lat: res.latitude,
                  lng: res.longitude
                }
                getApp().store.dispatch({
                  type: SET_CAN_GPS,
                  payload: true
                })
                resolve(res)
              },
              fail: err => {
                reject(err)
                if(!needHideToast){
                  wx.showToast({
                    title: '请确认您已授权，并且微信已开启位置授权',
                    icon: 'none'
                  })
                }
                console.log('get GPS fail')
                getApp().store.dispatch({
                  type: SET_CAN_GPS,
                  payload: false
                })
              }
            })
          }else if(!res.authSetting['scope.userLocation']){
            reject(res)
            if(!needHideToast){
              wx.showToast({
                title: '请确认您已授权，并且微信已开启位置授权',
                icon: 'none'
              })
            }
          }
        },
        fail: err => {
          reject(err)
        }
      })
    })
  }
}

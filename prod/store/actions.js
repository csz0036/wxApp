
import request from '../utils/request'
import {
  APP_LAUNCH_SUCCESS,
  IS_OFFLINE,
  NOT_SET_COMMUNITY,
  COMMUNITY_DISUSED,
  RECEIVED_GIFT,
  SET_COMMUNITY,
  SET_NEW_USER_GIFT,
  SET_NONE_GIFT_PACKAGE,
  SET_PINE_NUTS_GIFT,
  SET_RECEIVE_MOBILE,
  SET_RECEIVE_NAME,
  SET_SURPRISE_GIFT,
  SET_USER_INFO,
  IS_COUPON_TIPS,
  SET_EXPRESS_ADDRESS
} from './actionTypes'

let couponTimer = null

function getCityName (data) {
  return data.fullAddress && data.fullAddress.split(',')[1]
}

// 网络状态
export const changeNetworkState = value => dispatch => {
  wx.stopPullDownRefresh()
  dispatch({
    type: IS_OFFLINE,
    value
  })
}
// 社区修改
export const changeCommunityAction = (communityId) => (dispatch, getState) => {
  const currentCommunity = getState().community
  if (currentCommunity.communityId === communityId) {
    return Promise.resolve(dispatch({
      type: NOT_SET_COMMUNITY
    }))
  }
  return Promise.all([
    request('/shop-goods/community/detail/need/login', {
      communityId
    }),
    request('/shop-community-activity/community/getCommunityCloseStatus', {
      communityId
    })
  ]).then(result => {
    const [res, res1] = result
    if (!res.body || !(res.body.communityStatus && res.body.communityStatus === 'Y')) {
      wx.hideLoading()

      dispatch({
        type: COMMUNITY_DISUSED,
        payload: true
      })
    } else if (res.body) {
      const community = {
        community: {
          ...res.body,
          communityDisused: false,
          isStop: res1.body
        },
        city: {
          districtName: getCityName(res.body),
          districtCode: res.body.cityCode
        }
      }
      getApp().globalData.community = res.body
      wx.setStorage({
        key: 'community',
        data: res.body
      })
      wx.setStorage({
        key: 'city',
        data: community.city
      })
      dispatch({
        type: COMMUNITY_DISUSED,
        payload: false
      })
      dispatch({
        type: SET_COMMUNITY,
        payload: community
      })
    }
  }).catch(() => {
    dispatch({
      type: NOT_SET_COMMUNITY
    })
  })
}
// 小程序启动
export const actionAppLaunch = () => ({
  type: APP_LAUNCH_SUCCESS,
})

// 设置用户信息
export const setUserInfo = userInfo => dispatch => {
  getApp().globalData.userInfo = userInfo
  wx.setStorage({
    key: 'userInfo',
    data: userInfo
  })
  dispatch({
    type: SET_USER_INFO,
    payload: userInfo
  })
}
// 设置收货信息
export const setReceiveName = nickName => (dispatch, getState) => {
  if (nickName) {
    wx.setStorage({
      key: 'receiveName',
      data: nickName
    })
    dispatch({
      type: SET_RECEIVE_NAME,
      payload: nickName
    })
  } else {
    wx.getStorage({
      key: 'receiveName',
      success: res => {
        let payload = res.data || getState().userInfo.nickName
        dispatch({
          type: SET_RECEIVE_NAME,
          payload
        })
      },
      fail: () => {
        const payload = getState().userInfo.nickName
        wx.setStorage({
          key: 'receiveName',
          data: payload
        })
        dispatch({
          type: SET_RECEIVE_NAME,
          payload
        })
      }
    })
  }
}
// 设置收货手机号
export const setReceiveMobile = mobile => (dispatch, getState) => {
  if (mobile) {
    wx.setStorage({
      key: 'mobile',
      data: mobile
    })
    dispatch({
      type: SET_RECEIVE_MOBILE,
      payload: mobile
    })
  } else {
    wx.getStorage({
      key: 'mobile',
      success: res => {
        let payload = res.data || getState().userInfo.mobile || ''
        dispatch({
          type: SET_RECEIVE_MOBILE,
          payload
        })
      },
      fail: () => {
        const payload = getState().userInfo.mobile || ''
        wx.setStorage({
          key: 'mobile',
          data: payload
        })
        dispatch({
          type: SET_RECEIVE_MOBILE,
          payload
        })
      }
    })
  }
}
// 落地页红包
export const setLandGift = (stage = 0) => (dispatch, getState) => {
  const {
    community: { communityId, isStop, manageCityCode },
    appLoadStatus: { type },
    giftPackage: { hasRequested },
    userInfo: { memberId }
  } = getState()
  if(!memberId || hasRequested) {
    return Promise.resolve()
  }
  const app = getApp()

  if (((isStop && isStop.status === 1) || !isStop) && communityId) {
    switch (stage) {
      case 0:
        return request('/shop-member-strategy/sky/reward/receive', {
          cityCode: manageCityCode,
          communityId,
          memberId
        }, {
          showError: false
        }).then(res => {
          if (res.body.rewardMark === 10) {
            dispatch({
              type: SET_SURPRISE_GIFT,
              payload: res.body.rewardList
            })
          } else {
            return app.store.dispatch(setLandGift(1))
          }
        })
      case 1:
        if (type > 0) {
          return request('/shop-member-strategy/market/newcomer/display', {
            communityId,
            activityId: 2
          }).then(res => {
            if (res.body.result === 0) {
              dispatch({
                type: SET_NEW_USER_GIFT,
                payload: res.body.prizeList
              })
            } else {
              return app.store.dispatch(setLandGift(2))
            }
          })
        }
        return app.store.dispatch(setLandGift(2))
      case 2:
        let lanternFestivalFlag = wx.getStorageSync('LanternFestival') || {}
        let currentDateStr = new Date().toLocaleDateString()

        if (!lanternFestivalFlag[currentDateStr]) {
          return request('/shop-member-strategy/pinenut/challenge/flag', {
            communityId,
            activityId: 6
          }).then(res => {
            if (res.body && res.body.hasActivity === 1) {
              let obj = {}
              obj[currentDateStr] = true
              wx.setStorage({
                key: 'LanternFestival',
                data: obj
              })
              dispatch({
                type: SET_PINE_NUTS_GIFT,
                payload: res.body
              })
            } else {
              return app.store.dispatch(setLandGift(3))
            }
          })
        }
        return app.store.dispatch(setLandGift(3))
      default:
        return Promise.resolve(dispatch({
          type: SET_NONE_GIFT_PACKAGE
        }))
    }
  } else {
    return Promise.resolve(dispatch({
      type: SET_NONE_GIFT_PACKAGE
    }))
  }
  // 检测是否为新人
}
// 领取落地页红包
export const receiveLandGift = () => dispatch => {
  dispatch({
    type: RECEIVED_GIFT
  })
}
// 优惠券提示show
export const showCouponTips = () => (dispatch, getState) => {
  const { userInfo } = getState()
  if(userInfo.memberId) {
    request('/shop-member/coupon/v1/usable/tip').then(res => {
      if (res.body) {
        dispatch({
          type: IS_COUPON_TIPS,
          payload: true
        })
        couponTimer = setTimeout(() => {
          dispatch(hideCouponTips())
        }, 10000)
      }
    })
  }else {
    return Promise.resolve()
  }
}
// 优惠券提示hide
export const hideCouponTips = () => (dispatch, getState) => {
  const { userInfo } = getState()
  if(userInfo.memberId) {
    couponTimer && clearTimeout(couponTimer)
    dispatch({
      type: IS_COUPON_TIPS,
      payload: false
    })
    request('/shop-member/coupon/v1/usable/tip/cache')
  }else {
    return Promise.resolve()
  }
}

/**
 * @description 设置快递地址
 */
export const setExpressAddressInfo = (obj) => dispatch => {
  let o = obj

  if (o) {
    let fullAddress = obj.provinceName + obj.cityName + obj.countyName + obj.detailAddress

    o = Object.assign({}, obj, {
      fullAddress
    })
  }

  dispatch({
    type: SET_EXPRESS_ADDRESS,
    payload: o
  })
}

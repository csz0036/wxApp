
import {
  APP_LAUNCH_SUCCESS,
  CHANGE_CITY,
  CLEAR_COUPON,
  IS_COUPON_TIPS,
  IS_OFFLINE,
  SELECT_COUPON,
  SET_RECEIVE_MOBILE,
  SET_RECEIVE_NAME,
  SET_USER_INFO,
  COMMUNITY_DISUSED,
  SELECT_ADDRESS,
  SET_EXPRESS_ADDRESS,
} from '../actionTypes'
import community from './community'
import historyCommunity from './historyCommunity'
import city from './city'
import appLoadStatus from './appLoadStatus'
import giftPackage from './giftPackage'

export default {
  community,
  historyCommunity,
  city,
  offLine: (state = false, action) => {
    if (action.type === IS_OFFLINE) {
      return action.value
    }
    return state
  },
  // 小程序初始化是否完成
  appLaunchSuccess: (state = false, action) => {
    if (action.type === APP_LAUNCH_SUCCESS) {
      return true
    }
    return state
  },
  // 小程序启动状态
  appLoadStatus,
  // 当前使用的优惠券
  currentCoupon: (state = {}, action) => {
    if (action.type === SELECT_COUPON) {
      return action.payload
    } else if (action.type === CLEAR_COUPON) {
      return {}
    }
    return state
  },
  // 切换城市
  changeCity: (state = '', action) => {
    if (action.type === CHANGE_CITY) {
      return action.payload
    }
    return state
  },
  // 用户信息
  userInfo: (state = {}, action) => {
    if (action.type === SET_USER_INFO) {
      return action.payload
    }
    return state
  },
  // 收货人信息
  receiveInfo: (state = {
    nickName: '',
    mobile: ''
  }, action) => {
    if (action.type === SET_RECEIVE_NAME) {
      return {
        ...state,
        nickName: action.payload
      }
    } else if (action.type === SET_RECEIVE_MOBILE) {
      return {
        ...state,
        mobile: action.payload
      }
    }
    return state
  },
  giftPackage,
  isShowCoupon: (state = false, action) => {
    if (action.type === IS_COUPON_TIPS) {
      return action.payload
    }

    return state
  },
  communityDisused: (state = false, action) => {
    if (action.type === COMMUNITY_DISUSED) {
      return action.payload
    }

    return state
  },
  // 当前收货地址
  currentAddress: (state = {}, action) => {
    if (action.type === SELECT_ADDRESS) {
      return action.payload
    }

    return state
  },
  /**
   * @description 快递地址
   */
  expressAddressInfo: (state = null, action) => {
    if (action.type === SET_EXPRESS_ADDRESS) {
      return action.payload
    }

    return state
  }
}

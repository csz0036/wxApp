
<template>
  <view>111</view>
  <i-modal
    visible="{{needAuth}}"
    scrollUp="{{false}}"
  >
    <view class="auth-content">
      <image src="https://via.placeholder.com/150" class="bg"></image>
      <view class="h1">终于等到您</view>
      <view class="h2">为了完整体验该小程序，需要您的授权。（授权仅用于用户识别，用户昵称与头像）</view>
      <view class="btn-group" wx:if="canIUse">
        <i-button
          i-class="cancel"
          bindclick="goBack"
        >取消</i-button>
        <i-button
          i-class="confirm"
          open-type="getUserInfo"
          bindgetuserinfo="bindGetUserInfo"
          loading="{{btnLoading}}"
        >确认授权</i-button>
      </view>
      <view wx:else class="confirm">请升级微信版本</view>
    </view>
  </i-modal>
</template>

<script>
import request from '../utils/request'
import Location from '../utils/Location'
import appLaunch from '../utils/appLaunch'
import { SET_NEED_AUTH } from '../store/actionTypes'
import { setUserInfo } from '../store/actions'

let app = getApp()
export default {
  fileType: 'component',
  config: {
    usingComponents: {
      'i-modal': './modal',
      'i-button': './button',
    }
  },
  properties: {
    needAuth: {
      type: Boolean,
      value: false
    },
    showTurnaround: {
      type: Boolean,
      value: false
    },
    turnaroundList: {
      type: Array
    },
    inviterId: {
      type: String,
      value: ''
    },
    inviterWay: {
      type: String,
      value: ''
    },
  },
  data: {
    btnLoading: false,
    btnText: '去使用'
  },
  methods: {
    bindGetUserInfo (e) {
      if(this.data.btnLoading) return
      let detail = e.detail
      this.setData({
        btnLoading: true
      })

      if (detail.errMsg === 'getUserInfo:ok') {
        let avatarUrl = ''
        if (detail.userInfo && detail.userInfo.avatarUrl !== '') {
          avatarUrl = detail.userInfo.avatarUrl
        }
        let userInfo = {
          avatarUrl,
          nickName: detail.userInfo.nickName,
          encryptedData: detail.encryptedData,
          iv: detail.iv,
          inviterId: app.globalData.inviterInfo ? app.globalData.inviterInfo.inviterId : '',
          inviterWay: app.globalData.inviterInfo ? app.globalData.inviterInfo.inviterWay : ''
        }
        request('/shop-member/miniProgram/updateMemberInfo', userInfo).then(res => {
          this.setData({
            btnLoading: false
          })
          // 合并、保存用户信息
          userInfo = Object.assign({}, app.globalData.userInfo, res.body)
          app.globalData.userInfo = userInfo
          app.store.dispatch({
            type: SET_NEED_AUTH,
            payload: false
          })
      
          app.store.dispatch(setUserInfo(userInfo))
          appLaunch(app, app.globalData.options.query).then(() => {
        
            this.triggerEvent('authSuccess')
          })
        }).catch(() => {
          app.store.dispatch({
            type: SET_NEED_AUTH,
            payload: false
          })
        })
      } else {
        this.setData({
          btnLoading: false
        })
      }
    },
    openSetting(){
      Location.openSetting().then(res => {
        app.globalData.location = {
          lat: res.latitude,
          lng: res.longitude
        }
        if(!app.globalData.community.communityId){
          wx.redirectTo({
            url: '/pages/position/communities'
          })
        }
        app.globalData.canGetGPS = true
      }).catch(() => {})
    },
    goBack(){
      wx.navigateBack({
        delta: 1
      })
    }
  }
}
</script>
<style lang="scss">
  .auth-content{
    width: 260px;
    height: 330px;
    background: #fff;
    border-radius: 12px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;

    .bg{
      width: 260px;
      height: 177px;
      position: absolute;
      top: 0;
      left: 0;
    }

    .title{
      font-size: 13px;
      color: #fe473f;
      margin-bottom: 15px;
    }

    .h1{
      color: #444;
      font-size: 16px;
      margin-bottom: 10px;
    }

    .h2{
      font-size: 12px;
      line-height: 18px;
      color: #999;
      width: 204px;
      margin-bottom: 22px;

      p{
        text-align: center;
        display: block;
      }
    }

    .btn-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 216px;
      margin: 0 auto 15px;

      .cancel {
        width: 100px;
        height: 36px;
        color: #fff;
        background: #e5e5e5;
        font-size: 14px;
        line-height: 36px;
        border-radius: 6px;
        margin: 0;
      }

      .confirm{
        width: 100px;
        height: 36px;
        color: #fff;
        background: linear-gradient(to left, #ff2756, #ff2f30);
        font-size: 14px;
        line-height: 36px;
        border-radius: 6px;
        margin: 0;
      }
    }
  }
  .achieve-coupon-text{
    text-align: center;
    color: #FE473F;

    .title{
      font-size: 13px;
      margin-bottom: 8px;
    }

    .h1{
      font-size: 35px;
      line-height: 35px;
      font-weight: bold;
    }

    .h2{
      font-size: 11px;
      margin-bottom: 15px;
      color: #986565;
    }

    .h3{
      font-size: 16px;
      color: #fe473f;
      font-weight: bold;
    }
  }

  .tips{
    position: absolute;
    width: 100%;
    top: 217px;
    font-size: 11px;
    color: #ffbaba;
    text-align: center;
  }
</style>

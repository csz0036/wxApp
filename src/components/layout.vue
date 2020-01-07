<template>
  <view>
    <view wx:if="{{!offLine}}" class="container {{isIpx && needIpx ? 'mb20' : ''}}">
        <slot></slot>
    </view>
    <view wx:else class="link-fail-content" bindtap="reloadPage">
        <image src="https://via.placeholder.com/150"></image>
        <view class="h1">网络连接超时</view>
        <view class="h2">请检查您的手机是否联网</view>
        <view class="h3">点击屏幕重新加载</view>
    </view>
  </view>  
</template>

<script>
import { connect } from '../lib/wechatAppRedux'

let app = getApp()

const mapToData = state => ({
  offLine: state.offLine
})

export default connect(mapToData)({
  fileType: 'component',
  properties: {
    needIpx: {
      type: Boolean,
      value: true
    }
  },
  data: {
    isIpx: false
  },
  attached(){
    if(app.globalData.isIpx){
      this.setData({
        isIpx: true
      })
    }
  },
  methods: {
    reloadPage(){
      // 判断是否为网络超时
      wx.getNetworkType({
        complete: res => {
          console.log(res)
          if(res.networkType === 'unknown' || res.networkType === 'none'){
            app.globalData.offLine = true
            wx.showToast({
              title: '网络状态不好，请稍等再试',
              icon: 'none',
              duration: 2000
            })
          }else{
            app.globalData.offLine = false
            this.triggerEvent('reloadPage')
          }
        }
      })
    }
  }
})
</script>
<style lang="scss">
  .mb20{
    margin-bottom: 20px;
  }

  .link-fail-content{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 99999;

    image{
      width: 109px;
      height: 109px;
      margin-bottom: 13px;
    }

    .h1{
      color: #666;
      font-size: 15px;
      line-height: 15px;
      margin-bottom: 15px;
    }

    .h2{
      color: #aaa;
      font-size: 13px;
      line-height: 13px;
      margin-bottom: 49px;
    }

    .h3{
      font-size: 13px;
      color: #aaa;
      line-height: 13px;
    }
  }
</style>

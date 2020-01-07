<template>
  <view>
    <!-- <i-auth
      needAuth="{{ isLogin && accountStatus === 0 }}"
    ></i-auth> -->
    <view class="barcode">
      <view class="barnum">{{code}}</view>
      <canvas canvas-id="barcode" />
    </view>
    <view class="qrcode">
      <view class="barnum">{{code}}</view>
      <canvas canvas-id="qrcode" id="qrcode" />
    </view>
  </view>
</template>    

<script>
import wxbarcode from '../utils/wxbarcodeIndex'
// let app = getApp()
export default {
    fileType:'page',
    config: {
      navigationBarBackgroundColor: '#FFF',
      navigationBarTextStyle: 'black',
      navigationBarTitleText: '首页',
      onReachBottomDistance: 500,
      usingComponents: {
        'i-auth': '/components/auth',
      }
    },
    data:{
      offLine: true,
      isLogin: true,
      accountStatus: 0,
      code: '1234567890123456789'
    },
    onLoad:function () {
      wxbarcode.barcode('barcode', '1234567890123456789', 680, 200);
      wxbarcode.qrcode('qrcode', '1234567890123456789', 550, 550);
    },
    onShow(){
    }
//   mixins: [ rushSpuList ],
}
</script>

<style lang="scss">
#qrcode{
  width: 400px;
  height: 600px;
}
</style>
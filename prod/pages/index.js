//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
import wxbarcode from '../utils/wxbarcodeIndex'; // let app = getApp()

Page(getApp().initMixin({
  fileType: 'page',
  config: {
    navigationBarBackgroundColor: '#FFF',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '首页',
    onReachBottomDistance: 500,
    usingComponents: {
      'i-auth': '/components/auth'
    }
  },
  data: {
    offLine: true,
    isLogin: true,
    accountStatus: 0,
    code: '1234567890123456789'
  },
  onLoad: function () {
    wxbarcode.barcode('barcode', '1234567890123456789', 680, 200);
    wxbarcode.qrcode('qrcode', '1234567890123456789', 550, 550);
  },

  onShow() {} //   mixins: [ rushSpuList ],


}));
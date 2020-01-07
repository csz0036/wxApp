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
import { connect } from '../lib/wechatAppRedux';
let app = getApp();

const mapToData = state => ({
  offLine: state.offLine
});

Component(connect(mapToData)({
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

  attached() {
    if (app.globalData.isIpx) {
      this.setData({
        isIpx: true
      });
    }
  },

  methods: {
    reloadPage() {
      // 判断是否为网络超时
      wx.getNetworkType({
        complete: res => {
          console.log(res);

          if (res.networkType === 'unknown' || res.networkType === 'none') {
            app.globalData.offLine = true;
            wx.showToast({
              title: '网络状态不好，请稍等再试',
              icon: 'none',
              duration: 2000
            });
          } else {
            app.globalData.offLine = false;
            this.triggerEvent('reloadPage');
          }
        }
      });
    }

  }
}));
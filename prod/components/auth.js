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
import request from '../utils/request';
import Location from '../utils/Location';
import appLaunch from '../utils/appLaunch';
import { SET_NEED_AUTH } from '../store/actionTypes';
import { setUserInfo } from '../store/actions';
let app = getApp();
Component({
  fileType: 'component',
  config: {
    usingComponents: {
      'i-modal': './modal',
      'i-button': './button'
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
    }
  },
  data: {
    btnLoading: false,
    btnText: '去使用'
  },
  methods: {
    bindGetUserInfo(e) {
      if (this.data.btnLoading) return;
      let detail = e.detail;
      this.setData({
        btnLoading: true
      });

      if (detail.errMsg === 'getUserInfo:ok') {
        let avatarUrl = '';

        if (detail.userInfo && detail.userInfo.avatarUrl !== '') {
          avatarUrl = detail.userInfo.avatarUrl;
        }

        let userInfo = {
          avatarUrl,
          nickName: detail.userInfo.nickName,
          encryptedData: detail.encryptedData,
          iv: detail.iv,
          inviterId: app.globalData.inviterInfo ? app.globalData.inviterInfo.inviterId : '',
          inviterWay: app.globalData.inviterInfo ? app.globalData.inviterInfo.inviterWay : ''
        };
        request('/shop-member/miniProgram/updateMemberInfo', userInfo).then(res => {
          this.setData({
            btnLoading: false
          }); // 合并、保存用户信息

          userInfo = Object.assign({}, app.globalData.userInfo, res.body);
          app.globalData.userInfo = userInfo;
          app.store.dispatch({
            type: SET_NEED_AUTH,
            payload: false
          });
          app.store.dispatch(setUserInfo(userInfo));
          appLaunch(app, app.globalData.options.query).then(() => {
            this.triggerEvent('authSuccess');
          });
        }).catch(() => {
          app.store.dispatch({
            type: SET_NEED_AUTH,
            payload: false
          });
        });
      } else {
        this.setData({
          btnLoading: false
        });
      }
    },

    openSetting() {
      Location.openSetting().then(res => {
        app.globalData.location = {
          lat: res.latitude,
          lng: res.longitude
        };

        if (!app.globalData.community.communityId) {
          wx.redirectTo({
            url: '/pages/position/communities'
          });
        }

        app.globalData.canGetGPS = true;
      }).catch(() => {});
    },

    goBack() {
      wx.navigateBack({
        delta: 1
      });
    }

  }
});
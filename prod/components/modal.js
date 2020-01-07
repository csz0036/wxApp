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
let app = getApp();
Component({
  fileType: 'component',
  externalClasses: ['i-class', 'i-mask-class'],
  properties: {
    // 是否可见
    visible: {
      type: Boolean,
      value: false,

      observer(newVal) {
        if (this.data.closeDelay) {
          setTimeout(() => {
            this.setData({
              isShow: newVal
            });
          }, this.data.closeDelay);
        } else {
          this.setData({
            isShow: newVal
          });
        }
      }

    },
    // 是否允许点击蒙层关闭弹层
    maskClosable: {
      type: Boolean,
      value: true
    },
    // 是否底部弹起
    scrollUp: {
      type: Boolean,
      value: true
    },
    closeDelay: {
      type: Number,
      value: 0
    },
    needIpx: {
      type: Boolean,
      value: true
    }
  },
  data: {
    isIpx: false,
    isShow: false
  },

  attached() {
    this.setData({
      isIpx: app.globalData.isIpx
    });
  },

  methods: {
    stopMove() {},

    handleClickMask() {
      if (!this.data.maskClosable) return;
      this.handleClickCancel();
    },

    handleClickCancel() {
      this.triggerEvent('cancel');
    }

  }
});
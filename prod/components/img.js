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
let app = getApp();
Component({
  fileType: 'component',
  externalClasses: ['i-class'],
  properties: {
    defaultImage: String,
    imgType: {
      type: Number,
      value: 2
    },
    loadImage: {
      type: String,

      observer(newVal) {
        if (newVal) {
          const pixelRatio = Math.ceil(app.globalData.systemInfo.pixelRatio);
          const url = `${newVal}?imageView2/${this.data.imgType}/w/${this.getPx(this.data.width) * pixelRatio}/h/${this.getPx(this.data.height) * pixelRatio}/ignore-error/1`;
          this.setData({
            img: url
          });
        }
      }

    },
    width: String,
    height: String,
    canPreview: {
      type: Boolean,
      value: false
    },
    isLazy: {
      type: Boolean,
      value: false
    },
    imgGroup: {
      type: Array
    },
    needMask: {
      type: Boolean,
      value: true
    }
  },
  methods: {
    imageLoad() {
      this.setData({
        isLoad: true
      });
    },

    bindError(e) {
      console.log(e);
    },

    getPx(px) {
      return Math.round(app.globalData.systemInfo.windowWidth / 375 * px);
    },

    preview() {
      if (this.data.canPreview) {
        wx.previewImage({
          current: this.data.loadImage,
          urls: this.data.imgGroup,
          fail: err => {
            wx.showToast({
              title: '预览图片失败，请重试',
              icon: 'none'
            });
            console.log(err);
          }
        });
      } else {
        this.triggerEvent('goGoodsDetail');
      }
    }

  }
});

<template>
  <view class="i-class img-content">
    <image
      class="i-class img-def {{ isLoad ? 'opacity' : '' }}"
      src="{{defaultImage}}"
      wx:if="{{ needMask }}"
    ></image>
    <image
      class="i-class img-def {{ needMask ? 'opacity' : '' }} {{isLoad && needMask ? 'show-img' : ''}}"
      lazy-load="{{isLazy}}"
      mode="aspectFill"
      src="{{img}}"
      bindload="imageLoad"
      binderror="bindError"
      bindtap="preview"
    ></image>
  </view>
</template>

<script>
let app = getApp()
export default {
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
      observer(newVal){
        if(newVal){
          const pixelRatio = Math.ceil(app.globalData.systemInfo.pixelRatio)
          const url = `${newVal}?imageView2/${this.data.imgType}/w/${this.getPx(this.data.width) * pixelRatio}/h/${this.getPx(this.data.height) * pixelRatio}/ignore-error/1`
          this.setData({
            img: url
          })
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
    imageLoad(){
      this.setData({
        isLoad: true
      })
    },
    bindError(e){
      console.log(e)
    },
    getPx(px){
      return Math.round(app.globalData.systemInfo.windowWidth / 375 * px)
    },
    preview(){
      if(this.data.canPreview){
        wx.previewImage({
          current: this.data.loadImage,
          urls: this.data.imgGroup,
          fail: err => {
            wx.showToast({
              title: '预览图片失败，请重试',
              icon: 'none'
            })
            console.log(err)
          }
        })
      } else {
        this.triggerEvent('goGoodsDetail')
      }
    }
  }
}
</script>

<style lang="scss">
  .img-content{
    position: relative;
    font-size: 0;

    image {
      margin: 0;
      border: 0;
      outline: 0;
    }
  }
  .img-def{
    position: absolute !important;
    top: 0;
    left: 0;
    transition: opacity .6s;
  }

  .opacity{
    opacity: 0;
  }

  .show-img{
    opacity: 1;
  }
</style>

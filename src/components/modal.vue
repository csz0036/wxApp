
<template>
  <view
    class="i-as-mask i-class-mask i-mask-class {{ isShow ? 'i-as-mask-show' : '' }}"
    bindtap="handleClickMask"
    catchtouchmove="stopMove"
  ></view>
  <view
    catchtouchmove="stopMove"
    class="i-class {{isIpx && needIpx ? 'ipx' : ''}} {{scrollUp ? 'i-as' : 'i-modal-content'}} {{ isShow ? (scrollUp ? 'i-as-show' : 'i-modal-show') : '' }}"
  >
    <slot></slot>
  </view>
</template>

<script>
let app = getApp()
export default {
  fileType: 'component',
  externalClasses: ['i-class', 'i-mask-class'],
  properties: {
    // 是否可见
    visible: {
      type: Boolean,
      value: false,
      observer (newVal) {
        if(this.data.closeDelay) {
          setTimeout(() => {
            this.setData({
              isShow: newVal
            })
          }, this.data.closeDelay)
        }else{
          this.setData({
            isShow: newVal
          })
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
  attached(){
    this.setData({
      isIpx: app.globalData.isIpx
    })
  },
  methods: {
    stopMove(){},
    handleClickMask () {
      if (!this.data.maskClosable) return
      this.handleClickCancel()
    },
    handleClickCancel () {
      this.triggerEvent('cancel')
    }
  }
}
</script>

<style lang="scss">
  .i-as {
    position: fixed;
    width: 100%;
    box-sizing: border-box;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    transform: translate3d(0, 100%, 0);
    transform-origin: center;
    transition: all .2s ease-in-out;
    z-index: 900;
    visibility: hidden;
    border-radius: 15px 15px 0 0;
  }

  .i-as-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .7);
    z-index: 900;
    transition: all .2s ease-in-out;
    opacity: 0;
    visibility: hidden
  }

  .i-as-mask-show {
    opacity: 1;
    visibility: visible
  }

  .i-as-show {
    transform: translate3d(0, 0, 0);
    visibility: visible
  }

  .i-modal-content{
    position: fixed;
    overflow: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    width: auto;
    height: auto;
    outline: 0;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    transform: translateZ(1px);
    opacity: 0;
    visibility: hidden
  }

  .i-modal-show {
    visibility: visible;
    opacity: 1
  }

  .ipx{
    padding-bottom: 20px;
  }
</style>

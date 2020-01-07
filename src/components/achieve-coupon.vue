
<template>
  <i-modal
    visible="{{ visible }}"
    scrollUp="{{ isScrollUp }}"
  >
    <view class="content {{ visible ? 'bounceIn' : '' }}">
      <i-img
        i-class="bg-light"
        width="318"
        height="318"
        loadImage="https://image.songshupinpin.com/goods_1547092175001.png"
      ></i-img>
      <i-img
        i-class="bg"
        width="360"
        height="435"
        loadImage="https://image.songshupinpin.com/goods_1547274119417.png"
      ></i-img>

      <view class="text-content">
        <slot></slot>
      </view>

      <view class="confirm" bindtap="confirm">
        <i-img
          width="180"
          height="54"
          loadImage="https://image.songshupinpin.com/goods_1547300743655.png"
        ></i-img>
        <button
          wx:if="{{needShare}}"
          open-type="share"
          hover-class="hover"
          class="btn-text"
          data-share="2"
        >{{ btnText }}</button>
        <view wx:else class="btn-text">{{ btnText }}</view>
      </view>

      <view wx:if="{{showCloseBtn}}" class="close" bindtap="close">
        <i-img
          width="32"
          height="32"
          loadImage="https://image.songshupinpin.com/goods_1547109657886.png"
        ></i-img>
      </view>
    </view>
  </i-modal>
</template>

<script>
export default {
  fileType: 'component',
  config: {
    usingComponents: {
      'i-button': './button',
      'i-img': './img'
    },
  },
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    needShare: {
      type: Boolean,
      value: false
    },
    btnText: {
      type: String,
      value: '去使用'
    },
    showCloseBtn: {
      type: Boolean,
      value: false
    }
  },
  data: {
    isScrollUp: false,
    closeDelay: 600
  },
  methods: {
    confirm(){
      this.triggerEvent('confirm')
    },
    close () {
      this.triggerEvent('close')
    }
  }
}
</script>

<style lang="scss">
  .content{
    width: 360px;
    height: 435px;
    position: relative;
    display: flex;
    justify-content: center;
    opacity: 0;
    transform: translate3d(0, -25px, 0);
    transition: all .4s ease-out .2s;

    .bg{
      width: 360px;
      height: 435px;
      position: absolute;
      left: 0;
      top: 0;
    }

    .bg-light{
      width: 318px;
      height: 318px;
      animation: circle 6s linear infinite;
      transform-origin: center center;
    }

    .text-content{
      width: 180px;
      position: absolute;
      left: 90px;
      top: 140px;
    }
  }

  .confirm{
    width: 180px;
    height: 54px;
    color: #B82B01;
    font-size: 19px;
    line-height: 40px;
    position: absolute;
    left: 92px;
    top: 305px;

    image{
      width: 180px;
      height: 54px;
      position: absolute;
    }

    .btn-text{
      position: relative;
      width: 180px;
      height: 40px;
      text-align: center;
      background: none;
      font-size: 19px;
    }

    button.btn-text {
      color: #B82B01;
      line-height: 40px;
      text-align: center;

      &:after {
        border: 0;
      }

      &.hover {
        opacity: 0.7;
      }
    }
  }

  .close {
    position: absolute;
    left: 164px;
    top: 400px;
    width: 32px;
    height: 32px;

    image {
      width: 32px;
      height: 32px;
    }
  }

  .bounceIn {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    // animation: bounceIn .75s .6s forwards;
    // animation-fill-mode: forwards;
  }

  .bounceOut{
    animation: bounceOut .75s;
  }

  @keyframes circle {
    0% {
      transform: rotate(0);
    }
    100%{
      transform: rotate(360deg);
    }
  }

  @keyframes bounceOut {
    0% {
      transform: scale3d(1, 1, 1);
    }
    20% {
      transform: scale3d(.9,.9,.9)
    }

    50%,55% {
      opacity: 1;
      transform: scale3d(1.1,1.1,1.1)
    }

    100% {
      opacity: 0;
      transform: scale3d(.3,.3,.3)
    }
  }

  @keyframes bounceIn {
    0%,20%,40%,60%,80%,to {
      animation-timing-function: cubic-bezier(.215,.61,.355,1)
    }

    0% {
      opacity: 0;
      transform: scale3d(.3,.3,.3)
    }

    20% {
      transform: scale3d(1.1,1.1,1.1)
    }

    40% {
      transform: scale3d(.9,.9,.9)
    }

    60% {
      opacity: 1;
      transform: scale3d(1.03,1.03,1.03)
    }

    80% {
      opacity: 1;
      transform: scale3d(.97,.97,.97)
    }

    to {
      opacity: 1;
      transform: scale3d(1, 1, 1)
    }
  }
</style>


<template>
  <button
    class="i-class i-btn {{ long ? 'i-btn-long' : '' }} {{ 'i-btn-' + size }} {{ 'i-btn-' + type }} {{ 'i-btn-' + shape }} {{ loading ? 'i-btn-loading' : '' }} {{ disabled ? 'i-btn-disabled' : ''}} {{ inline ? 'i-btn-inline' : '' }}"
    hover-class="i-btn-hover"
    catchtap="handleTap"
    open-type="{{ openType }}"
    app-parameter="{{ appParameter }}"
    hover-stop-propagation="{{ hoverStopPropagation }}"
    hover-start-time="{{ hoverStartTime }}"
    hover-stay-time="{{ hoverStayTime }}"
    session-from="{{ sessionFrom }}"
    send-message-title="{{ sendMessageTitle }}"
    send-message-path="{{ sendMessagePath }}"
    send-message-img="{{ sendMessageImg }}"
    show-message-card="{{ showMessageCard }}"
    bindcontact="bindcontact"
    bindgetuserinfo="bindgetuserinfo"
    bindgetphonenumber="bindgetphonenumber"
    binderror="binderror"
    plain="true"
  ><view class="i-btn-loading-inner i-loading-class" wx:if="{{loading}}"></view><slot></slot></button>
</template>

<script>
export default {
  fileType: 'component',
  externalClasses: ['i-class', 'i-loading-class'],

  properties: {
    // default, primary, ghost, info, success, warning, error
    type: {
      type: String,
      value: '',
    },
    inline: {
      type: Boolean,
      value: false
    },
    // default, large, small
    size: {
      type: String,
      value: '',
    },
    // circle, square
    shape: {
      type: String,
      value: 'square'
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    loading: {
      type: Boolean,
      value: false
    },
    long: {
      type: Boolean,
      value: false
    },
    openType: String,
    appParameter: String,
    hoverStopPropagation: Boolean,
    hoverStartTime: {
      type: Number,
      value: 20
    },
    hoverStayTime: {
      type: Number,
      value: 140
    },
    lang: {
      type: String,
      value: 'en'
    },
    sessionFrom: {
      type: String,
      value: ''
    },
    sendMessageTitle: String,
    sendMessagePath: String,
    sendMessageImg: String,
    showMessageCard: Boolean
  },

  methods: {
    handleTap () {
      if (this.data.disabled) return false
      if(this.data.loading) return false

      this.triggerEvent('click')
    },
    bindgetuserinfo ({ detail = {} } = {}) {
      this.triggerEvent('getuserinfo', detail)
    },
    bindcontact ({ detail = {} } = {}) {
      this.triggerEvent('contact', detail)
    },
    bindgetphonenumber ({ detail = {} } = {}) {
      this.triggerEvent('getphonenumber', detail)
    },
    binderror ({ detail = {} } = {}) {
      this.triggerEvent('error', detail)
    }
  }
}
</script>
<style lang="scss">
  .i-btn {
    text-align: center;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    white-space: nowrap;
    user-select: none;
    font-size: 14px;
    border-radius: 2px;
    border: 0 !important;
    position: relative;
    text-decoration: none;
    height: 44px;
    line-height: 44px;
    background: #f7f7f7;
    color: #495060;
    margin: 10px
  }

  .i-btn-hover {
    opacity: .7
  }

  .i-btn-long {
    border-radius: 0;
    margin: 0;
    box-shadow: none
  }

  .i-btn-large {
    height: 48px;
    line-height: 48px
  }

  .i-btn-small {
    height: 40px;
    line-height: 40px
  }

  .i-btn-primary {
    color: #fff;
    background: #2d8cf0
  }

  .i-btn-ghost {
    color: #fff;
    background: #fff;
    color: #495060
  }

  .i-btn-success {
    color: #fff;
    background: #19be6b
  }

  .i-btn-warning {
    color: #fff;
    background: #f90
  }

  .i-btn-error {
    color: #fff;
    background: #ed3f14
  }

  .i-btn-info {
    color: #fff;
    background: #2db7f5
  }

  .i-btn-circle {
    border-radius: 44px
  }

  .i-btn-large.i-btn-circle {
    border-radius: 48px
  }

  .i-btn-small.i-btn-circle {
    border-radius: 40px
  }

  .i-btn-loading {
    opacity: .6
  }

  .i-btn-loading-inner {
    display: inline-block;
    margin-right: 12px;
    vertical-align: middle;
    width: 14px;
    height: 14px;
    background: 0 0;
    border: 2px solid #e9eaec;
    border-color: #e9eaec #e9eaec #e9eaec #2d8cf0;
    border-radius: 50%;
    animation: btn-spin .6s linear;
    animation-iteration-count: infinite
  }

  .i-btn-disabled {
    opacity: .9;
  }

  .i-btn-inline {
    display: inline-block
  }

  .i-class{}

  @keyframes btn-spin {
    0% {
      transform: rotate(0)
    }
    100% {
      transform: rotate(360deg)
    }
  }
</style>

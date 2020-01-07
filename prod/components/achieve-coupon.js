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
Component({
  fileType: 'component',
  config: {
    usingComponents: {
      'i-button': './button',
      'i-img': './img'
    }
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
    confirm() {
      this.triggerEvent('confirm');
    },

    close() {
      this.triggerEvent('close');
    }

  }
});
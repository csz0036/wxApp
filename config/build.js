module.exports = {
  fileType: {
    page: 'Page',
    app: 'App',
    component: 'Component'
  },
  src: 'src',
  version: '2.10.1',
  env: {
    prod: {
      dist: 'prod',
      baseUrl: 'https://fix.songshupinpin.com',
      baseImgUrl: 'https://image.songshupinpin.com/',
      webViewBaseUrl: 'https://active.songshupinpin.com',
      qiyuChatUrl: 'https://sspp.qiyukf.com',
      apikey: '678cc57094988a6873a3ee0bdb9f450b856f961342a1996288bb2b821e3eb097',
    },
    dev: {
      dist: 'dev',
      baseUrl: 'https://dfix.songshupinpin.com',
      baseImgUrl: 'https://dimage.songshupinpin.com/',
      webViewBaseUrl: 'https://dev-active.songshupinpin.com',
      qiyuChatUrl: 'https://sspp.qiyukf.com',
      apikey: '4547c88c4774d842bc2c5d51ee8628da86163deabdd9fa0c34d310670f7df392',
    }
  }
}

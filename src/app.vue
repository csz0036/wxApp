
<script>
import request from './utils/request'
import initMixin from './utils/initMixin'
import TimerQueue from './utils/timeQueue'
import getPlatformConfigRe, { clearStorage } from './utils/versionController'
import publicAttrs from './utils/publicAttrs'
import { Provider } from './lib/wechatAppRedux'
import store from './store/store'
import { COMMUNITY_CLOSED } from './store/actionTypes'

App(Provider(store)({
  config: {
    networkTimeout: {
      request: 10000
    },
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#FC4443',
      navigationBarTitleText: '',
      navigationBarTextStyle: 'white',
      backgroundColor: '#f5f5f5'
    },
    tabBar: {
      list: [
        {
          pagePath: 'pages/index',
          text: '首页',
          iconPath: 'images/icon-tab-index.png',
          selectedIconPath: 'images/icon-tab-index-active.png'
        },
        {
          pagePath: 'pages/index',
          text: '搜索',
          iconPath: 'images/icon-tab-search.png',
          selectedIconPath: 'images/icon-tab-search-active.png'
        },
        {
          pagePath: 'pages/index',
          text: '购物车',
          iconPath: 'images/icon-tab-shop.png',
          selectedIconPath: 'images/icon-tab-shop-active.png'
        },
        {
          pagePath: 'pages/index',
          text: '我的',
          iconPath: 'images/icon-tab-me.png',
          selectedIconPath: 'images/icon-tab-me-active.png'
        }
      ],
      color: '#707070',
      selectedColor: '#ff5344',
      backgroundColor: '#fff',
      borderStyle: 'white'
    }
  },
  fileType: 'App',
  tracker: null,
  onLaunch () {
    this.launchPreAction()
  },
  // 启动的前置动作
  launchPreAction(){
    // 清除启动参数
    this.globalData.options = null
    // 检测是否有配置，清除缓存
    let clearStorageKeys = wx.getStorageSync('clearStorageKey')
    if (clearStorageKeys) {
      clearStorage(clearStorageKeys)
    }
    // 请求系统配置
    getPlatformConfigRe(this)
    this.globalData.timer = new TimerQueue()
    // 获取手机型号
    this.globalData.systemInfo = wx.getSystemInfoSync()
    let model = this.globalData.systemInfo.model
    this.globalData.isIpx = model.indexOf('iPhone X') > -1 || model.indexOf('unknown<iPhone') > -1
    try {
      this.globalData.showCompareCommunityDialog = wx.getStorageSync('showCompareCommunityDialog')
    } catch (e) {
      this.globalData.showCompareCommunityDialog = true
    }
    try {
      this.globalData.lastOrderCommunity = wx.getStorageSync('lastOrderCommunity') || {}
    } catch (e) {
      this.globalData.lastOrderCommunity = {}
    }
  },
  onShow (options) {
    // 对比是否启动参数变化
    const path = options.path
    let query = options
  
    this.globalData.options = query
    const pagesStack = getCurrentPages()
    let cur = pagesStack.length - 1
    this.globalData.options = options
   
    // 监听小程序状态，变化时触发
    const unsubscribe = this.store.subscribe(() => {
      const appLaunchSuccess = this.store.getState().appLaunchSuccess
      if(appLaunchSuccess){
        unsubscribe()
      }
    })
  },
  onHide () {
    const { community } = this.store.getState()
    if (!(community && community.communityId)) return
  },
  onPageNotFound (res) {
    wx.reLaunch({
      url: '/pages/index'
    })
  },
  initMixin (vm) {
    const page = initMixin(vm)
    const _this = this
    let result = {}

    const onShow = function () {
      page.onShow && page.onShow.call(this)
    }

    result = {
      ...page,
      onShow,
    }
    return result
  },
  onError (err) {
    console.log('错误信息', err)
    if(err.indexOf('webviewScriptError') > -1){
      return
    }
    wx.showToast({
      title: '小程序启动失败，请重新打开再次尝试',
      icon: 'none',
      duration: 2000
    })
  },
  // 请求
  request,
  globalData: {
    appLaunchSuccess: false,
    // entryPath 入口页面
    entryInfo: {},
    timer: 0,
    mixins: [],
    // funDebug,
    needMobile: false,
    userInfo: {},
    systemInfo: {},
    // 定位城市
    city: {},
    // 定位社区
    community: {},
    // 是否存在默认小区
    hasDefaultCommunity: true,
    // 历史小区
    historyCommunity: [],
    // 手机型号
    isIpx: '',
    // 定位
    location: {},
    // 团长信息
    disUserInfo: {},
    // form id 收集
    formIds: [],
    // gps是否可用
    canGetGPS: true,
    // 购物车数量
    cartNum: 0,
    // 小程序启动状态
    /*
     * 0 -> 未启动
     * 1 -> 未授权用户资料，弹出用户资料
     * */
    appLoadStatus: 0,
    // 下单页数据
    settleInfo: [],
    // 网络连接状态
    offLine: false,
    // 启动参数
    options: '',
    changedCommunity: false,
    // 首页刷新计数
    indexRefreshCount: 0,
    // 切换城市
    changeCity: '',
    // 修改数量时选择check可能导致异步回调顺序错误，添加flag不允许在修改数量回调结束前修改check
    shopCartCanCheck: true,
    // 获取count数限制10分钟
    cartNumStamp: 0,
    // 最大限购数
    maxLimitBuyNumber: 200,
    // 是否已经显示过社区切换提示框
    showCompareCommunityDialog: true,
    // 上次下单的社区
    lastOrderCommunity: {},
    // 邀请人信息
    inviterInfo: {
      inviterId: '',
      inviteType: '',
      inviterWay: ''
    },
    // 渠道邀请人信息
    channelInfo: {
      channelId: '',
      channelTime: 0,
    },
    // 是否小程序更新
    isUpdate: false,
    // 历史搜索记录
    historySearch: null,
    // 商品素材历史搜索记录
    materialHistorySearch: null,
    // 是否已经显示过转盘抽奖
    isShownTurnaroundDraw: false,
    // 分销类型
    affiliate_type: 0,
    // 邀请者id
    utm_user: '',
    // 首页跳转分类传递的前台分类id
    categoryId: '',
    // 疑似和高危用户验证
    verifyUser: {
      userType: '',
      options: {},
      from: ''
    }
  },
}))

</script>
<style lang="scss">
  page {
    background-color: #f6f6f6;
    font-size: 14px;
    font-weight: 400;
    color: #333;
  }

  .pb20 {
    padding-bottom: 20px;
  }

  .mb20 {
    margin-bottom: 20px;
  }
</style>

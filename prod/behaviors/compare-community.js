
import { changeCommunity } from '../utils/index'

const app = getApp()
let resolveHandler = null
let targetCompareCommunity = null

export default Behavior({
  config: {},
  data: {
    communityChangeVisible: false
  },
  methods: {
    compareCommunity (targetCommunity) {
      return new Promise((resolve, reject) => {
        // 比较社区
        if (!(typeof targetCommunity === 'object' && targetCommunity.communityId)) {
          targetCommunity = app.globalData.lastOrderCommunity || wx.getStorageSync('lastOrderCommunity')
        }
        targetCompareCommunity = targetCommunity
        // lastOrderCommunity = app.globalData.lastOrderCommunity || wx.getStorageSync('lastOrderCommunity')
        let targetCompareCommunityId = ''
        console.log('上次订单社区：', targetCompareCommunity)
        // 当前社区
        let currentCommunity = app.globalData.community

        if (
          targetCommunity &&
          typeof targetCommunity === 'object' &&
          targetCommunity.communityId
        ) {
          targetCompareCommunityId = targetCommunity.communityId
        }

        if (
          !app.globalData.showCompareCommunityDialog &&
          targetCompareCommunityId &&
          currentCommunity &&
          currentCommunity.communityId !== targetCompareCommunityId
        ) {
          wx.hideLoading()
          this.setData({
            communityChangeVisible: true
          })
          resolveHandler = resolve
          app.globalData.showCompareCommunityDialog = true
          wx.setStorage({
            key: 'showCompareCommunityDialog',
            data: true
          })
        } else {
          resolve()
        }
      })
    },
    // 回到原社区
    gobackOriginCommunity () {
      this.setData({
        communityChangeVisible: false
      })
      let city = {
        districtCode: targetCompareCommunity.cityCode,
        districtName: targetCompareCommunity.fullAddress && targetCompareCommunity.fullAddress.split(',')[1]
      }
      app.globalData.cartNumStamp = 0
      changeCommunity(targetCompareCommunity, city)

      // if (typeof rejectHandler === 'function') {
      //   app.globalData.changedCommunity = true
      //   app.globalData.cartNumStamp = 0
      //   rejectHandler(targetCompareCommunity)
      // }
    },
    // 访问当前社区
    setCurrentCommunity () {
      this.setData({
        communityChangeVisible: false
      })
      if (typeof resolveHandler === 'function') {
        resolveHandler()
      }
    },
  }
})

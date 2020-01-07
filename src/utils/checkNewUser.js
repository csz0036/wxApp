
import request from './request'

const app = getApp()

export default () => {
  const isNew = isNewUser()
  return new Promise((resolve, reject) => {
    if(isNew && !app.store.getState().appLoadStatus.needAuth){
      const communityId = app.globalData.community.communityId
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      request('/shop-member-strategy/market/newcomer/display', {
        communityId,
        activityId: 2
      }).then(res => {
        if(res.body.result === 0){
          app.globalData.isShownTurnaroundDraw = true
          resolve(res.body.prizeList)
        }else{
          // 老用户
          resolve('ORIGINAL_USER')
          // reject(new Error())
        }
        wx.hideLoading()
      }).catch(() => {
        wx.hideLoading()
        resolve('ORIGINAL_USER')
      })
    }else {
      if (app.store.getState().appLoadStatus.needAuth || !app.globalData.community.communityId) {
        resolve(false)
      } else {
        resolve('ORIGINAL_USER')
      }
    }
  })
}

const isNewUser = () => {
  let result = false
  // 校验是否鉴权
  if(app.globalData.appLoadStatus > 0){
    result = handle()
    return result
  }
  return result
}

const handle = () => {
  const globalData = app.globalData
  return !!(globalData.community.communityId && !globalData.isShownTurnaroundDraw)
}

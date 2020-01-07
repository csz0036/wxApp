
import Auth from './Auth'
import Location from './Location'
import request from './request'


function next(app, resolve) {
  // 有默认社区 并且 有定位权限

  request('/shop-order/order/getRiskActSkuNum', {}, {
    self: app
  }).then(res => {
    app.globalData.maxLimitBuyNumber = res.body * 1
    resolve()
  }).catch(() => {
    app.globalData.maxLimitBuyNumber = 200
    resolve()
  })
}

let recordTime = 0

function setInviter(app, options) {
  return new Promise(resolve => {
    // 神策添加渠道来源
    if (options && options.memberId && options.inviterWay && options.channelId) {
      clearTimeout(recordTime)
      app.globalData.utm_user = options.memberId || ''
      app.globalData.affiliate_type = options.inviterWay || 0
      recordTime = setTimeout(() => {
        app.globalData.affiliate_type = 0
      }, 1800000)

      app.globalData.inviterInfo.inviterId = options.memberId
      app.globalData.inviterInfo.inviterWay = options.inviterWay
      // 邀请渠道:分享
      app.globalData.inviterInfo.inviteType = !options.isWxcode ? 'share' : 'wxcode'

      // 团长分享id 绑定channelId下单
      console.log('options.channelId-----------', options.channelId)
      app.globalData.channelInfo.channelId = options.channelId
      app.globalData.channelInfo.channelTime = (new Date()).getTime()

      setInviterInfo(app.globalData.inviterInfo, app)
      resolve(options)
    }else if (options && options.scene) {
      request('/platform/wxcode/getWxCodeParam', {
        sceneUrl: options.scene
      }, {
        self: app
      }).then(res => {
        if (res.head.error === 0 && res.body) {
          let arr = res
            .body
            .slice(2)
            .slice(0, -1)
            .split('&')
          // let arr = str
          let obj = {}
          arr.forEach(item => {
            obj[item.split('=')[0]] = item.split('=')[1]
          })
          app.globalData.inviterInfo.inviterId = obj.memberId || ''
          app.globalData.inviterInfo.inviterWay = obj.inviterWay || ''
          if(obj.memberId && obj.inviterWay){
            app.globalData.utm_user = options.memberId || ''
          }
          // 邀请渠道:二维码
          app.globalData.inviterInfo.inviteType = 'wxcode'
          app.globalData.options.query = obj
          if(obj.realSharePath){
            app.globalData.options.path = obj.realSharePath
          }
          setInviterInfo(app.globalData.inviterInfo, app)
          resolve(app.globalData.options.query)
        }
      })
    } else {
      wx.getStorage({
        key: 'inviterInfo',
        success(data) {
          if (data && data.inviterId && data.inviterWay) {
            app.globalData.inviterInfo.inviterId = data.memberId
            app.globalData.inviterInfo.inviterWay = data.inviterWay
            app.globalData.inviterInfo.inviteType = data.inviteType || ''
          }
        },
        complete(){
          resolve(options)
        }
      })
    }
  })
}

function setInviterInfo(inviterInfo, app) {
  try {
    let data = wx.getStorageSync('inviterInfo')
    if (!data || !data.inviterId) {
      wx.setStorageSync('inviterInfo', inviterInfo)
    }
  } catch (e) {
    console.warn('set strage err', e)
  }
}

export default (app, options) => {
  return new Promise(resolve => {
    setInviter(app, options).then(res => {
      Auth.init(app, res).then(() => {

        let requestList = [
          Location.init(app, res)
        ]
        console.log(app.globalData.userInfo)
        if(app.globalData.userInfo.accountStatus > 0 && app.globalData.userInfo.memberId){
          requestList.push(
            request('/shop-dis-user/disUser/detail', {}, {
              self: app
            })
          )
        }
        Promise.all(requestList).then(res => {
          if(res[1] && res[1].body){
            const disUserId = res[1].body.disUserId

            request('/shop-group-center/community/getByDisUser', {
              disUserId
            }, {
              self: app
            }).then(result => {
              let role = []
              if(result.body){
                role = ['用户', '团长']
              }else{
                role = ['用户']
              }
             
              if(result.body) {
                app.globalData.disUserInfo = {
                  ...result.body,
                  disUserId
                }
                wx.setStorage({
                  key: 'disUserInfo',
                  data: {
                    ...result.body,
                    disUserId
                  }
                })
              }
              next(app, resolve)
            })
          }else{
         
            next(app, resolve)
          }
        })
      })
    })
  })
}

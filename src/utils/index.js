
import request from './request'
import { changeCommunityAction, setLandGift } from '../store/actions'
import { SET_HAS_DEFAULT_COMMUNITY } from '../store/actionTypes'

let app = getApp()

// 分割小数点
export const getNumberSplit = num => {
  num = num * 1
  if (!num) return ['0', '00']
  let temp = (num / 100).toFixed(2)
  return temp.split('.')
}

// 切换小区
export const changeCommunity = (community, city, redirect = true) => {
  return app.store.dispatch(changeCommunityAction(community.communityId, true)).then(() => {
    wx.hideLoading()
    setCompareCommunityDialogStatus(true)
    app.store.dispatch({
      type: SET_HAS_DEFAULT_COMMUNITY,
      payload: true
    })
  })
}
// 设置购物车tabbar数量
export const cartNum = (total = '', isGet = false) => {
  return new Promise(resolve => {
    if(app.globalData.userInfo.memberId){
      if (isGet) {
        // 查询购物车数量
        getNumber(resolve)
      }else {
        let currentStamp = new Date().getTime()
        if (app.globalData.cartNumStamp < currentStamp) {
          getNumber(resolve)
        } else {
          if (typeof total === 'number') {
            app.globalData.cartNum = total
          }
          setTabBarNumber(app.globalData.cartNum)
          resolve(total)
        }
        // 减少count接口请求量，添加10分钟缓冲
        app.globalData.cartNumStamp = new Date().getTime() + 60000
      }
    }else {
      resolve(0)
    }
  })

  function getNumber (resolve) {
    let globalData = app.globalData

    if (globalData.community.communityId && globalData.userInfo.accountStatus === 1) {
      request('/shop-cart-web/cart/count', {
        communityId: app.globalData.community.communityId
      }).then(result => {
        app.globalData.cartNum = result.body
        wx.setStorageSync('cartNum', result.body)
        setTabBarNumber(result.body)
        resolve(result.body)
      })
    }
  }

  function setTabBarNumber (val) {
    if (typeof val === 'number' && val > 0) {
      wx.setTabBarBadge({
        index: 2,
        text: val + '',
        fail: err => {
          console.log(err)
        }
      })
    } else {
      wx.removeTabBarBadge({
        index: 2,
        fail: err => {
          console.log(err)
        }
      })
    }
  }
}
// canvas绘图封装函数
export const download = url => {
  return new Promise(resolve => {
    wx.downloadFile({
      url: url,
      success (res) {
        if (res.statusCode === 200) {
          resolve(res)
        }
      },
      fail: err => {
        console.log(err)
        wx.hideLoading()
      }
    })
  })
}
export const getPx = px => {
  const systemInfo = wx.getSystemInfoSync()
  return Math.round(systemInfo.windowWidth / 375 * px)
}

export const drawText = (context, style, t, x, y, w) => {
  let chr = t.split('')
  let temp = ''
  let row = []
  context.setFillStyle(style.color)
  context.textAlign = style.textAlign
  context.setFontSize(style.size)
  for (let a = 0; a < chr.length; a++) {
    if (context.measureText(temp).width < w) {
    } else {
      row.push(temp)
      temp = ''
    }
    temp += chr[a]
  }
  row.push(temp)
  for (let b = 0; b < row.length; b++) {
    context.fillText(row[b], x, y + b * 12)
  }
}

export const drawText2 = (context, style = {
  weight: 'normal',
}, t, x, y, w, line) => {
  let chr = t.split('')
  let temp = ''
  let row = []
  context.beginPath()
  context.save()
  context.setFillStyle(style.color)
  context.textAlign = style.textAlign
  context.font = `normal ${style.weight} ${style.size}px sans-serif`
  const tWidth = context.measureText(t).width
  for (let a = 0; a < chr.length; a++) {
    // console.log(context.measureText(temp).width, temp, row, w)
    if (w && context.measureText(temp + chr[a]).width > w) {
      row.push(temp)
      temp = ''
    }
    temp += chr[a]
  }

  row.push(temp)

  if(line && line < row.length){
    row.splice(line)
    row[line - 1] = row[line - 1].substring(0, row[line - 1].length - 2) + '...'
  }

  for (let b = 0; b < row.length; b++) {
    const lineHeight = style.lineHeight || Math.ceil(style.size * 1.2)
    const startY = y + (b + 1) * lineHeight
    context.fillText(row[b], x, startY)
    if(style['line-through']){
      const textWidth = context.measureText(row[b]).width
      context.setLineDash([])
      context.moveTo(x, startY - style.lineThroughPosition)
      context.lineTo(x + textWidth, startY - style.lineThroughPosition)
      context.strokeStyle = style.color
      context.stroke()
    }
  }
  context.restore()
  context.closePath()
  return tWidth
}

export const setCompareCommunityDialogStatus = (status) => {
  app.globalData.showCompareCommunityDialog = status
  wx.setStorage({
    key: 'showCompareCommunityDialog',
    data: status
  })
}
// 绘制圆角矩形
export const drawRoundRect = (ctx, x, y, width, height, radius) => {
  let r
  if(typeof radius === 'number'){
    r = [radius, radius, radius, radius]
  }else{
    r = radius
  }
  ctx.beginPath()
  ctx.arc(x + r[0], y + r[0], r[0], Math.PI, Math.PI * 3 / 2)
  ctx.lineTo(width - r[0] + x, y)
  ctx.arc(width - r[1] + x, r[1] + y, r[1], Math.PI * 3 / 2, Math.PI * 2)
  ctx.lineTo(width + x, height + y - r[1])
  ctx.arc(width - r[2] + x, height - r[2] + y, r[2], 0, Math.PI / 2)
  ctx.lineTo(r[2] + x, height + y)
  ctx.arc(r[3] + x, height - r[3] + y, r[3], Math.PI / 2, Math.PI)
  ctx.closePath()
}
// 画圆角方法2
export const drawRoundRect2 = (cxt, x, y, width, height, radius, half, color) => {
  cxt.beginPath()
  cxt.setStrokeStyle(color)
  // 起点
  if(half){
    cxt.lineTo(x, y)
  } else {
    cxt.lineTo(x, y + radius)
  }
  // 左上角圆角
  if(half){
    cxt.lineTo(width - radius + x, y)
  } else {
    cxt.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2)
    cxt.lineTo(width - radius + x, y)
  }
  // 右上角圆角
  cxt.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2)
  cxt.lineTo(width + x, height + y - radius)
  // 右下下角圆角
  if(half){
    cxt.lineTo(width + x, y + height)
  } else {
    cxt.arc(width - radius + x, height - radius + y, radius, 0, Math.PI * 1 / 2)
    cxt.lineTo(width - radius + x, y + height)
  }
  // 左下角圆角
  cxt.arc(radius + x, height - radius + y, radius, Math.PI * 1 / 2, Math.PI)
  if(half){
    cxt.lineTo(x, y)
  } else {
    cxt.lineTo(x, y + radius)
  }
  cxt.stroke()
  cxt.closePath()

}
// 画圆角方法3
export const drawRoundRect3 = (cxt, x, y, width, height, radius, half, color) => {
  cxt.beginPath()
  cxt.setFillStyle(color)
  // 起点
  if(half){
    cxt.lineTo(x, y)
  } else {
    cxt.lineTo(x, y + radius)
  }
  // 左上角圆角
  if(half){
    cxt.lineTo(width - radius + x, y)
  } else {
    cxt.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2)
    cxt.lineTo(width - radius + x, y)
  }
  // 右上角圆角
  cxt.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2)
  cxt.lineTo(width + x, height + y - radius)
  // 右下下角圆角
  if(half){
    cxt.lineTo(width + x, y + height)
  } else {
    cxt.arc(width - radius + x, height - radius + y, radius, 0, Math.PI * 1 / 2)
    cxt.lineTo(width - radius + x, y + height)
  }
  // 左下角圆角
  cxt.arc(radius + x, height - radius + y, radius, Math.PI * 1 / 2, Math.PI)
  if(half){
    cxt.lineTo(x, y)
  } else {
    cxt.lineTo(x, y + radius)
  }
  cxt.fill()
  cxt.closePath()

}
// 画圆形图片
export const drawCircleImage=(ctx, imgPath,x, y, R,color)=>{
  const r= R/2
  ctx.save()
  ctx.beginPath()
  ctx.setStrokeStyle(color)
  ctx.arc(x+r,y+r,r, 0, 2 * Math.PI,false)
  ctx.stroke()
  ctx.clip()

  ctx.drawImage(imgPath,x,y,R,R)
  ctx.closePath()
  ctx.restore()
  // ctx.draw();
}
// 获取图片
export const getImagePath = url => {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: url,
      success (res) {
        resolve(res.path)
      },
      fail (err) {
        reject(err)
      }
    })
  })
}
//获取图片失败不返回reject
export const getImagePathWithoutReject = url => {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: url,
      success (res) {
        resolve(res.path)
      },
      fail (err) {
        resolve()
      }
    })
  })
}
// 根据经纬度计算距离
/* @param la1 第一个坐标点的纬度
* @param lo1 第一个坐标点的经度
* @param la2 第二个坐标点的纬度
* @param lo2 第二个坐标点的经度
* @return (int)s   返回距离(单位千米或公里)
* */
export const calDistance = (la1, lo1, la2, lo2) => {
  let La1 = la1 * Math.PI / 180.0
  let La2 = la2 * Math.PI / 180.0
  let La3 = La1 - La2
  let Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)))
  s = s * 6378.137
  s = Math.round(s * 10000) / 10000
  s = s.toFixed(2)
  return s
}
// 计算单件商品赠送松子
export const computedSinglePoint = (price, baseRate, integralGiftMultiply) => {
  return Math.floor(price * baseRate * integralGiftMultiply / 1000000)
}

export const getRect = (context, selector, all) => {
  return new Promise(resolve => {
    wx.createSelectorQuery()
      .in(context)[all ? 'selectAll' : 'select'](selector)
      .boundingClientRect(rect => {
        if (all && Array.isArray(rect) && rect.length) {
          resolve(rect)
        }

        if (!all && rect) {
          resolve(rect)
        }
      })
      .exec()
  })
}

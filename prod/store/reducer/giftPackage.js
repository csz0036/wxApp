
import {
  RECEIVED_GIFT,
  SET_NEW_USER_GIFT,
  SET_NONE_GIFT_PACKAGE,
  SET_PINE_NUTS_GIFT,
  SET_SURPRISE_GIFT
} from '../actionTypes'
import { formatYMDPoint } from '../../utils/timeFormat'

export default (state = {
  // 新人红包
  newUserGift: null,
  // 天降红包
  surpriseGift: null,
  // 百万松子
  pineNutsGift: null,
  // 是否请求过
  hasRequested: false
}, action) => {
  switch (action.type) {
    case SET_NEW_USER_GIFT:
      let LIGHT_COLORS = ['#FFE852', '#FF00FA', '#FFE852']
      let PRIZES_COLORS = ['#FFDB0C', '#FFF1C1', '#FF9B34']
      let FONT_COLORS = ['#7E3900', '#7E3900', '#FFFFFF']
      let newUserGift = action.payload.map((item, index) => {
        let id = index % 3

        return {
          count: item.perCount,
          unit: item.prizeName,
          type: item.displayType,
          url: item.imgUrl,
          bg: PRIZES_COLORS[id],
          color: FONT_COLORS[id],
          light: LIGHT_COLORS[id]
        }
      })
      return {
        ...state,
        newUserGift,
        hasRequested: true
      }
    case SET_SURPRISE_GIFT:
      const surpriseGift = action.payload.map(item => {
        item.faceValue = item.faceValue / 100
        item.thresholdValue = item.thresholdValue / 100
        item.beginTime = formatYMDPoint(new Date(item.beginTime * 1))
        item.endTime = formatYMDPoint(new Date(item.endTime * 1))
        return item
      })
      return {
        ...state,
        surpriseGift,
        hasRequested: true
      }
    case SET_PINE_NUTS_GIFT:
      let pineNutsGift = {
        visible: false
      }
      let payload = action.payload
      if (payload.hasActivity && payload.begin && payload.end) {
        let begin = payload.begin.slice(5).replace(/-/g, '.')
        let end = payload.end.slice(5).replace(/-/g, '.')
        let date = begin + '-' + end
        let total = (payload.pineNut + '').replace(/(?=(\B)(\d{3})+$)/g, ',')

        pineNutsGift = {
          date,
          total,
          visible: true,
          desc: payload.eventDescription
        }
      }
      return {
        ...state,
        pineNutsGift,
        hasRequested: true
      }
    case SET_NONE_GIFT_PACKAGE:
      return {
        ...state,
        hasRequested: true
      }
    case RECEIVED_GIFT:
      return {
        newUserGift: null,
        surpriseGift: null,
        pineNutsGift: null,
        hasRequested: true
      }
    default:
      return state
  }
}

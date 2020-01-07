
import {
  SET_NEED_AUTH,
  SET_CAN_GPS,
  SET_HAS_DEFAULT_COMMUNITY,
} from '../actionTypes'

export default (state = {
  needAuth: false,
  canGetGPS: true,
  hasDefaultCommunity: false,
  type: 0
}, action) => {
  switch (action.type) {
    case SET_CAN_GPS:
      return getType(state, {
        canGetGPS: action.payload
      })
    case SET_NEED_AUTH:
      return getType(state, {
        needAuth: action.payload
      })
    case SET_HAS_DEFAULT_COMMUNITY:
      return getType(state, {
        hasDefaultCommunity: action.payload
      })
    default:
      return state
  }
}

const getType = (state, val) => {
  let obj = {
    ...state,
    ...val
  }
  if(obj.needAuth){
    obj.type = 5
  }else if(obj.hasDefaultCommunity && obj.canGetGPS){
    obj.type = 2
    // 没有默认社区，有定位权限
  }else if(obj.canGetGPS && !obj.hasDefaultCommunity) {
    obj.type = 3
    // 没有定位授权，没有默认社区
  }else if(!obj.hasDefaultCommunity && !obj.canGetGPS) {
    obj.type = 4
  }else if(obj.hasDefaultCommunity && !obj.canGetGPS){
    obj.type = 6
    // 需要授权用户信息
  }

  return obj
}

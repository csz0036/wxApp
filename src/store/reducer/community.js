
import { SET_COMMUNITY, COMMUNITY_CLOSED } from '../actionTypes'

export default (state = {}, action) => {
  if(action.type === SET_COMMUNITY) {
    const { payload } = action

    return payload.community
  }else if(action.type === COMMUNITY_CLOSED) {
    return {
      ...state,
      isStop: action.payload
    }
  }
  return state
}

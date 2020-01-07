

import { SET_COMMUNITY, SET_CITY } from '../actionTypes'

export default (state = {
  districtName: '',
  districtCode: ''
}, action) => {
  if(action.type === SET_COMMUNITY) {
    const { payload } = action

    return payload.city

  } else if (action.type === SET_CITY) {
    return action.payload
  }
  return state
}

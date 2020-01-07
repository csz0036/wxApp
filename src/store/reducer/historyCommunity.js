
import { SET_COMMUNITY } from '../actionTypes'

export default (state = {}, action) => {
  if (action.type === SET_COMMUNITY) {
    const payload = action.payload
    if (!payload) {
      return state
    }

    return addToHistory(state, payload)

  }
  return state
}

function addToHistory (state, community) {
  let historyCommunity = state || []
  for (let i = 0; i < historyCommunity.length; i++) {
    if (historyCommunity[i].community.communityId === community.community.communityId && i === 1) {
      historyCommunity[i] = community
      return historyCommunity
    }
  }
  if (historyCommunity.length > 1) {
    historyCommunity.shift()
  }

  historyCommunity.push(community)
  wx.setStorage({
    key: 'historyCommunity',
    data: historyCommunity
  })
  return historyCommunity
}

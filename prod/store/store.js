
import { applyMiddleware, combineReducers, createStore } from '../lib/redux'
import thunk from '../lib/redux-thunk'
import reducer from './reducer/index'
// import config from '../config'

let middlewares = [thunk]
// if(config.env !== 'production') {
//   middlewares.push(require('../lib/redux-logger').createLogger())
// }

const historyCommunity = wx.getStorageSync('historyCommunity') || []

export default createStore(
  combineReducers(reducer),
  {
    historyCommunity
  },
  applyMiddleware(...middlewares),
)

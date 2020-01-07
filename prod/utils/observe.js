
export default (self, obj, key, cb) => {
  let object = self[obj]
  let value = object[key]

  Object.defineProperty(object, key, {
    configurable: true,
    enumerable: true,
    set: val => {
      if(val === value) return
      if (cb) cb(val, value)
      if(key === 'appLoadStatus'){
        let app = getApp()
        let data = app.globalData
        if(data.needAuth){
          value = 5
        }else if(data.hasDefaultCommunity && data.canGetGPS){
          value = 2
          // 没有默认社区，有定位权限
        }else if(data.canGetGPS && !data.hasDefaultCommunity) {
          value = 3
          // 没有定位授权，没有默认社区
        }else if(!data.hasDefaultCommunity && !data.canGetGPS) {
          value = 4
        }else if(data.hasDefaultCommunity && !data.canGetGPS){
          value = 6
          // 需要授权用户信息
        }
      }else{
        value = val
      }
    },
    get: () => {
      return value
    }
  })
}

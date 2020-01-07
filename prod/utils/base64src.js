
const base64src = function(base64data) {
  const app = getApp()
  const brand = app.globalData.systemInfo.brand
  let fsm
  if(wx.canIUse('getFileSystemManager')){
    fsm = wx.getFileSystemManager()
  } else {
    wx.showToast({
      title: '当前微信版本过低，暂时无法使用海报功能！',
      icon: 'none'
    })
  }
  return new Promise((resolve, reject) => {
    const FILE_BASE_NAME = 'tmp_base64src' + new Date().getTime()
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || []
    if (!format) {
      reject(new Error('ERROR_BASE64SRC_PARSE'))
    }
    fsm.readdir({
      dirPath: `${brand === 'devtools' ? 'http' : 'wxfile'}://usr`,
      success(res) {
        // console.log('usr文件夹', res.files)
        res.files.forEach(item => {
          if(item.substring(item.lastIndexOf('.') + 1) === 'png') {
            fsm.unlinkSync(`${brand === 'devtools' ? 'http' : 'wxfile'}://usr/` + item)
          }
        })
        const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`
        const buffer = wx.base64ToArrayBuffer(bodyData)
        fsm.writeFile({
          filePath,
          data: buffer,
          encoding: 'binary',
          success() {
            resolve(filePath)
          },
          fail() {
            reject(new Error('ERROR_BASE64SRC_WRITE'))
          },
        })
      },
      fail(err){
        console.log(err)
      }
    })
  })
}

export default base64src

class HTTP {
  constructor() {
    
  }

  request(params) {
    var that = this
    if (!params.name) {
      console.error('没有选定云端数据库!')
      return
    }
    return new Promise((resolve, reject)=>{
      wx.cloud.callFunction({
        name: params.name,
        data: params.data,
        success: res => {
          wx.hideLoading()
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
          console.log(res)
          if (res.errMsg === 'cloud.callFunction:ok') {
            if (res.result) {
              if (parseInt(res.result.code) == 0) {
                if (!res.result.data) {
                  wx.showToast({
                    title: res.result.message,
                  })
                }
                resolve(res.result.data)
              } else {
                if (res.result.message) {
                  wx.showToast({
                    title: res.result.message,
                    icon: 'none',
                    duration: 2000
                  })
                  reject(res.result.message)
                }
              }
            } else {
              wx.showToast({
                title: "返回空数据",
                icon: 'none',
                duration: 2000
              })
              reject(res.errMsg)
            }
          } else {
            wx.showToast({
              title: res.errMsg,
              icon: 'none',
              duration: 2000
            })
            reject(res.errMsg)
          }
        },
        fail: err => {
          wx.hideLoading()
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
          wx.showToast({
            title: err.toString(),
            icon: 'none',
            duration: 2000
          })
          reject(err)
        }
      })
    })
  }
}

export {
  HTTP
}
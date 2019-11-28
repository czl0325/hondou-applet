//app.js

import {
  Request
} from '/http/request.js'

var requestModel = new Request()

App({
  onLaunch: function() {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'hongdou-ow8qk',
        traceUser: true,
      })
    }

    Promise.resolve().then(()=>{
      return this.getOpenId()
    }).then((openId)=>{
      this.globalData.userInfo.openId = openId
      wx.setStorageSync("openId", openId)
      return requestModel.getUserInfo(openId)
    }).then(res=>{
      this.globalData.userInfo = res
    })
  },

  getOpenId() {
    return new Promise((resolve, reject)=>{
      wx.cloud.callFunction({
        name: 'login',
        success: res => {
          resolve(res.result.openid)
        },
        fail: err => {
          reject(err)
        }
      })
    })
  },

  globalData: {
    userInfo: {
      openId: '',
      nickName: '未登录',
      avatarUrl: '',
      phone: '未设置手机号码'
    }
  }
})
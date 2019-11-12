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

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           //this.globalData.userInfo.avatarUrl = res.userInfo.avatarUrl
    //           this.globalData.userInfo.nickName = res.userInfo.nickName
    //         }
    //       })
    //     }
    //   }
    // })

    Promise.resolve().then(()=>{
      return this.getOpenId()
    }).then((openId)=>{
      this.globalData.userInfo.openId = openId
      return requestModel.getUserInfo(openId)
    }).then(res=>{
      
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
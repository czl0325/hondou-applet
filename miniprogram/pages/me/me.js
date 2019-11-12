// miniprogram/pages/me/me.js
import {
  Request
} from '../../http/request.js'

var requestModel = new Request()
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  onShow: function() {
    var user = app.globalData.userInfo
    if (!user.avatarUrl) {
      user.avatarUrl = '../../images/icon_default_header.png'
    }
    this.setData({
      userInfo: user
    })
  },

  getUserInfo(event) {
    app.globalData.userInfo.nickName = event.detail.userInfo.nickName
    app.globalData.userInfo.avatarUrl = event.detail.userInfo.avatarUrl
    this.setData({
      userInfo: app.globalData.userInfo
    })
    requestModel.register({
      openId: app.globalData.userInfo.openId,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      nickName: app.globalData.userInfo.nickName
    }).then(res=>{
      console.log(res)
      wx.showToast({
        title: '注册成功!',
      })
    })
  }
})
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
    userInfo: {},
    modalShow: false
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
      if (!res) {
        wx.showToast({
          title: '注册成功!',
        })
      }
    })
  },

  toRegister(event) {
    if (!app.globalData.userInfo._id) {
      wx.navigateTo({
        url: '../register/register',
      })
    }
  },

  toPublish(event) {
    if (app.globalData.userInfo._id != null) {
      wx.navigateTo({
        url: '../activity-edit2/activity-edit2',
      })
    } else {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                wx.navigateTo({
                  url: '../activity-edit/activity-edit',
                })
              }
            })
          } else {
            this.setData({
              modalShow: true,
            })
          }
        }
      })
    }
  },

  onLoginSuccess(event) {
    app.globalData.userInfo.nickName = event.detail.userInfo.nickName
    app.globalData.userInfo.avatarUrl = event.detail.userInfo.avatarUrl
    this.setData({
      userInfo: app.globalData.userInfo
    })
    wx.showLoading({
      title: '登录中...',
      mask: true
    })
    requestModel.register({
      avatarUrl: app.globalData.userInfo.avatarUrl,
      nickName: app.globalData.userInfo.nickName
    }).then(res => {
      wx.navigateTo({
        url: '../activity-edit/activity-edit',
      })
    })
  },

  toMyActivity(event) {
    wx.navigateTo({
      url: `../my-activity/my-activity?type=${event.currentTarget.dataset.index}`,
    })
  }
})
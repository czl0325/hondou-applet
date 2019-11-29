// miniprogram/pages/activity-detail/activity-detail.js

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
    activity: {},
    participants: [],
    isCollect: false,
    isSignup: false,
    modalShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._getActivityDetail(options.activity_id)
  },

  onShareAppMessage: function() {

  },

  async onCollect(event) {
    var user = await this._checkLogin()
    if (user._id != null) {
      wx.showLoading({
        title: '处理中...',
      })
      requestModel.collectActivity(this.data.activity._id, app.globalData.userInfo, (this.data.isCollect == true ? 0 : 1)).then(res => {
        this.setData({
          isCollect: res.collect
        })
      })
    }
  },

  onLoginSuccess(event) {
    app.globalData.userInfo.nickName = event.detail.userInfo.nickName
    app.globalData.userInfo.avatarUrl = event.detail.userInfo.avatarUrl
    this.setData({
      userInfo: app.globalData.userInfo
    })
    requestModel.register({
      openId: app.globalData.userInfo.openId,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      nickName: app.globalData.userInfo.nickName
    }).then(res => {
      wx.showToast({
        title: '登录成功!',
      })
    })
  },

  onLoginFail(event) {
    wx.showToast({
      title: '登录用户才可以操作',
    })
  },

  async onSignUp(event) {
    var user = await this._checkLogin()
    if (user._id != null) {
      if (app.globalData.userInfo.phone.length != 11) {
        wx.navigateTo({
          url: '../bindPhone/bindPhone',
          success: res => {
            wx.showToast({
              title: '请先绑定电话号码',
              icon: 'none',
              duration: 2000
            })
          }
        })
        return
      }
      wx.showLoading({
        title: '处理中...',
      })
      requestModel.signupActivity(this.data.activity._id, app.globalData.userInfo, (this.data.isSignup == true ? 0 : 1)).then((res) => {
        this.setData({
          isSignup: res.signup
        })
        this._getParticipants(this.data.activity._id)
      })
    }
  },

  async _checkLogin() {
    if (app.globalData.userInfo._id != null) {
      return app.globalData.userInfo
    } 
    let result = await wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              return res.userInfo
            }
          })
        } else {
          this.setData({
            modalShow: true,
          })
          return null
        }
      }
    })
    return result
  },

  _getActivityDetail(activity_id) {
    wx.showLoading({
      title: '内容加载中...',
    })
    requestModel.getActivityDetail(activity_id).then(res => {
      this.setData({
        activity: res
      })
      wx.setNavigationBarTitle({
        title: this.data.activity.title,
      })
      this._getParticipants(activity_id)
      this._getIsCollect()
      this._getIsSignup()
    })
  },

  _getParticipants(activity_id) {
    requestModel.getParticipants(activity_id).then(res => {
      this.setData({
        participants: res
      })
    })
  },

  _getIsCollect() {
    requestModel.getIsCollect(this.data.activity._id).then((res) => {
      this.setData({
        isCollect: res.collect
      })
    })
  },

  _getIsSignup() {
    requestModel.getIsSignup(this.data.activity._id).then((res) => {
      this.setData({
        isSignup: res.signup
      })
    })
  },

  onClickUser(event) {
    const index = event.currentTarget.dataset.index
    let user = this.data.participants[index]
    wx.navigateTo({
      url: `../user-info/user-info?_openid=${user._openid}`,
    })
  }
})
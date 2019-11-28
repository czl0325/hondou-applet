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
    isCollect: false,
    isSignup: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      activity: JSON.parse(options.activity)
    })
    wx.setNavigationBarTitle({
      title: this.data.activity.title,
    })
    this.getIsCollect()
    this.getIsSignup()
  },

  onShareAppMessage: function() {

  },

  onCollect(event) {
    requestModel.collectActivity(this.data.activity._id, app.globalData.userInfo).then((res) => {

    })
  },

  onSignUp(event) {
    requestModel.signupActivity(this.data.activity._id, app.globalData.userInfo).then((res) => {
      
    })
  },

  getIsCollect() {
    requestModel.getIsCollect(this.data.activity._id).then((res) => {
      this.setData({
        isCollect: res.collect
      })
    })
  },

  getIsSignup() {
    requestModel.getIsSignup(this.data.activity._id).then((res) => {
      this.setData({
        isSignup: res.signup
      })
    })
  },

  onClickUser(event) {
    
  }
})
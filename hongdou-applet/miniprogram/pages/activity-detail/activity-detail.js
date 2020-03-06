// miniprogram/pages/activity-detail/activity-detail.js

import {
  Request
} from '../../http/request.js'

const requestModel = new Request()
const app = getApp()

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
  onLoad: function (options) {
    this._getActivityDetail(options.activity_id)
  },

  onShareAppMessage: function () {

  },

  async onCollect(event) {
    var user = app.globalData.userInfo
    if (!user._id || user.phone.length != 11 || user.idNumber.length <= 0) {
      this.setData({
        modalShow: true
      })
      return
    }
    wx.showLoading({
      title: '处理中...',
    })
    requestModel.collectActivity(this.data.activity._id, app.globalData.userInfo, (this.data.isCollect == true ? 0 : 1)).then(res => {
      this.setData({
        isCollect: res.collect
      })
    })
  },

  //报名活动
  async onSignUp(event) {
    var user = app.globalData.userInfo
    if (!user._id || user.phone.length != 11 || user.idNumber.length <= 0) {
      this.setData({
        modalShow: true
      })
      return
    }
    wx.showLoading({
      title: '处理中...',
    })
    requestModel.signupActivity(this.data.activity._id, user, (this.data.isSignup == true ? 0 : 1)).then((res) => {
      this.setData({
        isSignup: res.signup
      })
      this._getParticipants(this.data.activity._id)
    })
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
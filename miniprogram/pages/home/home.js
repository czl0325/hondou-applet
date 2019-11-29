// miniprogram/pages/home/home.js

import {
  Request
} from '../../http/request.js'

var requestModel = new Request()
var event = require('../../utils/event.js')

var pageNum = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['全部', '未开始', '已结束'],
    currentIndex: 0,
    activities: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    event.on('publishSuccess', this, function (activity) {
      this.data.activities.unshift(activity)
      this.setData({
        activities: this.data.activities
      })
    })

    this._getActivityList(true)
  },

  onUnload: function() {
    event.remove("publishSuccess", this)
  },
  
  onPullDownRefresh: function () {
    this._getActivityList(true)
  },
  
  onReachBottom: function () {
    this._getActivityList(false)
  },

  onSearch(event) {
    this._getActivityList(true, event.detail.value)
  },

  onClickTab(event) {
    this.setData({
      currentIndex: event.currentTarget.dataset.index
    })
    this._getActivityList(true)
  },

  toActivityDetail(event) {
    let activity = event.detail.activity
    wx.navigateTo({
      url: '../activity-detail/activity-detail?activity_id=' + activity._id,
    })
  },

  _getActivityList(refresh, keyword = '', type = this.data.currentIndex) {
    if (refresh) {
      pageNum = 0
      this.data.activities = []
    } else {
      pageNum++
    }
    wx.showLoading({
      title: '活动数据加载中...',
    })
    requestModel.getActivityList(pageNum, type, keyword).then((res) => {
      this.setData({
        activities: this.data.activities.concat(res)
      })
    })
  }
})
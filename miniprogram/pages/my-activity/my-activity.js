// pages/my-activity/my-activity.js
import {
  Request
} from '../../http/request.js'

var requestModel = new Request()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activities: []
  },

  onLoad: function(options) {
    if (options.type == 1) {
      this._getMyJoin()
      wx.setNavigationBarTitle({
        title: '我已报名',
      })
    } else if (options.type == 2) {
      this._getMyCollect()
      wx.setNavigationBarTitle({
        title: '我的收藏',
      })
    }
  },

  _getMyCollect() {
    requestModel.getMyCollect().then(res => {
      this.setData({
        activities: res
      })
    })
  },

  _getMyJoin() {
    requestModel.getMyJoin().then(res => {
      this.setData({
        activities: res
      })
    })
  }
})
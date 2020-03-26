// pages/user-info/user-info.js

import {
  Request
} from '../../http/request.js'

var requestModel = new Request()

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
    console.log(options._openid)
    this._getUserInfo(options._openid)
  },

  onCallPhone(event) {
    wx.makePhoneCall({
      phoneNumber: this.data.userInfo.phone,
    })
  },

  _getUserInfo(_openid) {
    requestModel.getUserInfo(_openid).then(res=>{
      this.setData({
        userInfo: res
      })
    })
  }
})
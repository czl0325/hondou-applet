// pages/user-info/user-info.js

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
    userInfo: {},
    canShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
        userInfo: res,
        canShow: app.globalData.userInfo._openid == "ocoH25eqQfokZXP629ZcgxoiKHSE"
      })
    })
  }
})
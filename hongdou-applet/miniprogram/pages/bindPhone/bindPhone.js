// pages/bindPhone/bindPhone.js
import {
  Request
} from '../../http/request.js'

var requestModel = new Request()
var app = getApp()
var phone = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  onInputPhone(event) {
    phone = event.detail.value
  },

  onBind(event) {
    if (phone.length != 11) {
      wx.showToast({
        title: '请填写正确的手机号码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.showLoading({
      title: '设置中...',
    })
    requestModel.bindPhone(phone)
      .then(res => {
        app.globalData.userInfo.phone = phone
        wx.navigateBack({
          success: res => {
            wx.showToast({
              title: '设置电话成功!',
            })
          }
        })
      })
  }
})
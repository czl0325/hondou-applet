// miniprogram/pages/register/register.js
import {
  Request
} from '../../http/request.js'

const requestModel = new Request()
const app = getApp()

var is_agree = false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user: app.globalData.userInfo
    })
  },

  onRealName(event) {
    this.data.user.realName = event.detail.value
  },

  onPhone(event) {
    this.data.user.phone = event.detail.value
  },

  onIdNumber(event) {
    this.data.user.idNumber = event.detail.value
  },

  onRegister(event) {
    const userInfo = event.detail.userInfo
    if (userInfo) {
      this.data.user.avatarUrl = userInfo.avatarUrl
      this.data.user.nickName = userInfo.nickName
    } 
    if (this.data.user.idNumber.length <= 0 || this.data.user.phone.length != 11 || this.data.user.realName.length <= 0) {
      wx.showToast({
        title: '资料填写不完整',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (is_agree == false) {
      wx.showToast({
        title: '请先阅读并同意隐私政策和服务协议',
        icon: 'none',
        duration: 3000
      })
      return
    }
    wx.showLoading({
      title: '提交注册中...',
    })
    requestModel.register(this.data.user).then(res => {
      app.globalData.userInfo = res
      wx.navigateBack({
        success: () => {
          wx.showToast({
            title: '注册成功!',
          })
        }
      })
    })
  },

  onCheck(event) {
    is_agree = !(event.detail.value == '')
  },

  toPrivacy(event) {
    wx.navigateTo({
      url: '../web-view/web-view?type=1',
    })
  },

  toService(event) {
    wx.navigateTo({
      url: '../web-view/web-view?type=2',
    })
  }

})
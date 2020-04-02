// miniprogram/pages/web-view/web-view.js
const utils = require('../../utils/utils.js')
const text = require('../../utils/text.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "",
    html_str: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.url) {
      this.setData({
        url: utils.urlDecode(options.url)
      })
    }
    if (options.type) {
      if (parseInt(options.type) == 1) {
        wx.setNavigationBarTitle({
          title: '隐私政策',
        })
        this.setData({
          html_str: text.privacy()
        })
      } else {
        wx.setNavigationBarTitle({
          title: '服务协议',
        })
        this.setData({
          html_str: text.service()
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
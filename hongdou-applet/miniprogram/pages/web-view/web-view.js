// miniprogram/pages/web-view/web-view.js
const utils = require('../../utils/utils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "https://mp.weixin.qq.com/s?__biz=MzA5ODE1NzMwNg==&mid=502812811&idx=1&sn=519f42e89d1055a65752ac6b202c4acc&chksm=0899271e3feeae080f635d8599368a4899f2949eb98a4d4084e6df6ec4062ecc02aa716bce8e#rd"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (options.url) {
    //   console.log(utils.urlDecode(options.url))
    //   this.setData({
    //     url: utils.urlDecode(options.url)
    //   })
    // }
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
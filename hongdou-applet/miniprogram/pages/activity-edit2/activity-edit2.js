// miniprogram/pages/activity-edit2/activity-edit2.js
import { Request } from '../../http/request.js'
const requestModel = new Request()
const myEvent = require('../../utils/event.js')
const app = getApp()
const utils = require('../../utils/utils.js')

var title = ""
var inputText = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formats: {},
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    signEndDate: '',
    activityDate: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({
      isIOS
    })
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)
    })
  },

  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const {
      windowHeight,
      platform
    } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({
      editorHeight,
      keyboardHeight
    })
  },

  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },

  onStatusChange(e) {
    const formats = e.detail
    this.setData({
      formats
    })
  },

  onAcitivityTitle(event) {
    title = event.detail.value
  },

  onInputContent(event) {
    inputText = event.detail.html
  },

  bindDateChange1(event) {
    console.log(event.detail.value)
    this.setData({
      signEndDate: event.detail.value
    })
  },

  bindDateChange2(event) {
    this.setData({
      activityDate: event.detail.value
    })
  },

  onPublish(event) {
    if (title.trim().length <= 0) {
      wx.showToast({
        title: '标题不能为空',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.signEndDate === '') {
      wx.showToast({
        title: '报名截止时间必填',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.activityDate === '') {
      wx.showToast({
        title: '活动开始时间必填',
        icon: 'none',
        duration: 2000
      })
      return
    }
    var date1 = utils.stringToDate(this.data.signEndDate)
    var date2 = utils.stringToDate(this.data.activityDate)
    if (date2 < date1) {
      wx.showToast({
        title: '活动开始时间不得早于报名截止时间',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.showLoading({
      title: '发布中',
      mask: true,
    })
    requestModel.publishActivity(app.globalData.userInfo, title, inputText, '', this.data.signEndDate, this.data.activityDate).then(res1 => {
      wx.navigateBack({
        success: res2 => {
          myEvent.emit("publishSuccess", res1)
          wx.showToast({
            title: '活动发布成功',
          })
        }
      })
    })
  },

  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        that.editorCtx.insertImage({
          src: res.tempFilePaths[0],
          data: {
            id: 'abcd',
            role: 'god'
          },
          width: '95%',
          success: function () {
            console.log('insert image success')
          }
        })
      }
    })
  },


  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const {
      statusBarHeight,
      platform
    } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset
    if (!name) return
    this.editorCtx.format(name, value)
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  }
})
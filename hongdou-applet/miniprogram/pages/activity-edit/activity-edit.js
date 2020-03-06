// miniprogram/pages/activity-edit/activity-edit.js
import {
  Request
} from '../../http/request.js'

const requestModel = new Request()
const myEvent = require('../../utils/event.js')
const app = getApp()
const utils = require('../../utils/utils.js')

var title = ''
var content = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    signEndDate: '',
    activityDate: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  onAcitivityTitle(event) {
    title = event.detail.value
  },

  onInputContent(event) {
    content = event.detail.value
  },

  onChooseImage(event) {
    wx.chooseImage({
      count: 100,
      sizeType: ['compressed'],
      success: (res) => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
      },
    })
  },

  onDeleteImage(event) {
    const index = event.currentTarget.dataset.index
    this.data.images.splice(index, 1)
    this.setData({
      images: this.data.images
    })
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
    var promises = []
    let fileIds = []
    for (var i = 0, len = this.data.images.length; i < len; i++) {
      let promise = new Promise((resolve, rejuect) => {
        let image = this.data.images[i]
        // 文件扩展名
        let suffix = /\.\w+$/.exec(image)[0]
        wx.cloud.uploadFile({
          cloudPath: 'activity_images/' + new Date().getTime() + '_' + Math.random() * 1000000 + suffix,
          filePath: image,
          success: (res) => {
            fileIds = fileIds.concat(res.fileID)
            resolve()
          },
          fail: (err) => {
            console.error(err)
            reject()
          }
        })
      })
      promises.push(promise)
    }
    Promise.all(promises).then((res) => {
      requestModel.publishActivity(app.globalData.userInfo, title, content, fileIds, this.data.signEndDate, this.data.activityDate).then(res1 => {
        wx.navigateBack({
          success: res2 => {
            myEvent.emit("publishSuccess", res1)
            wx.showToast({
              title: '活动发布成功',
            })
          }
        })
      })
    })
  }
})
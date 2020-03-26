// miniprogram/pages/activity-edit2/activity-edit2.js
import { Request } from '../../http/request.js'
const requestModel = new Request()
const myEvent = require('../../utils/event.js')
const app = getApp()
const utils = require('../../utils/utils.js')
const dateTimePicker = require('../../utils/dateTimePicker.js');



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
    activityDate: '',
    dateTimeArray1: null,
    dateTime1: null,
    title: "",
    inputText: "",
    activity_id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.activity_id) {
      wx.setNavigationBarTitle({
        title: '编辑活动',
      })
      this.setData({
        activity_id: options.activity_id
      })
      this._getActivityDetail(options.activity_id)
    } else {
      wx.setNavigationBarTitle({
        title: '发布活动',
      })
    }
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

    var obj1 = dateTimePicker.dateTimePicker()
    this.setData({
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
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
    this.data.title = event.detail.value
  },

  onInputContent(event) {
    this.data.inputText = event.detail.html
  },

  bindDateChange1(event) {
    var dateTimeArray1 = this.data.dateTimeArray1
    var dateTime1 = this.data.dateTime1
    this.setData({
      signEndDate: `${dateTimeArray1[0][dateTime1[0]]}-${ dateTimeArray1[1][dateTime1[1]]}-${ dateTimeArray1[2][dateTime1[2]]} ${ dateTimeArray1[3][dateTime1[3]]}:${ dateTimeArray1[4][dateTime1[4]]}`
    })
  },

  bindDateChange2(event) {
    var dateTimeArray1 = this.data.dateTimeArray1
    var dateTime1 = this.data.dateTime1
    this.setData({
      activityDate: `${dateTimeArray1[0][dateTime1[0]]}-${dateTimeArray1[1][dateTime1[1]]}-${dateTimeArray1[2][dateTime1[2]]} ${dateTimeArray1[3][dateTime1[3]]}:${dateTimeArray1[4][dateTime1[4]]}`
    })
  },

  onPublish(event) {
    if (this.data.title.trim().length <= 0) {
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
    var date1 = new Date(this.data.signEndDate)
    var date2 = new Date(this.data.activityDate)
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
    requestModel.publishActivity(app.globalData.userInfo, this.data.title, this.data.inputText, '', this.data.signEndDate, this.data.activityDate, this.data.activity_id).then(res1 => {
      wx.navigateBack({
        success: res2 => {
          if (this.data.activity_id == null) {
            myEvent.emit("publishSuccess", res1)
          }
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
      count: 9,
      success: function (res) {
        const arr = []
        // console.log(that.data.images)
        for (let path of res.tempFilePaths) {
          // 文件扩展名
          let suffix = /\.\w+$/.exec(path)[0]
          let promise = wx.cloud.uploadFile({
            cloudPath: 'activity_images/' + utils.dateFormat("YYYYmmddHHMMSS", new Date()) + '_' + parseInt(Math.random() * 1000000) + suffix,
            filePath: path
          })
          arr.push(promise)
        }
        Promise.all(arr).then(urls => {
          for (var url of urls) {
            that.editorCtx.insertImage({
              src: url.fileID,
              width: '95%',
              success: function () {

              }
            })
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
  },

  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },

  _getActivityDetail(activity_id) {
    wx.showLoading({
      title: '内容加载中...',
    })
    requestModel.getActivityDetail(activity_id).then(res => {
      res.content = utils.escape2Html(res.content)
      this.data.inputText = res.content
      this.editorCtx.setContents({
        html: res.content
      })
      this.setData({
        title: res.title,
        signEndDate: utils.dateToString(new Date(res.signEndDate), true) ,
        activityDate: utils.dateToString(new Date(res.activityDate), true) 
      })
    })
  },
})
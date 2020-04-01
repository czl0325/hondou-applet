// miniprogram/pages/article/article.js
import { Request } from '../../http/request.js'
const requestModel = new Request()
const utils = require('../../utils/utils.js')

var pageNum = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    articles: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getArticles(true)
  },

  onPullDownRefresh: function () {
    this._getArticles(true)
  },

  onReachBottom: function () {
    this._getArticles(false)
  },

  onClickArticle(event) {
    let index = event.currentTarget.dataset.index
    let article = this.data.articles[index]
    wx.navigateTo({
      url: '../web-view/web-view?url=' + utils.urlEncode(article.url),
    })
  },

  _getArticles(refresh) {
    wx.showLoading({
      title: '文章获取中...',
      mask: true
    })
    if (refresh) {
      pageNum = 0
    } else {
      pageNum++
    }
    requestModel.getArticles().then(res=>{
      var articles = this.data.articles
      if (refresh) {
        articles = []
      }
      articles = articles.concat(res)
      this.setData({
        articles
      })
    })
  }
})
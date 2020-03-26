//引用editor方法,外部唯一暴露接口
function editorfunction(e) {
  wx.loadFontFace({
    family: 'Pacifico',
    source: 'url("https: //sungd.github.io/Pacifico.ttf")',
  })
  //获取当前工作路径,that变量等同于页面本身的this
  var pages = getCurrentPages();
  var that = pages[pages.length - 1]
  var e = e.currentTarget.dataset
  //改变文本样式方法
  if (e.bind == 'format') {
    if (!e.name) return
    that.editorCtx.format(e.name, e.value)
  }
  //删除字体样式方法
  if (e.bind == 'removeFormat') {
    that.editorCtx.removeFormat()
  }
  //快速插入日期方法
  if (e.bind == 'insertDate') {
    var date = new Date()
    var formatDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    that.editorCtx.insertText({
      text: formatDate
    })
  }
  //撤销操作方法
  if (e.bind == 'undo') {
    that.editorCtx.undo()
  }
  //恢复操作方法
  if (e.bind == 'redo') {
    that.editorCtx.redo()
  }
  //添加分割线方法
  if (e.bind == 'insertDivider') {
    that.editorCtx.insertDivider()
  }
  //清除内容方法
  if (e.bind == 'clear') {
    that.editorCtx.clear()
  }
  //插入图片方法
  if (e.bind == 'insertImage') {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        wx.uploadFile({
          url: getApp().globalData.url + 'activity/ uploadimg',
          //里填写自己的图片上传方法地址
          header: {
            'content - type': 'multipart/form-data'
          },
          filePath: res.tempFilePaths[0],
          name: 'img',
          success(res) {
            wx.hideLoading()
            var data = JSON.parse(res.data)
            if (data.code == 1) {
              that.editorCtx.insertImage({
                src: data.data
              })
            } else {
              wx.showToast({
                title: data.data,
                icon: 'none'
              })
            }
          }
        })
      }
    })
  }
}

module.exports = {
  editorfunction: editorfunction, //引用editor方法,外部唯一暴露接口
}
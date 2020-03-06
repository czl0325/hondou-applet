// components/dialog-login/index.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGotUserInfo(event) {
      const userInfo = event.detail.userInfo
      if (userInfo) {
        app.globalData.userInfo.avatarUrl = userInfo.avatarUrl
        app.globalData.userInfo.nickName = userInfo.nickName
      } 
      this.setData({
        modalShow: false
      },()=>{
        wx.navigateTo({
          url: '../../pages/register/register',
        })
      })
    }
  }
})

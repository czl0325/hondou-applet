// components/dialog-login/index.js
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
        this.setData({
          modalShow: false
        })
        this.triggerEvent('loginSuccess', {
          userInfo
        })
      } else {
        this.triggerEvent('loginFail')
      }
    }
  }
})

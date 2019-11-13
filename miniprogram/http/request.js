import {
  HTTP
} from '../http/http.js'

class Request extends HTTP {
  getOpenId() {
    return this.request({
      name: 'login'
    })
  }

  getUserInfo(openId) {
    return this.request({
      name: 'user',
      data: {
        action: 'getUser',
        openId: openId
      }
    })
  }

  register(user) {
    return this.request({
      name: 'user',
      data: {
        action: 'register',
        openId: user.openId || '',
        avatarUrl: user.avatarUrl || '',
        nickName: user.nickName || '',
        phone: user.phone || '',
      }
    })
  }

  bindPhone(phone) {
    return this.request({
      name: 'user',
      data: {
        action: 'bindPhone',
        openId: wx.getStorageSync("openId"),
        phone: phone || ''
      }
    })
  }
}

export {
  Request
}
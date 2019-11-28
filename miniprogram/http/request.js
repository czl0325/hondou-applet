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

  publishActivity(user, title, content, images, singEndDate, activityDate) {
    return this.request({
      name: 'activity',
      data: {
        title,
        content,
        images,
        singEndDate,
        activityDate,
        $url: 'publish',
        avatarUrl: user.avatarUrl,
        nickName: user.nickName
      }
    })
  }

  getActivityList(pageNum, type, keyword) {
    return this.request({
      name: 'activity',
      data: {
        pageNum,
        type,
        keyword,
        $url: 'list'
      }
    })
  }

  collectActivity(activity_id, user, collect=0) {
    return this.request({
      name: 'activity',
      data: {
        activity_id,
        collect,
        $url: 'collect',
        avatarUrl: user.avatarUrl,
        nickName: user.nickName
      }
    })
  }

  getIsCollect(activity_id) {
    return this.request({
      name: 'activity',
      data: {
        activity_id,
        $url: 'isCollect'
      }
    })
  }

  signupActivity(activity_id, user, signup=0) {
    return this.request({
      name: 'activity',
      data: {
        activity_id,
        signup,
        $url: 'signup',
        avatarUrl: user.avatarUrl,
        nickName: user.nickName
      }
    })
  }

  getIsSignup(activity_id) {
    return this.request({
      name: 'activity',
      data: {
        activity_id,
        $url: 'isSignup'
      }
    })
  }
}

export {
  Request
}
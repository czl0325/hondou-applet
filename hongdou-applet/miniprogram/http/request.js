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
        avatarUrl: user.avatarUrl || '',
        nickName: user.nickName || '',
        realName: user.realName || '',
        phone: user.phone || '',
        idNumber: user.idNumber || ''
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

  publishActivity(user, title, content, images, signEndDate, activityDate) {
    return this.request({
      name: 'activity',
      data: {
        title,
        content,
        images,
        signEndDate,
        activityDate,
        $url: 'publish',
        avatarUrl: user.avatarUrl,
        nickName: user.nickName,
        createTime: wx.cloud.database().serverDate()
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

  getActivityDetail(activity_id) {
    return this.request({
      name: 'activity',
      data: {
        activity_id,
        $url: 'detail'
      }
    })
  }

  getParticipants(activity_id) {
    return this.request({
      name: 'activity',
      data: {
        activity_id,
        $url: 'join'
      }
    })
  }

  collectActivity(activity_id, user, collect=1) {
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

  signupActivity(activity_id, user, signup=1) {
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

  getMyCollect() {
    return this.request({
      name: 'user',
      data: {
        action: 'collect'
      }
    })
  }

  getMyJoin() {
    return this.request({
      name: 'user',
      data: {
        action: 'join'
      }
    })
  }
}

export {
  Request
}
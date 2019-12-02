// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  if (event.action == null || event.action.length <= 0) {
    return {
      code: 500,
      message: "缺少action!",
    }
  }
  const { OPENID } = cloud.getWXContext()
  if (!event._openid) {
    event._openid = OPENID
  }
  console.log(`openid=${event._openid}`)
  switch (event.action) {
    case "getUser":
      {
        return getUserById(event._openid)
      }
    case 'register':
      {
        return registerUser(event)
      }
    case 'bindPhone':
      {
        return bindPhone(event._openid, event.phone)
      }
    case "collect":
      {
        return getMyCollect(event._openid)
      }
    case "join":
      {
        return getMyJoin(event._openid)
      }
    default:
      {
        return {
          code: 500,
          message: "找不到该action!",
        }
      }
  }
}

async function getUserById(openId) {
  if (!openId) {
    return {
      code: 500,
      message: "用户openId为空!",
    }
  }
  console.log(`传入的openId=${openId}`)
  let result = await db.collection('user')
    .where({
      _openid: openId
    })
    .get().then(res => {
      if (res.data.length > 0) {
        return {
          code: 0,
          message: "成功!",
          data: res.data[0]
        }
      } else {
        return {
          code: 102,
          message: "未登录!"
        }
      }
    }).catch(err => {
      console.log(`错误信息=${err}`)
      return {
        code: 102,
        message: "您还没有注册，请点击头像进行注册!"
      }
    })
  return result
}

async function registerUser(event) {
  let user = await db.collection('user')
    .where({
      _openid: event._openid
    }).get().then(res => {
      if (res.data.length > 0) {
        return res.data[0]
      } else {
        return null
      }
    })
  if (user != null && user._id != null) {
    let result = await db.collection('user')
      .where({
        _openid: event._openid,
      }).update({
        data: {
          avatarUrl: event.avatarUrl,
          nickName: event.nickName,
          phone: event.phone,
          updateTime: db.serverDate(),
        }
      }).then(res => {

      })
    let newUser = await getUserById(event._openid)
    return {
      code: 0,
      message: "登录成功!",
      data: newUser
    }
  } else {
    const user = {
      _openid: event._openid,
      avatarUrl: event.avatarUrl,
      nickName: event.nickName,
      phone: event.phone ? event.phone : '',
      createTime: db.serverDate(),
    }
    let result = await db.collection('user')
      .add({
        data: {
          ...user
        }
      }).then((res) => {
        user._id = res._id
        return {
          code: 0,
          message: "注册成功!",
          data: user
        }
      }).catch((err) => {
        return {
          code: 101,
          message: "注册失败!",
        }
      })

    return result
  }
}

async function bindPhone(openId, phone) {
  if (!openId) {
    return {
      code: 500,
      message: '缺少openId'
    }
  }
  if (!phone) {
    return {
      code: 500,
      message: '缺少电话号码'
    }
  }
  let result = await db.collection('user')
    .where({
      _openid: openId,
    }).update({
      data: {
        phone: phone
      }
    }).then(res => {
      return {
        code: 0,
        message: '设置电话号码成功'
      }
    }).catch(err => {
      return {
        code: 101,
        message: '设置电话号码失败'
      }
    })
  return result
}

async function getMyCollect(openId) {
  let collects = await db.collection('collect').where({
    _openid: openId
  }).orderBy('createTime', 'desc').get().then(res=>{
    return res.data
  }).catch(err=>{
    return null
  })
  if (collects == null) {
    return {
      code: 500,
      message: "数据库读取错误"
    }
  }
  var activities = []
  for (let c of collects) {
    let activity = await db.collection('activity').where({
      $url: 'detail',
      activity_id: c.activity_id
    }).get().then(res=>{
      return res.data
    }).catch(err=>{
      return null
    })
    if (activity != null) {
      activities.push(activity)
    }
  }
  return {
    code: 0,
    message: "读取我的收藏成功",
    data: activities
  }
}

async function getMyJoin(openId) {
  let signups = await db.collection('signup').where({
    _openid: openId
  }).orderBy('createTime', 'desc').get().then(res => {
    return res.data
  }).catch(err => {
    return null
  })
  if (signups == null) {
    return {
      code: 500,
      message: "数据库读取错误"
    }
  }
  var activities = []
  for (let s of signups) {
    let activity = await db.collection('activity').where({
      _id: s.activity_id
    }).get().then(res => {
      return res.data
    }).catch(err => {
      return null
    })
    if (activity != null && activity.length > 0) {
      activities.push(activity[0])
    }
  }
  return {
    code: 0,
    message: "读取我报名的成功",
    data: activities
  }
}
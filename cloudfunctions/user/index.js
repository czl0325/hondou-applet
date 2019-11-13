// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  if (!event.action) {
    return {
      code: 500,
      message: "缺少action!",
    }
  }
  switch (event.action) {
    case "getUser":
      {
        return getUserById(event.openId)
      }
    case 'register':
      {
        return registerUser(event)
      }
    case 'bindPhone':
      {
        return bindPhone(event.openId, event.phone)
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
      openId: openId
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
          message: "数据错误，请联系管理员!"
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
  if (!event.openId) {
    return {
      code: 500,
      message: '缺少openId'
    }
  }
  let user = await db.collection('user')
    .where({
      openId: event.openId
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
        openId: event.openId,
      }).update({
        data: {
          avatarUrl: event.avatarUrl,
          nickName: event.nickName,
          phone: event.phone,
          updateTime: db.serverDate,
        }
      }).then(res => {

      })
    let newUser = await getUserById(event.openId)
    return newUser
  } else {
    let result = await db.collection('user')
      .add({
        data: {
          openId: event.openId,
          avatarUrl: event.avatarUrl,
          nickName: event.nickName,
          phone: event.phone,
          createTime: db.serverDate,
        }
      }).then((res) => {
        let e = {
          openId: event.openId
        }
        //let newUser = await getUserById(e)
        return {
          code: 0,
          message: "注册成功!"
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
      openId: openId,
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
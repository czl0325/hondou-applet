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
        return getUserById(event)
      }
    case 'register':
      {
        return registerUser(event)
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

async function getUserById(event) {
  if (!event.openId) {
    return {
      code: 100,
      message: "用户openId为空!",
    }
  }
  let result = await db.collection('user').doc(event.openId)
    .get().then(res => {
      return {
        code: 0,
        message: "成功!",
        data: res.data
      }
    }).catch(err => {
      return {
        code: 102,
        message: "找不到该用户!"
      }
    })
  return result
}

async function registerUser(event) {
  if (!event.openId) {
    return {
      code: 101,
      message: '缺少openId'
    }
  }
  let user = await db.collection('user')
    .where({
      openId: event.openId
    }).get().then(res=>{
      if (res.data.length > 0) {
        return res.data[0]
      } else {
        return null
      }
    })
  console.log("测试下云函数更新")
  if (user != null && user._id != null) {
    return {
      code: 0,
      message: "该用户已注册过!",
      data: user
    }
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
        console.log('插入成功')
        return {
          code: 0,
          message: "注册用户成功!",
        }
      }).catch((err) => {
        console.error('插入失败')
        return {
          code: 101,
          message: "注册用户成功!",
        }
      })

    return result
  }
}
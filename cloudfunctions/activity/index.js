// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const TcbRouter = require('./router');

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    OPENID
  } = wxContext
  const app = new TcbRouter({ event });

  const result = {
    code:0,
    message:'成功'
  }
  app.router('publish', async(ctx, next)=>{
    const activity = {
      nickName: event.nickName,
      avatarUrl: event.avatarUrl,
      _openid: event.openid ? event.openid : OPENID,
      title: event.title,
      content: evetn.content,
      images: event.images ? event.images : [],
      createTime: db.serverDate,
      participants: []    //参与者
    }

    let _id = db.collection('activity').add({
      data: {
        ...activity
      }
    }).then((res)=>{
      return res._id
    })
    if (!_id) {
      result.code = 500
      result.message = "数据插入失败"
    } else {
      activity._id = _id
      result.data = activity
    }
    
    ctx.body = result
  })

  return app.serve()
}
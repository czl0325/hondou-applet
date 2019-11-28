// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const TcbRouter = require('tcb-router');
var PageSize = 20

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    OPENID
  } = wxContext
  const app = new TcbRouter({
    event
  });

  const result = {
    code: 0,
    message: '成功'
  }

  app.router('publish', async(ctx, next) => {
    const activity = {
      nickName: event.nickName,
      avatarUrl: event.avatarUrl,
      _openid: event.openid ? event.openid : OPENID,
      title: event.title,
      content: event.content,
      images: event.images ? event.images : [],
      singEndDate: Date.parse(event.singEndDate + " 23:59:59"),
      activityDate: Date.parse(event.singEndDate),
      createTime: db.serverDate(),
      participants: [] //参与者
    }
    let _id = await db.collection('activity').add({
      data: {
        ...activity
      }
    }).then((res) => {
      return res._id
    }).catch((err) => {
      console.error(err)
      return null
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

  app.router('list', async(ctx, next) => {
    if (event.pageSize != null) {
      PageSize = parseInt(event.pageSize)
    }
    var filtrate = {}
    if (event.type != null) {
      if (event.type == 1) {
        filtrate.activityDate = db.command.lt(new Date().getTime())
      } else if (event.type == 2) {
        filtrate.activityDate = db.command.gte(new Date().getTime())
      }
    }
    if (event.keyword != null && event.keyword.length > 0) {
      filtrate.title = new db.RegExp({
        regexp: event.keyword,
        options: 'i',
      })
      filtrate.content = new db.RegExp({
        regexp: event.keyword,
        options: 'i',
      })
    }
    if (event.pageNum == null) {
      result.code = 100
      result.message = "缺少参数pageNum"
    } else {
      var pageNum = event.pageNum
      let list = await db.collection('activity').where(filtrate).skip(pageNum * PageSize).limit(PageSize).orderBy('createTime', 'desc').get().then(res => {
        return res.data
      })
      result.data = list
    }
    ctx.body = result
  })

  app.router('detail', async(ctx, next) => {
    if (event.activity_id == null) {
      result.code = 100
      result.message = "缺少参数_id"
    } else {
      let activity = await db.collection('activity').where({
        _id: event.activity_id
      }).get().then(res=>{
        return res.data[0]
      }).catch(err=>{
        return null
      })
      if (activity != null) {
        result.data = activity
      } else {
        result.code = 500
        result.message = "查找不到数据"
      }
    }
    ctx.body = result
  })

  app.router('collect', async(ctx, next) => {
    var collect = 0 //0收藏 1取消收藏
    if (event.collect) {
      collect = parseInt(event.collect)
    }
    if (event.activity_id == null) {
      result.code = 100
      result.message = "缺少参数_id"
    } else {
      let user = await db.collection('user').where({
        _openid: event.openid ? event.openid : OPENID
      }).limit(1).get().then((res) => {
        return res.data[0]
      }).catch((err) => {
        return null
      })
      let activity = await db.collection('activity').where({
        _id: event.activity_id
      }).limit(1).get(1).then((res) => {
        return res.data[0]
      }).catch((err) => {
        return null
      })
      let myopenid = event.openid ? event.openid : OPENID

      if (collect == 0) {
        let list = await db.collection('collect').where({
          activity_id: event.activity_id,
          _openid: myopenid
        }).get().then(res => {
          return res.data
        }).catch(err => {
          return null
        })
        if (list.length > 0) {
          result.code = 200
          result.message = "您已收藏过了"
        } else {
          let _id = await db.collection('collect').add({
            data: {
              activity_id: event.activity_id,
              avatarUrl: event.avatarUrl,
              nickName: event.nickName,
              _openid: myopenid
            }
          }).then((res) => {
            return res._id
          }).catch((err) => {
            console.error(err)
            return null
          })
          if (!_id) {
            result.code = 500
            result.message = "数据插入失败"
          } else {
            result.message = "已收藏"
            result.data = {
              collect: true
            }
          }
        }
      } else {
        let number = await db.collection('collect').where({
          activity_id: event.activity_id,
          _openid: myopenid
        }).remove().then((res) => {
          return res.stats.removed
        }).catch((err) => {
          console.error(err)
          return null
        })
        if (!number) {
          result.code = 500
          result.message = "数据删除失败"
        } else {
          result.message = "取消收藏"
          result.data = {
            collect: false
          }
        }
      }
    }
    ctx.body = result
  })

  app.router('isCollect', async(ctx, next) => {
    if (event.activity_id == null) {
      result.code = 100
      result.message = "缺少参数_id"
    } else {
      let list = await db.collection('collect').where({
        activity_id: event.activity_id,
        _openid: event.openid ? event.openid : OPENID
      }).get().then((res) => {
        return res.data
      }).catch(err => {
        return null
      })
      result.data = {
        collect: list.length > 0 ? true : false
      }
    }
    ctx.body = result
  })

  app.router('signup', async(ctx, next) => {
    var signup = 0 //0报名 1取消报名
    if (event.signup) {
      signup = parseInt(event.signup)
    }
    if (event.activity_id == null) {
      result.code = 100
      result.message = "缺少参数_id"
    } else {
      let user = await db.collection('user').where({
        _openid: event.openid ? event.openid : OPENID
      }).limit(1).get().then((res) => {
        return res.data[0]
      }).catch((err) => {
        return null
      })
      let activity = await db.collection('activity').where({
        _id: event.activity_id
      }).limit(1).get(1).then((res) => {
        return res.data[0]
      }).catch((err) => {
        return null
      })
      let myopenid = event.openid ? event.openid : OPENID

      if (signup == 0) {
        let list = await db.collection('signup').where({
          activity_id: event.activity_id,
          _openid: myopenid
        }).get().then(res => {
          return res.data
        }).catch(err => {
          return null
        })
        if (list.length > 0) {
          result.code = 200
          result.message = "您已报名过了"
        } else {
          let _id = await db.collection('signup').add({
            data: {
              activity_id: event.activity_id,
              avatarUrl: event.avatarUrl,
              nickName: event.nickName,
              _openid: myopenid
            }
          }).then((res) => {
            return res._id
          }).catch((err) => {
            console.error(err)
            return null
          })
          if (!_id) {
            result.code = 500
            result.message = "数据插入失败"
          } else {
            var participants = activity.participants
            participants.push(user)
            let number = db.collection('activity').where({
              _id: event.activity_id
            }).update({
              data: {
                participants: participants
              }
            }).then((res) => {
              return res.stats.updated
            }).catch((err) => {
              return null
            })
            result.message = "报名成功"
            result.data = {
              signup: true
            }
          }
        }
      } else {
        let number = await db.collection('signup').where({
          activity_id: event.activity_id,
          _openid: myopenid
        }).remove().then((res) => {
          return res.stats.removed
        }).catch((err) => {
          console.error(err)
          return null
        })
        if (!number) {
          result.code = 500
          result.message = "数据删除失败"
        } else {
          var participants = activity.participants
          participants = participants.filter(function(item) {
            return p._openid != myopenid
          });
          let number = db.collection('activity').where({
            _id: event.activity_id
          }).update({
            data: {
              participants: participants
            }
          }).then((res) => {
            return res.stats.updated
          }).catch((err) => {
            return null
          })
          result.message = "取消报名成功"
          result.data = {
            signup: false
          }
        }
      }
    }
    ctx.body = result
  })

  app.router('isSignup', async(ctx, next) => {
    if (event.activity_id == null) {
      result.code = 100
      result.message = "缺少参数_id"
    } else {
      let list = await db.collection('signup').where({
        activity_id: event.activity_id,
        _openid: event.openid ? event.openid : OPENID
      }).get().then((res) => {
        return res.data
      })
      result.data = {
        signup: list.length > 0 ? true : false
      }
    }
    ctx.body = result
  })

  return app.serve()
}
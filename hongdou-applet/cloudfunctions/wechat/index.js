// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const TcbRouter = require('tcb-router');
const request = require('request')
const rp2 = require('request-promise')


// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  const app = new TcbRouter({
    event
  });

  var offset = 0
  var size = 10
  if (event.offset) {
    offset = event.offset
  }
  if (event.size) {
    size = event.size
  }

  const result = {
    code: 0,
    message: '成功'
  }

  app.router('article', async(ctx, next) => {
    access_token = await rp2(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxe9c4679c259680ac&secret=ca1354e9bfc9eea7ff78e92c3c4c9ee9`).then(res => {
      return JSON.parse(res).access_token
    })
    console.log("获取到access_token：")
    console.log(access_token)

    var options = {
      method: 'POST',
      json: true,
      uri: `https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=${access_token}`,
      body: {
        "type": "news",
        "offset": offset,
        "count": size
      }
    }
    const rp = options =>
      new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
          if (error) {
            reject(error);
          }
          resolve(response);
        });
      });
    const res2 = await rp(options)
    let rbody = (typeof res2 === 'object') ? res2 : JSON.parse(res2);
    rbody = rbody.body.item
    articles = []
    for (var bb1 of rbody) {
      console.log(bb1)
      for (var bb2 of bb1.content.news_item) {
        articles.push({
          thumb_url: bb2.thumb_url,
          title: bb2.title,
          url: bb2.url
        })
      }
    }
    result.data = articles
    ctx.body = result
  })

  return app.serve()
}


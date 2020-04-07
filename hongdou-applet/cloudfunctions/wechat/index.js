// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const TcbRouter = require('tcb-router');
const request = require('request')
const rp2 = require('request-promise')

const WECHAT_APPID = "wxe9c4679c259680ac"
const WECHAT_SECRET = "ca1354e9bfc9eea7ff78e92c3c4c9ee9"
const APPLET_APPID = "wx24c04d16368795f2"
const APPLET_SECRET = "e3720625e879e87dda0caaa86f0117c1"

var access_token = ""
var create_time = ""

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
    for (var i = 0; i < 3; i++) {
      console.log("access_token=" + access_token)
      if (access_token == "") {
        access_token = await rp2(`https://service-fwtqa5cw-1301759664.gz.apigw.tencentcs.com/release/get_access_token`).then(res => {
          var res2 = JSON.parse(res)
          if (typeof res2 == 'string') {
            res2 = JSON.parse(res2)
          }
          return res2.access_token
        })
      }
      console.log("access_token=" + access_token)
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
      rbody = rbody.body
      console.log(rbody)
      if (!rbody) {
        access_token = ""
        continue;
      } else {
        rbody = rbody.item
        articles = []
        for (var bb1 of rbody) {
          for (var bb2 of bb1.content.news_item) {
            articles.push({
              thumb_url: bb2.thumb_url,
              title: bb2.title,
              url: bb2.url
            })
          }
        }
        result.data = articles
        break;
      }
    }
    if (result.data == null) {
      result.data = []
    }
    ctx.body = result
  })

  return app.serve()
}
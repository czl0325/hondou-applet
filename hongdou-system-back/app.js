const Koa = require('koa')
const Router = require('koa-router')
const cors = require('koa2-cors')
const koaBody = require('koa-body')

const app = new Koa()
const router = new Router()
const ENV = "hongdou-ow8qk"

// 跨域
app.use(cors({
    origin: "*",
    credentials: true
}))

// 接收post参数解析
app.use(koaBody({
    multipart: true
}))

app.use(async (ctx, next) => {
    ctx.state.env = ENV
    await next()
})

const activity = require('./controller/Activity.js')
router.use("/activity", activity.routes())

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, ()=>{
    console.log("服务器启动在3000端口")
})

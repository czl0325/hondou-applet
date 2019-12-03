const Router = require('koa-router')
const router = new Router()
const dbStorage = require('../utils/DBStorage.js')
const {dbQuery, dbInsert} = require('../utils/DBFounction.js')

router.get('/list', async (ctx, next)=>{
    const params = ctx.request.query
    let PageSize = 100;
    if (params.pageSize != null) {
        PageSize = params.pageSize
    }
    const query = `
        db.collection('activity').skip(${params.pageNum*PageSize}).limit(${PageSize}).orderBy('createTime', 'desc').get()
    `;
    const res = await dbQuery(ctx, query)
    ctx.body = {
        code: 20000,
        data: res.data
    }
});

router.post('/add', async (ctx, next)=>{
    const params = ctx.request.query
    const activity = {
        nickName: params.nickName,
        avatarUrl: params.avatarUrl,
        _openid: params.openid,
        title: params.title,
        content: params.content,
        images: params.images ? params.images : [],
        signEndDate: params.signEndDate,
        activityDate: params.activityDate,
        createTime: Date.now()
    };
    const query = `
        db.collection('activity').add({data:${JSON.stringify(activity)}})
    `;
    const res = await dbInsert(ctx, query)
    ctx.body = {
        code: 20000,
        data: res.id_list
    }
});

module.exports = router

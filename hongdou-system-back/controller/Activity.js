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
        data: JSON.parse(res.data) || {}
    }
});

router.get('/detail', async (ctx, next) => {
    const params = ctx.request.query
    if (params.id == null) {
        ctx.body = {
            code: 30001,
            message: "缺少必要参数"
        };
        return ;
    }
    const query = `db.collection('activity').doc('${params.id}').get()`;
    const res = await dbQuery(ctx, query)
    let activity = {}
    if (res.data.length > 0) {
        activity = res.data[0]
    }
    if (typeof activity === 'string') {
        activity = JSON.parse(activity) || {}
    }
    if (activity.images.length > 0) {
        let file_list = []
        for (let i=0; i<activity.images.length; i++) {
            file_list.push({
                fileid: activity.images[i],
                max_age: 7200
            })
        }
        const result2 = await dbStorage.download(ctx, file_list)
        activity.images = result2.file_list
    }
    ctx.body = {
        code: 20000,
        data: activity || {}
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

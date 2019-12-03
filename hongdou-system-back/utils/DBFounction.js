const rp = require('request-promise')
const getAccessToken = require('../utils/GetAccessToken')

const dbQuery = async (ctx, query = {}) => {
    const access_token = await getAccessToken()
    const options = {
        method: 'POST',
        uri: `https://api.weixin.qq.com/tcb/databasequery?access_token=${access_token}`,
        body: {
            query,
            env: ctx.state.env
        },
        json: true
    };
    return await rp(options).then(res=>{
        return res
    }).catch(err=>{
        console.error(err)
    })
};

const dbInsert = async (ctx, query = {}) => {
    const access_token = await getAccessToken()
    const options = {
        method: 'POST',
        uri: `https://api.weixin.qq.com/tcb/databaseadd?access_token=${access_token}`,
        body: {
            query,
            env: ctx.state.env
        },
        json: true
    };
    return await rp(options).then(res=>{
        return res
    }).catch(err=>{
        console.error(err)
    })
};

const dbDelete = async (ctx, query = {}) => {
    const access_token = await getAccessToken()
    const options = {
        method: 'POST',
        uri: `https://api.weixin.qq.com/tcb/databasedelete?access_token=${access_token}`,
        body: {
            query,
            env: ctx.state.env
        },
        json: true
    };
    return await rp(options).then(res=>{
        return res
    }).catch(err=>{
        console.error(err)
    })
};

const dbUpdate = async (ctx, query = {}) => {
    const access_token = await getAccessToken()
    const options = {
        method: 'POST',
        uri: `https://api.weixin.qq.com/tcb/databaseupdate?access_token=${access_token}`,
        body: {
            query,
            env: ctx.state.env
        },
        json: true
    };
    return await rp(options).then(res=>{
        return res
    }).catch(err=>{
        console.error(err)
    })
};

module.exports = {
    dbQuery,
    dbInsert,
    dbDelete,
    dbUpdate
};

const getAccessToken = require('./GetAccessToken.js')
const rp = require('request-promise')
const fs = require('fs')

const dbStorage = {
    async download(ctx, fileList) {
        const access_token = await getAccessToken()
        const options = {
            method: 'POST',
            uri: `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${access_token}`,
            body: {
                env: ctx.state.env,
                file_list: fileList
            },
            json: true
        };
        return rp(options).then(res=>{
            return res
        }).catch(err=>{
            console.error(err)
        })
    },

    async upload(ctx) {
        // 1、请求地址
        const access_token = await getAccessToken()
        const file = ctx.request.files.file
        const index = file.name.lastIndexOf(".");
        const suffix = file.name.substring(index);
        const pic_name = `activity_images/${Date.now()}_${Math.random()*10000}${suffix}`
    }
};

module.exports = dbStorage;

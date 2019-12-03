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
        const path = `activity_images/${Date.now()}_${Math.random()*10000}${suffix}`
        const options = {
            method: 'POST',
            uri: `https://api.weixin.qq.com/tcb/uploadfile?access_token=${access_token}`,
            body: {
                path,
                env: ctx.state.env
            },
            json: true
        };
        //  请求参数
        const info = await rp(options).then(res=>{
            return res
        }).catch(err=>{
            console.error(err)
        });
        const params = {
            method: 'POST',
            headers: {
                'content-type': 'multipart/form-data'
            },
            uri: info.url,
            formData: {
                key: path,
                Signature: info.authorization,
                'x-cos-security-token': info.token,
                'x-cos-meta-fileid': info.cos_file_id,
                file: fs.createReadStream(file.path)
            },
            json: true
        };
        await rp(params)
        return info.file_id
    },

    async delete(ctx, fileid_list) {
        const access_token = await getAccessToken()
        const options = {
            method: 'POST',
            uri: `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${access_token}`,
            body: {
                env: ctx.state.env,
                fileid_list: fileid_list
            },
            json: true
        };
        return await rp(options)
            .then((res) => {
                return res
            })
            .catch(function (err) {
                console.log(err);
            })
    }
};

module.exports = dbStorage;

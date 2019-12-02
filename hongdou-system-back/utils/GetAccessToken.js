const rp = require('request-promise')
const AppId = "wx24c04d16368795f2"
const AppSecret = "d9081090bb2d04e2ef6dc77fb6b7b5d9"
const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${AppId}&secret=${AppSecret}`
const fs = require('fs')
const path = require('path')
const fileName = path.resolve(__dirname, './access_token.json')

const updateAccessToken = async () => {
    const res_str = await rp(url)
    const res = JSON.parse(res_str)
    console.log(res_str)
    if (res.access_token) {
        fs.writeFileSync(fileName, JSON.stringify({
            access_token: res.access_token,
            createTime: new Date()
        }))
    } else {
        await updateAccessToken()
    }
}

const getAccessToken = async () => {
    try {
        const res_str = fs.readFileSync(fileName)
        const res = JSON.parse(res_str)
        const createTime = new Date(res.createTime).getTime()
        const nowTime = new Date().getTime()
        if (nowTime - createTime > 7200000) {
            await updateAccessToken()
            await getAccessToken()
        }
        return res.access_token
    } catch (e) {
        await updateAccessToken()
        await getAccessToken()
    }
}

setInterval(async ()=>{
    await updateAccessToken()
}, (7200-300)*1000)

module.exports = getAccessToken

import axios from "axios";

const service = axios.create({
  baseURL: 'http://localhost:3000/', // 接口域名的地址
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  },
  withCredentials: true
});

class HTTP {
  httpRequest(url, data = {}, method = 'get') {
    return new Promise((resolve, reject) => {
      const options = {
        url,
        method
      };
      if (method.toLowerCase() === 'get') {
        options.params = data
      } else {
        options.data = data
      }
      service(options)
        .then(res => {
          resolve(res.data.data)
        })
        .catch(error => {
          reject(error);
          console.error(error)
        })
    })
  }
}

export default HTTP

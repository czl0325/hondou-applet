import HTTP from './http.js'

class Request extends HTTP {
  getActivityList() {
    return this.httpRequest('activity/list', {
      pageNum: 0
    })
  }
}

export default Request

import request from '@/utils/request'

const baseURL = 'http://localhost:3000'

export function getActivityList(pageNum) {
  return request({
    url: `${baseURL}/activity/list`,
    params: {
      pageNum
    },
    method: 'get'
  })
}

export function getActivityDetail(id) {
  return request({
    url: `${baseURL}/activity/detail`,
    params: {
      id: id
    },
    method: 'get'
  })
}



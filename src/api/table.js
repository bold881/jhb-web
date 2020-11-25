import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

export function getUniqueIdxNames(params) {
  return request({
    url: '/api/uniqueCarIdxNames',
    method: 'get',
    params
  })
}
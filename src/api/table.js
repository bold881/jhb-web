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

export function addPerformanceIdx(data) {
  data.carIdxValue *= 1000
  return request({
    url: '/api/addPerformanceIdx',
    method: 'post',
    data
  })
}

export function getPerformanceByIdx(data) {
  return request({
    url: '/api/getPerformancesByIdx',
    method: 'post',
    data
  })
}

export function deleteById(data) {
  return request({
    url: '/api/deleteById',
    method: 'post',
    data
  })
}

import axios from '@/libs/api.request'

// 根据project_code获取confTree
export const getConfTree = (name) => {
  return axios.request({
    url: '/kerrigan/v1/conf/tree/',
    method: 'get',
    params: {
      project_code: name
    }
  })
}

export const getConf = (params) => {
  return axios.request({
    url: '/kerrigan/v1/conf/config/',
    method: 'get',
    params
  })
}

export const putConf = (data) => {
  return axios.request({
    url: '/kerrigan/v1/conf/config/',
    method: 'put',
    data
  })
}

export const postConf = (data) => {
  return axios.request({
    url: '/kerrigan/v1/conf/config/',
    method: 'post',
    data
  })
}

export const patchConf = (data) => {
  return axios.request({
    url: '/kerrigan/v1/conf/config/',
    method: 'patch',
    data
  })
}

export const deleteConf = (data) => {
  return axios.request({
    url: '/kerrigan/v1/conf/config/',
    method: 'delete',
    data
  })
}

export const diffConf = (params) => {
  return axios.request({
    url: '/kerrigan/v1/conf/diff/',
    method: 'get',
    params
  })
}

export const getHistory = (params) => {
  return axios.request({
    url: '/kerrigan/v1/conf/history/',
    method: 'get',
    params
  })
}

export const backHistory = (data) => {
  return axios.request({
    url: '/kerrigan/v1/conf/history/',
    method: 'patch',
    data
  })
}

export const getAuth = (params) => {
  return axios.request({
    url: '/kerrigan/v1/conf/permissions/',
    method: 'get',
    params
  })
}

export const setAuth = (data, action) => {
  return axios.request({
    url: '/kerrigan/v1/conf/permissions/',
    method: action,
    data
  })
}

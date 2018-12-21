import axios from '@/libs/api.request'

// 获取所有项目
export const getTableData = () => {
  return axios.request({
    url: '/k8s/v1/k8s/project/',
    method: 'get'
  })
}

// 新建项目
export const addProject = (data, url, action) => {
  return axios.request({
    url: `/k8s/v1/k8s/project${url}`,
    method: action,
    data
  })
}

// 获取所有Env
export const getEnvList = () => {
  return axios.request({
    url: '/k8s/v1/k8s/env/',
    method: 'get'
  })
}

// 获取所有User
export const getUserList = () => {
  return axios.request({
    url: '/k8s/v1/k8s/user/',
    method: 'get'
  })
}

// 获取所有APP
export const getAppList = () => {
  return axios.request({
    url: '/k8s/v1/k8s/app/',
    method: 'get'
  })
}

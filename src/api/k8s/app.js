import axios from '@/libs/api.request'

// 获取所有项目
export const getTableData = () => {
  return axios.request({
    url: '/k8s/v1/k8s/app/',
    method: 'get'
  })
}

// 新建项目
export const addApp = (data, url, action) => {
  return axios.request({
    url: `/k8s/v1/k8s/app${url}`,
    method: action,
    data
  })
}

// 获取所有APP
export const getAppList = () => {
  return axios.request({
    url: '/k8s/v1/k8s/app/',
    method: 'get'
  })
}

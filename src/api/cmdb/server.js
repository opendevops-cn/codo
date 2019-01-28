import axios from '@/libs/api.request'
import config from '@/config'

// 获取所有主机
export const getTableData = (params) => {
  return axios.request({
    url: '/cmdb/v1/cmdb/server/',
    method: 'get',
    params
  })
}
// // 根据条件搜索主机
// export const searchTableData = (key, value) => {
//   return axios.request({
//     url: `/api/cmdb/server/?${key}=${value}`,
//     method: 'get'
//   })
// }

// 获取所有管理用户
export const getAdmUser = () => {
  return axios.request({
    url: '/cmdb/v1/cmdb/adm_user/',
    method: 'get'
  })
}

// 获取所有主机组 getGroupList
export const getGroupList = () => {
  return axios.request({
    url: '/cmdb/v1/cmdb/server_group/',
    method: 'get'
  })
}

// 获取所有主机组 getTagList
export const getTagList = () => {
  return axios.request({
    url: '/cmdb/v1/cmdb/tag/',
    method: 'get'
  })
}

// 添加或修改主机
export const addProject = (data, url, action) => {
  return axios.request({
    url: `/cmdb/v1/cmdb/server${url}`,
    method: action,
    data
  })
}

// 批量添加主机
export const multiAdd = (data) => {
  return axios.request({
    url: '/cmdb/v1/cmdb/server_multiadd/',
    method: 'post',
    data
  })
}

// 删除主机
export const delServer = (id) => {
  return axios.request({
    url: `/cmdb/v1/cmdb/server/${id}`,
    method: 'delete'
  })
}

// 批量删除主机
export const delMultiServer = (data) => {
  return axios.request({
    url: '/cmdb/v1/cmdb/server_multidel/',
    method: 'post',
    data
  })
}

// 更新资产
export const rsyncHostData = (data) => {
  return axios.request({
    url: '/cmdb/v1/cmdb/server_update/',
    method: 'post',
    data
  })
}

// 推送公钥
export const rsyncPublicKeyData = (data) => {
  return axios.request({
    url: '/cmdb/v1/cmdb/server_publickey/',
    method: 'post',
    data
  })
}

// WEB Socket
// export const webSocketUrl = 'ws://cmdb.opendevops.cn:8002/v1/cmdb/ws/terminal' 内网
// export const webSocketUrl = 'ws://demo.opendevops.cn/api/cmdb/v1/cmdb/ws/terminal' // 外网
const theDomain = process.env.NODE_ENV === 'development' ? 'demo.opendevops.cn' : config.domainName.pro
// const theDomain = process.env.NODE_ENV === 'development' ? config.domainName.dev : config.domainName.pro
const wsuri = '/cmdb/v1/cmdb/ws/terminal'
const ws = config.isHttps ? 'wss' : 'ws'
export const webSocketUrl = ws + '://' + theDomain + '/api' + wsuri

import axios from '@/libs/api.request'

// 获取所有主机
export const getDBData = (params) => {
  return axios.request({
    url: '/cmdb/v1/cmdb/db/',
    method: 'get',
    params
  })
}

// 添加或修改DB
export const addDBServer = (data, url, action) => {
  return axios.request({
    url: `/cmdb/v1/cmdb/db${url}`,
    method: action,
    data
  })
}

// 批量添加主机
export const multiAdd = (data) => {
  return axios.request({
    url: '/cmdb/v1/cmdb/db_multiadd/',
    method: 'post',
    data
  })
}

// 批量删除主机
export const delMulti = (data) => {
  return axios.request({
    url: '/cmdb/v1/cmdb/db_multidel/',
    method: 'post',
    data
  })
}

// 删除主机
export const delDB = (id) => {
  return axios.request({
    url: `/cmdb/v1/cmdb/db/${id}`,
    method: 'delete'
  })
}

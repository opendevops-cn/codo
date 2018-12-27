import axios from '@/libs/api.request'

// 获取所有主机
export const getTableData = () => {
  return axios.request({
    url: '/cmdb/v1/cmdb/server_group/',
    method: 'get'
  })
}

// 添加或修改主机组
export const addServerGroup = (data, url, action) => {
  return axios.request({
    url: `/cmdb/v1/cmdb/server_group${url}`,
    method: action,
    data
  })
}

// 删除主机
export const delGroup = (id) => {
  return axios.request({
    url: `/cmdb/v1/cmdb/server_group/${id}`,
    method: 'delete'
  })
}

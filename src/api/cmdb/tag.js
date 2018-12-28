import axios from '@/libs/api.request'

// 获取所有tag
export const getTableData = () => {
  return axios.request({
    url: '/cmdb/v1/cmdb/tag/',
    method: 'get'
  })
}

// 添加或修改tag
export const addTag = (data, url, action) => {
  return axios.request({
    url: `/cmdb/v1/cmdb/tag${url}`,
    method: action,
    data
  })
}

// 删除tag
export const delTag = (id) => {
  return axios.request({
    url: `/cmdb/v1/cmdb/tag/${id}`,
    method: 'delete'
  })
}

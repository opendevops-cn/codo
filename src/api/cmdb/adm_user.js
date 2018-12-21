import axios from '@/libs/api.request'

// 获取所有管理用户
export const getTableData = () => {
  return axios.request({
    url: '/cmdb/v1/cmdb/adm_user/',
    method: 'get'
  })
}

// 添加或修改管理用户
export const Add = (data, url, action) => {
  return axios.request({
    url: `/cmdb/v1/cmdb/adm_user${url}`,
    method: action,
    data
  })
}

import axios from '@/libs/api.request'


export const getAdminUserList = (key, value) => {
    return axios.request({
      url: '/cmdb2/v1/cmdb/admin_user/',
      method: 'get',
      params: {
        key,
        value
      }
    })
  }

export const operationAdminUser = (data, meth) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/admin_user/',
    method: meth,
    data
  })
}

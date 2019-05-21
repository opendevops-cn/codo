import axios from '@/libs/api.request'


export const getSystemUserList = (key, value) => {
    return axios.request({
      url: '/cmdb2/v1/cmdb/system_user/',
      method: 'get',
      params: {
        key,
        value
      }
    })
  }

export const operationSystemUser = (data, meth) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/system_user/',
    method: meth,
    data
  })
}

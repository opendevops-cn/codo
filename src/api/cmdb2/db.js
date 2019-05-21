import axios from '@/libs/api.request'
import config from '@/config'


export const getDBlist= ( page, limit, key, value) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/db/',
    method: 'get',
    params: {
      key,
      value,
      page,
      limit
    }
  })
}



export const getDBDetail= ( key, value) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/db/',
    method: 'get',
    params: {
      key,
      value,
      // page,
      // limit
    }
  })
}

export const operationDB = (data, meth) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/db/',
    method: meth,
    data
  })
}


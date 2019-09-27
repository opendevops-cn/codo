import axios from '@/libs/api.request'
import config from '@/config'


//批量添加DB
export const multiAdddb = (data) => {
  return axios.request({
    url: '/cmdb2//v1/cmdb/db/multi_add/',
    method: 'post',
    data
  })
}

//获取DBlist
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

//获取DB详情
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

//操作DB
export const operationDB = (data, meth) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/db/',
    method: meth,
    data
  })
}


import axios from '@/libs/api.request'

// 获取IDC list

export const getIDClist= (key, value) => {
    return axios.request({
        url: '/cmdb2/v1/cmdb/idc/',
        method: 'get',
        params: {
        key,
        value,
        }
    })
}

// 操作IDC管理
export const operationIdc = (data, meth) => {
    return axios.request({
      url: '/cmdb2/v1/cmdb/idc/',
      method: meth,
      data
    })
  }
import axios from '@/libs/api.request'
import config from '@/config'





// 获取所有TAG
export const getTagList = (page, limit, key, value, date = ['', '']) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/tag/',
    method: 'get',
    params: {
      page,
      limit,
      key,
      value,
      start_date: date[0],
      end_date: date.length > 1 ? date[1] : ''
    }
  })
}

export const operationTag= (data, meth) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/tag/',
    method: meth,
    data
  })
}
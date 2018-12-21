import axios from '@/libs/api.request'

export const getLoglist = (page, limit, key, value, date = ['', '']) => {
  return axios.request({
    url: '/mg/v2/app/opt_log/',
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

// 系统配置项
// 发布应用选择
export const getSysconfig = (value) => {
  return axios.request({
    url: `/mg/v2/sysconfig/settings/${value}/`,
    method: 'get'
  })
}

export const operationSysconfig = (data, meth) => {
  return axios.request({
    url: '/mg/v2/sysconfig/settings/set/',
    method: 'post',
    data
  })
}
// 检查配置
export const CheckSysconfig = (data) => {
  return axios.request({
    url: '/mg/v2/sysconfig/check/',
    method: 'post',
    data
  })
}

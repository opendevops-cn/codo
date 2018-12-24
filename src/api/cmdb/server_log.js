import axios from '@/libs/api.request'

// 获取所有登录日志
export const getLogData = (params) => {
  return axios.request({
    url: '/cmdb/v1/cmdb/server_log/',
    method: 'get',
    params
  })
}

// 获取所有Tty日志
export const getTtyLogData = (lid) => {
  return axios.request({
    url: `/cmdb/v1/cmdb/server_ttylog/?log_id=${lid}`,
    method: 'get'
  })
}

// 获取回放日志
export const getRecordData = (lid) => {
  return axios.request({
    url: `/cmdb/v1/cmdb/server_recordlog/?log_id=${lid}`,
    method: 'get'
  })
}

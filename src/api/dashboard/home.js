import axios from '@/libs/api.request'
import config from '@/config'


// 获取Tag，Home仪表盘拼图展示
export const getTagList = () => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/tag/',
    method: 'get',
  })
}

// 任务订单
export const getTaskOrderlist = () => {
  return axios.request({
    url: '/task/v2/task/list/',
    method: 'get'
  })
}


// 历史任务订单状态+数量
export const getTaskStatementlist = () => {
  return axios.request({
    url: '/task/v2/task/statement/',
    method: 'get'
  })
}
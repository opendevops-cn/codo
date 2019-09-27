import axios from '@/libs/api.request'
import config from '@/config'

//触发更新tag_rule
export const handUpdateTagrule = (data) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/tag_rule/hand_update/',
    method: 'post',
    data
  })
}

//GET 更新所有规则
export const handUpdateAlltagrule = () => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/tag_rule/hand_update/',
    method: 'get'
  })
}

// 获取所有tag规则
export const getTagRulelist = (page, limit, key, value, date = ['', '']) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/tag_rule/',
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

export const operationTagrule = (data, meth) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/tag_rule/',
    method: meth,
    data
  })
}

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
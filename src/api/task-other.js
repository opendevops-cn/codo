import axios from '@/libs/api.request'
import config from '@/config'

export const getTagtree= (key, value) => {
  return axios.request({
    url: '/task/v1/record/tree/',
    method: 'get',
    params: {
      key,
      value
    }
  })
}

export const getTaglist= ( page, limit, key, value) => {
  return axios.request({
    url: '/task/v1/record/tag/',
    method: 'get',
    params: {
      key,
      value,
      page,
      limit
    }
  })
}

export const operationTag= (data, meth) => {
  return axios.request({
    url: '/task/v1/record/tag/',
    method: meth,
    data
  })
}

export const getDBlist= ( page, limit, key, value) => {
  return axios.request({
    url: '/task/v1/record/db/',
    method: 'get',
    params: {
      key,
      value,
      page,
      limit
    }
  })
}

export const operationDB = (data, meth) => {
  return axios.request({
    url: '/task/v1/record/db/',
    method: meth,
    data
  })
}

export const getServerlist= ( page, limit, key, value) => {
  return axios.request({
    url: '/task/v1/record/server/',
    method: 'get',
    params: {
      key,
      value,
      page,
      limit
    }
  })
}

export const operationServer = (data, meth) => {
  return axios.request({
    url: '/task/v1/record/server/',
    method: meth,
    data
  })
}

export const getProxylist= () => {
  return axios.request({
    url: '/task/v1/record/proxy/',
    method: 'get'
  })
}

export const operationProxy = (data, meth) => {
  return axios.request({
    url: '/task/v1/record/proxy/',
    method: meth,
    data
  })
}

// 数据库审核
export const getMysqlAudit = (key, value) => {
  return axios.request({
    url: '/task/v1/submission/mysql_audit/',
    method: 'get',
    params: {
      key,
      value,
    }
  })
}

export const operationMysqlAudit = (data, meth) => {
  return axios.request({
    url: '/task/v1/submission/mysql_audit/',
    method: meth,
    data
  })
}

// 数据库优化
export const getMySQLOpt  = (key, value) => {
  return axios.request({
    url: '/task/v1/submission/mysql_opt/',
    method: 'get',
    params: {
      key,
      value,
    }
  })
}

export const operationMySQLOpt = (data, meth) => {
  return axios.request({
    url: '/task/v1/submission/mysql_opt/',
    method: meth,
    data
  })
}

export const getCustomtask = (key, value) => {
  return axios.request({
    url: '/task/v1/submission/custom_task/',
    method: 'get',
    params: {
      key,
      value,
    }
  })
}

export const operationCustomtask = (data, meth) => {
  return axios.request({
    url: '/task/v1/submission/custom_task/',
    method: meth,
    data
  })
}

export const operationPosttask = (data, meth) => {
  return axios.request({
    url: '/task/v1/submission/post_task/',
    method: meth,
    data
  })
}

// 发布应用选择
export const getPublishApplist = (value) => {
  return axios.request({
    url: '/task/v1/submission/publish/',
    method: 'get',
    params: {
      'publish_name': value
    }
  })
}

export const operationPublishApplist = (data, meth) => {
  return axios.request({
    url: '/task/v1/submission/publish/',
    method: meth,
    data
  })
}

const ws = config.isHttps ? 'wss': 'ws'
const theDomain = process.env.NODE_ENV === 'development' ? config.domainName.dev : config.domainName.pro
export const logWSUrl=  ws + '://' + theDomain + '/api' + '/task/ws/v1/task/log_data/'

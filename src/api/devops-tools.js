import axios from '@/libs/api.request'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

export const getPrometheusAlertlist = (key, value) => {
  return axios.request({
    url: '/tools/v1/tools/alert/prometheus/',
    method: 'get',
    params: {
      key,
      value
    }
  })
}

export const operationPrometheusAlert = (data, meth) => {
  return axios.request({
    url: '/tools/v1/tools/alert/prometheus/',
    method: meth,
    data
  })
}

export const getRandomPassword = (num) => {
  return axios.request({
    url: '/tools/v1/tools/password/',
    method: 'get',
    params: {
      num
    }
  })
}

export const operationMycrypy = (key,value) => {
  return axios.request({
    url: '/tools/v1/tools/mycrypt/',
    method: 'get',
    params: {
      key,
      value
      // 'text': value,
    }
  })
}

export const getEventManagerList = (page, limit, key, value, date = ['', '']) => {
  return axios.request({
    url: '/tools/v1/tools/event/',
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

export const operationEvent = (data, meth) => {
  return axios.request({
    url: '/tools/v1/tools/event/',
    method: meth,
    data
  })
}

export const getPaidManagerList = (page, limit, key, value, date = ['', '']) => {
  return axios.request({
    url: '/tools/v1/tools/paid/',
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

export const operationPaidManager = (data, meth) => {
  return axios.request({
    url: '/tools/v1/tools/paid/',
    method: meth,
    data
  })
}

export const getProjectManagerList = (page, limit, key, value, date = ['', '']) => {
  return axios.request({
    url: '/tools/v1/tools/project/',
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

export const operationProjectManager = (data, meth) => {
  return axios.request({
    url: '/tools/v1/tools/project/',
    method: meth,
    data
  })
}

export const getFaultManagerList = (page, limit, key, value, date = ['', '']) => {
  return axios.request({
    url: '/tools/v1/tools/fault/',
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

export const operationFaultManager = (data, meth) => {
  return axios.request({
    url: '/tools/v1/tools/fault/',
    method: meth,
    data
  })
}


export const GetOSSBucketInfo = () => {
  return axios.request({
    url: '/tools/v1/tools/fault/oss/',
    method: 'get',
    // data
  })
}

// export const UploadUrl = '/tools/v1/tools/fault/upload/'
export const UploadUrl = baseUrl + '/tools/v1/tools/fault/upload/'

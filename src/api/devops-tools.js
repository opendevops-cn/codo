import axios from '@/libs/api.request'
import config from '@/config'

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

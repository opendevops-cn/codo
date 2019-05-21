import axios from '@/libs/api.request'

export const getDomainname= (key, value) => {
  return axios.request({
    url: '/dns/v1/dns/bind/domain/',
    method: 'get',
    params: {
      key,
      value
    }
  })
}

export const operationDomainname= (data, meth) => {
  return axios.request({
    url: '/dns/v1/dns/bind/domain/',
    method: meth,
    data
  })
}

export const getDomainzone= (page, limit, zone, key) => {
  return axios.request({
    url: '/dns/v1/dns/bind/zone/',
    method: 'get',
    params: {
      page,
      limit,
      zone,
      key
    }
  })
}

export const operationDomainzone= (data, meth) => {
  return axios.request({
    url: '/dns/v1/dns/bind/zone/',
    method: meth,
    data
  })
}

export const getLoglist= (domain) => {
  return axios.request({
    url: '/dns/v1/dns/bind/log/',
    method: 'get',
    params: {
      domain
    }
  })
}

export const getDomainconf= () => {
  return axios.request({
    url: '/dns/v1/dns/bind/conf/',
    method: 'get',
  })
}

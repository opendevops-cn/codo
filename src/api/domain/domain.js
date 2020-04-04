import axios from '@/libs/api.request'

export const getDomain = (search_value) => {
    return axios.request({
        url: '/dns/v1/dns/cloud/domain/',
        method: 'get',
        params: {
            search_value
        }
    })
}

export const operationDomain = (data, method) => {
    return axios.request({
        url: '/dns/v1/dns/cloud/domain/',
        method: method,
        data
    })
}

export const syncDomain = (key, value) => {
    return axios.request({
        url: '/dns/v1/dns/cloud/sync/',
        method: 'get'
    })
}

export const getDomainRecords = (page, limit, domain_name, search_value) => {
    return axios.request({
        url: '/dns/v1/dns/cloud/record/',
        method: 'get',
        params: {
            page,
            limit,
            domain_name,
            search_value
        }
    })
}

export const optDomainRecords = (data, method) => {
    return axios.request({
        url: '/dns/v1/dns/cloud/record/',
        method: method,
        data
    })
}

export const recordsChangeRemark = (data) => {
    return axios.request({
        url: '/dns/v1/dns/cloud/remark/',
        method: 'post',
        data
    })
}

export const getDomainLog = (page, limit, domain_name, search_value) => {
    return axios.request({
        url: '/dns/v1/dns/cloud/logs/',
        method: 'get',
        params: {
            page,
            limit,
            domain_name,
            search_value
        }
    })
}
export const getAccountlist = () => {
    return axios.request({
        url: '/dns/v1/dns/cloud/account/',
        method: 'get'
    })
}

export const operationAccount = (data, method) => {
    return axios.request({
        url: '/dns/v1/dns/cloud/account/',
        method: method,
        data
    })
}
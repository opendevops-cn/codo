import axios from '@/libs/api.request'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro




// 获取ZABBIX配置信息
export const getZabbixSubmitTaskConflist = (key, value) => {
    return axios.request({
        url: '/tools/v1/zabbix/task_config/',
        method: 'get',
        params: {
            key,
            value
        }
    })
}


//操作ZABBIX 提交任务认证配置信息
export const operationZabbixSubmitTaskConf = (data, meth) => {
    return axios.request({
        url: '/tools/v1/zabbix/task_config/',
        method: meth,
        data
    })
}

//操作ZABBIX Hooks
export const operationZabbixHooks = (data, meth) => {
    return axios.request({
        url: '/tools/v1/zabbix/hooks/',
        method: meth,
        data
    })
}

//获取ZABBIX告警日志
export const getZabbixHooklog = (key, value) => {
    return axios.request({
        url: '/tools/v1/zabbix/logs/',
        method: 'get',
        params: {
            key,
            value
        }
    })
}

//刷新ZABBIX主机信息
export const ZabbixSync = (data) => {
    return axios.request({
        url: '/tools/v1/zabbix/sync/',
        method: 'post',
        data
    })
}

// 操作ZABBIX主机配置
export const operationZabbixHosts = (data, meth) => {
    return axios.request({
        url: '/tools/v1/zabbix/hosts/',
        method: meth,
        data
    })
}

//获取ZABBIX主机信息
export const getZabbixHostlist = (zabbix_url, group_name, searchVal) => {
    return axios.request({
        url: '/tools/v1/zabbix/hosts/',
        method: 'get',
        params: {
            zabbix_url,
            group_name,
            'search_val': searchVal
        }
    })
}

//获取ZABBIX TagTree
export const getZabbixTagtree = (key, value) => {
    return axios.request({
        url: '/tools/v1/zabbix/tree/',
        method: 'get',
        params: {
            key,
            value
        }
    })
}

// 获取zabbix last issues
export const getZabbixLastissues = (key, value) => {
    return axios.request({
        url: '/tools/v1/zabbix/issues/',
        method: 'get',
        params: {
            key,
            value
        }
    })
}

// 获取ZABBIX配置信息
export const getZabbixConfiglist = (key, value) => {
    return axios.request({
        url: '/tools/v1/zabbix/config/',
        method: 'get',
        params: {
            key,
            value
        }
    })
}

// 操作ZABBIX配置
export const operationZabbixConfig = (data, meth) => {
    return axios.request({
        url: '/tools/v1/zabbix/config/',
        method: meth,
        data
    })
}

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

export const operationMycrypy = (key, value) => {
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


export const getremindlist = (page, limit, key) => {
    return axios.request({
        url: '/tools/v1/tools/remind/',
        method: 'get',
        params: {
            page,
            limit,
            key
        }
    });
};

export const operationremind = (data, meth) => {
    return axios.request({
        url: '/tools/v1/tools/remind/',
        method: meth,
        data
    });
};

export const handtiggerremind = () => {
    return axios.request({
        url: '/tools/v1/tools/remind/hand_tigger/',
        method: 'get'
    });
};

export const UploadUrl = baseUrl + '/tools/v1/tools/fault/upload/'
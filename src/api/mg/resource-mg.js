import axios from '@/libs/api.request'
import config from '@/config'

//
export const getResourceList = (page, limit, search_value) => {
    return axios.request({
        url: '/mg/v2/overall/resource/',
        method: 'get',
        params: {
            page,
            limit,
            search_value
        }
    })
}


export const optResource = (data, meth) => {
    return axios.request({
        url: '/mg/v2/overall/resource/',
        method: meth,
        data
    })
}
import axios from '@/libs/api.request'




export const handleUpdateserver = () => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/asset_configs/handler_update_server/',
    method: 'get',

  })
}

export const getAssetConfigsList = (key, value) => {
    return axios.request({
      url: '/cmdb2/v1/cmdb/asset_configs/',
      method: 'get',
      params: {
        key,
        value
      }
    })
  }

export const operationAssetConfigs = (data, meth) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/asset_configs/',
    method: meth,
    data
  })
}

//测试用户输入的ID/Key/region等信息是否正确
export const testAuth = (data) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/asset_configs/test_auth/',
    method: 'post',
    data
  })
}



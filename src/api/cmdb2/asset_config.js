import axios from '@/libs/api.request'


// 获取RDS信息
export const handleUpdateredis = () => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/asset_configs/handler_update_redis/',
    method: 'get'

  })
}

// 获取RDS信息
export const handleUpdaterds = () => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/asset_configs/handler_update_rds/',
    method: 'get'

  })
}

// 获取EC2信息
export const handleUpdateserver = () => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/asset_configs/handler_update_server/',
    method: 'get'

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


// 测试用户填写的数据是否正确
export const apiPermission = (data) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/asset_configs/api_permission/',
    method: 'post',
    data
  })
}

// // 测试用户输入的ID/Key/region等信息是否正确（ECS）
// export const ecsAuth = (data) => {
//   return axios.request({
//     url: '/cmdb2/v1/cmdb/asset_configs/ecs_auth/',
//     method: 'post',
//     data
//   })
// }

// // 测试用户输入的ID/Key/region等信息是否正确（RDS）
// export const rdsAuth = (data) => {
//   return axios.request({
//     url: '/cmdb2/v1/cmdb/asset_configs/rds_auth/',
//     method: 'post',
//     data
//   })
// }

// // 测试用户输入的ID/Key/region等信息是否正确（redis）
// export const redisAuth = (data) => {
//   return axios.request({
//     url: '/cmdb2/v1/cmdb/asset_configs/redis_auth/',
//     method: 'post',
//     data
//   })
// }

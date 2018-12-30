import axios from '@/libs/api.request'

// 获取所有授权规则
export const getTableData = (params) => {
  return axios.request({
    url: '/cmdb/v1/cmdb/server_auth/',
    method: 'get',
    params
  })
}

// 添加或修改授权策略
export const addRule = (data, url, action) => {
  return axios.request({
    url: `/cmdb/v1/cmdb/server_auth${url}`,
    method: action,
    data
  })
}

// 删除授权策略
export const delRule = (id) => {
  return axios.request({
    url: `/cmdb/v1/cmdb/server_auth/${id}`,
    method: 'delete'
  })
}

// 获取系统用户列表
export const getSystemUser = () => {
  return axios.request({
    url: '/mg/v2/accounts/user/',
    method: 'get',
    params: {
      'page': '1',
      'limit': '10000'
    }
  })
}

// gw接口登录
export const loginGW = () => {
  return axios.request({
    url: '/cmdb/v1/accounts/login/',
    method: 'post',
    data: {
      'username': 'cmdb',
      'password': 'GpJSWhgZs8hfDLR',
      'dynamic': ''
    }
  })
}

// 判断当前用户对资产是否有权限
export const checkAuthServer = (sid) => {
  return axios.request({
    url: '/cmdb/v1/cmdb/server_check_auth/',
    method: 'get',
    params: {
      // 'username': user,
      'sid': sid
    }
  })
}

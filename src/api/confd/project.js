import axios from '@/libs/api.request'

// 获取所有项目
export const getProject = (limit) => {
  return axios.request({
    url: '/kerrigan/v1/conf/project/',
    method: 'get',
    params:{
      limit
    }
  })
}

// 添加项目
export const addProject = (data) => {
  return axios.request({
    url: '/kerrigan/v1/conf/project/',
    method: 'post',
    data
  })
}

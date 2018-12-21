import axios from '@/libs/api.request'

// 获取所有发布信息
export const getTableData = () => {
  return axios.request({
    url: '/k8s/v1/k8s/publish/',
    method: 'get'
  })
}

// 获取发布详情
export const getPublishDetail = (pid) => {
  return axios.request({
    url: `/k8s/v1/k8s/publish/${pid}/`,
    method: 'get'
  })
}

// 对发布任务进行操作
export const publishAction = (pid, data) => {
  return axios.request({
    url: `/k8s/v1/k8s/publish/${pid}/`,
    method: 'patch',
    data: data
  })
}

// 新建发布
export const addPublish = (data) => {
  return axios.request({
    url: '/k8s/v1/k8s/publish/',
    method: 'post',
    data
  })
}

// 执行发布任务
export const exeJob = (jid) => {
  return axios.request({
    url: `/k8s/v1/k8s/job/exec/${jid}/`,
    method: 'post'
  })
}

// 获取日志信息
export const getLog = (project, jid) => {
  return axios.request({
    url: '/k8s/v1/k8s/job/log/',
    method: 'get',
    params: {
      project_name: project,
      job_id: jid
    }
  })
}

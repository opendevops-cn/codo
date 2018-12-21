import axios from '@/libs/api.request'

// 获取日志信息
export const getTaskDetail = (publishId, appId, envId) => {
  return axios.request({
    url: '/k8s/v1/k8s/job/detail/',
    method: 'get',
    params: {
      publish_id: publishId,
      app_id: appId,
      env_id: envId
    }
  })
}

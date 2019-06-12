import axios from '@/libs/api.request'

export const getCronJobslist = (page, limit, value) => {
  return axios.request({
    url: '/cron//v1/cron/job/',
    method: 'get',
    params: {
      page,
      limit,
      'job_id': value
    }
  })
}

export const operationCron = (data, meth) => {
  return axios.request({
    url: '/cron//v1/cron/job/',
    method: meth,
    data
  })
}

export const getCronLoglist = (page, limit, key, value, date = ['', '']) => {
  return axios.request({
    url: '/cron//v1/cron/log/',
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

import axios from '@/libs/api.request'

// 获取IDC list
export const getLoglist = (page, limit, key, value, date = ['', '']) => {
    return axios.request({
      url: '/cmdb2/v1/cmdb/operational_audit/',
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
  


// export const getoperationalAuditlist= (key, value) => {
//     return axios.request({
//         url: '/cmdb2/v1/cmdb/operational_audit/',
//         method: 'get',
//         params: {
//         key,
//         value,
//         }
//     })
// }


// export const getoperationalAuditlist = (page, limit, key, value, date = ['', '']) => {
//     return axios.request({
//       url: '/cmdb2/v1/cmdb/operational_audit/',
//       method: 'get',
//       params: {
//         page,
//         limit,
//         key,
//         value,
//         start_date: date[0],
//         end_date: date.length > 1 ? date[1] : ''
//       }
//     })
//   }
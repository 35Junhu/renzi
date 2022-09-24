import request from '@/utils/request'

export const loginAPI = (data) => {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

import request from '@/utils/request'

/**
 * 获取用户的基本信息
 * @returns
 */
export const getUserInfoAPI = () => {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

/**
 * 获取用户更多信息
 * @param {第一次请求返回的用户id} id
 * @returns
 */
export const getUserDetailById = (id) => {
  return request({
    url: `/sys/user/${id}`,
    method: 'GET'
  })
}

export function logout() {

}

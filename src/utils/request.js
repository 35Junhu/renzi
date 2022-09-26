import axios from 'axios'
import { Message } from 'element-ui'
// 创建实例化axios
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 响应拦截器，把我需要的数据提前进行解构

service.interceptors.response.use(
  response => {
    const { message, data, success } = response.data
    if (success) {
    // 业务逻辑成功
      return data
    } else {
      Message.error(message)
      return Promise.reject(new Error(message))
    }
  },
  error => {
    Message.error(error.message)
    return Promise.reject(error)
  }
)

export default service

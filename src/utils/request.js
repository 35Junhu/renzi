import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
// 定义超时时间
const TimeOut = 12
// 创建实例化axios
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})
// 封装对比时间是否超时的函数
const isCheckTimeOut = () => {
  // 接口真正调用的时间
  const currentTime = Date.now()
  // 获取时间差
  const timeStamp = (currentTime - store.getters.hrsaasTime) / 1000
  return timeStamp > TimeOut
}
// 请求拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // 这里进行token超时的判断
      if (isCheckTimeOut()) {
        store.dispatch('user/logout')
        router.push('/login')
        return Promise.reject(new Error('token超时'))
      }
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 响应拦截器，把我需要的数据提前进行解构
service.interceptors.response.use(
  response => {
    const { message, data, success } = response.data
    if (success) {
    // 业务逻辑成功
      return data
    }
    Message.error(message)
    return Promise.reject(new Error(message))
  },
  error => {
    console.log(error)
    // 这里做一个兼容性处理，上面出错会把错误抛出
    if (error.response && error.response.status === 401) {
      store.dispatch('user/logout')
      router.push('/login')
      Message.error('token失效')
    } else {
      Message.error(error.message)
    }
    return Promise.reject(error)
  }
)

export default service

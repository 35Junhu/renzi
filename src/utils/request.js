import axios from 'axios'

// 创建实例化axios
const service = axios.create({
  baseURL: '/dev',
  timeout: 5000
})

export default service

import { loginAPI } from '@/api/login'
import { getUserDetailById, getUserInfoAPI } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: null,
    userInfo: {},
    hrsaasTime: 0
  },
  mutations: {
    SET_TOKEN(state, payload) {
      state.token = payload
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
    },
    REMOVE_USER_INFO(state) {
      state.userInfo = {}
    },
    REMOVE_TOKEN(state) {
      state.token = null
    },
    SET_HRSAAS_TIME(state, hrsaasTime) {
      state.hrsaasTime = hrsaasTime
    }
  },
  actions: {
    // 登录请求
    async loginAction({ commit }, loginData) {
      // 接口调用
      const data = await loginAPI(loginData)
      console.log(data)
      commit('SET_TOKEN', data)
      commit('SET_HRSAAS_TIME', new Date().getTime())
    },
    // 获取用户信息的请求
    async getUserInfo({ commit }) {
      // 接口请求
      const res = await getUserInfoAPI()
      // console.log(res)
      // 获取更多信息
      const res1 = await getUserDetailById(res.userId)
      // 合并对象
      const result = { ...res, ...res1 }
      commit('SET_USER_INFO', result)
      // 返回res后面会调用，复杂数据类型避免相互影响，拷贝一份
      return JSON.parse(JSON.stringify(result))
    },
    // 登出
    // 调用这个函数会返回一个Promise对象
    // 要先等它先清完
    logout({ commit }) {
      commit('REMOVE_USER_INFO')
      commit('REMOVE_TOKEN')
    }
  }
}

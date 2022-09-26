import { loginAPI } from '@/api/login'
export default {
  namespaced: true,
  state: {
    token: null
  },
  mutations: {
    SET_TOKEN(state, payload) {
      state.token = payload
    }
  },
  actions: {
    async loginAction({ commit }, loginData) {
      // 接口调用
      const data = await loginAPI(loginData)
      console.log(data)
      commit('SET_TOKEN', data)
    }
  }
}

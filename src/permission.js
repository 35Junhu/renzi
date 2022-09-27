import router from '@/router'
import store from '@/store'

const whiterList = ['/404', '/login']
router.beforeEach(async(to, from, next) => {
  // 判断本地存储是否有token
  if (store.getters.token) {
    // 有token的时候就可以去拿用户的信息了
    if (!store.getters.userId) {
      await store.dispatch('user/getUserInfo')
    }
    // 判断是否在登录页，如果是要跳转到首页，否则留在当前页面
    if (to.path === '/login') {
      // 表示要去的页面是登录页面
      next('/')
    } else {
      next()
    }
  } else {
    // 无token，看是否在白名单内，在放行，不在，跳转至登录页面
    if (whiterList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

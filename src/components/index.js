// 过滤器
// 抛出一个对象
// 引入要注册的组件
// 把组件用数组收集起来
// 全局注册组件
// import PageTools from './PageTools/index.vue'

// const components = [PageTools]

// export default {
//   install: function(Vue) {
//     components.forEach(ele => {
//       Vue.component(ele.name, ele)
//     })
//   }
// }

// 匹配路径优化，
// 返回的是一个函数,参数，路径，是否深层，匹配规则
const fn = require.context('./', true, /\.vue$/)
// keyS()方法返回的是匹配上的路径
console.log(fn.keys())
// 根据路径查找模块
console.log(fn('./PageTools/index.vue'))

// 一次性导入所有模块

// 返回的是所有的组件的组合(数组)
const components = fn.keys().map(ele => {
  return fn(ele)
})
import * as filters from '@/filters'
export default (Vue) => {
  components.forEach(ele => {
    Vue.component(ele.default.name, ele.default)
  })
  Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
  })
}
console.log(Object.keys(filters))


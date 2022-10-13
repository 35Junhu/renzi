<template>
  <div>
    <UploadExcel :on-success="success" />
  </div>
</template>

<script>
import UploadExcel from '@/components/UploadExcel/index.vue'
import { importEmployee } from '@/api/employees'
export default {
  components: { UploadExcel },
  methods: {
    async  success({ header, results }) {
      // console.log(results)
      // 建立一个对象，把中英文的互相匹配起来
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // 新建一个空数组,存储每个对象
      const arr = []
      results.forEach(item => {
        // 存储每个用户的信息,对象形式
        const userInfo = {}
        // ['入职日期','手机号,'姓名','转正日期','工号']
        Object.keys(item).forEach(key => {
          userInfo[userRelations[key]] = item[key]
        })
        arr.push(userInfo)
      })
      console.log(arr)
      // 已经把所有的中文key换成了英文，接下来调用接口
      await importEmployee(arr)
      // 弹出提示
      this.$message.success('批量导入成功')
      // 回退
      this.$router.back()
    }
  }
}
</script>

<style>

</style>

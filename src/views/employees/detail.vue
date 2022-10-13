<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="登录账户设置" lazy name="first">
          <!-- 放置表单 -->
          <el-form ref="userForm" :model="accountInfo" :rules="accountInfoRules" label-width="120px" style="margin-left: 120px; margin-top:30px">
            <el-form-item label="姓名:" prop="username">
              <el-input v-model="accountInfo.username" style="width:300px" />
            </el-form-item>
            <el-form-item label="密码:" prop="password">
              <el-input v-model="accountInfo.password" style="width:300px" type="password" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateUserInfo">更新</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情" lazy name="second">
          <UserInfo />
        </el-tab-pane>
        <el-tab-pane label="岗位信息" lazy name="third">
          <JobInfo />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getUserDetailById, updateUserInfo } from '@/api/user'
import UserInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'
import Cookies from 'js-cookie'
export default {
  components: { UserInfo, JobInfo },
  data() {
    return {
      activeName: Cookies.get('activeName') || 'first',
      accountInfo: {
        username: '',
        password: ''
      },
      accountInfoRules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { min: 2, max: 12, message: '姓名2-12位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, message: '密码长度最少6位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      const res = await getUserDetailById(this.$route.params.id)
      // console.log(res)
      this.accountInfo = res
    },
    // 点击更新用户信息
    async updateUserInfo() {
      try {
        await this.$refs.userForm.validate()
        await updateUserInfo(this.accountInfo)
        this.$message.success('更新成功')
        this.$router.back()
        // console.log('校验通过')
      } catch (error) {
        this.$message.error('更新失败')
        // console.log('校验失败')
      }
    },
    // 点击tabs存储cookie数据
    tabClick() {
      Cookies.set('activeName', this.activeName)
    }
  }
}
</script>

<style>

</style>

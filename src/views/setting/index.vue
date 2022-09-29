<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-tabs v-model="activeName">
        <el-tab-pane label="用户管理" name="first">
          <el-row>
            <!-- 按钮 -->
            <el-button type="primary" style="margin-left:10px" size="small" icon="el-icon-plus" @click="handleAdd">新增角色</el-button>
          </el-row>
          <!-- 表格 -->
          <el-table v-loading="loading" :data="list">
            <el-table-column label="序号" width="120" type="index" />
            <el-table-column label="角色名称" width="240" prop="name" />
            <el-table-column label="描述" prop="description" />
            <el-table-column label="操作" width="240">
              <template slot-scope="{row}">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary" @click="editRole(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="delRow(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-row type="flex" justify="end" align="middle" style="height:60px">
            <el-pagination
              v-if="total>0"
              background
              layout="prev, pager, next, sizes"
              :total="total"
              :current-page.sync="page.page"
              :page-size.sync="page.pagesize"
              :page-sizes="[2,5,10,15]"
              @current-change="getRoleList"
              @size-change="getRoleList"
            /></el-row>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="second">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />
          <el-form label-width="120px" style="margin-top:50px" :model="CompanyInfo">
            <el-form-item label="公司名称">
              <el-input v-model="CompanyInfo.name" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="CompanyInfo.companyAddress" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="CompanyInfo.mailbox" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="CompanyInfo.remarks" type="textarea" :rows="3" disabled style="width:400px" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <AddRole ref="addRole" :dialog-visible.sync="dialogVisible" @refreshList="getRoleList" />
  </div>
</template>

<script>
import { getRoleListAPI, deleteRole, getCompanyInfo } from '@/api/setting'
import AddRole from './components/addRole.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'HrsaasIndex',
  components: { AddRole },
  data() {
    return {
      activeName: 'first',
      list: [],
      page: {
        page: 1,
        pagesize: 10
      },
      total: 0,
      loading: false,
      dialogVisible: false,
      CompanyInfo: {}
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  mounted() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    // 刷新列表
    async getRoleList() {
      try {
        this.loading = true
        const { rows, total } = await getRoleListAPI(this.page)
        this.total = total
        this.list = rows
        // 一页数据删完，显示前一页
        if (total > 0 && rows.length === 0) {
          this.page.page = this.page.page - 1
          this.getRoleList()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    // 增加
    handleAdd() {
      this.dialogVisible = true
    },
    // 编辑的回显
    // 利用默认插槽可以显示行数据，把当前行数据拿到，再去赋值给子组件的vue变量当中
    editRole(row) {
      // row直接赋值给addRole的formData
      this.$refs.addRole.roleForm = { ...row }
      // 弹出来
      this.dialogVisible = true
    },
    // 删除
    async  delRow(id) {
      // this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   this.$message({
      //     type: 'success',
      //     message: '删除成功!'
      //   })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   })
      // })
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // console.log('success')
        // 调用接口
        await deleteRole(id)
        // 刷新页面
        this.getRoleList()
        // 弹窗提示
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      } catch (error) {
        // console.log('cancel')
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    // 获取公司信息
    async getCompanyInfo() {
      this.CompanyInfo = await getCompanyInfo(this.companyId)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

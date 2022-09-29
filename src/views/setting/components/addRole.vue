<template>
  <el-dialog
    :title="title"
    width="30%"
    :visible="dialogVisible"
    :before-close="handleClose"
  >
    <!-- 不写回调会报错 -->
    <el-form
      ref="roleDialogForm"
      label-width="80px"
      :model="roleForm"
      :rules="rules"
    >
      <el-form-item
        prop="name"
        label="角色"
      >
        <el-input v-model="roleForm.name" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="roleForm.description" type="textarea" row="3" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center" align="middle" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button v-loading="loading" type="primary" @click="handleAdd">确 定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { addRoleAPI, updateRole } from '@/api/setting'
export default {
  name: 'AddRole',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    title() {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    }
  },
  methods: {
    handleClose() {
      // 表单效果重置
      this.$refs.roleDialogForm.resetFields()
      this.$emit('update:dialogVisible', false)
      this.roleForm = {
        name: '',
        description: ''
      }
    },
    async handleAdd() {
      try {
        await this.$refs.roleDialogForm.validate()
        this.loading = true
        this.roleForm.id ? await updateRole(this.roleForm) : await addRoleAPI(this.roleForm)
        this.$message.success(this.roleForm.id ? '角色修改成功' : '角色新增成功')
        this.$emit('refreshList')
        this.handleClose()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>

</style>

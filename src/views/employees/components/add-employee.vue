<template>
  <el-dialog title="新增员工" :visible="isShowAdd" @close="handleClose">
    <!-- 表单 -->
    <el-form ref="addEmployee" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:80%" placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:80%" placeholder="请选择">
          <!-- <el-option label="正式" :value="1" /> -->
          <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:80%" placeholder="请选择部门" @focus="getDepartments" />
        <el-tree v-if="showTree" v-loading="loading" style="width:80%" :data="treeData" default-expand-all :props="{ label: 'name' }" @node-click="selectNode" />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:80%" placeholder="请选择日期" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="handleClose">取消</el-button>
          <el-button type="primary" size="small" @click="addEmployee">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import employees from '@/api/constant/employees'
import { getDepartmentsAPI } from '@/api/department'
import { transListToTreeData } from '@/utils/index'
import { addEmployee } from '@/api/employees'
export default {
  props: {
    isShowAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showTree: false,
      treeData: [],
      loading: false,
      hireType: employees.hireType,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: 'Please enter a username', trigger: 'blur' },
          { min: 1, max: 4, message: 'username 1~4', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: 'Please enter a mobile', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: 'mobile 不满足格式', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: 'Please enter a formOfEmployment' }
        ],
        timeOfEntry: [
          { required: true, message: 'Please enter a timeOfEntry' }
        ],
        workNumber: [
          { required: true, message: 'Please enter a workNumber', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: 'Please enter a departmentName' }
        ]
      }
    }
  },
  methods: {
    handleClose() {
    // 表单数组的重置
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      // 表单校验重置
      this.$refs.addEmployee.resetFields()
      // 传给父级进行值的更改
      this.$emit('update:isShowAdd', false)
      // 树的隐藏
      this.showTree = false
    },
    // 获取架构
    async getDepartments() {
      try {
        this.showTree = true
        this.loading = true
        const { depts } = await getDepartmentsAPI()
        // console.log(depts)
        this.treeData = transListToTreeData(depts, '')
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    // 点击节点触发方法，和输入框数据绑定
    selectNode(node) {
      // 选中树节点，把对应数据给输入框
      this.formData.departmentName = node.name
      // tree的隐藏
      this.showTree = false
    },
    // 新增员工
    async addEmployee() {
      try {
        // 表单校验通过后
        await this.$refs.addEmployee.validate()
        await addEmployee(this.formData)
        // console.log(res)
        // 告诉父组件刷新列表，关闭
        this.$parent.getEmployeeList()
        this.handleClose()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>

</style>

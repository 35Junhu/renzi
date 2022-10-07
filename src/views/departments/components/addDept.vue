<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="title" :visible="dialogVisible" @close="handleClose">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="addDeptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="submit">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { addDepartments, getDepartmentsAPI, updateDepartments } from '@/api/department'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: 'HrsaasAddDept',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      required: true
    }
  },
  data() {
    const codeCheck = async(rule, value, callback) => {
      const { depts } = await getDepartmentsAPI()
      let isRepeat = true
      // 编辑,其中存的是一个个对象
      // 保留原来的code重复校验，多加一个判断，校验时，我的每一项id不等于formData中的id
      if (this.formData.id) {
        isRepeat = depts.some(item => item.id !== this.formData.id && item.code === value)
      } else {
        isRepeat = depts.some(item => item.code === value)
      }
      isRepeat ? callback(new Error(`模块下已经存在${value}编码`)) : callback()
    }
    // 部门名字是否重复
    const nameCheck = async(rule, value, callback) => {
      const { depts } = await getDepartmentsAPI()
      // 找同级部门，把id和我点击传过来的部门id相同的都利用filter筛选出来
      // 拿到的treeNode数据代表技术部/运营部等一个部门对象
      let isRepeat = true
      if (this.formData.id) {
        // 编辑校验的是和自己同一级的，相同点就是pid是一样的+排除自己
        const deptstj1 = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id)
        // console.log(deptstj1)
        isRepeat = deptstj1.some(item => item.name === value)
      } else {
        // 添加是添加到自己的子级，筛选的是点击的所有的子级
        const deptstj = depts.filter(item => item.pid === this.treeNode.id)
        console.log(deptstj)
        isRepeat = deptstj.some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`该部门下已经存在${value}部门名称`)) : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      peoples: [], // 接收获取的员工简单列表的数据
      rules: {
        name: [
          { required: true, message: '部门名称必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称1-50个字符', trigger: 'blur' },
          { validator: nameCheck, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码1-50个字符', trigger: 'blur' },
          { validator: codeCheck, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人必填' }
        ],
        introduce: [
          { required: true, message: '部门介绍必填', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍1-300个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑部门' : '增加部门'
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible')
      // 关闭时重置表单
      this.$refs.addDeptForm.resetFields()
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    },
    // 获取员工简单列表数据
    async  getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
      console.log(this.peoples)
    },
    // 点击确定按钮后的提交
    async submit() {
      try {
        // 先校验表单是否通过，通过后执行后续代码
        await this.$refs.addDeptForm.validate()
        // 确定loading状态
        this.loading = true
        if (this.formData.id) {
          await updateDepartments(this.formData)
        } else {
          await addDepartments({ ...this.formData, pid: this.treeNode.id })
        }
        // 添加是子部门，所以把新增部门的id当自己的pid
        // 提示
        this.$message.success(`${this.formData.id ? '编辑' : '新增'}部门成功`)
        // 刷新加关闭弹窗
        this.$parent.getDepartments()
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

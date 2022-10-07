<template>
  <el-row type="flex" justify="space-between" align="middle" style="height:40px;width:100%">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex">
        <el-col>
          <span>{{ treeNode.manager }}</span>
        </el-col>
        <el-col>
          <el-dropdown @command="handleCommand">
            <span>
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/department'
export default {
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleCommand(type) {
      if (type === 'add') {
        // 新增
        // console.log('add')
        this.$emit('addDepts', this.treeNode)
      } else if (type === 'edit') {
        // 编辑
        // console.log('edit')
        this.$emit('editDept', this.treeNode)
      } else {
        // 删除
        // console.log('del')
        //  删除操作
        this.$confirm('您确定删除该部门的数据吗？', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定'
        }).then(() => {
          // 如果点击了确定就会进入then
          return delDepartments(this.treeNode.id) // 返回promise对象
        }).then(res => {
          this.$message.success('删除成功')
          this.$emit('refreshList')
        })
      }
    }
  }
}
</script>

<style>

</style>

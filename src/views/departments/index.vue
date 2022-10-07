<template>
  <div v-loading="loading" class="departments-container">
    <el-card>
      <tree-node :tree-node="company" :is-root="false" @addDepts="handleAddDept" />
    </el-card>
    <!-- 展开结构 -->
    <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
      <tree-node slot-scope="{data}" :tree-node="data" @refreshList="getDepartments" @editDept="editDept" @addDepts="handleAddDept" />
    </el-tree>
    <!-- 弹窗 -->
    <add-dept ref="addDept" :dialog-visible.sync="showDialog" :tree-node="currentNode" />
  </div>
</template>

<script>
import treeNode from './components/treeNode.vue'
import { getDepartmentsAPI } from '@/api/department'
import { transListToTreeData } from '@/utils/index'
import AddDept from './components/addDept.vue'
export default {
  name: 'HrsaasIndex',
  components: { treeNode, AddDept },

  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      departs: [
        { name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }
      ],
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人', id: '' },
      showDialog: false, // 显示窗体
      currentNode: {},
      loading: false
    }
  },

  mounted() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      try {
        this.loading = true
        const { depts, companyManage, companyName } = await getDepartmentsAPI()
        console.log(depts)
        this.departs = transListToTreeData(depts, '')
        this.company = { name: companyName, manager: companyManage, id: '' }
        // this.departs = depts
      } finally {
        this.loading = false
      }
    },
    handleAddDept(node) {
      this.showDialog = true
      this.currentNode = node
    },
    editDept(node) {
      console.log(node)
      // 拿去点击的这个实例对象
      this.showDialog = true
      this.currentNode = { ...node }
      // 回显数据
      this.$refs.addDept.formData = { ...node }
    }
  }
}
</script>

<style lang="scss">
  .departments-container {
    width: 900px;
    margin: 20px auto;
    .el-tree {
      .el-tree-node__content {
        // padding-right: 20px;
      }
    }
    .el-card__body {
      padding-right: 0 !important;
    }
  }
  </style>

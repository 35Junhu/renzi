<template>
  <div>
    <el-upload
      action="#"
      class="uploadImg"
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="preview"
      :on-remove="remove"
      :on-change="onChange"
      :http-request="onHttpRequest"
      :before-upload="beforeUpload"
      :limit="1"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialog"
      width="30%"
    >
      <img style="width: 100%" :src="previewUrl">
    </el-dialog>
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDc7ORGpCMIyoOjqiLkupVwCGUSBfuwlLn',
  SecretKey: 'INNDpHZfVBgwznPnw62jCQQBjy1pPlxv'
})
export default {
  name: 'UploadImg',
  props: {
    defaultUrl: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      fileList: [
        // { name: 'default', url: 'http://destiny001.gitee.io/image/cxk.gif' }
      ],
      previewDialog: false,
      previewUrl: ''
    }
  },
  // 监听器监听异步请求后传最新的数据过来
  watch: {
    defaultUrl() {
      this.fileList.push({
        name: 'default', url: this.defaultUrl
      })
    }
  },
  methods: {
    preview(file) {
      // console.log('点击预览')
      this.previewUrl = file.url
      this.previewDialog = true
    },
    remove(file, fileList) {
      // console.log('点击删除')
      this.fileList = fileList
    },
    onChange(file, fileList) {
      this.fileList = fileList
    },
    onHttpRequest({ file }) {
      cos.putObject({
        Bucket: 'tiger-1314348506', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-nanjing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        Body: file, // 上传文件对象
        onProgress: function(progressData) {
          // console.log(JSON.stringify(progressData))
          // 这个就是上传的百分比
          // params.percent 表示当前上传的进度
        }
      }, (err, data) => {
        if (err) return this.$message.error('上传图片失败')
        console.log(data)
        this.$emit('on-success', {
          imgUrl: 'https://' + data.Location
        })
      })
    },
    // 上传之前的校验
    beforeUpload(file) {
      // 创建文件类型的数组
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      // 判断是否包含在允许规则内
      const allow = types.includes(file.type)
      // 如果没有包含，返回false加弹窗提示
      if (!allow) {
        this.$message.error('只能上传' + types.join(' 、') + '类型数据')
        return false
      }

      // 限制上传的大小
      const maxSize = 1 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('上传图片不能超过1mb')
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
 .uploadImg {
  width: 148px;
  height: 148px;
  overflow: hidden;
}
</style>

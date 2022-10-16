<template>
  <div>
    <!-- <UploadExcel /> -->
    <ImageUpload @on-success="onSuccess" />
  </div>
</template>

<script>
import ImageUpload from '@/components/ImageUpload/index.vue'
// import UploadExcel from '../../components/UploadExcel/index.vue'
export default {
  components: { ImageUpload },
  methods: {
    onSuccess(val) {
      console.log('1')
      console.log(val)
    }
  }
}
</script>

<style>

</style>

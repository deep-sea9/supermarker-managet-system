<template>
  <div>

     <!-- 面包屑栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>人事管理</el-breadcrumb-item>
      <el-breadcrumb-item>日程流程</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click="downloadTemplate">下载离职单<i class="el-icon-download el-icon--right"></i></el-button>
    </el-card> 
    
  </div>
</template>

<script>
export default {
  data () {
    return {
      
    }
  },
  methods: {
  
    downloadTemplate(){
        
        this.$http({
          url: 'upload?method=download',
          method: 'post',
           responseType: 'blob',
          }).then((data)=>{
            console.log(data)
            let blob = new Blob([data.data],{ type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8'});
            let objectUrl = URL.createObjectURL(blob);
            window.location.href = objectUrl;
        })
        
    }
    
    
  }
}
</script>

<style>

</style>
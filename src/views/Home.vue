<template>
  <!-- 系统主页 -->
  <el-container class="home-container">
    <!-- 主页顶部 -->
    <el-header>
      <div class="collapse" @click="toggleCollapse">
        <i :class="unfold ? 'el-icon-s-unfold' : 'el-icon-s-fold' "></i>
      </div>
      <div class="foldMenu">
        超市管理系统
      </div>
      <div class="user">
        <div class="notice"><i class="el-icon-bell"></i></div>      
        <div class="block"><el-avatar :size="40" :src="circleUrl"></el-avatar></div>
        <el-dropdown @command="handleCommand">  
          <span class="el-dropdown-link">
            admin<i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="fold" :key="index">
            <el-dropdown-item command="a">系统设置</el-dropdown-item>
            <el-dropdown-item command="b">注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="settings"><i class="el-icon-setting"></i></div>  
      </div>
    </el-header>  
    <el-container>
      <!-- 菜单导航栏区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">      
        <el-menu
        :uniqueOpened="true" :default-active="$route.path"
        class="el-menu-vertical-demo" :collapse="isCollapse" 
        background-color="#252b3b" text-color="#fff"
        active-text-color="#ffd04b" router :collapse-transition="false">
        <el-menu-item index="/welcome">
          <i class="el-icon-s-home"></i>
          <span slot="title">系统首页</span>
        </el-menu-item>
        <el-submenu index="2">
          <template #title>
            <i class="el-icon-location"></i>
            <span>库存管理</span>
          </template> 
          <el-menu-item index="/goods">
            <template #title>
              <i class="el-icon-menu"></i>
              <span>商品列表</span>
            </template> 
          </el-menu-item>
          <el-menu-item index="/inventory">
            <i class="el-icon-menu"></i>
              <span>商品库存</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template #title>
            <i class="el-icon-user-solid"></i>
            <span>人事管理</span>
          </template> 
          <el-menu-item index="/emp">
            <i class="el-icon-menu"></i>
              <span>员工列表</span>
          </el-menu-item>
          <el-menu-item index="/management">
            <i class="el-icon-menu"></i>
              <span>日常流程</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template #title>
            <i class="el-icon-data-analysis"></i>
            <span>销售管理</span>
          </template> 
          <el-menu-item index="/salement">
            <i class="el-icon-menu"></i>
              <span>销售明细</span>
          </el-menu-item>
          <el-menu-item index="/statistics">
            <i class="el-icon-menu"></i>
              <span>营业统计</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="5">
          <template #title>
            <i class="el-icon-s-data"></i>
            <span>数据统计</span>
          </template> 
          <el-menu-item index="/report">
            <i class="el-icon-menu"></i>
              <span>数据图表</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="6">
          <template #title>
            <i class="el-icon-s-management"></i>
            <span>供应商管理</span>
          </template> 
          <el-menu-item index="/supply">
            <i class="el-icon-menu"></i>
              <span>供应商列表</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="7">
          <template #title>
            <i class="el-icon-setting"></i>
            <span>系统设置</span>
          </template> 
          <el-menu-item index="/settings">
            <i class="el-icon-menu"></i>
              <span>用户管理</span>
          </el-menu-item>
          <el-menu-item @click="logout">
            <i class="el-icon-menu"></i>
              <span>退出系统</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      </el-aside>
      <!-- 主要内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

export default {
  
  data () {
    return {
      isCollapse: false,
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      unfold: true,
      index: null
    }
  },
  created () {
    
  },
  methods: {
    //菜单栏折叠
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
      this.unfold = !this.unfold
    },
    //退出系统
    logout(){
      this.$confirm('是否继续退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          window.sessionStorage.clear()
          this.$router.push('/login')
        })
    },
     handleCommand(command) {
      if (command == "a") {
        this.$router.push('./settings')
      }
      else{
        this.logout()
      }
    }
  }
  
}
</script>

<style>
  .home-container{
    height: 100%;
  }
  .el-header {
    background-color: #324157;
    color: #333;
    line-height:60px;  
  }
  .collapse{
    height: 100%;
    width: 64px;
    text-align: center;
    font-size: 25px;
    float: left;
    color: #fff;
    cursor: pointer;
    line-height: 60px;
  }
  .collapse:hover{
    background-color: #283446;
    color: #fff;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #fff;
  }
  .block{   
    display: inline-block;
    margin: 10px;
    margin-left: 20px;
  }
  .user{
    display: flex;
    float: right;
    margin-right: 50px;
    color: #fff;
    line-height: 60px;
  }
  .user span{
    font-size: 15px;
  }
  .notice{
    font-size: 25px;
  }
  .user .settings{
    margin-left: 15px;
    font-size: 25px;
  }
  .fold {
    top: 40px !important;
  }
  .foldMenu{
    margin: 0;
    float: left; 
    display: flex;
    font-weight: 400;
    font-size: 25px;
    font-family: '微软雅黑';
    color: #fff;
  }
  .el-aside {
    background-color: #252b3b;
    border: none;    
  }
  .el-main {
    background-color: #f1f5f7;
  }
  
  .logo{
    display: flex;
  }
  .profile{
    text-align: center;
    padding: 10px 0;
  }
</style>

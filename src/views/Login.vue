<template>
  <div class="main">
    <Particles></Particles>
    <div class="login">
      <div class="login_content">
        超市管理系统
      </div>
      <div class="loginForm">
        <el-form label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
          <el-form-item prop="username">
            <el-input placeholder="请输入用户名" v-model="loginForm.username" @focus="resetForm" clearable>
                <template slot="prepend"><i class="el-icon-user"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input placeholder="请输入密码" type="password" v-model="loginForm.password" clearale>
              <template slot="prepend"><i class="el-icon-lock"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item class="login_btn">
            <el-button type="primary" @click="login" class="loginBtn" >立即登录</el-button>
          </el-form-item>
        </el-form>
      </div>
        
      
    </div>
  </div>
  
</template>

<script>
import { Loading } from 'element-ui';
import particlesJS from '../components/particles/Particles'

export default {
  components: {
    Particles: particlesJS
  },
  data() {
    return {
      //登录表单数据绑定对象
       loginForm: {
        username: "",
        password: "",
      },
      //表单验证规则对象
      loginFormRules: {
        username: [
          //用户名验证
          { required: true, message: "请输入用户名", trigger: "blur" },
          {min: 3,max: 10, message: "长度在 6 到 10 个字符",trigger: "blur"}],
        password: [
          //密码验证
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {min: 6,max: 15,message: "长度在 6 到 15 个字符",trigger: "blur"}]
      },
      //商品列表
      result: null,
      fullscreenLoading: false
    };
  },
  methods: {
    resetForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
     
       this.$refs.loginFormRef.validate(async (valid) => {
        if (valid) {
          this.$http({
            url: "login",
            method: "post",
            params: {
              username: this.loginForm.username,
              password: this.loginForm.password,
            },
          }).then((res) => {
            console.log(res);
            if (res.data.status != 200) {
             this.$message.error("用户名不存在或密码错误");
               return;
            }
            const loading = Loading.service({
              lock: true,
              text: '正在登录...',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
           setTimeout(() => {
            loading.close();
            this.$message.success("登录成功");
            window.sessionStorage.setItem("session",res.data.session);
             this.$router.push('/home');  
          }, 2000);
          })
        } else {
          return false;
        }
      }) 
       
          
       
        
         
      
    }
  },
};
</script>

<style scoped>
.main {
  height: 100%;
  width: 100%; 
}
.login{
    width: 350px;
    background: hsla(0,0%,100%,.3);
    border-radius: 5px;
    -webkit-box-shadow: 0 0 2px #f7f7f7;
    box-shadow: 0 0 2px #f7f7f7;
    border: 1px solid #f7f7f7;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -175px;
    margin-top: -150px;
}
.login_content {
    line-height: 50px;
    font-size: 20px;
    color: #fff;
    text-align: center;
    border-bottom: 1px solid #fff;
}
.loginForm {
    width: 100%;
    height: auto;
    padding: 30px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.login_btn {  
    width: 100%;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    color: #606266;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    font-size: 14px;
    border-radius: 4px;
}
.loginBtn{
  width: 100%;
}

</style>
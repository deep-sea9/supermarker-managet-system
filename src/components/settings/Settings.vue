<template>
  <div>
    <!-- 面包屑栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <h3>用户列表</h3>
      <el-divider></el-divider>
      <el-row>
        <el-table :data="userList" border style="width: 50%;margin: 30px auto">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="username" label="用户名" width="180"></el-table-column>
          <el-table-column prop="password" label="密码" width="180"></el-table-column>
          <el-table-column fixed="right" label="操作" >
            <template slot-scope="scope">
              <el-link icon="el-icon-edit" @click="updatePwd(scope.row)">修改密码</el-link>
              <el-link>删除<i class="el-icon-delete el-icon--right"></i> </el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card> 

    <!-- 修改密码对话框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="pwdForm" status-icon :rules="rules" ref="pwdForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="原密码" prop="password">
          <el-input v-model="pwdForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="pwdForm.newPwd" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input v-model="pwdForm.confirmPwd" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('pwdForm')">立即修改</el-button>
          <el-button @click="resetForm('pwdForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

  
</template>

<script>
export default {
  data () {
    var validatePwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原密码'))
      }else if (value !== this.pwdForm.pwd) {
        callback(new Error('输入密码与原密码不一致'))
      }else{
        callback()
      }
      
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      }else if (value.length > 15 || value.length < 5) {
        callback(new Error('密码长度在5-15位数之间'))
      }else if (value === this.pwdForm.password) {
        callback(new Error('新密码不能和原密码相同'))
      }else {
        if (this.pwdForm.confirmPwd !== '') {
          this.$refs.pwdForm.validateField('confirmPwd');
        }
        callback();
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.pwdForm.newPwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      userList: [],
      dialogVisible: false,
      pwdForm: {
        password: '',  //输入的原密码
        newPwd: '',    //新密码
        confirmPwd: '',//确认密码，
        pwd: '',        //获取的原密码
        username: ''    //账号

      },
      rules: {
        password: [
          {validator: validatePwd, trigger: 'blur'}
        ],
        newPwd: [
          { validator: validatePass, trigger: 'blur' }
        ],
        confirmPwd: [
          { validator: validatePass2, trigger: 'blur' }
        ],
      },
      
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList(){
      const {data: res} = await 
      this.$http.get('user?method=getUser')
      this.userList = res.userList
    },
    updatePwd(row){
      console.log(row);
      this.dialogVisible = true
      this.pwdForm.pwd = row.password
      this.pwdForm.username = row.username
    },
    handleClose(){
      this.dialogVisible = false
      this.$refs.pwdForm.resetFields();
    },
    submitForm(formName) {
        this.$refs[formName].validate( async valid => {
          if (valid) {
            //console.log(this.pwdForm);
            const {data:res} = await 
            this.$http({
              url: 'user?method=updatePwd',
              method: 'post',
              params: {
                'username': this.pwdForm.username,
                'password': this.pwdForm.confirmPwd
              }
            })
            if (res.status != 200) {
              return this.$message.error('修改密码失败')
            }
            this.$message.success("修改密码成功，请重新登录")
            window.sessionStorage.clear()
            this.$router.push('/login')

          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
  }
  
}
</script>

<style>
  .el-link{
    margin-left: 30px;
  }
</style>
<template>
  <div>
    <!-- 面包屑栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>供应商管理管理</el-breadcrumb-item>
      <el-breadcrumb-item>供应商列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="18">
        <el-col :span="8">
          <el-input placeholder="请输入供应商名称" v-model="profferName" class="input-with-select search" clearable @clear="getProfferList">
            <el-button slot="append" icon="el-icon-search" @click="queryGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="AddSupplyDialog">添加供应商</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="ProfferList" height="510" border stripe size="mini" style="width:100%;margin-top:15px;">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="profferId" label="供应商编号"></el-table-column>
            <el-table-column prop="fullName" label="供应商名称"></el-table-column>
            <el-table-column prop="contacts" label="联系人"></el-table-column>
            <el-table-column prop="phone" label="联系电话"></el-table-column>
            <el-table-column prop="address" label="联系地址"></el-table-column>
            <el-table-column prop="account" label="银行账号" ></el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">            
                <el-button type="primary" icon="el-icon-edit"  @click="updateSupply(scope.row)" size="mini"></el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteSupply(scope.row)" size="mini"></el-button>
              </template>
            </el-table-column>
        </el-table>
      </el-row>
      <!-- 分页 -->
      <el-row>
         <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[12, 15, 20]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-row>
    </el-card>

    <!-- 信息详情页 -->
    <el-dialog :title="titleMap[dialogTitle]"  :visible.sync="supplyDialogVisible" :before-close="handleClose">
      <el-form :model="supplyForm" ref="supplyForm" :rules="supplyFormRules"  label-width="100px" status-icon>
        <el-row>
          <el-col :span="15">
            <el-form-item label="供应商编号" prop="profferId">
              <el-input v-model="supplyForm.profferId" autocomplete="off" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="供应商名称" prop="fullName">
              <el-input v-model="supplyForm.fullName" autocomplete="off" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" >
            <el-form-item label="联系人" prop="contacts">
              <el-input v-model="supplyForm.contacts" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="supplyForm.phone" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="联系地址" prop="address">
              <el-input v-model="supplyForm.address" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="银行账号" prop="account">
              <el-input v-model="supplyForm.account" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('supplyForm')">取 消</el-button>
        <el-button type="primary" @click="submit('supplyForm')">{{buttonName}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    const checkPhoneNumber = (rule, value, callback) => {
      const reg = /^1[3|4|5|6|7|8|9]\d{9}$/;
      if (!value) {
        return callback(new Error('请填写手机号码！'))
      } else if (!reg.test(value)) {
        return callback(new Error('请填写正确的手机号码！'))
      }else{
        callback()
      }
    }
    return {
      page: 1,
      size: 12,
      total: 10,
      ProfferList: [],
      profferName: '',
      supplyDialogVisible: false,
      supplyForm: {
        profferId: '',
        fullName: '',
        contacts: '',
        phone: '',
        address: '',
        account: ''
      },
      supplyFormRules: {
          profferId: [{required: true, message: '供应商编号不能为空',trigger:'blur'}],
          fullName: [{required: true, message: '供应商名称不能为空', trigger: 'blur'}],
          contacts:[{required: true, message: '联系人不能为空', trigger:'blur'}],
          phone: [{required: true, validator: checkPhoneNumber, trigger: 'blur'}],
          address: [{required: true, message: '联系地址不能为空', trigger:'blur'}],
          account: [{required:true, message: '银行账号不能为空',trigger:'blur'}]   
      },
      titleMap : {
        addSupply : "添加供应商信息",
        updateSupply : "修该供应商信息"
      },
      dialogTitle: "",
      buttonName: "",
      disabled: false
    }
  },
  created () {
    this.getProfferList()
  },
  methods: {
     //监听pageSize事件
    handleSizeChange(newSize){
      this.size = newSize
      this.getProfferList()
    },
    //监听页码值改变
    handleCurrentChange(newPage){
      this.page = newPage
      this.getProfferList()
    },
    async getProfferList(){
      const {data: res} = await
      this.$http.get('supply?method=getProffer',{params: {'page': this.page, 'size': this.size}})
      console.log(res);
      this.ProfferList = res.profferList.rows
      this.total = res.profferList.total
      if (res.status != 200) {
        return this.$message.error("获取供应商信息失败")
      }
      
    },
    updateSupply(row){
      this.supplyDialogVisible = true
      this.supplyForm = row
      this.dialogTitle = "updateSupply"
      this.buttonName = "修 改"
      this.disabled = true
    },
    deleteSupply(row){
      console.log(row);
    },
    AddSupplyDialog(){
      this.supplyDialogVisible = true
      this.dialogTitle = "addSupply"
      this.buttonName = "添 加"
      this.supplyForm = {}
      this.disabled = false
    },
    cancel(formName){
      this.$refs[formName].resetFields()
      this.supplyDialogVisible = false
    },
    handleClose(done){
      this.supplyDialogVisible = false
     this.$refs.supplyForm.resetFields()
    },
    submit(formName){ 
       this.$refs[formName].validate( (valid) => {
          if (valid) {
            if (this.dialogTitle == 'addSupply') {
              this.$confirm('是否确定添加?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(async () => {
                const {data: res} = await 
                this.$http.get('supply?method=addProffer',{params: {'supplyForm': this.supplyForm}})
                console.log(res);
                if (res.status == 100) {
                  return this.$message.warning("该供应商信息已存在")
                }else if (res.status == 400) {
                  return this.$message.error('添加失败')
                }
                this.$message.success("添加成功")
                this.getProfferList()
                this.supplyDialogVisible = false
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消添加'
                });         
              })
 
            }else{
              this.$confirm('是否确定修改?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(async () => {
                const {data: res} = await 
                this.$http.get('supply?method=updateProffer',{params: {'supplyForm': this.supplyForm}})
                console.log(res);
                 if (res.status != 200) {
                  return this.$message.error('修改失败')
                }
                this.$message.success("修改成功")
                this.getProfferList()
                this.supplyDialogVisible = false
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消修改'
                });         
              })
            }
            
          }else{
            return false
          }
          
       })
    },
    async queryGoodsList(){
      const {data: res} = await 
      this.$http.get('supply?method=findSupply',{params: {'profferName': this.profferName}})
      console.log(res);
      if (res.status != 200) {
        return this.$message.error("所查询的供应商不存在")
      }
      this.ProfferList = res.profferList
      this.total = res.profferList.length
      
    },
    //删除供应商信息
    deleteSupply(row){
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const {data: res} = await
          this.$http.get('supply?method=deleteProffer',{params: {'profferId': row.profferId}})
          if (res.status != 200) {
            return this.$message.error("删除失败")
          }
          this.$message.success("删除成功")
          this.getProfferList()
        })
      
    }
  }
}
</script>

<style>

</style>
<template>
  <div>
    <!-- 面包屑栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>人事管理</el-breadcrumb-item>
      <el-breadcrumb-item>员工列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="18">
        <el-col :span="8">
          <el-input placeholder="请输入员工姓名" v-model.trim="query" class="input-with-select search" clearable @clear="getEmpList">
            <el-button slot="append" icon="el-icon-search" @click="queryEmp"></el-button>
          </el-input>
        </el-col>
         <el-col :span="4">
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addEmpDialog">添加员工</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-table
          :data="EmpList"
          height="510"
          border stripe size="mini"
          style="width:100%;margin-top:15px;">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="eno" label="员工编号"></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>      
          <el-table-column prop="sex" label="性别"></el-table-column>         
          <el-table-column prop="dept" label="部门" ></el-table-column>        
          <el-table-column prop="job" label="职位" ></el-table-column>  
          <el-table-column prop="workDate" label="入职日期" ></el-table-column>   
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-view" circle @click="handleClick(scope.row)" size="mini"></el-button>  
              <el-button type="danger" icon="el-icon-delete" circle @click="deleteEmp(scope.row)" size="mini"></el-button>
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

    <!-- 员工信息详情页 -->
    <el-dialog :title="titleMap[dialogTitle]" :visible.sync="empDialogVisible">
      <el-form :model="empForm" ref="empForm" :rules="empFormRules"  label-width="100px" size="mini" status-icon>
        <el-row>
          <el-col :span="10">
            <el-form-item label="员工编号" prop="eno">
              <el-input v-model="empForm.eno" autocomplete="off" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="empForm.name" autocomplete="off" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="身份证号码" prop="idNo">
              <el-input v-model="empForm.idNo" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="性别" prop="sex">
               <el-radio-group v-model="empForm.sex" size="medium">
                <el-radio label="男" checked></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="年龄" prop="age">
              <el-input v-model.number="empForm.age" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
             <el-form-item label="出生日期" prop="birth">
              <el-date-picker type="date" placeholder="选择日期" v-model="empForm.birth" 
                              style="width: 100%;" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" >
            <el-form-item label="联系电话" prop="telephone">
              <el-input v-model="empForm.telephone" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="所属部门" prop="deptNo">
              <el-select v-model="empForm.deptNo" placeholder="请选择所属部门" @change="getDept">
                <el-option
                  v-for="item in deptList"
                  :key="item.dept_no"
                  :label="item.dept"
                  :value="item.dept_no">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="家庭地址" prop="address">
              <el-input v-model="empForm.address" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
             <el-form-item label="入职日期" prop="date">
              <el-date-picker type="date" placeholder="选择日期" v-model="empForm.workDate" 
                              style="width: 100%;" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="工作岗位" prop="job">
              <el-input v-model="empForm.job" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('empForm')">取 消</el-button>
        <el-button type="primary" @click="submit('empForm')">{{buttonName}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data () {
    //手机号码验证
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
    //身份证号码验证
    const checkIdNum = (rule, value, callback) => {
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (!value) {
        return callback(new Error('证件号码不能为空'))
      } else if (!reg.test(value)) {
        return callback(new Error('证件号码不正确'))
      } else {
        callback()
      }
    }
    return {
      input2: '',
      EmpList: [],
      deptList: [],
      //当前页数
      page: 1,
      //当前每页显示多少条数据
      size: 12,
      total: 0,
      //对话框显示与隐藏
      empDialogVisible: false,
      empForm: {
        eno: '',
        name: '',
        idNo: '',
        sex: '男',
        age: null ,
        birth: '',
        telephone: '',
        dept: '',
        deptNo: '',
        address: '',
        workDate: '',
        job: ''
      },
      query: '', 
      titleMap : {
        addEmp : "添加员工信息",
        updateEmp : "修该员工信息"
      },
      dialogTitle: "",
      buttonName: "",
      empFormRules: {
        eno: [{required: true, message: '员工编号不能为空',trigger: 'blur'}],
        name: [{required:true, message: '员工姓名不能为空', trigger: 'blur'}],
        telephone: [{ required: true, validator: checkPhoneNumber, trigger: 'blur' }],
        idNo: [{ required: true, validator: checkIdNum, trigger: 'blur' }],
        sex: [{required: true, message: '请选择性别', trigger: 'blur'}],
        age: [{required:true,  message: '请输入年龄'},{type: 'number',message: '年龄只能为数值'}],
        birth: [{required:true, message: '请选择出生日期',trigger: 'change'}],
        address: [{required:true, message: '家庭地址不能为空', trigger:'blur'}],
        dept_no: [{required: true, message: '请选择部门', trigger: 'change'}],
        workDate: [{required: true, message: '请选择入职日期', trigger: 'blur'}],
        job: [{required: true, message: '职位不能为空', trigger: 'blur'}]
      },
      
    }
  },
  created() {
    this.getEmpList()
  },
  methods: {
    //监听pageSize事件
    handleSizeChange(newSize){
      this.size = newSize
      this.getEmpList()
    },
    //监听页码值改变
    handleCurrentChange(newPage){
      this.page = newPage
      this.getEmpList()
    },
    getEmpList(){
      this.$http({
                url:'emp?method=getAllEmp',
                methods:'get',
                params:{
                    'page':this.page,
                    'size':this.size
                }
            }).then(res => {
              console.log(res);
              this.EmpList = res.data.empList.rows
              this.total = res.data.empList.total
              this.deptList = res.data.deptList
              if (res.data.status != 200) {
                return this.$message.error("获取数据失败!")
              }
              
            }) 
    },
    handleClick(row){
      this.empForm = row
      //console.log(row);
      this.empDialogVisible = true
      this.dialogTitle = "updateEmp"
      this.buttonName = "修 改"
      //console.log(this.buttonName);
    },
    //查找员工
    queryEmp(){
      this.$http({
        url: 'emp?method=getEmpByName',
        methods: 'get',
        params: {
          'ename': this.query
        }
      }).then(res => {
        this.EmpList = res.data.emp
        this.total = res.data.emp.length

        if (res.data.status != 200) {
          return this.$message.error("所查询的员工不存在，请重新输入！");
        }
       
       
        
      })
    },
    //删除员工信息
    deleteEmp(row){
      this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         this.$http.get('emp?method=deleteEmp',{params: {'empNo': row.eno}}).then(res => {
            if (res.status != 200) return this.$message.error("删除员工信息失败")
            this.getEmpList()
            this.$message.success("删除员工信息成功")
          })
        }).catch(() =>{

        })
    },
    //更新员工信息
    updateMessage(){
      
      this.$http.get('emp?method=updateEmp',{params: {'empForm': this.empForm}}).then(res => {
        if(res.status != 200) return this.$message.error("更新员工信息失败")
        this.getEmpList()
        this.$message.success("更新员工信息成功")
      })
    },
    //员工信息对话框添加或修改
    addEmpDialog(){
      this.empDialogVisible = true
      this.empForm = {}
      this.dialogTitle = "addEmp"
      this.buttonName = "添 加"
    },
    //添加员工信息
    addEmp(){
      console.log(this.empForm);
      this.$http({
        method: 'post',
        url: 'emp?method=addNewEmp',
        params: {
          'empForm': this.empForm
        }
      }).then(res => {
        //console.log(res);
        if (res.data.status == 100) {
          return this.$message.error("所添加的员工已存在")
        }else if (res.data.status == 400) {
          return this.$message.error("添加员工信息失败")
        }
        this.$message.success("添加员工信息成功")
      })
      this.getEmpList()
    },
    submit(formName){
       this.$refs[formName].validate((valid) => {
        if (valid) {
          this.empDialogVisible = false
          if (this.dialogTitle == "addEmp") {        
            //console.log(this.buttonName);
            this.addEmp()
          }else{  
            this.updateMessage()
          }
        }else{
          return false
        }
       })
      
    },
    cancel(formName){
      this.empDialogVisible = false
      this.$refs[formName].resetFields()
    },
    getDept(data){
      let obj = {};
      obj = this.deptList.find((item) => {
        return item.dept_no === data
      })
      this.empForm.dept = obj.dept
    }
  },

}
</script>

<style>

</style>
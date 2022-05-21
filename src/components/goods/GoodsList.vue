<template>
  <div>
    <!-- 面包屑栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="18">
        <el-col :span="8">
          <el-input placeholder="请输入要查找的商品" v-model.trim="query" class="input-with-select search" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="queryGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="showAddDialog">添加商品</el-button>
          <el-button type="primary" icon="el-icon-upload" @click="toAddGoods">批量导入</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-table
          :data="goodsList"
          height="510"
          border
          stripe size="mini"
          style="width:100%;margin-top:15px;">
          <el-table-column type="index" ></el-table-column>
          <el-table-column prop="goodsId" label="商品编号" ></el-table-column>
          <el-table-column prop="goodsName" label="商品名称" ></el-table-column>
          <el-table-column prop="spec" label="规格" ></el-table-column>
          <el-table-column prop="measurement" label="计量单位"></el-table-column>
          <el-table-column prop="price" label="零售价" ></el-table-column>
          <el-table-column prop="status" label="状态" ></el-table-column>
          <!-- <el-table-column prop="count" label="库存数量" width="120"></el-table-column> -->
          <el-table-column label="操作">
            <template slot-scope="scope">            
              <el-button type="primary" icon="el-icon-edit"  @click="updateGoods(scope.row)" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete"  @click="deleteGoods(scope.row)" size="mini"></el-button>
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

    <!-- 商品信息详情页 -->
    <el-dialog :title="titleMap[dialogTitle]" :visible.sync="goodsDialogVisible" width="30%" :before-close="handleClose">
      <el-form :model="goodsForm" status-icon  ref="goodsForm" :rules="goodsFormRules" label-width="100px" class="demo-ruleForm" size="mini">
        <el-form-item label="商品编号" prop="goodsId">
          <el-input v-model="goodsForm.goodsId" ></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="goodsForm.goodsName" ></el-input>
        </el-form-item>
        <el-form-item label="规格" prop="spec">
          <el-input v-model="goodsForm.spec" ></el-input>
        </el-form-item>
        <el-form-item label="计量单位" prop="measurement">
          <el-input v-model="goodsForm.measurement" ></el-input>
        </el-form-item>
        <el-form-item label="销售价格" prop="price">
          <el-input v-model="goodsForm.price" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="商品状态" prop="status">
          <el-input v-model="goodsForm.status"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="cateId">
          <el-select v-model="goodsForm.cateId" placeholder="请选择商品类目" @change="getCate">
            <el-option
              v-for="item in cateList"
              :key="item.cate_id"
              :label="item.cate"
              :value="item.cate_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('goodsForm')">取 消</el-button>
        <el-button type="primary" @click="action('goodsForm')">{{btnName}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>


export default {
  data () {
    const validatePrice = (rule,value,callback) =>{
      let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{2})$/
      if(!value){
          callback(new Error('单价不能为空'))
        }else if(!reg.test(value)){
          callback(new Error('请输入正确格式的单价'))
            this.$set(this.goodsForm, "price", '');
        }else if(value.length > 10){
          callback(new Error('最多可输入10个字符'))
            this.$set(this.goodsForm, "price", '');
        }else{
        callback();
      }
    }
    return {
      input2: '',
      goodsList: [],
      cateList: [],
      //当前页数
      page: 1,
      //当前每页显示多少条数据
      size: 12,
      total: 0,
      query:'',
      //商品信息对话框显示与隐藏
      goodsDialogVisible: false,
      goodsForm: {
        goodsId: '',
        goodsName: '',
        spec: '',
        measurement: '',
        price: '',
        status: '',
        cateId: ''
      },
      dialogImageUrl: '',
      disabled: false,
      addGoodsDialogVisible: false,
      titleMap : {
        addData : "添加商品信息",
        updateData : "修该商品信息"
      },
      dialogTitle: "",
      goodsFormRules: {
        goodsId: [
          {required: true, message: '请输入商品编号',trigger: 'blur'}
        ],
        goodsName: [
          {required: true, message:'请输入商品名称', trigger: 'blur'}
        ],
        spec: [
          {required: true, message: '请输入商品规格',trigger: 'blur'}
        ],
        measurement: [
          {required: true, message: '请输入计量单位', trigger: 'blur'}
        ],
        price: [
          { validator: validatePrice, trigger: 'blur', required: true }
        ],
        status: [
          {required: true, message: '请输入商品状态', trigger: 'blur'}
        ],
        cate_id: [
          {required: true, message: '请选择商品分类', trigger: 'change'}
        ]
      },
      pictureDialogVisible: false      
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    //监听pageSize事件
    handleSizeChange(newSize){
      this.size = newSize
      this.getGoodsList()
    },
    //监听页码值改变
    handleCurrentChange(newPage){
      this.page = newPage
      this.getGoodsList()
    },
    //获取商品列表
    getGoodsList(){
      this.$http({
                url:'goods?method=getGoodsList',
                methods:'get',
                params:{
                    'page':this.page,
                    'size':this.size,
                    'query': this.query
                }
            }).then(res => {                   
              if (res.data.status != 200) {
                return this.$message.error("获取数据失败!")
              }
              //console.log(res);
              this.goodsList = res.data.goodsList.rows
              this.total = res.data.goodsList.total
              this.cateList = res.data.cateList
              
            }) 
    },
    //查询商品
    queryGoodsList(){
      this.$http({
        url: 'goods?method=queryGoodsList',
        methods: 'get',
        params: {
          'goodsName': this.query
        }
      }).then(res => {
        this.goodsList = res.data.goodsList
        this.total = res.data.goodsList.length
        if (res.data.status != 200) {
          return this.$message.error("所查询商品不存在，请重新输入！")
        }
        
      })
    },
    //删除商品
    deleteGoods(row){
      //console.log(row.goodsId);
      //根据商品编号删除商品
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: 'goods?method=deleteGoods',
            methods: 'get',
            params: {
              'goodsId': row.goodsId
            }
          }).then(res => {
            console.log(res);
            if (res.status != 200) {
              return this.$message.error("删除商品失败！")
            }
            this.getGoodsList()
            this.$message.success("删除商品成功!") 
          })
        })
      
    },
    //商品信息对话框事件
    updateGoods(row){
      this.goodsForm = row
      //console.log(this.goodsForm);
      this.goodsDialogVisible = true
      this.dialogTitle = "updateData"
      //console.log(this.dialogTitle);
    },
    handleClose(done) {
      this.goodsDialogVisible = false
      this.$refs.goodsForm.resetFields()
      //this.addGoodsDialogVisible = false
      
    },
    handleRemove(file) {
        console.log(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.pictureDialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    //修改商品信息
    editGoods(){
      //console.log(this.goodsForm);
       this.$http.get('goods?method=updateGoods',{params: {'goodsForm': this.goodsForm}}).then(res => {
         console.log(res);
         if (res.data.status != 200){
            return this.$message.error("修改商品信息失败")
         } 
         this.getGoodsList()
         this.$message.success("修改商品信息成功")
       })

    },
    //添加商品信息对话框
    showAddDialog(){
      this.goodsDialogVisible = true
      this.goodsForm = {}
      this.dialogTitle = "addData"    
      //console.log(this.dialogTitle);
    },
    addGoods(){
          this.$http({
          method: 'post',
          url: 'goods?method=addGoods',
          params: {
            'goodsForm': this.goodsForm
          }
          }).then(res => {
            console.log(res);
            if (res.data.status == 100) {
              return this.$message.error("你所添加的商品已存在")
            }else if (res.data.status == 400 ) {
              return this.$message.error("添加商品信息失败")
            }
            this.getGoodsList()
            this.$message.success("添加商品信息成功")
            this.goodsDialogVisible = false
          })  
    },
    action(formName){
       this.$refs[formName].validate((valid) => {
        if (valid) {  
          if (this.dialogTitle == 'addData') {
            //添加操作
             this.$confirm('是否继续添加商品?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.addGoods()
              })            
          }else{
            //修改操作
            this.editGoods()
          }   
          this.goodsDialogVisible = false
        } else {    
          return false
        }
      })
      
    },
    cancel(formName){
      this.$refs[formName].resetFields()
      this.goodsDialogVisible = false
    },
    getCate(data){
      let obj = {};
      obj = this.cateList.find((item) => {
        return item.cate_id === data
      })
      this.goodsForm.cate_id = obj.cate_id
    },
    toAddGoods(){
      this.$router.push('/add')
    }
  },
  computed: {
    btnName(){
      if (this.dialogTitle == 'updateData') {
        return '修 改'
      }else{
        return '添 加'
      }
    }
  }
}
</script>

<style scoped>
  
</style>
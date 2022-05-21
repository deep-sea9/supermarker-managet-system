<template>
  <div>
    <!-- 面包屑栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品库存</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div class="ilabel">库存信息列表</div>
      <el-divider class="divider"></el-divider>
      <el-row :gutter="20">
        <el-form ref="" :model="query" label-width="80px" size="mini">
          <el-col :span="6">
            <el-form-item label="商品名称">
              <el-input v-model.trim="query.goodsName" clearable @clear="getInventoryList"></el-input>
            </el-form-item>
          </el-col> 
          <el-col :span="6">
            <el-form-item label="商品编号">
              <el-input v-model.trim="query.goodsId" clearable @clear="getInventoryList"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" icon="el-icon-search" @click="findInventory">查询</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="newInventory">添加库存</el-button>
            <el-button type="primary" icon="el-icon-view" @click="inputHistory">进货记录</el-button>
          </el-col>          
        </el-form> 
      </el-row>
      <el-row>
        <el-table
          :data="inventoryList"
          height="450"
          border stripe size="mini"
          style="width:100%;margin-top:15px;">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="goodsId" label="商品编号" ></el-table-column>
          <el-table-column prop="goodsName" label="商品名称"></el-table-column>
          <el-table-column prop="category" label="类别" ></el-table-column>
          <el-table-column prop="date" label="进货日期" ></el-table-column>
          <el-table-column prop="count" label="库存数量" ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="addInventory(scope.row)" type="primary" size="mini" >进货</el-button>
            </template>
          </el-table-column>
        </el-table>
        
      </el-row>

      <!-- 分页 -->
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 15, 20]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <el-dialog title="补充库存" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form :model="InventoryForm"  ref="InventoryForm" :rules="InventoryFormRules" 
              label-width="100px" class="demo-ruleForm" status-icon>
        <el-form-item label="商品编号" prop="goodsId">
          <el-input v-model="InventoryForm.goodsId"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="InventoryForm.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="proffer">
          <el-input v-model="InventoryForm.proffer"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="InventoryForm.price"></el-input>
        </el-form-item>
        <el-form-item label="进货数量" prop="quantity">
          <el-input v-model.number="InventoryForm.quantity"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('InventoryForm')">取 消</el-button>
        <el-button type="primary" @click="submit('InventoryForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 进货记录 -->
    <el-dialog
      title="进货记录"
      :visible.sync="importDialog"
      width="70%"
      :before-close="handleHistoryClose">
      
      <el-date-picker v-model="dataValue" :type="type" :picker-options="pickerOptions" :key="type"
           :value-format="type==='year'?'yyyy':type==='month'?'yyyy-MM':'yyyy-MM-dd'"
           :format="type==='year'?'yyyy':type==='month'?'yyyy-MM':'yyyy-MM-dd'"
           :placeholder="type==='year'?'选择年份':type==='month'?'选择月份':'选择日期'" 
           @change="dateSelect" >
       </el-date-picker>

      <el-dropdown split-button type="primary"  class="selectDate" @command="handleCommand">
        筛选
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="date">按日查询</el-dropdown-item>
          <el-dropdown-item command="year">按年查询</el-dropdown-item>
          <el-dropdown-item command="month">按月查询</el-dropdown-item>
          <el-dropdown-item command="daterange">自定义日期范围</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-button class="print" @click="exportExcelSelect">导出<i class="el-icon-printer el-icon--right"></i></el-button>

      <el-table :data="StockList" border style="width: 100%" size="mini" height="400" class="import" id="selectTable">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="importBill" label="进货单号" width="120"></el-table-column>
        <el-table-column prop="goodsId" label="商品编号" width="120"></el-table-column>
        <el-table-column prop="goodsName" label="商品名称" width="150"></el-table-column>
        <el-table-column prop="proffer" label="供应商" width="150"></el-table-column>
        <el-table-column prop="price" label="单价" width="80"></el-table-column>
        <el-table-column prop="quantity" label="数量" width="80"></el-table-column>
        <el-table-column prop="total" label="总额" width="80"></el-table-column>
        <el-table-column prop="date" label="进货日期"></el-table-column>
      </el-table>
      <span class="totalHistory">共有 {{history}} 条记录</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleHistoryClose">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加库存 -->
    <el-dialog title="添加库存" :visible.sync="newInventoryDialog" width="35%" :before-close="closeDialog">
      <el-form :model="newInventoryform" ref="newInventoryform" :rules="newInventoryformRules" label-width="100px" status-icon>
        <el-form-item label="商品编号" prop="goodsId">
          <el-input v-model="newInventoryform.goodsId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="newInventoryform.goodsName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="category">
          <el-select v-model="newInventoryform.category" placeholder="请选择">
            <el-option
              v-for="item in cateList"
              :key="item.cate_id"
              :label="item.cate"
              :value="item.cate">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="进货日期" prop="date">
          <el-date-picker
            v-model="newInventoryform.date"
            type="date" value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-input v-model.number="newInventoryform.count" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="increaseInventory">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import exportExcel from '../../utils/exportExcel'

export default {

  data(){
    const validatePrice = (rule,value,callback) =>{
      let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{2})$/
      if(!value){
          callback(new Error('单价不能为空'))
        }else if(!reg.test(value)){
          callback(new Error('请输入正确格式的单价'))
            this.$set(this.InventoryForm, "price", '');
        }else if(value.length > 10){
          callback(new Error('最多可输入10个字符'))
            this.$set(this.InventoryForm, "price", '');
        }else{
        callback();
      }
    }
    return {
      inventoryList: [],
      page: 1,
      //当前每页显示多少条数据
      size: 10,
      total: 10,
      query: {
        goodsName: '',
        goodsId: ''     
      },
      dialogVisible: false,
      InventoryForm: {
        importBill: '',
        goodsId: '',
        goodsName: '',
        quantity: null,
        proffer: '',
        price: null,
        total: null,
        date: this.$moment(new Date()).format("YYYY-MM-DD")
      },
      InventoryFormRules: {
        proffer: [{required: true, message: '供应商不能为空', trigger: 'blur'}],
        price: [{required: true, validator: validatePrice, trigger: 'blur'}],
        quantity: [{required: true, type: 'number', message: '数量只能为数值', trigger: 'blur'}]
      },
      totalCount: null,
      importDialog: false,
      StockList: [],
      inputDate:'',
      type: 'date',//默认日期选择器的type为年
      dataValue: '',
      curSearchKey: '',
      pickerOptions: { 
      },
      history: 0,
      newInventoryDialog: false,
      newInventoryform: {
        goodsId: '',
        goodsName: '',
        category: '',
        date: '',
        count: null
      },
      cateList: [],
      newInventoryformRules: {
        goodsId: [{required: true,message:'商品编号不能为空', trigger: 'blur'}],
        goodsName: [{required: true, message:'商品名称不能为空', trigger: 'blur'}],
        count: [{required: true, message: '请输入数量',trigger: 'blur',type: 'number'}],
        inDate: [{required: true, message: '请选择进货日期'}],
        cate: [{required: true, message: '请选择类别',trigger:'change'}]
      },
     
    } 
  },
  created () {
    this.getInventoryList()
  },
  methods: {
    //监听pageSize事件
    handleSizeChange(newSize){
      this.size = newSize
      this.getInventoryList()
    },
    //监听页码值改变
    handleCurrentChange(newPage){
      this.page = newPage
      this.getInventoryList()
    },
    getInventoryList(){
      this.$http({
                url:'inventory?method=queryAllInventory',
                methods:'get',
                params:{
                    'page':this.page,
                    'size':this.size
                }
            }).then(res => {
              this.inventoryList = res.data.inventoryList.rows
              this.total = res.data.inventoryList.total
              if (res.data.status != 200) {
                return this.$message.error("获取数据失败!")
              }           
            }) 
    },
    findInventory(){
      //const {data: res} = await
      this.$http.get('inventory?method=getInventoryList',{params: {'query': this.query}}).then((res) => {
        if (res.data.status != 200) {
          return this.$message.error("查询的商品库存不存在，请重新输入")
        }
        this.inventoryList = res.data.inventoryList
        this.total = this.inventoryList.length
      })
      
    },
    async deleteInventory(row){
      const {data: res} = await 
      this.$http.get('inventory?method=removeInventory',{params: {'goodsId': row.goodsId}})
      if (res.status != 200) {
        return this.$message.error("删除库存失败")
      }
      this.getInventoryList()
    },
    addInventory(row){
      this.dialogVisible = true
      this.InventoryForm.goodsName = row.goodsName
      this.InventoryForm.goodsId = row.goodsId
      //调用获取当前日期的方法加四位随机数  赋值表单中的项目编号
      //如果是6位或者8位随机数，相应的 *1000000或者 *100000000就行了
      this.InventoryForm.importBill = this.getProjectNum() + Math.floor(Math.random() * 10000)  
      this.totalCount = row.count
      this.InventoryForm.price = null
      this.InventoryForm.proffer = ''
      this.InventoryForm.quantity = null
      
    },
    handleClose(done){
      this.dialogVisible = false
      this.$refs.InventoryForm.resetFields()
    },
    // 获取当前日期的方法
    getProjectNum () {
        const projectTime = new Date() // 当前中国标准时间
        const Year = projectTime.getFullYear() // 获取当前年份 支持IE和火狐浏览器.
        const Month = projectTime.getMonth() + 1 // 获取中国区月份
        const Day = projectTime.getDate() // 获取几号
        var CurrentDate = String(Year)
        if (Month >= 10) { // 判断月份和几号是否大于10或者小于10
          CurrentDate += Month
        } else {
          CurrentDate += '0' + Month
        }
        if (Day >= 10) {
          CurrentDate += Day
        } else {
          CurrentDate += '0' + Day
        }
        return CurrentDate
    },
    //添加进货
    submit(formName){
      this.InventoryForm.total = (this.InventoryForm.quantity * this.InventoryForm.price).toFixed(2)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否继续进货?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
              this.$http({
              method: 'post',
              url: 'inventory?method=addInventory',
              params: {
                'inventoryForm': this.InventoryForm,
                'total': this.totalCount + this.InventoryForm.quantity
              }
            }).then((res) => {
              if (res.data.status != 200) {
                return this.$message.error("进货失败，请稍后重试")
              }
              this.getInventoryList()
              this.dialogVisible = false
            })
          })
        }else{
          return false
        }
          
      })
    },
    cancel(formName){
      this.dialogVisible = false
      this.$refs[formName].resetFields()
    },
    //进货
    async inputHistory(){
      this.importDialog = true
      const {data: res} = await
      this.$http.get('stock?method=getStockList')
      this.StockList = res.stockList
      this.history = res.stockList.length
      if (res.status != 200) {
        return this.$message.error("获取进货记录失败")
      }
      
    },
    handleCommand(command) {
      this.dataValue = ''
      this.type = command
      if (command !== 'daterange') {
        this.pickerOptions ={}
      }else {
        this.pickerOptions = {shortcuts: [
          {
            text: '最近三天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, 
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, 
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '最近半年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit('pick', [start, end]);
            }
          }]}
      }
    },
    //日期筛选进货记录
    async dateSelect(date){      
        if (this.dataValue != null ) {
          if (this.type == "date") {
            const {data: res} =await  
            this.$http.get('stock?method=getDateList',{params: {'date': date}})
            console.log(res);
            this.StockList = res.DateList
            if (res.status != 200) this.history = 0
            else this.history = res.DateList.length 
            if (res.status != 200 && this.dataValue != null) {
              return this.$message.error("该天没有进货记录")
            }
          }
          if (this.type == "year") {
            const {data: res} =await  
            this.$http.get('stock?method=selectYear',{params: {'year': date}})   
            this.StockList = res.yearList
            if (res.status != 200) this.history = 0
            else this.history = res.yearList.length
            if (res.status != 200 && this.dataValue != null) {
              return this.$message.error("该年没有进货记录")
            }
          }
          if (this.type == "month") {
            const {data: res} =await  
            this.$http.get('stock?method=selectMonth',{params: {'month': date}})
            this.StockList = res.monthList
            if (res.status != 200) this.history = 0
            else this.history = res.monthList.length
            if (res.status != 200 && this.dataValue != null) {
              return this.$message.error("该月没有进货记录")
            }
          }
          if (this.type == "daterange") {
            const {data: res} =await  
            this.$http.get('stock?method=selectDateRange',{params: {'startDate': date[0], 'endDate': date[1]}})
            this.StockList = res.RangeList
            if (res.status != 200) this.history = 0
            else this.history = res.RangeList.length
            if (res.status != 200 && this.dataValue != null) {
              return this.$message.error("该时间段没有进货记录")
            }
          }
        }else{
          this.inputHistory();
        }
        
      
    },
    handleHistoryClose(){
      this.importDialog = false
      this.type = 'date'
      this.dataValue = ''
    },
    exportExcel() {
        htmlToExcel.getExcel('#selectTable','导出的自定义标题')
    },
    //导出Excel表格
    exportExcelSelect(){
        this.$confirm('是否继续导出Excel表格?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          exportExcel.getExcel('#selectTable','导出的自定义标题')
        })
         
    },
    async newInventory(){
      this.newInventoryDialog = true
      this.newInventoryform = {}
      
      const {data:res} = await 
      this.$http.get('goods?method=getCateList')
      this.cateList = res.cateList
    },
    //添加库存
    increaseInventory(){
       this.$refs.newInventoryform.validate((valid) => {
          if (valid) {
            //console.log(this.newInventoryform);
            this.$confirm('是否继续添加?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              const {data: res} = await
              this.$http.get('inventory?method=addNewInventory',{params: {'form': this.newInventoryform}})
              if (res.status == 100) {
                return this.$message("该商品库存已存在")
              }
              else if (res.status == 400) {
                return this.$message.error("添加失败")
              }
              this.getInventoryList()
              this.$message.success("添加成功")
              this.newInventoryDialog = false
            })
          }else{
            return false
          }
      })
    },
    closeDialog(){
      this.$refs.newInventoryform.resetFields()
      this.newInventoryDialog = false
    }
  },
  
}
</script>

<style>
.ilabel{
  font-weight: 400;
  font-size: 20px;
 
}
.import{
  margin-top: 10px;
}
.selectDate{
  margin-left: 15px;
}
.print{
  float: right;
}
.totalHistory{
  text-align: center;
  display: block;
  font-size: 20px;
  margin-top: 5px;
}
</style>
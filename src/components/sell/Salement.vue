<template>
  <div>
    <!-- 面包屑栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>销售管理</el-breadcrumb-item>
      <el-breadcrumb-item>销售明细</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="serach" class="input-with-select" clearable @clear="getSaleDate">
            <el-button slot="append" icon="el-icon-search" @click="findSaleByName" ></el-button>
          </el-input>
        </el-col>
        <el-col :span="8" :offset="10">
          <el-date-picker v-model="dataValue" :type="type" :picker-options="pickerOptions" :key="type"
              :value-format="type==='year'?'yyyy':type==='month'?'yyyy-MM':'yyyy-MM-dd'"
              :format="type==='year'?'yyyy':type==='month'?'yyyy-MM':'yyyy-MM-dd'"
              :placeholder="type==='year'?'选择年份':type==='month'?'选择月份':'选择日期'" 
              @change="dateSelect">
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
        </el-col>
      </el-row>
      <el-row>
        <el-table
          :data="saleList"
          height="500"
          border
          stripe size="mini"
          style="width:100%;margin-top:15px;">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="goodsId" label="商品编号" ></el-table-column>
          <el-table-column prop="goodsName" label="商品名称" ></el-table-column>
          <el-table-column prop="category" label="类别" ></el-table-column>
          <el-table-column prop="sales" label="销量" ></el-table-column>
          <el-table-column prop="price" label="零售价"></el-table-column>
          <el-table-column prop="total" label="总额" ></el-table-column>
          <el-table-column prop="saleDate" label="销售日期"></el-table-column> 
        </el-table>
      </el-row>

      <!-- 分页 -->
      <el-row>
         <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[15, 18, 20]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-row>
    </el-card>

  </div>
</template>

<script>
export default {
  data () {
    return {
      page: 1,
      size: 15,
      total: 10,
      saleList: [],
      value: '',
      serach: '',
      type: 'date',//默认日期选择器的type为年
      dataValue: '',
      curSearchKey: '',
      pickerOptions: {
          
      },
    }
  },
  created () {
    this.getSaleDate()
  },
  mounted () {
    this.getCurrentDate()
  },
  methods: {
    //监听pageSize事件
    handleSizeChange(newSize){
      this.size = newSize
      this.getSaleDate()
    },
    //监听页码值改变
    handleCurrentChange(newPage){
      this.page = newPage
      this.getSaleDate()
    },
    getCurrentDate(){
      this.currentDate = this.$dateFormat(new Date(), 'yyyy-mm-dd')
    },
    getSaleDate(){
      this.$http.get('sale?method=getAllSales',{params: {'page': this.page,'size': this.size}}).then(res => {
        if (res.data.status != 200) {
          return this.$message.error("获取销售数据失败")
        }
        console.log(res);
        this.saleList = res.data.saleList.rows
        this.total = res.data.saleList.total
      })
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
    async dateSelect(date){
      //console.log(date);
      if (this.dataValue != null) {
        if (this.type == "date") {
          const {data: res} =await  
          this.$http.get('sale?method=getDateList',{params: {'date': date}})
          console.log(res);
          this.saleList = res.list
          this.total = res.list.length
          console.log(res);
          if (res.status != 200 && this.dataValue != null) {
            return this.$message.error("该天没有销售记录")
          }
        }
        if (this.type == "year") {
          const {data: res} =await  
          this.$http.get('sale?method=selectYear',{params: {'year': date}})
          this.saleList = res.list
          this.total = res.list.length
          if (res.status != 200 && this.dataValue != null) {
            return this.$message.error("该年没有销售记录")
          }
          
        }
        if (this.type == "month") {
          const {data: res} =await  
          this.$http.get('sale?method=selectMonth',{params: {'month': date}})
          this.saleList = res.list
          this.total = res.list.length
          console.log(res);
          if (res.status != 200 && this.dataValue != null) {
            return this.$message.error("该月份还没有进货记录")
          }
        }
        if(this.type == "daterange"){
          const {data: res} =await  
          this.$http.get('sale?method=selectDateRange',{params: {'startDate': date[0], 'endDate': date[1]}})
          this.saleList = res.list
          this.total = res.list.length
          if (res.status != 200 && this.dataValue != null) {
            return this.$message.error("该时间段没有销售记录")
          }
        }
      }else{
        this.getSaleDate()
      }
    },
    async findSaleByName(){
      const {data: res} = await 
      this.$http.get('sale?method=getSaleByName',{params: {'goodsName': this.serach}})
      if (res.status != 200) {
        this.saleList = []
        return this.$message.error("该商品暂无销售记录")
      }
      
      this.saleList = res.list
      this.total = res.list.length
    }
  }
 
}
</script>

<style>

</style>
<template>
  <div>
    <el-card>
      <!-- 面包屑栏 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据图表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card> 
   
   <el-row :gutter="10">
      <el-col :span="12" :lg="12" :md="24" :sm="24" :xs="24"> 
        <el-card>        
          <div style="border: 1px solid #e6e6e6;">
              <span class="sales">销量Top10</span>  
              <br>
              <el-button-group class="dateSelect" :xs="24">
                <el-button :type="aa" size="mini" @click="getSeven">近七天</el-button>
                <el-button :type="bb" size="mini" @click="getThisMonth">本月</el-button>
                <el-button :type="cc" size="mini" @click="getThisYear">本年</el-button>
              </el-button-group>
              <br>
              <div id="main" style="height:400px;margin-top:20px;"></div>
          </div>   
        </el-card>
      </el-col>
      <el-col :span="12" :lg="12" :md="24" :sm="24" :xs="24">
        <el-card>
          <div style="border: 1px solid #e6e6e6;">
            <span class="cateSales">类目销售情况</span>  
            <br>
            <el-button-group class="dateSelect" >
              <el-button type="primary" size="mini">近七天</el-button>
              <el-button type="" size="mini">本月</el-button>
              <el-button type="" size="mini">本年</el-button>
            </el-button-group>
            <br>
            <div id="aa" style="height: 400px;margin-top:20px;"></div>  
          </div>   
        </el-card>
      </el-col>
   </el-row>
   <el-row :gutter="10">
     <el-col :span="12" :lg="12" :md="24" :sm="24" :xs="24"> 
        <el-card>        
          <div style="border: 1px solid #e6e6e6;">
              <span class="sales">销售额</span>  
              <br>
              <el-button-group class="dateSelect" >
                <el-button :type="aa" size="mini" @click="getSeven">近七天</el-button>
                <el-button :type="bb" size="mini" @click="getThisMonth">本月</el-button>
                <el-button :type="cc" size="mini" @click="getThisYear">本年</el-button>
              </el-button-group>
              <br>
              <div id="salesDate" style="height:400px;margin-top:20px;"></div>
          </div>   
        </el-card>
      </el-col>
      <el-col :span="12" :lg="12" :md="24" :sm="24" :xs="24">
        <el-card>
          <div style="border: 1px solid #e6e6e6;">
            <span class="cateSales">进货情况</span>  
            <br>
            <el-button-group class="dateSelect" >
              <el-button type="primary" size="mini">近七天</el-button>
              <el-button type="" size="mini">本月</el-button>
              <el-button type="" size="mini">本年</el-button>
            </el-button-group>
            <br>
            <div id="inputDate" style="height: 400px;margin-top:20px;"></div>  
          </div>   
        </el-card>
      </el-col>
   </el-row>
    
   
  
  </div>
</template>

<script>
//导入echarts
import * as echarts from "echarts";

export default {
  data() {
    return {
      saleDate: [],
      goodsName: [],
      sales:[],
      sales_date: [],
      sales_value: [],
      // 指定图表的配置项和数据
      cateDate: [],
      aa: 'primary',
      bb: '',
      cc: ''
    }
  },
  created() {
    this.getDateList()
   
  },
  methods: {
    async getDateList(){
      const {data: res} = await 
      this.$http.get('sale?method=statisticsReport')
      console.log(res);
      this.saleDate = res.list
      //销量前十
      for(var i of res.list){
        this.goodsName.push(i.goods)
        this.sales.push(i.value)
      }
      
      //销量top10统计图
      var myChart = echarts.init(document.getElementById("main"));
      myChart.setOption({
        tooltip: {},
        legend: {
          data: ["销量"],
        },
        xAxis: {
          data: this.goodsName,
          axisLabel: { interval: 0, rotate: 30 },
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: this.sales,
          },
        ],
      });

      //类目销量统计图
      var myChart1 = echarts.init(document.getElementById("aa"));
       myChart1.setOption( {
          tooltip: {
              trigger: 'item'
          },
          legend: {
              orient: 'vertical',
              left: 'left',
          },
          series: [
              {
                  name: '访问来源',
                  type: 'pie',
                  radius: '50%',
                  data: res.listCate,
                  emphasis: {
                      itemStyle: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                  }
              }
          ]
      });

      //过去七天的销售额
      for(var i of res.listSales){
        this.sales_date.push(i.date)
        this.sales_value.push(i.value)
      }

      //销售额统计图
      var myChart2 = echarts.init(document.getElementById("salesDate"));
      myChart2.setOption({
        xAxis: {
            type: 'category',
            data: this.sales_date
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: this.sales_value,
            type: 'line'
        }]
    })
      
      //进货情况统计图
      var myChart3 = echarts.init(document.getElementById("inputDate"));
      myChart3.setOption({
        legend: {
            top: 'bottom'
        },
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        series: [
            {
                name: '面积模式',
                type: 'pie',
                radius: '75%',
                center: ['50%', '40%'],
                roseType: 'area',
                itemStyle: {
                    borderRadius: 8
                },
                data: res.listInput
            }
        ]
    })
      

    },
    getSeven(){
      this.aa = 'primary'
      this.bb = ''
      this.cc = ''
    },
    getThisMonth(){
      this.aa = ''
      this.bb = 'primary'
      this.cc = ''
    },
    getThisYear(){
      this.aa = ''
      this.bb = ''
      this.cc = 'primary'
    }

    
  },
};
</script>
  
<style>
  .sales{
    position: absolute;
    width: 130px;
    height: 30px;
    background: #fff;
    display: inline-block;
    text-align: center;
    line-height: 30px;
    font-size: 13px;
    color: #000;
    left:50px;
    top:20px;
    
  }
  .dateSelect{
    float: right;
    margin-right: 10px;
  }
  .cateSales{
    position: absolute;
    color: #000;
    text-align: center;
    background: #fff;
    font-size: 13px;
    line-height: 30px;
    width: 130px;
    height: 30px;
    display: inline-block;
    top: 20px;
    margin-left: 30px;
  }
</style>
<template>
  <div>
    <!-- 面包屑栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>销售管理</el-breadcrumb-item>
      <el-breadcrumb-item>营业统计</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="10">
        <el-col :span="6">
          <div class="sale">
            <div class="value">今日销售额</div>
            <div class="value1">
              <div style="float:left;"><i class="iconfont icon-rmb" style="font-size:40px;"></i></div>
              <span style="">{{currentSalesData}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="sale" style="border-color: #a155e8;">
            <div class="value">本周销售额</div>
            <div class="value1" style="background-color:#a155e8;">
              <div style="float:left;"><i class="iconfont icon-rmb" style="font-size:40px;"></i></div>
              <span style="">{{weekSales}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="sale" style="border-color:#aed75b;">
            <div class="value">本月销售额</div>
            <div class="value1" style="background-color: #aed75b;">
              <div style="float:left;"><i class="iconfont icon-rmb" style="font-size:40px;"></i></div>
              <span style="">{{monthSales}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="sale" style="border-color: #a233a2;">
            <div class="value">本季度销售额</div>
            <div class="value1" style="background-color: #a233a2;">
              <div style="float:left;"><i class="iconfont icon-rmb" style="font-size:40px;"></i></div>
              <span style="">{{quarterSales}}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <div id="main" style="height: 400px"></div>
    </el-card>

  </div>
  
</template>

<script>

import * as echarts from "echarts";
export default {
  data () {
    return {
      currentSalesData: 0,
      weekSales: 0,
      monthSales: 0,
      quarterSales:0,
      monthSalesData: [],
      date:[]
    }
  },
  created () {
    this.getSalesDate()
  },
  methods: {
    getSalesDate(){
      
      this.$http.get('sale?method=getSaleDate').then( res => {
      console.log(res);
      this.currentSalesData = res.data.salesDate.todaySales.toFixed(2)
      this.weekSales = res.data.salesDate.weekSales.toFixed(2)
      this.monthSales = res.data.salesDate.monthSales.toFixed(2)
      this.quarterSales = res.data.salesDate.quarterSales.toFixed(2)
      for(let i of res.data.monthSales){
        this.monthSalesData.push(i.data)
        this.date.push(i.date)
      }
      var myChart = echarts.init(document.getElementById('main'))
      myChart.setOption({
          tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis: [
              {
                  type: 'category',
                  data: this.date,
                  axisTick: {
                      alignWithLabel: true
                  }
              }
          ],
          yAxis: [
              {
                  type: 'value'
              }
          ],
          series: [
              {
                  name: '销售额',
                  type: 'bar',
                  barWidth: '60%',
                  data: this.monthSalesData
              }
          ]
      })
       })
     
    },
    
    
  }
}
</script>

<style>
  .sale{
    border: 1px solid #ffa333;
    height: 100px;
    border-radius: 5px;
    color: #5c5c5c;

  }
  .sale .value{
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    text-align: center;
  } 
  .sale .value1{
    height: 60px;
    background-color: #ffa333;
    color: #fff;
    line-height:60px;
    font-size:30px;
    
  }
  .value1 span{
    float: right;
    margin-right: 15px;
  }
 
  
</style>
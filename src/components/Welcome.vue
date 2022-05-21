<template>
  <div>
    <el-row :gutter="30" >
      <el-col :xs="10" :md="10" :lg="6"  >
        <el-card shadow="hover">
          <div>
            <div class="pic" ><i class="iconfont icon-message" style="color:#60b6f9;font-size:50px; "></i></div>
            <div class="content" >
              <div class="label">消息</div>
              <span class="message">1,283</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="10" :md="10" :lg="6">
        <el-card shadow="hover">
          <div>
            <div class="pic" ><i class="iconfont icon-rmb" style="color:#f4516c;font-size:50px;"></i></div>
            <div class="content" >
              <div class="label">销售额</div>
              <span class="message">{{currentSalesData}}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="10" :md="10"  :lg="6"  >
        <el-card shadow="hover">
          <div>
            <div class="pic"><i class="el-icon-s-data" style="color:#34bfa3;font-size=50px;"></i></div>
            <div class="content" >
              <div class="label">进货量</div>
              <span class="message">{{importToday}}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col  :xs="10" :md="10" :lg="6"  >
        <el-card shadow="hover">
          <div>
            <div class="pic"><i class="el-icon-star-on" style="color: yellow;"></i></div>
            <div class="content" >
              <div class="label">评价</div>
              <span class="message">3,148</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card>
      <el-row>      
          <div id="main" style="width: 100%; height: 500px"></div>
      </el-row>
    </el-card>
  </div>
</template>

<script>

import * as echarts from "echarts"

export default {
  data () {
    return {
      currentSalesData: 0,
      importToday: 0,
      date: [],
      value: []
    }
  },
  created () {
    //this.getSalesDate()
    //this.getInputDate()   
    this.getSevenDaySale()
  },
  mounted () { 
    
  },
  methods: {
    getSevenDaySale(){
      
      this.$http.get('sale?method=getSalesStatistics').then(res => {
       console.log(res);
          for(var i = 0; i<res.data.list.length;i++){
            this.date.push(res.data.list[i].date)
            this.value.push(res.data.list[i].value)
          }
          this.currentSalesData = res.data.salesToday.toFixed(2)
          this.importToday = res.data.importSales.toFixed(2)
          var myChart = echarts.init(document.getElementById('main'));
            myChart.setOption({
              title:{
                text: "过去七天营业额情况"
              },
              xAxis: {
                  type: 'category',
                  data: this.date
              },
              yAxis: {
                  type: 'value'
              },
              series: [{
                  data: this.value,
                  type: 'line',
                  smooth: true
              }]
            });
         
      })

     
      
    }
  }
} 
</script>

<style>
  .pic{
    width:80px;
    height:80px;
    float: left;
    font-size:50px;
    /* background-color:#60b6f9; */
    text-align: center;
    
  }
  .content{
    float: right;
    width:80px;
    height:52px
  }
  .label{
      font-weight:700;
      color:rgba(0, 0, 0, 0.45);
      line-height:18px;
      margin: 0px 0px 12px;
      text-align:center;
  }
  .message{
    font-size: 20px;
    font-weight:700;
    line-height: 23px;
    color: #666;
    text-align:center;
  }
  .aa img{
    width: 180ppx;
    height: 100px;
  }
  
</style>
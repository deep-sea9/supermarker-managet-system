<template>
  <div>
    <!-- 页头 -->
    <el-page-header @back="goBack" content="商品列表"></el-page-header>

    <el-card>
      <!-- 上传文件按钮 -->
    <el-row class="aa">
      <el-col :span="10">
        <!-- <el-upload
        action
        accept=".xlsx,.xls"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handle">
        <el-button type="primary" slot="trigger">选取 Excel 文件</el-button>
      </el-upload> -->
      <el-upload
        class="upload-demo"
        drag
        action
        accept=".xlsx,.xls"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handle">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">支持xlsx或者xls格式</div>
      </el-upload>
      </el-col>
      <el-col :span="6">
        <el-button type="success" @click="download">下载模板</el-button>
      </el-col>
      <el-col :span="6">
        <el-button type="success" @click="submit" :disabled="disable">采集数据提交</el-button>
      </el-col>
    </el-row>
      
    

    <!-- 解析出来的数据 -->
    <div class="tableBox" v-show="show">
      <h3>
        <i class="el-icon-info">
          小主，以下是采集完成的数据，请您检查无误后，点击“采集数据提交”按钮上传至服务器</i>
      </h3>
      <el-table :data="tempData" border style="width: 100%" :height="height">
        <el-table-column prop="goodsId" label="商品编号" min-width="50%"></el-table-column>
        <el-table-column prop="goodsName" label="商品名称" min-width="50%"></el-table-column>
        <el-table-column prop="spec" label="规格" min-width="50%"></el-table-column>
        <el-table-column prop="measurement" label="计量单位" min-width="50%"></el-table-column>
        <el-table-column prop="price" label="零售机" min-width="50%"></el-table-column>
        <el-table-column prop="cateId" label="分类编号" min-width="50%"></el-table-column>
        <el-table-column prop="status" label="状态" min-width="50%"></el-table-column>
        <el-table-column prop="count" label="库存数量" min-width="50%"></el-table-column>
      </el-table>
    </div>
    </el-card>
    
  </div>
</template>

<script>
import xlsx from 'xlsx'
import { Loading } from 'element-ui'
import { readFile, character, delay } from '../../utils/utils.js'

export default {
  data () {
    return {
      height: document.documentElement.clientHeight - 130,
      tempData: [],
      show: false,
      disable: false,
      type: 'xlsx',
      failSend: []
    }
  },
  methods: {
    goBack(){
      this.$router.push('goods')
    },
    // 采集 EXCEL 数据
    async handle(e) {
      let file = e.raw
      if (!file) return

      this.show = false
      let loading = Loading.service({
        text: '小主，请您稍等片刻，女家正在玩命处理中...',
        background: 'rgba(0,0,0,.5)'
      })

      await delay(300)

      // 读取FILE中的数据
      let data = await readFile(file)
      let workbook = xlsx.read(data, { type: 'binary' }),
        worksheet = workbook.Sheets[workbook.SheetNames[0]],
        list = xlsx.utils.sheet_to_json(worksheet)
      // console.log(list)

      // 把读取出来的数据变为可以提交为服务器的数据格式
      let arr = []
      list.forEach(item => {
        let obj = {}
        for (let key in character) {
          if (!character.hasOwnProperty(key)) break
          let v = character[key],
            text = v.text,
            type = v.type
          v = item[text] || ''
          type === 'string' ? (v = String(v)) : null
          type === 'number' ? (v = Number(v)) : null
          obj[key] = v
        }

        arr.push(obj)
      })

      await delay(300)

      // 展示到页面中
      this.show = true
      // console.log(arr)
      this.tempData = arr
      loading.close()
    },
    // 提交数据给服务器
    async submit() {
      if (this.tempData.length <= 0) {
        return this.$message({
          message: '小主，请您先选择 EXCEL 文件！',
          type: 'warning',
          showClose: true
        })
        return;
      }

      this.disable = true
      let loading = Loading.service({
        text: '小主，请您稍等片刻，女家正在玩命处理中...',
        background: 'rgba(0,0,0,.5)'
      })

      //完成后处理的事情
      let complete = () =>{
        this.$message({
          message: '上传成功',
          type: 'success',
          showClose: true
        });
        this.show = false
        this.disable = false
        loading.close()
      }


      //需要把数据一条条传递给服务器
      let n = 0
      let send = async () => {
        if(n > this.tempData.length - 1){
          //传递完了
          complete();
          return;
        }
        let body = this.tempData[n]
        
        const {data: res} = await 
        this.$http.get('upload?method=importExcel',{params: {'data': body}})
        console.log(res);
          if(res.status == 200){
            n++;
          }
          send();
      }
      send();
      
    },
    download(){
      this.$http({
        headers: {
          'Content-Type': 'application/json'
        },
        url: 'upload?method=downloadExcel',
        responseType: 'blob',
        method: 'get'
      }).then(res => {
        console.log(res);
        if(!res) return
        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' }) // 构造一个blob对象来处理数据，并设置文件类型
        
        if (window.navigator.msSaveOrOpenBlob) { //兼容IE10
            navigator.msSaveBlob(blob, this.filename)
        } else {
            const href = URL.createObjectURL(blob) //创建新的URL表示指定的blob对象
            const a = document.createElement('a') //创建a标签
            a.style.display = 'none'
            a.href = href // 指定下载链接
            a.download = this.filename //指定下载文件名
            a.click() //触发下载
            URL.revokeObjectURL(a.href) //释放URL对象
        }
        // 这里也可以不创建a链接，直接window.open(href)也能下载
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
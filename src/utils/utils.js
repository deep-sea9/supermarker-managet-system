// 设置异步延迟间隔
export function delay(interval = 0) {
  return new Promise(resolve => {
    let timer = setTimeout(_ => {
      clearTimeout(timer)
      resolve()
    }, interval)
  })
}

// 按照二进制读取文件
export function readFile(file) {
  return new Promise(resolve => {
    let reader = new FileReader()
    reader.readAsBinaryString(file)
    reader.onload = e => {
      resolve(e.target.result)
    }
  })
}

// 字段对应表
export let character = {
  goodsId: {
    text: '商品编号',
    type: 'string'
  },
  goodsName: {
    text: '商品名称',
    type: 'string'
  },
  spec: {
    text: '规格型号',
    type: 'string'
  },
  measurement: {
    text: '计量单位',
    type: 'string'
  },
  price: {
    text: '零售价',
    type: 'string'
  },
  cateId: {
    text: '分类编号',
    type: 'number'
  },
  status: {
    text: '状态',
    type: 'string'
  },
  count: {
    text: '库存数量',
    type: 'number'
  }
}

// 时间字符串格式化
export function formatTime(str, tpl) {
  let arr = str.match(/\d+/g).map(item => {
    return item.length < 2 ? '0' + item : item
  })
  tpl = tpl || '{0}年{1}月{2}日 {3}时{4}分{5}秒'
  return tpl.replace(/\{(\d+)\}/g, (_, group) => {
    return arr[group] || '00'
  })
}

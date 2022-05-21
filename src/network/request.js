import axios from "axios";

export function request(config) {
  
    //1.创建axios实例
    const instance = axios.create({
        baseURL: 'http://localhost:8000/sys_market',
        timeout: 5000
    })
    
    //发送真正的网络请求
    return instance(config)
    
}
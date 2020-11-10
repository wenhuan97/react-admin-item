// 专门发送ajax异步请求的函数模块
// 封装axios 库
// 函数返回值是 promise对象
/*
  优化：统一处理数据异常
  1.在外层包一个 自己创建的promise对象 
  2.在请求出错时 不调用reject方法 还是弹出提示框包含错误内容
*/
import axios from 'axios'
import { message } from 'antd'




export default function ajax(url, data = {}, type = "GET") {

    // 统一处理数据异常
    return new Promise((reslove, reject) => {
        let promise
        if (type === "GET") {//发送get请求
            promise = axios.get(url, {//配置对象
                params: data
            })
        } else { //发送post
            promise = axios.post(url, data)
        }
        // 如果成功了 调用resolve（value)
        promise.then(response => {
            reslove(response.data)
            //    如果失败了 不调用 reject 要统一错误信息 提示错误
        }).catch(error => {
            message.error('请求出现了错误：' + error.message)
        })
    })
}

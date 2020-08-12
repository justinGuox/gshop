// ajax请求函数模块
// 函数的返回值是promise对象
import axios from 'axios'
axios.defaults.withCredentials = true
const baseUrl = 'http://localhost:4000'
export default function ajax2 (url, data = {}, type = 'GET') {
  return new Promise(function (resolve, reject) {
    // 执行异步ajax请求
    let promise
    url = baseUrl + url
    if (type === 'GET') {
      // 发送GET请求
      // 拼请求参数串
      // data: {username: tom, password: 123}
      // paramStr: username=tom&password=123
      let paramStr = ''
      Object.keys(data).forEach((key) => {
        paramStr += key + '=' + data[key] + '&'
      })
      if (paramStr) {
        paramStr = paramStr.substring(0, paramStr.length - 1)
      }
      // 使用axios发get请求
      promise = axios.get(url + '?' + paramStr)
    } else {
      promise = axios.post(url, data)
    }
    promise.then(function (response) {
      resolve(response.data)
    })
      .catch(function (error) {
        reject(error)
      })
  })
}

/*
const response = await ajax()
const result = response.data
====>>> 优化方法
const result = await ajax()
 */

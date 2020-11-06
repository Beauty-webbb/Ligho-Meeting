import axios from 'axios'; // 引入axios
import qs from 'qs'; // 引入qs
import APIUrl from './api.url'; // 引入api.url.js
import store from '../store'
import router from '../router'
import {
  Message
} from 'element-ui'

// axios 默认配置  更多配置查看Axios中文文档
axios.defaults.timeout = 5000; // 超时默认值

if (process.env.NODE_ENV === 'development') {} else {
  axios.defaults.baseURL = APIUrl.baseURL; // 默认baseURL
}
// axios.defaults.responseType  = 'json'         // 默认数据响应类型
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.withCredentials = false; // 表示跨域请求时是否需要使用凭证

// http request 拦截器
// 在ajax发送之前拦截 比如对所有请求统一添加header token
axios.interceptors.request.use(
  config => {
    const token = window.localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response 拦截器
// ajax请求回调之前拦截 对请求返回的信息做统一处理 比如error为401无权限则跳转到登陆界面
axios.interceptors.response.use(
  response => {
    switch (response.data.status) {
      // 判断token失效
      case 4004:
        response.data.msg = '未授权，请登录';
        Message({
          message: '身份验证失败，请重新登录',
          type: 'error'
        })
        localStorage.removeItem('token')
        router.replace('/');
        break;
      default:
        break;
    }
    return response;
  },
  error => {
    console.log(error);
    return Promise.reject(error);

  }
);

export default axios; // 这句千万不能漏下！！！

/**
 * post 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(data))
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err);
        console.log(err.request)
        // 判断请求超时
        if (err.request.readyState == 4 && status == 0) {
          Message({
            message: '请求超时，请重试',
            type: 'error'
          })
        }

      });
  });
}
/**
 * get 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function get(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
        params: data
      })
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err);
      });
  });
}

/**
 * 其他delete等的封装类似
 * 可以查看中文文档 自行封装
 */

import axios from 'axios'
import router from '@/router'
import {
  MessageBox,
  Message,
  Loading
} from 'element-ui'
import store from '@/store'
import qs from 'qs'
import {
  getToken
} from '@/utils/auth'
let $alert = MessageBox.alert;
var loading = null;
window._axiosPromiseArr = [];
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 50000
})
service.interceptors.request.use(
  config => {
    if (config.dataType == 'FormData') {
      config.data = qs.stringify(config.data);
      config.headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //配置请求头
      }
    } else {
      config.data = JSON.stringify(config.data);
      config.headers = {
        'Content-Type': 'application/json' //配置请求头
      }
    }
    if (store.getters.token) {
      config.headers['token'] = getToken()
    }
    loading = Loading.service({
      lock: true,
      text: '请稍后',
      spinner: 'el-icon-loading',
      background: 'rgba(255, 255, 255, 0.7)'
    })
    // 将请求的接口添加到数组中
    config.cancelToken = new axios.CancelToken(cancel => {
      window._axiosPromiseArr.push({
        cancel,
        id: config.id
      });
    });
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
service.interceptors.response.use(response => {
    loading.close();
    if (response.data.code != 200) {
      $alert(response.data.code + '：' + response.data.message, '提示');
      //token失效
      if (response.data.code == 99920) {
        store.commit('user/SET_INIT_INFO');
        try {
          window._axiosPromiseArr.forEach((ele, index) => {
            ele.cancel(); // 路由跳转之前，清空（终止）上一个页面正在请求的内容
            delete window._axiosPromiseArr[index];
          });
        } catch (e) {
          console.log(e)
        }
        router.push(`/login`)
      }
      return Promise.reject(response.data);
    } else {
      return response.data.data
    }
  },
  error => {
    loading.close();
    if(error != 'Cancel'){
      $alert(error, '提示')
    }
    return Promise.reject(error)
  }
)
export default service

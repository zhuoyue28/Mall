import axios from "axios";
import { message } from 'ant-design-vue';

// 创建axios 实例
const request = axios.create({
    baseURL: 'zyapi/' + 'admin',
    timeout: 10000,
    headers: { 'X-Custom-Header': 'foobar', 'Accept-Language': 'zh' }
});

// 添加请求拦截器
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    config.headers['token'] = localStorage.getItem('mallToken')
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


// 添加响应拦截器
request.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    const data = response.data

    if (data.code == 202) {
        message.error(data.message);
    }
    if (data.code == 203) {
        message.error(data.message);
    }
    if (data.code == 204) {
        // ElMessage.error(t('请登录'))
        // messageApi.info('请登录');
        // message.info('请先登录');
        // navigate('/login')
        // router.push('/login')
    }
    return data;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    message.error('超时或其他错误,请检查网络或尝试刷新,错误信息：' + error.message);
    return Promise.reject(error);
});



// 封装方法

export default request

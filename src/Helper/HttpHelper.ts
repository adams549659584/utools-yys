import axios, { AxiosRequestConfig } from 'axios';

export default class HttpHelper {
  constructor() {
    // 添加请求拦截器
    axios.interceptors.request.use(request => {
      // // 默认请求头
      // request.headers['X-Requested-With'] = 'XMLHttpRequest';
      // // 类似 jquery cache false
      // if ((request.method || '').toLowerCase() === 'get') {
      //   Object.assign(request.params, { _t: Date.now() });
      // }
      return request;
    });
    // 添加响应拦截器，响应拦截器会在then/catch处理之前执行
    axios.interceptors.response.use(
      response => {
        return Promise.resolve(response);
      },
      async err => {
        return Promise.reject(err);
      }
    );
  }

  /**
   * get 请求
   * @param url 请求链接
   * @param params 参数
   * @param config 配置
   */
  static async get<T>(url: string, params?: { [key: string]: any }, config?: AxiosRequestConfig) {
    const res = await axios.get(url, { params, ...config });
    return res.data as T;
  }

  /**
   * post 请求
   * @param url 请求链接
   * @param data 参数
   * @param config 配置
   */
  static async post<T>(url: string, data?: { [key: string]: any }, config?: AxiosRequestConfig) {
    const res = await axios.post(url, data, config);
    return res.data as T;
  }
}

//公共的axios实例

import axios from 'axios';
import {Toast} from "vant";
import router from '../router'

export function request(config){
    const instance = axios.create({
      baseURL: 'https://api.shop.eduwork.cn',
      timeout: 5000,
    })

    //请求拦截
    instance.interceptors.request.use(
        config=>{
            //如果有接口需要认证, 统一设置
            const token = window.localStorage.getItem('token');
            if(token !== ' '){
                config.headers.Authorization = 'Bearer '+token;
            }
            //直接放行
            return config;
    },
        err=>{})

    //响应拦截
    instance.interceptors.response.use(
        res=>{
            //直接放行
            return res.data ? res.data : res;
        },
        err=>{
            //如果有接口需要授权,统一授权
            if(err.response.status === 401){

                Toast.fail('请先登录')
                setTimeout(()=>{router.push({path:'/login'})},500)
            }
            //如果状态码不是成功, 则处理
            Toast({
                message: err.response.data.errors[Object.keys(err.response.data.errors)[0]][0],
                position: 'bottom',
            });

        }
    )

    return instance(config)
}
import {request} from './request';

//添加购物车
export function addCart(data){
    return request({
        url:'/api/carts',
        method:'post',
        data,
    })
}

//删除购物车
export function deleteCart(id){
    return request({
        url:`/api/carts/${id}`,
        method:'delete',
    })
}

//修改购物车
export function modifyCart(id, data){
    return request({
        url:`/api/carts/${id}`,
        method:'put',
        data,
    })
}

//选择商品的状态, data为所有被选中商品的id
export function checkedCart(data){
    return request({
        url:'/api/carts/checked',
        method:'patch',
        data,
    })
}

//获取购物车列表，
export function getCart(data=''){
    return request({
        url:'/api/carts?'+data,
        method:'get',
    })
}

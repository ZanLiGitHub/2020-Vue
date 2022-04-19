import {request} from './request'

export function getCategoryData() {
    return request( {
        url:'./api/goods'
    })
}

export function getCategoryGoods(sortMethod='sales', category=0, page=1,) {
    return request( {
        url:'./api/goods?category_id='+category+'&page='+page+'&'+sortMethod+'=1',
    })
}
<template>
  <div class="goods-item" @click="itemClick(item.id)">
    <img v-lazy="item.cover_url" alt="">
    <div class="goods-info">
      <p>{{item.title}}</p>
      <span class="price"><small>$</small>{{ item.price }}</span>
      <span class="collect"><img src="../../../assets/images/collect.png" alt="">{{ item.collects_count }}</span>
    </div>
  </div>
</template>

<script>

import {useRouter} from "vue-router";

export default {
  name: "GoodsItem",
  props:{
    item:{
      type:Object,
      default(){return {}}
    }
  },
  setup () {
    //变量：路由器实例
    const router = useRouter();

    //方法：点击商品跳转到详情页面
    const itemClick = (id) => {
      router.push({path:'/detail', query:{id}})
    }

    return{
      itemClick,
    }
  }
}
</script>


<style scoped lang="less">
.goods-item {
  width: 46%;
  padding-bottom: 40px;
  position: relative;
  z-index: 1;

  img {
    width: 100%;
    border-radius: 5px;
  }

  .goods-info {
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    overflow: hidden;
    text-align: center;

    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 3px;
    }
  }

  .price {
    color: red;
    margin-right: 20px;
  }

  .collect {

    img{
      width: 15px;
      height: 15px;
      margin-right: 3px;
      margin-bottom: -2px ;
    }
  }
}
</style>
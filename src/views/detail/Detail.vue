<template>
  <div>
    <!--顶部标题栏-->
    <NavBar>
      <template v-slot:center>商品详情: {{ id }}</template>
    </NavBar>

    <!--商品图片-->
    <van-image
        width="100%"
        lazy-load
        :src="goods.cover_url"
    />

    <!--商品详情-->
    <van-card
        :num="goods.stock"
        :price="price"
        :desc="goods.description"
        :title="goods.title"
    >
      <template #tags>
        <van-tag plain type="danger">新书</van-tag>
        <van-tag plain type="danger">推荐</van-tag>
      </template>
      <template #footer>
        <van-button type="warning" @click="toAddCart">加入购物车</van-button>
        <van-button type="danger" @click="goToCart">立即购买</van-button>
      </template>
    </van-card>

    <!--商品标签页-->
    <van-tabs v-model="activeTab">
      <van-tab title="概述">
        <div class="tabs-content" v-html="goods.details"></div>
      </van-tab>
      <van-tab title="评价">
        <van-list
            v-model="state.loading"
            :finished="state.finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
          <div class="van-cell" v-for="item in state.list" :key="item">
            <van-card
                :title="item.reply"
                :thumb="item.pics_url"
            >
              <template #tags>
                <van-tag plain type="danger">{{ item.user.name }}</van-tag>
              </template>
              <template v-slot:desc>
                <div class="item-desc">{{ item.content }}</div>
              </template>
              <template v-slot:price>
                <van-rate v-model="item.star" readonly/>
              </template>
              <template v-slot:num>
                {{ item.created_at }}
              </template>
            </van-card>
          </div>
        </van-list>
      </van-tab>
      <van-tab title="相关">
        <div class="content">
          <!--商品列表-->
          <GoodsList :goods="like_goods"></GoodsList>
        </div>
      </van-tab>
    </van-tabs>

  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import GoodsList from "@/components/cotnent/goods/GoodsList";
import BackTop from "@/components/common/backtop/BackTop"

import {useRoute, useRouter} from "vue-router";
import {ref, reactive, onMounted, toRefs} from "vue";
import {useStore} from 'vuex';

import {getDetail} from "@/network/detail";
import {addCart, getCart} from "@/network/cart"
import BetterScroll from 'better-scroll';

import {Toast} from 'vant'

export default {
  name: "Detail",
  components: {
    NavBar,
    GoodsList,
    BackTop,
  },
  setup() {
    //初始化betterScroll组件
    let betterScroll = reactive({});
    //变量：路由实例
    const route = useRoute()
    //变量：路由实例
    const router = useRouter()
    //变量：状态管理实例
    const store = useStore()
    //变量：商品id
    let id = ref(0);
    //变量：商品信息
    let item = reactive({
      goods: {
        comments: []
      },
      like_goods: [],
    })
    //变量：价格
    let price = ref(0)
    //变量：激活的标签页
    let activeTab = ref(0)
    //变量：获取的评价列表
    const state = reactive({
      list: [],
      loading: false,
      finished: false,
    });

    //方法：加载评价列表
    const onLoad = () => {
      state.list = item.goods.comments
      state.loading = false;
      state.finished = true;
    }
    //方法：加入购物车
    const toAddCart = () => {
      addCart({goods_id:id.value, num:1}).then(res => {
        if(res.status === 201 || res.status === 204){
          //更新购物车
          store.dispatch('updateCart')
          Toast({
            message:'添加成功',
            position:'bottom',
          })

        }
      })
    }
    //方法：立即购买
    const goToCart = () => {
      addCart({goods_id:id.value, num:1}).then(res => {
        if(res.status === 201 || res.status === 204){
          //更新购物车
          store.dispatch('updateCart')
          router.push({
            path:'/cart'
          })
        }
      })
    }
    //生命周期：挂载后
    onMounted(() => {
      id.value = route.query.id

      getDetail(id.value).then(res => {
        item.goods = res.goods;
        item.like_goods = res.like_goods;
        price.value = res.goods.price.toFixed(2)
      })

      //创建betterScroll实例,获取外层包装
      betterScroll = new BetterScroll(document.querySelector('.content'), {
        probeType: 3, //惯性
        click: true, //允许点击
        pullUpLoad: true //上拉加载更多. 默认false
      })

      //加载完数据后刷新滚动区域
      betterScroll && betterScroll.refresh()

    })

    return {
      id,
      price,
      ...toRefs(item),
      activeTab,
      state,

      onLoad,
      toAddCart,
      goToCart
    }
  }
}
</script>

<style scoped lang="less">

//商品图片样式
.van-image {
  margin-top: 50px !important;
}

//商品详情样式
.van-card {
  text-align: left;
  font-size: 16px;
  width: 100%;

  .item-desc {
    height: 40px;
    line-height: 40px;
    margin-bottom: -5px;
  }
}

//商品概述标签页样式
.tabs-content {
  padding: 10px;

  //概述标签页里的图片
  img {
    max-width: 100%;
    height: auto;
  }
}

.content {
  padding-bottom: 60px;
}


</style>
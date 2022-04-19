<template>
  <div id="home">

    <!--页面标题-->
    <NavBar>
      <template v-slot:left>&nbsp</template>
      <template v-slot:center>图书商城</template>
    </NavBar>

    <!--固定在顶部的控制条-->
    <!--v-show="isTabFixed"-->
    <!--<TabControl @tabClick="tabClick" :titles="['畅销','新书','精选']"></TabControl>-->

    <!--滚动区-->
    <div class="wrapper">
      <div class="content">
        <!--轮播图-->
        <div class="banners">
          <Swiper :banners="banners"></Swiper>
        </div>

        <!--推荐书籍-->
        <Recommend :recommends="recommends"></Recommend>

        <!--滚动的控制条-->
        <TabControl @tabClick="tabClick" :titles="['畅销','新书','精选']"></TabControl>

        <!--商品列表-->
        <GoodsList :goods="showGoods"></GoodsList>
      </div>
    </div>

    <!--返回顶部-->
    <BackTop @back-top="backTop" v-show="isTabFixed"></BackTop>
  </div>
</template>
<!------------------------------------------------------------------------------------------------>
<script>
import NavBar from "@/components/common/navbar/NavBar";
import Recommend from "@/views/home/child/Recommend";
import TabControl from "@/components/cotnent/tabcontrol/TabControl";
import GoodsList from "@/components/cotnent/goods/GoodsList";
import BackTop from "@/components/common/backtop/BackTop"
import Swiper from "./child/Swiper"
import BetterScroll from 'better-scroll'

import {onMounted, ref, reactive, computed, watchEffect, nextTick} from "vue";
import {useStore} from 'vuex'

import {getHomeAllData, getHomeGoods} from "@/network/home";

export default {
  name: "Home",
  components: {
    NavBar,
    Recommend,
    TabControl,
    GoodsList,
    BackTop,
    Swiper,
  },
  setup() {
    //变量：状态管理实例
    const store = useStore();

    //初始化betterScroll组件
    let betterScroll = reactive({})

    //显示固定的导航栏和返回顶部按钮
    let isTabFixed = ref(false)

    const recommends = ref([])

    let currentType = ref('sales');

    const tabClick = (index)=> {
      let types = ['sales', 'new', 'recommend']
      currentType.value = types[index]
      nextTick(()=>{
        betterScroll && betterScroll.refresh()
      })
    }

    //商品列表数据模型(畅销/新书/精选)
    const goods = reactive({
      sales:{page:0, list:[]},
      new:{page:0, list:[]},
      recommend:{page:0, list:[]},
    })

    const showGoods = computed(()=>{
      return goods[currentType.value].list
    })

    //事件方法：返回顶部
    const backTop = () => {
      //使用BetterScroll内置方法scrollTo(x坐标，y坐标，执行毫秒)
      betterScroll.scrollTo(0,0, 500)
    }

    //声明变量：轮播图数据
    let banners = ref([]);

    //生命周期：挂载后
    onMounted(() => {

      getHomeAllData().then(res => {
        recommends.value = res.goods.data;
        banners.value = res.slides;
      })

      getHomeGoods('sales').then(res=>{
        goods.sales.list = res.goods.data;
      })

      getHomeGoods('new').then(res=>{
        goods.new.list = res.goods.data;
      })

      getHomeGoods('recommend').then(res=>{
        goods.recommend.list = res.goods.data;
      })

      //创建betterScroll实例,获取外层包装
      betterScroll = new BetterScroll(document.querySelector('.wrapper'), {
        probeType: 3, //惯性
        click: true, //允许点击
        pullUpLoad: true //上拉加载更多. 默认false
      })

      //上拉加载数据, 触发pullingUp
      betterScroll.on('pullingUp', ()=>{
        const page = goods[currentType.value].page + 1;
        getHomeGoods(currentType.value, page).then(res=>{
          goods[currentType.value].list.push(...res.goods.data);
          goods[currentType.value].page += 1;
        })
        //完成上拉,等数据请求完成,将新数据展示
        betterScroll.finishPullUp();
        //重新计算高度
        betterScroll.refresh()
      })

      //加载完数据后刷新滚动区域
      betterScroll && betterScroll.refresh()
    })

    return {
      recommends,
      tabClick,
      goods,
      showGoods,
      isTabFixed,
      backTop,
      banners,
    }
  }
}
</script>
<!------------------------------------------------------------------------------------------------>
<style scoped lang="less">
#home{
  position: relative;
  height: 100vh;
}

.banners {
  img {
    width: 100%;
    height: auto;
    //margin-top: 45px;
  }
}

.wrapper{
  position: absolute;
  top: 45px;
  bottom: 50px;
  left: 0;
  right: 0;
  overflow: hidden;

  .content{

  }
}
</style>
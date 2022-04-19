<template>
  <div>
    <NavBar>
      <template v-slot:center>商品分类</template>
    </NavBar>

    <div id="mainBox">
      <!--排序选项-->
      <div class="sortTab">
        <van-tabs v-model:active="activeSortTab" @click="tabClick">
          <van-tab title="销量排序"></van-tab>
          <van-tab title="价格排序"></van-tab>
          <van-tab title="评论排序"></van-tab>
        </van-tabs>
      </div>

      <!--左部菜单-->
      <div class="leftMenu">
        <!--下拉菜单-->
        <van-sidebar id="sidebar" v-model="activeSideBar">
          <van-collapse v-model="activeCollapse" accordion>
            <van-collapse-item v-for="(item, index) in categories" :key="item.id" :title="item.name" :name="item.naem">

              <van-sidebar-item v-for="subItem in item.children" :key="subItem.id" :title="subItem.name"
                                @click="getGoods(subItem.id)"/>

            </van-collapse-item>
          </van-collapse>
        </van-sidebar>
        <!--侧边菜单-->

      </div>

      <!--商品列表-->
      <div class="goodList">
        <div class="content">
          <van-card
              v-for="item in showGoods"
              :key="item.id"
              :num='item.comments_count'
              :price='item.price'
              :tag="item.comments_count >= 0 ? '流行' : ''"
              :desc="item.update_at"
              :title="item.title"
              :thumb="item.cover_url"
              :lazy-load="true"
              @click="itemClick(item.id)"
          />
        </div>
      </div>
    </div>

    <BackTop @back-top="backTop" v-show="isScrolled"></BackTop>

  </div>
</template>
<!------------------------------------------------------------------------------------------------>
<script>
import {ref, reactive, onMounted, computed} from 'vue'; //引入vue方法
import {useRouter} from 'vue-router';
import NavBar from "@/components/common/navbar/NavBar"; //引入组件：顶部标题条
import BackTop from "@/components/common/backtop/BackTop"
import {getCategoryData, getCategoryGoods} from "@/network/category";
import BetterScroll from "better-scroll";
import {getHomeGoods} from "@/network/home"; //引入网络请求方法

export default {
  name: "Category",
  components: {
    NavBar,
    BackTop,
  },
  setup() {
    //变量：路由器实例
    const router = useRouter();
    //变量：侧边栏激活的标签
    let activeSideBar = ref(0);
    //变量：侧边栏下拉菜单
    let activeCollapse = ref(0);
    //变量：排序栏激活标签
    let activeSortTab = ref(0);
    //变量：接口请求后得到的categories数据
    let categories = ref([]);
    //变量：当前的排序方法
    let currentSortMethod = ref('sales');
    //变量：当前的分类
    let currentCategory = ref(0)
    //变量：商品数据模型
    let goods = reactive({
      sales: {page: 1, list: []},
      price: {page: 1, list: []},
      comments_count: {page: 1, list: []}
    })
    //变量：商品显示数据
    let showGoods = computed(() => {
      return goods[currentSortMethod.value].list //根据排序方法字符串从goods数据模型中获得数据
    })
    //变量：BetterScroll对象
    let betterScroll = reactive({})
    //变量：判断是否已经滚动过
    let isScrolled = ref(false)


    //方法；点击排序选项卡
    const tabClick = (index) => { //默认参数是点击的选项卡的序号
      let sortMethods = ['sales', 'price', 'comments_count'] //排序方法
      currentSortMethod.value = sortMethods[index];//根据点击事件返回的index获得代表排序方法的字符串
      getCategoryGoods(currentSortMethod.value, currentCategory.value).then(res => {
        goods[currentSortMethod.value].list = res.goods.data
        //加载完数据后刷新滚动区域
        betterScroll && betterScroll.refresh()
      })
    }
    //方法：点击分类选项卡
    const getGoods = (id) => {
      currentCategory.value = id;
      getCategoryGoods(currentSortMethod.value, currentCategory.value).then(res => {
        goods[currentSortMethod.value].list = res.goods.data
        //加载完数据后刷新滚动区域
        betterScroll && betterScroll.refresh()
      })
    }
    //方法：从接口获取数据并初始化数据
    const init = () => {
      getCategoryGoods('sales', currentCategory.value).then(res => {
        goods.sales.list = res.goods.data
      })

      getCategoryGoods('price', currentCategory.value).then(res => {
        goods.price.list = res.goods.data
      })

      getCategoryGoods('comments_count', currentCategory.value).then(res => {
        goods.comments_count.list = res.goods.data
      })
    }
    //方法：点击回到顶部按钮
    const backTop = () => {
      //使用BetterScroll内置方法scrollTo(x坐标，y坐标，执行毫秒)
      betterScroll.scrollTo(0,0, 500)
    }
    //方法：点击商品跳转到详情页面
    const itemClick = (id) => {
      router.push({path:'/detail', query:{id}})
    }

    //声明周期：挂载后
    onMounted(() => {
      //挂载时从接口获取数据
      getCategoryData().then(res => {
        categories.value = res.categories;
      });

      //挂载时初始化商品列表
      init();

      //创建betterScroll实例,获取外层包装
      betterScroll = new BetterScroll(document.querySelector('.goodList'), {
        probeType: 3, //惯性
        click: true, //允许点击
        pullUpLoad: true //上拉加载更多. 默认false
      })

      //上拉加载数据, 触发pullingUp
      betterScroll.on('pullingUp', () => {

        //根据页数获取更多数据,并加入到原有的list里
        getCategoryGoods(currentSortMethod.value, currentCategory.value, goods[currentSortMethod.value].page + 1).then(res => {
          goods[currentSortMethod.value].list.push(...res.goods.data)
          //加载完数据后刷新滚动区域
          betterScroll && betterScroll.refresh()
        })

        //当前页加一
        goods[currentSortMethod.value].page += 1

        //完成上拉,等数据请求完成,将新数据展示
        betterScroll.finishPullUp();
      })

      //滚动事件，触发scroll
      betterScroll.on('scroll', (position)=>{
        isScrolled.value = (-position.y) > 450
      })


    })

    return {
      activeSideBar,
      activeCollapse,
      activeSortTab,
      categories,
      currentSortMethod,
      currentCategory,
      goods,
      showGoods,
      betterScroll,
      isScrolled,

      tabClick,
      getGoods,
      init,
      backTop,
      itemClick,
    };
  }
}
</script>

<!------------------------------------------------------------------------------------------------>

<style scoped lang="less">

#mainBox {
  margin-top: 45px;
  background: grey;
  display: flex;

  .sortTab {
    height: 50px;
    z-index: 99;
    position: fixed;
    top: 45px;
    right: 0;
    left: 130px;
  }
;

  .leftMenu {

    #sidebar {
      width: 130px;
      position: fixed;
      top: 95px;
      left: 0;
    }
  }
;

  .goodList {
    flex: 1;
    position: absolute;
    top: 95px;
    left: 130px;
    right: 0;
    height: 100vh;
    padding: 10px;
    text-align: left !important;
    z-index: 1 !important;

    .content{
      z-index: 1 !important;
    }

    .van-card__thumb {
      width: 68px;
    }
  }
;
}

</style>
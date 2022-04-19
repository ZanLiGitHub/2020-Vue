<template>
  <div class="order-box">
    <NavBar class="nav-bar">
      <template v-slot:left><i class="iconfont icon-left" @click="$router.push('cart')"></i></template>
      <template v-slot:center>订单列表</template>
    </NavBar>
    <van-tabs v-model:active="active" @click="onChangeTab">
      <van-tab title="全部"></van-tab>
      <van-tab title="待付款"></van-tab>
      <van-tab title="已支付"></van-tab>
      <van-tab title="发货"></van-tab>
      <van-tab title="交易完成"></van-tab>
      <van-tab title="过期"></van-tab>
    </van-tabs>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="order-list-refresh">
      <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          offset="10"
      >
        <div @click="goTo(item.id)" class="order-item-box" v-for="(item, index) in list" :key="index">
          <div class="order-item-header">
            <span style="line-height:30px">订单号: {{item.order_no}} <br> 创建时间: {{item.created_at}}</span>
          </div>
          <van-card v-for="sub in item.orderDetails.data" :key="sub.id" :num="sub.num" :price="sub.goods.price" desc="全场包邮" :title="sub.goods.title" :thumb="sub.goods.cover_url"></van-card>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import {toRefs, ref, reactive, onMounted, computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import {Toast} from "vant";
import {getOrderList} from "@/network/order";

export default {
  name: "Order",
  components:{
    NavBar,
  },
  setup(){
    const router = useRouter()

    const state = reactive({
      active: 1,
      refreshing:false,
      loading:false,
      finished:false,
      list:[],
      page:1,
      totalPage:0,
      status:0,
    })


    const onRefresh = () => {
      state.page= 1;
      state.refreshing = true;
      // 清空列表数据
      state.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      state.loading = true;
      onLoad();
    };
    const onLoad = () => {
      if(state.refreshing){
        state.list = []
        state.refreshing = false
      }
      loadData()
      state.loading = false
    };
    const loadData = () => {
      getOrderList({page:state.page,status:state.status,include:'orderDetails.goods'}).then((res)=>{
        state.totalPage = res.meta.pagination.totalPage
        if(state.page > state.totalPage){
          state.finished = true
        }else{
          state.page += 1
          state.list  = state.list.concat(res.data)
        }

      })
    };
    const onChangeTab = (name) => {
      state.status = name
      onRefresh()
    }
    const goTo = (id) => {
      router.push({path:'/orderdetail', query:{id}})
    }

    onMounted(()=>{
      onRefresh()
    })

    return {
      ...toRefs(state),
      onRefresh,
      onLoad,
      loadData,
      onChangeTab,
      goTo,
    }
  }
}
</script>

<style scoped lang="less">
.van-tabs{
  margin-top: 50px;
}

</style>
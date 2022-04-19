<template>
  <div class="order-detail-box">
    <NavBar class="nav-bar">
      <template v-slot:left><i class="iconfont icon-left" @click="$router.push('order')"></i></template>
      <template v-slot:center>订单详情</template>
    </NavBar>

    <!--订单状态-->
    <div class="order-status">
      <div class="status-item">
        <label>订单状态:</label>
        <span>{{statusString}}</span>
      </div>
      <div class="status-item">
        <label>订单编号:</label>
        <span>{{detail.order_no}}</span>
      </div>
      <div class="status-item">
        <label>下单时间:</label>
        <span>{{detail.created_at}}</span>
      </div>

      <van-button v-if="detail.status === 1" @click="showPayFn" style="margin-bottom: 10px" color="#1baeae" block>去支付</van-button>
      <van-button v-if="detail.status === 3" @click="handleConfirmOrder" block>确认订单</van-button>
    </div>
    <div class="order-price">
      <div class="price-item">
        <label>商品金额:</label>
        <span>$ {{total}}</span>
      </div>
      <div class="price-item">
        <label>配送方式:</label>
        <span>普通快递</span>
      </div>
    </div>

    <van-card v-for="item in detail.orderDetails.data" :key="item.id" :num="item.num" :price="item.price" desc="全场包邮"
              :title="item.goods.title" :thumb="item.goods.cover_url"/>

    <div style="width: 100%; height: 50px"></div>

    <van-popup v-model:show="showPay" position="bottom" :style="{height:'27%', overflow:'hidden'}">
      <div :style="{width:'90%', margin:'0 auto', padding:'10px 0'}">
        <van-grid :border="false" :column-num="2">
          <van-grid-item text="支付宝">
            支付宝二维码<br>
            <van-image width="150" height="150" :src="aliyun"></van-image>
          </van-grid-item>
          <van-grid-item text="微信支付">
            微信二维码<br>
            <van-image width="150" height="150" :src="wechat"></van-image>
          </van-grid-item>
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {toRefs, ref, reactive, onMounted, computed} from "vue";
import {useStore} from 'vuex'
import {useRoute, useRouter} from 'vue-router'

import {getOrderDetail, confirmOrder, payOrder, payOrderStatus, viewExpress} from "@/network/order";

import NavBar from "@/components/common/navbar/NavBar";

import {Toast} from "vant";

export default {
  name: "OrderDetail",
  components: {
    NavBar,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      orderNo: '', //订单的ID
      detail: {
        orderDetails: {
          data: []
        }
      },
      showPay: false,
      aliyun:'',
      wechat:'',
    })
    const statusString = computed(()=> {
      let status = ['','已下单','已支付','等待发货','等待收货','已过期',]
      return status[state.detail.status]

    })
    const total = computed(()=>{
      let sum = 0;
      state.detail.orderDetails.data.forEach(item =>{
        sum += parseInt(item.num) * parseFloat(item.price)
      })
      sum = sum.toFixed(2)

      return sum

    })

    //方法:初始化
    const init = () => {
      //解构复制id
      state.orderNo = route.query.id

      getOrderDetail(state.orderNo).then(res => {
        state.detail = res;
        console.log(state.detail);
      })
    }
    //方法:显示支付
    const showPayFn = ()=> {
      state.showPay = true
      payOrder(state.orderNo, {type:'aliyun'}).then(res => {
        state.aliyun = res.qr_code_url;
        state.wechat = res.qr_code_url;
      })
      setTimeout(()=>{
        state.showPay = true
        Toast.success({message:'支付成功', duration:1000, onClose:()=>{
            router.push({path:'/order'})
        }})
      },1000)
    }
    //方法:确认订单
    const handleConfirmOrder = ()=>{
      Dialog.confirm({message:'是否确认收获'}).then(()=>{
        confirmOrder(state.orderNo).then((res)=>{
          Toast('确认成功')
          init()
        })
      })
    }

    onMounted(() => {
      init();
    })

    return {
      ...toRefs(state),
      statusString,
      total,
      showPayFn,
      handleConfirmOrder,
      close,
    }
  }
}
</script>

<style scoped lang="less">
.order-detail-box {
  text-align: left;
  height: 900px;
  background: #f7f7f7;

  .order-status {
    background: white;
    margin: 50px 0 20px 0;
    padding: 15px;

    .status-item{
      margin-bottom: 8px;
      label{
        color: rgba(0,0,0,.5);
        margin-right: 5px;
      }
    }
  }

  .order-price {
    background: white;
    height: 90px;
    margin-bottom: 20px;
    padding: 15px;
    .price-item{
      margin-bottom: 8px;
      label{
        color: rgba(0,0,0,.5);
        margin-right: 5px;
      }
    }

  }

  .van-card {
    background: white;
    margin-bottom: 20px;
    padding: 10px;
    font-size: 15px;
  }
}

</style>
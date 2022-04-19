<template>
<div class="create-order">
  <NavBar class="nav-bar">
    <template v-slot:left><i class="iconfont icon-left" @click="$router.push('cart')"></i></template>
    <template v-slot:center>订单预览</template>
  </NavBar>

  <!--收货地址-->
  <div class="address-wrap">
    <div class="name" >
      <span>{{address.name + " "}}</span>
      <span>{{address.phone + " "}}</span>
    </div>
    <div class="address">
      {{address.province}} {{address.city}} {{address.county}} {{address.address}}
    </div>
    <van-icon class="arrow" name="arrow" @click="goTo"/>
  </div>

  <!--商品信息-->
  <div class="good">
    <div class="good-item" v-for="(item, index) in cartList" :key="index">
      <div class="good-img"><img v-lazy="item.goods.cover_url" alt=""></div>
      <div class="good-desc">
        <div class="good-title">
          <span>{{item.goods.title}}</span>
          <span>x{{item.num}}</span>
        </div>
        <div class="good-btn">
          <div class="price">${{item.goods.price.toFixed(2)}}</div>
        </div>
      </div>
    </div>
  </div>

  <!--提交订单-->
  <van-submit-bar class="submit-all" :price='total*100' button-text="生成订单" @submit="handleCreateOrder">商品金额</van-submit-bar>

  <!--弹出信息-->
  <van-popup closeable :close-on-click-overlay="false" v-model:show="showPay" position="bottom" :style="{height:'30%'}" @close="close">
    <van-grid>
      <van-grid-item>
        支付宝二维码<br>
        <van-image width="150" height="150" :src="aliyun" />
      </van-grid-item>
      <van-grid-item>
        微信二维码<br>
        <van-image width="150" height="150" :src="wechat" />
      </van-grid-item>
    </van-grid>
  </van-popup>
</div>
</template>

<script>
import {ref, reactive, toRefs, onMounted, computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex"

import {getOrderPreview, createOrder, payOrder, payOrderStatus} from '@/network/order'

import NavBar from "@/components/common/navbar/NavBar";

import {Toast} from "vant"

export default {
  name: "CreatOrder",
  components:{
    NavBar,
  },
  setup(){
    //变量:路由实例
    const route = useRoute();
    const router = useRouter();
    //变量:状态管理
    const store = useStore();
    const state = reactive({
      cartList: [],
      address: {},
      showPay: false,
      orderNo: '',
      aliyun:'',
      wechat:''
    })
    //变量:总价
    const total = computed(()=>{
      let sum = 0;
      state.cartList.forEach(item => {
        sum += parseInt(item.num) * parseFloat(item.goods.price)
      })
      return sum
    })

    //方法:前往地址列表
    const goTo = ()=> {
      router.push({path:'/address'})
    }
    //方法:创建订单
    const handleCreateOrder = ()=> {
      const params = {
        address_id: state.address.id
      }
      //更新购物车数量
      createOrder(params).then(res => {
        store.dispatch('updateCart')
        //显示弹出层
        state.showPay = true
        //获取订单id
        state.orderNo = res.id;
        //支付订单
        payOrder(state.orderNo, {type:"aliyun"}).then(res => {
          state.aliyun = res.qr_code_url;
          state.wechat = res.qr_code_url
        })
        //轮询查看支付状态
        setTimeout(()=>{
          Toast.success({message:'支付成功', duration:900})
          router.push({path:'/orderdetail', query:{id:state.orderNo}})
        },2000)
        /*
        const timer = setInterval(()=>{
          payOrderStatus(state.orderNo).then(res => {

          })
        },2000)*/
      })
    }
    //方法:关闭
    const close = ()=> {
      router.push({path:'/orderdetail', query:{id:state.orderNo}})
    }
    //方法:初始化
    const init = ()=> {
      getOrderPreview().then(res => {
        let address = res.address.filter(n=>n.is_default === 1)
        if(address.length === 0){
          state.address = {
            address:'还没有默认地址,请选择或添加默认地址'
          }
        }else{
          state.address = address[0]
        }

        state.cartList = res.carts;
      })

    }

    //生命周期:挂载后
    onMounted(()=>{
      init();
    })

    return {
      ...toRefs(state),
      goTo,
      handleCreateOrder,
      close,
      total,
    }
  }
}
</script>

<style scoped lang="less">
.van-icon{
  display: inline !important;
}

.van-icon:before{
  display: inline !important;
}
.create-order{
  margin-top: 100px;
}

.van-submit-bar{
  height: 50px !important;
  bottom: 50px !important;
}

.address-wrap{

  margin-top: -50px;
  margin-bottom: 20px;
  padding: 10px;
  border-bottom: 1px solid var(--color-tint);
  text-align: start;
  line-height: 20px;
  position: relative;
  width: 100%;

  .name{
    margin-bottom: 5px;
  }
  .arrow{
    position: absolute;
    left: 93%;
    top:50%;
    transform: translate(0, -50%);

  }
}

.good-item{
  display: flex;
  img{
    width: 150px;
    margin: 10px;
  }
  .good-desc{
    width: 100%;
    position: relative;
    .good-title{
      position: absolute;
      top: 20px;
      left: 40px;
      font-size: 18px;
      span:first-of-type{
        margin-right: 60px;
      }
    }
    .good-btn{
      position: absolute;
      bottom: 30px;
      left: 50px;
      color: red;
      font-size: 18px;
    }
  }
}

</style>
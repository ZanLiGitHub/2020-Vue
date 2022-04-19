<template>
  <div>
    <NavBar>
      <template v-slot:center>购物车( <span style="color: red"> {{ $store.state.cartCount }} </span> )</template>
    </NavBar>
    <div class="empty" v-if="showEmpty">
      <img class="empty-cart" src="../../assets/images/empty-car.png" alt="空购物车">
      <div class="title">购物车是空的，先去逛逛吧</div>
      <van-button round color="#1baeae" type="primary" block @click="$router.push({path:'/home'})">前往首页</van-button>
    </div>
    <div v-else class="cart-box">
      <div class="cart-body">
        <van-checkbox-group ref="checkboxGroup" @change="groupChange" v-model="result">
          <van-swipe-cell :right-width="50"
                          v-for="(item, index) in list" :key="index"
          >
            <div class="good-item">
              <van-checkbox :name="item.id"/>
              <div class="good-img"><img :src="item.goods.cover_url" alt=""></div>
              <div class="good-desc">
                <div class="good-title">
                  <span>{{ item.goods.title }}</span>
                  <span>x{{ item.goods.stock }}</span>
                </div>
                <div class="good-btn">
                  <div class="price"><small>￥</small>{{ item.goods.price.toFixed(2) }}</div>
                  <van-stepper integer :min="1" :max="10" :model-value="item.num" :name="item.id" async-change
                               @change="onChange"/>
                </div>
              </div>
            </div>
            <template #right>
              <van-button
                  square
                  icon="delete"
                  type="danger"
                  class="delete-button"
                  @click="deleteGood(item, item.id)"
              />
            </template>
          </van-swipe-cell>
        </van-checkbox-group>
      </div>
      <van-submit-bar class="submit-all" :price="total * 100" button-text="结算" @submit="onSubmit">
        <van-checkbox v-model:checked="checkAll" @click="allCheck">全选</van-checkbox>
      </van-submit-bar>

    </div>
  </div>
</template>

<script>
import {ref, reactive, toRefs, onMounted, computed, onUpdated} from 'vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
import {Toast} from 'vant'

import {getCart, checkedCart, addCart, deleteCart, modifyCart} from "@/network/cart";

import NavBar from "@/components/common/navbar/NavBar";

export default {
  name: "Cart",
  components: {
    NavBar
  },
  setup() {
    //变量：浏览器实例
    const router = useRouter()
    //变量：状态管理实例
    const store = useStore()
    //变量：购物车列表数据
    const state = reactive({
      list: [],
      result: [],
      checkAll: true,
    })
    //变量: 是否显示空购物车
    let showEmpty = ref(true)

    //方法:初始化购物车页面
    const init = () => {
      if(window.localStorage.getItem('token') === ' '){
        showEmpty.value = true
      }else{
        getCart('include=goods').then(res => {
          if(res.data.length === 0){
            showEmpty.value = true
          }
          else{
            showEmpty.value = false
            state.list = res.data;
            state.result = res.data.filter((n) => n.is_checked === 1).map(item => item.id)
          }

        })
      }
    }
    //方法:异步改变购物车数量
    const onChange = (value, detail) => {
      console.log(detail.name);
      Toast({
        message: '添加成功',
        forbidClick: true,
        position: 'bottom',
      });

      modifyCart(detail.name, {num: value}).then(res => {
        state.list.forEach(item => {
          if (item.id === detail.name) {
            item.num = value;
          }
        })

        Toast.clear()

      })
    }
    //方法:复选框改变处理
    const groupChange = (result) => {
      //改变前端选中状态列表
      state.result = result
      //改变后端选中状态列表
      checkedCart({cart_ids: result})
      //改变全选状态
      result.length === state.list.length ? state.checkAll = true : state.checkAll = false
    }
    //方法:全选所有商品
    const allCheck = () => {
      if (!state.checkAll) {
        state.checkAll = true;
        state.result = state.list.map(item => item.id);
      } else {
        state.result = [];
        state.checkAll = false;
      }
    }
    //方法:删除商品
    const deleteGood = (item, id) => {
      state.list.splice(state.list.indexOf(item), 1);
      deleteCart(id).then(res => {

        getCart('include=goods').then(res => {
          state.list = res.data;
          state.result = res.data.filter((n) => n.is_checked === 1).map(item => item.id)
        })

        store.dispatch('updateCart') //改变vuex中的状态数量
      })
    }
    //方法:计算总价
    const total = computed(() => {
      let sum = 0;
      state.list.filter(item => state.result.includes(item.id)).forEach(item => {
        sum += parseFloat(item.goods.price) * parseInt(item.num)
      })
      return sum
    })
    //方法:创建订单
    const onSubmit = () => {
      //判断是否有选中商品
      if(state.result.length !== 0){
        router.push({
          path:'/createorder'
        })
      }
    }

    //生命周期:挂载后
    onMounted(() => {
      init()
    })

    return {
      //解构返回state
      ...toRefs(state),
      onChange,
      groupChange,
      allCheck,
      deleteGood,
      total,
      onSubmit,
      showEmpty,
    }
  }
}
</script>

<style scoped lang="less">
.cart-box {
  .cart-body {
    margin: 60px 0 100px 0;
    padding-left: 10px;
  }

  .good-item {
    display: flex;
  }

  .good-img {
    img {
      width: 100px;
      height: auto;
    }
  }

  .good-desc {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    padding: 20px;
  }

  .good-title {
    display: flex;
    justify-content: space-between;
  }

  .good-btn {
    display: flex;
    justify-content: space-between;
  }

  .price {
    font-size: 16px;
    color: red;
    line-height: 28px;
  }

  .van-icon-delete {
    font-size: 20px;
    margin-top: 4px;
  }

  .delete-button {
    width: 50px;
    height: 100%;
  }

  .submit-all {
    margin-bottom: 50px;

    .van-checkbox {
      margin-left: 0px;
    }

    .van-submit-bar__text {
      margin-right: 10px;
    }

    .van-submit-bar__button {
      background: red;
    }
  }

  .van-checkbox__icon--checked .van-icon {
    background-color: red;
    border-color: red;
  }

}

.empty {
  width: 50%;
  margin: 50px auto;
  text-align: center;
  margin-top: 200px;

  .empty-cart {
    width: 250px;
    margin-bottom: 20px;
  }

  .van-icon-smile-o {
    font-size: 50px;
  }

  .title {
    font-size: 16px;
    margin-bottom: 20px;
  }
}
</style>
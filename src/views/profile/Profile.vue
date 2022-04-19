<template>
 <div>
   <!--页面标题栏
   -->
   <NavBar>
     <template v-slot:center>个人中心</template>
   </NavBar>

   <!--用户信息与管理列表-->
   <div class="user-box">
     <!--用户信息-->
     <div class="user-info">
       <div class="info">
         <img src="../../assets/images/kuishou.jpg" alt="用户头像">
         <div class="user-desc">
           <span>{{user.name}}</span>
           <span>登录名: {{user.email}}</span>
           <span>标签: 这个人什么都没有写</span>
         </div>
       </div>
     </div>
     <!--管理列表-->
     <ul class="user-list">
       <li class="van-hairline--bottom" @click="goTo('/collect')">
         <span>我的收藏</span>
         <van-icon name="arrow" />
       </li>
       <li class="van-hairline--bottom" @click="goTo('/order')">
         <span>我的订单</span>
         <van-icon name="arrow" />
       </li>
       <li class="van-hairline--bottom" @click="goTo('/setting')">
         <span>账号管理</span>
         <van-icon name="arrow" />
       </li>
       <li class="van-hairline--bottom" @click="goTo('/address')">
         <span>地址管理</span>
         <van-icon name="arrow" />
       </li>
       <li class="van-hairline--bottom" @click="goTo('/about')">
         <span>关于我们</span>
         <van-icon name="arrow" />
       </li>
     </ul>
   </div>

   <!--退出登录按钮-->
   <div style="margin: 16px">
     <van-button round block color="#44BA80" @click="toLogout">
       退出登录
     </van-button>
   </div>
 </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import {ref, reactive, toRefs, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {useStore} from 'vuex'
import {logout, getUser} from '@/network/profile';
import {Toast} from 'vant'

export default {
  name: "Profile",
  components:{
    NavBar
  },
  setup() {
    //变量：路由实例
    const router = useRouter()
    //变量：状态管理实例
    const store = useStore()
    //变量: 数据
    const state = reactive({
      user:{}
    })

    //方法：退出登录
    const toLogout = () => {
      logout().then(res => {
        if(res.status === 204){
          Toast.success('退出成功');
          //清空token
          window.localStorage.setItem('token',' ')
          //清空购物车
          store.commit('addCart',{count:0})
          //设置vuex中登陆状态为假
          store.commit('setIsLogin',false);
          console.log('login: '+store.state.user.isLogin);
          //跳转
          setTimeout(()=>{router.push({path:'/home'})}, 500)
        }
      })
    }
    //方法: 跳转页面
    const goTo = (path, query) => {
      router.push({
        path,
        query: query || {}
      })
    }

    //生命周期:挂载后
    onMounted(()=>{
      getUser().then(res => {
        state.user = res
      })
    })

    return {
      toLogout,
      ...toRefs(state),
      goTo,
    }
  }
}
</script>

<style scoped lang="less">
  .user-box{
    margin: 50px 10px 10px;

    .user-info{
      .info{
        background: linear-gradient(to top right, var(--color-tint), lightgrey);
        margin: 5px;
        margin-top: 60px;
        border-radius: 10px;
        display: flex;

        img{
          width: 80px;
          height: 80px;
          margin: 20px 10px 20px 20px;
          border-radius: 10px;
        };
        .user-desc{
          color: rgba(255,255,255,0.82);
          text-align: start;
          margin-top: 20px;

          span{
            font-size: 15px;
            display: block;
            margin: 0 auto 10px 5px;

            &:first-of-type{
              font-size: 20px;
            }
          }
        };
      };
    };

    .user-list{
      margin: 40px 8px;

      li{
        height: 50px;
        line-height: 50px;
        display: flex;
        justify-content:space-between;
        align-items: center;
        color: rgba(0, 0, 0, .7);

      }
    }
  }
</style>
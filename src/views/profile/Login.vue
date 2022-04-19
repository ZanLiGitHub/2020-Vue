<template>
  <div>
    <!--顶部标题栏-->
    <NavBar>
      <template v-slot:center>用户登录</template>
    </NavBar>

    <!--登录页面-->
    <div id="registerForm">
      <!--登录页面LOGO-->
      <div id="imageWrapper">
        <van-image
            width="10rem"
            height="10rem"
            fit="contain"
            src="https://www.lmonkey.com/_nuxt/img/logo.ca1ae0c.png"
        />
      </div>
      <!--登录页面表格-->
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
              v-model="state.email"
              name="email"
              label="邮箱"
              placeholder="邮箱"
              :rules="[{ required: true, message: '请填写邮箱',  }]"
          />
          <van-field
              v-model="state.password"
              type="password"
              name="password"
              label="密码"
              placeholder="密码"
              :rules="[{ required: true, message: '请输入密码' }]"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit">
            登录
          </van-button>
        </div>
        <a href="/register">
        <div style="margin: 16px;">
          <van-button round block type="primary">
            没有帐号，前往注册
          </van-button>
        </div>
        </a>

      </van-form>
    </div>
  </div>


</template>

<script>
import {reactive} from 'vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'

import NavBar from "@/components/common/navbar/NavBar";

import {login} from '@/network/profile';
import {Toast} from "vant";

export default {
  name: "Login",
  components: {
    NavBar
  },
  setup() {
    //变量：用户输入的数据
    const state = reactive({
      email: '',
      password: '',
    });
    //变量：路由器实例
    const router = useRouter();
    //变量：状态管理实例
    const store = useStore();

    const onSubmit = (values) => {
      //验证数据
      login(values).then(res => {
        //如果成功，把token保存在本地window.localStorage setItem(key,value), getItem(key)
        window.localStorage.setItem('token',res.access_token);
        //在vuex中保存isLogin
        store.commit('setIsLogin', true)
        console.log('login: '+store.state.user.isLogin);
        //更新购物车
        store.dispatch('updateCart')
        //提示
        Toast.success('登录成功');

        //清空输入过的密码数据
        values.password = '';
        values.email = '';

        //回到要求登录前的页面
        setTimeout(() => {
          router.push({path:'/home'})
        }, 500)
      })
    };

    return {
      state,

      onSubmit,
    };
  },
}
</script>

<style scoped lang="less">

#registerForm {
  margin-top: 50px;

  #imageWrapper {
    padding-top: 50px;
    text-align: center;
  }
}
</style>
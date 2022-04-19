<template>
  <div>
    <!--顶部标题栏-->
    <NavBar>
      <template v-slot:center>用户注册</template>
    </NavBar>

    <!--注册页面-->
    <div id="registerForm">
      <!--注册页面LOGO-->
      <div id="imageWrapper">
        <van-image
            width="10rem"
            height="10rem"
            fit="contain"
            src="https://www.lmonkey.com/_nuxt/img/logo.ca1ae0c.png"
        />
      </div>
      <!--注册页面表格-->
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
              v-model="state.name"
              name="name"
              label="用户名"
              placeholder="用户名"
              :rules="[{ required: true, message: '请填写用户名',  }]"
          />
          <van-field
              v-model="state.email"
              name="email"
              label="邮箱"
              placeholder="邮箱"
              :rules="[{ required: true, message: '请输入邮箱'}]"
          />
          <van-field
              v-model="state.password"
              type="password"
              name="password"
              label="密码"
              placeholder="密码"
              :rules="[{ required: true, message: '请输入密码' }]"
          />
          <van-field
              v-model="state.password_confirmation"
              type="password"
              name="password_confirmation"
              label="密码确认"
              placeholder="密码确认"
              :rules="[{ required: true, message: '请输入密码确认'}]"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
        <a href="/login">
        <div style="margin: 16px;">
          <van-button round block type="primary">
            已有帐号，直接登录
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
import NavBar from "@/components/common/navbar/NavBar";

import {register} from '@/network/profile';
import {Toast} from "vant";

export default {
  name: "Register",
  components: {
    NavBar
  },
  setup() {
    //变量：用户输入的数据
    const state = reactive({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    });
    //变量：路由器实例
    const router = useRouter();

    const onSubmit = (values) => {
      //验证数据
      register(values).then(res => {
        if (res.status === 201) {
          Toast.success('注册成功');
          setTimeout(() => {
            router.push({path: '/login'})
          }, 1000)
        }

        //清空输入过的密码数据
        values.password = '';
        values.password_confirmation = '';

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
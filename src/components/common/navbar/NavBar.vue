<template>
  <div class="nav-bar">
    <div class="left">
      <slot name="left"><i class="iconfont icon-left" @click="goback"></i></slot>
    </div>
    <div class="center">
      <slot name="center"></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
import {useRouter} from 'vue-router'

export default {
  name: "NavBar",
  setup() {
    const router = useRouter();
    const goback = ()=> {
      router.replace('/')
    }
    return{
      goback,
    }
  }
}
</script>

<style scoped lang="less">
.nav-bar {
  background-color: var(--color-tint);
  color: #FFFFFF;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  height: 45px;
  line-height: 45px;
  text-align: center;
  box-shadow: 0 2px 0 rgba(100, 100, 100, .1);
  display: flex;

  .left, .right {
    width: 60px;
  }

  .center {
    flex: 1;
  }
}
</style>
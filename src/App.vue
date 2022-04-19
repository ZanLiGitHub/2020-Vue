<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <router-view/>

  <div id="nav">
    <router-link class="tab-bar-item" to="/"><i class="iconfont icon-shouye"></i>
      <div>首页</div>
    </router-link>
    <router-link class="tab-bar-item" to="/category"><i class="iconfont icon-leimupinleifenleileibie"></i>
      <div>分类</div>
    </router-link>
    <router-link class="tab-bar-item" to="/cart">
      <van-badge :content="$store.state.cartCount" max="9">
        <i class="iconfont icon-gouwuche"></i>
      </van-badge>
      <div>购物车</div>
    </router-link>
    <router-link class="tab-bar-item" to="/profile"><i class="iconfont icon-yonghu"></i>
      <div>我的</div>
    </router-link>
  </div>


</template>

<style lang="less">
@import "assets/css/base.css";
@import "assets/css/icon/iconfont.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  background-color: #F6F6F6;
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: 0 -3px 1px rgba(100, 100, 100, .1);
  z-index: 10;

  a {
    color: var(--color-text);

    &.router-link-exact-active {
      color: var(--color-high-text);
    }
  }

  .tab-bar-item {
    flex: 1;
    text-align: center;
    height: 50px;
    font-size: var(--font--size);

    i {
      width: 24px;
      height: 24px;
      margin-top: 5px;
      display: inline-block;
      vertical-align: middle;
    }
  }

  .van-badge--fixed {
    top: 10px !important;
  }

}
</style>

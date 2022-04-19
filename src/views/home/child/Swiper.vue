<template>
  <van-swipe v-if="banners.length" class="my-swipe" :autoplay="3000" indicator-color="white">
    <van-swipe-item v-for="(item, index) in banners" :key="index">
      <img v-lazy="item.img_url" alt="index">
    </van-swipe-item>
  </van-swipe>
</template>

<script>
export default {
  name: "Swiper",
  props:{
    banners:Array,
    default(){
      return []
    }
  }
}
</script>

<style scoped>
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 13px;
  text-align: center;
  background-color: #39a9ed;
}
</style>
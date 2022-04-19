<template>
  <div class="goods">
    <GoodsItem v-for="item in goods" :item="item" :key="item.id"></GoodsItem>
  </div>
</template>

<script>
import GoodsItem from "@/components/cotnent/goods/GoodsItem";

export default {
  name: "GoodsList",
  props:{
    goods:{
      type:Array,
      default(){return []}
    }
  },
  components: {
    GoodsItem,
  }

}
</script>

<style scoped lang="less">
.goods{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 2px;
  z-index: 5;
}
</style>
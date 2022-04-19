<template>
  <div class="recommend-wrapper">
    <swiper
        :slides-per-view="4"
        :space-between="10"
    >
      <swiper-slide @click.prevent = "goDetail(item.id)" class="recommend-item" v-for="item in recommends.slice(0,9)" :key="item.id">
        <a href="">
          <img v-lazy="item.cover_url" alt="">
          <p>{{ item.title }}</p>
        </a>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import SwiperCore, {Navigation, Pagination, Scrollbar, A11y} from 'swiper';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
import { Swiper, SwiperSlide} from 'swiper/vue';
import 'swiper/swiper.scss';


import {useRouter} from "vue-router";

export default {

  name: "Recommend",
  setup() {
    const router = useRouter()

    const goDetail = (id)=> {
      router.push({
        path:'/detail',
        query:{id}
      })
    }

    return {
      goDetail
    }
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    recommends: {
      type: Array,
      default() {
        return [];
      }
    }
  }
}
</script>

<style scoped lang="less">
.recommend-wrapper{
  border-bottom: 5px solid rgba(0,0,0,0.05);

  img{
    width: 60px;
    height: auto;
    margin: 10px 0;
  }

  p{
    font-size: 12px;
    margin-bottom: 10px;
  }
}

</style>
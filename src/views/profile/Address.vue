<template>
<div class="address-box">
  <NavBar class="bav-bar">
    <template v-slot:left><i class="iconfont icon-left" @click="$router.push('profile')"></i></template>
    <template v-slot:center>地址管理</template>
  </NavBar>

  <div v-show="list.length ===0" style="margin-top: 100px">还没有地址信息,去添加吧</div>

  <div class="address-item">
    <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
    />
  </div>
</div>
</template>

<script>
import {useRouter, useRoute} from 'vue-router';
import {ref, reactive, toRefs, onMounted} from 'vue';
import NavBar from "@/components/common/navbar/NavBar";

import {getAddressList} from "@/network/address";

export default {
  name: "Address",
  components: {
    NavBar,
  },
  setup(){
    const route = useRoute();
    const router = useRouter();

    //变量:地址数据
    const state = reactive({
      chosenAddressId:'1',
      list:[]
    })

    //方法:添加地址
    const onAdd = () => {router.push({path:'/addressedit', query:{type: 'add'}})}
    //方法:编辑地址
    const onEdit = (item) => {router.push({path:'/addressedit', query:{type: 'edit', addressId: item.id }})}

    //生命周期:挂载后
    onMounted(()=>{
      getAddressList().then(res => {
        if(res.data.length !== 0){
          state.list = res.data.map(item => {
            return {
              id:item.id,
              name:item.name,
              tel:item.phone,
              address:`${item.province} ${item.city} ${item.county} ${item.address}`,
              isDefault: !!item.is_default
            }
          })
        }
      })
    })

    return {
      ...toRefs(state),
      onAdd,
      onEdit,
    }
  }
}
</script>

<style scoped lang="less">
.address-box{
  height: 300px;
  .van-radio__icon{
    display: none;
  }
  .address-item{
    margin-top: 45px;
    .van-address-list{


    }
  }
}

</style>
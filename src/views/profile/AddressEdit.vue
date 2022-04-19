<template>
<div class="address-edit-box">
  <NavBar class="nav-bar">
    <template v-slot:left><i class="iconfont icon-left" @click="$router.push('address')"></i></template>
    <template v-slot:center>{{title}}</template>
  </NavBar>

  <van-address-edit
      :area-list="areaList"
      show-postal
      :show-delete="type === 'edit'"
      show-set-default
      show-search-result
      :address-info="addressInfo"
      :search-result="searchResult"
      :area-placeholder="areaPlaceholder"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
  />


</div>
</template>

<script>
import { areaList } from '@vant/area-data';
import {useRouter, useRoute} from 'vue-router';
import {ref, reactive, toRefs, onMounted, computed} from 'vue';
import {Toast} from 'vant'
import NavBar from "@/components/common/navbar/NavBar";

import {addAddress, editAddress, deleteAddress, getAddressDetail} from "@/network/address";

export default {
  name: "AddressEdit",
  components:{NavBar},
  setup(){
    const route = useRoute();
    const router = useRouter();

    //变量:地址数据
    const state = reactive({
      areaList,
      searchResult:[],
      addressInfo:{},
      areaPlaceholder:'选择省 / 市 / 区',
      type: 'add',
      addressId: '',
      title: ''
    })
    //变量:标题


    //方法:保存
    const onSave = (content) => {
      console.log(content);
      const params = {
        name: content.name,
        phone: content.tel,
        province: content.province,
        city: content.city,
        county:content.county,
        address: content.addressDetail,
        is_default: content.isDefault? 1: 0
      }

      if(state.type === 'edit'){
        editAddress(state.addressId, params).then(()=> {router.push({path:'/address'})})
      }else if(state.type === 'add'){
        addAddress(params).then((res)=> {
          if(res.status !== 422){
            Toast({
              message: '保存成功',
              position: 'bottom',
            });
            setTimeout(()=>{router.back()},500)
          }
        })
      }
    }
    //方法:删除
    const onDelete  = () => {
      deleteAddress(state.addressId).then(res => {
        router.push({path:'address'})
      })
    }

    onMounted(()=> {
      //接收参数
      const {type, addressId} = route.query;
      state.type = type;
      state.addressId = addressId;
      state.title = computed(()=>{return state.type === 'add'? '新增地址' : '编辑地址'})
      if(type === 'edit'){
        getAddressDetail(addressId).then(res => {
          const addressDetail = res
          console.log(addressDetail);

          state.addressInfo = {
            name:addressDetail.name,
            tel:addressDetail.phone,
            province:addressDetail.province,
            city: addressDetail.city,
            county: addressDetail.county,
            addressDetail: addressDetail.address,
            isDefault: !!addressDetail.is_default
          }

          state.areaPlaceholder = `${addressDetail.province} ${addressDetail.city} ${addressDetail.county}`
        })
      }
    })

    return {
      areaList,
      ...toRefs(state),
      onSave,
      onDelete,
    }
  }
}
</script>

<style scoped lang="less">
.edit{
  .van-field__body{
    textarea {
      height: 20px !important;
    }
  }
}
.address-edit-box{
  margin-top: 44px;
  .van-address-edit {

  }
}

</style>
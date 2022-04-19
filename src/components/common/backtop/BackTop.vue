<template>
<div class="backTop" @click="backTop">

</div>
</template>

<script>
export default {
  name: "BackTop",
  setup(props, {emit}){
    return{
      backTop:()=>{emit('back-top')}
    }
  }
}
</script>

<style scoped>

  .backTop{
    width: 40px;
    height: 40px;
    position: fixed;
    bottom: 80px;
    right: 30px;
    background: #FCFCFC url('../../../assets/images/up.png') no-repeat center;
    background-size:100% 100%;
    z-index: 999;
    border-radius: 50%;
    box-shadow:1px 1px 5px #888888;
  }

</style>
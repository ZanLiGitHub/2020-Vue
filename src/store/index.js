import { createStore } from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const state = {
    user:{
        isLogin: false
    },

    //购物车数量
    cartCount:0
}

export default createStore({
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters,
})

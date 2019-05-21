import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"

import user from './module/user'
import app from './module/app'
import router from './module/router'

Vue.use(Vuex)

export default new Vuex.Store({
  //解决Vuex持久化插件 把用户数据持久化
  plugins: [createPersistedState({
    storage: window.sessionStorage,
    reducer(val) {
      return {
        //只储存state中的user
        user: val.user
      }
    }
  })],
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    app,
    router
  }
})

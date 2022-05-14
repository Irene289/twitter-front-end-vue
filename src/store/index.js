import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      currentUser: {
        id: -1,
        name: '',
        email: '',
        image: '',
        isAdmin: false
      },
      isAuthenticated: false,
      token: ''
  },
  getters: {
  },
  mutations: {
    revokeAuthentication(state){
      //清空state
      state.currentUser = {}
      //通過驗證改為false
      state.isAuthenticated = false
      //移除sate中儲存的token
      state.token = ""
      //移除localStoage裡儲存的
      localStorage.removeItem('token')
    }
  },
  actions: {
  },
  modules: {
  }
})

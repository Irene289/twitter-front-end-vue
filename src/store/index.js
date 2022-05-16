import Vue from 'vue'
import Vuex from 'vuex'
import userAPI from '../apis/user'
import {Toast} from '../utils/helpers'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      currentUser: {
        id: -1,
        name: '',
        account:'',
        email: '',
        avatarImg: '',
        is_admin: false
      },
      isAuthenticated: false,
      token: ''
  },
  getters: {
  },
  mutations: {
    setCurrentUser(state, currentUser){
      state.currentUser = {
        ...state.currentUser,
        ...currentUser
      }
      state.token = localStorage.getItem('token'), 
      state.isAuthenticated = true
    },
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
    async fetchCurrentUser({commit}){
      try{
        const {data} = await userAPI.getCurrentUser()
        const {user} = data.data
        const {id, name, account, email, avatarImg, is_admin} = user
        commit('setCurrentUser',{
          id,
          name,
          account,
          email,
          avatarImg,
          is_admin          
        })
        console.log('state',this.state.currentUser)
        return true
      }catch(error){
        Toast.fire({
          icon: 'error',
          title: '無法取得當前用戶，請稍後再試'
        })
        return false
      }
      
    }
  },
  modules: {
  }
})

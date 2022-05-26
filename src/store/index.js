import Vue from 'vue'
import Vuex from 'vuex'
import userAPI from '../apis/user'
import {Toast} from '../utils/helpers'
import tweetAPI from "../apis/tweet"

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
      userFollowings:[],
      isAuthenticated: false,
      token: '',
      tweet: { description: '老天鵝' },
      isLoading: true,
      // newTweet: {
      //   id: -1,
      //   description: '',
      //   // User: {
      //   //   id: '',
      //   //   // account: ''
      //   //   // name: '',
      //   //   // avatarImg: '',
      //   // },
      //   // createdAt: new Date(),
      // }
  },
  getters: {
  },
  mutations: {
    setCurrentUser(state, currentUser){
      state.currentUser = {
        ...state.currentUser,
        ...currentUser,
        avatarImg: currentUser.avatarImg? currentUser.avatarImg : require('../assets/static/images/noImage@2x.png')
      }
      state.token = localStorage.getItem('token'), 
      state.isAuthenticated = true
    },
    //登出
    revokeAuthentication(state){
      //清空state
      state.currentUser = {}
      //通過驗證改為false
      state.isAuthenticated = false
      //移除sate中儲存的token
      state.token = ""
      //移除localStoage裡儲存的
      localStorage.removeItem('token')
    },
    // setTweet(state, newTweet) {
    //   state.tweet = newTweet
    // }
  },
  actions: {
    async fetchCurrentUser({commit}){
      try{
        this.isLoading = true
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
        this.isLoading = false
        return true
      }catch(error){
        this.isLoading = false
        Toast.fire({
          icon: 'error',
          title: '無法取得當前用戶，請稍後再試'
        })
        console.error('can not fetch user information')
        commit('revokeAuthentication')
        return false
      }
    },
    async postTweet() {
      try {
        const { data } = await tweetAPI.createTweet({
          description,
          // UserId,
        });
        const {
          // id,
          description,
          // UserId,
          // createdAt
        } = data.data

        console.log(data)

        // this.newTweet = {
        //   id, // 推文 id
        //   description,
        //   createdAt,
        //   User: { id: UserId },
        // };
        description.commit('setTweet', {
          // id, // 推文 id
          description,
          // createdAt: new Date(),
          // id,
          // createdAt,
        })

        // this.tweets = [{ ...this.newTweet }, ...this.tweets];

        // if (data.status !== "success") {
        //   throw new Error(data.message);
        // } else {
        //   Toast.fire({
        //     icon: "success",
        //     title: "成功送出回覆",
        //   });
        //   this.text = "";
        //   this.dNoneModal = true;
        //   this.isProcessing = false;
        // }
      } catch (error) {
        console.log(error);
        // this.isProcessing = false;
        // if (error.response.status === 500) {
        //   return;
        // } else {
        //   console.log(error);
        //   Toast.fire({
        //     icon: "error",
        //     title: "暫時無法推文",
        //   });
        // }
      }
    },
  },
  modules: {
  }
})

<template>
<!-- <div class="user-tweet scrollbar"> -->
  <div class="user-tweet">
     <UserTweetCard 
      v-for="tweet in tweets"
      :key="tweet.id"
      >
      <template v-slot:avatar>
        <img class="avatar" :src="tweet.img" alt="">
      </template>
       <template v-slot:name>
         {{tweet.User.name}}
      </template>
       <template v-slot:id>
         {{tweet.User.account}}
      </template>
       <template v-slot:post-time>
         {{tweet.created_at | fromNow}}
      </template>
       <template v-slot:text>
         {{tweet.description}}
         <div class="icons">
        <div class="icon-wrapper">
          <img src="../assets/static/images/reply@2x.png" alt="">
          <p class="count">{{tweet.Replies}}</p>
        </div>
        <div class="icon-wrapper">
          <img src="../assets/static/images/like@2x.png" alt="">
          <p class="count">{{tweet.Likes}}</p>
        </div>     
      </div>
      </template>
      
    </UserTweetCard>  
  </div>
  
</template>
<script>
import UserTweetCard from '../components/UserTweetCard.vue'
import { fromNowFilter } from './../utils/mixins'
import userAPI from '../apis/user'
import {Toast} from '../utils/helpers'
export default {
  name: 'UserTweets',
  mixins: [fromNowFilter],
  components:{
    UserTweetCard
  },
  data(){
    return{
      currentUserId: 8,
      tweets:[]
    }
  },
  methods:{
    //TODO:需要使用者圖片
    async fetchUserTweets(id){
      try{
        const {data,statusText} = await userAPI.getTweets({id})
        this.tweets = data
        if(statusText !== 'OK'){
          throw new Error(statusText)
        }

      }catch(error){
        Toast.fire({
          icon:'error',
          title: '無法載入用戶推文，請稍後再試'
        })
      }
    }
  },
  created(){
    const {id} = this.$route.params
    this.fetchUserTweets(id)
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/_basic.scss";
// .user-tweet{
//   height: 100vh;
//   overflow-y: scroll;
// }

// .scrollbar {
//   &::-webkit-scrollbar {
//     width: 8px;
//   }
//   &::-webkit-scrollbar-track {
//     box-shadow: inset 0 0 1px #C1C1C1; 
//     border-radius: 4px;
//   }
//   &::-webkit-scrollbar-thumb {
//     border-radius: 4px;
//     background-color: #C1C1C1;
//   }
// }
</style>
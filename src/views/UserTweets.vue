<template>
<!-- <div class="user-tweet scrollbar"> -->
  <div class="user-tweet">    
     <h3 v-if="noTweets">使用者尚無推文</h3>
     <template v-else>
        <UserTweetCard 
        v-for="tweet in tweets"
        :key="tweet.id"
        >
        <template v-slot:avatar>
          <img 
            @click.prevent.stop="visit(tweet.User.id, 'user-tweets')"
            class="avatar" :src="tweet.User.avatarImg" alt="">
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
          <div 
            @click.prevent.stop="visit(tweet.id, 'twitter-replies')"
            class="icon-wrapper">
            <img class="link" src="../assets/static/images/reply@2x.png" alt="">
            <p class="count">{{tweet.Replies}}</p>
          </div>
          <div 
            
            class="icon-wrapper">
            <img src="../assets/static/images/like@2x.png" alt="">
            <p class="count">{{tweet.Likes}}</p>
          </div>     
        </div>
      </template>
      
    </UserTweetCard> 
     </template>
    
  </div>
  
</template>
<script>
import {visitPage} from '../utils/mixins'
import UserTweetCard from '../components/UserTweetCard.vue'
import { fromNowFilter } from './../utils/mixins'
import userAPI from '../apis/user'
// import {Toast} from '../utils/helpers'
export default {
  name: 'UserTweets',
  mixins: [fromNowFilter, visitPage],
  components:{
    UserTweetCard
  },
  data(){
    return{
      tweets:[],
      noTweets: false
    }
  },
  methods:{
      // TODO:篩除非user的用戶
    async fetchUserTweets(id){
      try{
        const {data,statusText} = await userAPI.getTweets({id})
        if(data.length === 0 ){
          this.noTweets = true
        }else{
          this.noTweets = false
        }
        this.tweets = data
        if(statusText !== 'OK'){
          throw new Error(statusText)
        }

      }catch(error){
        if(error.response.status === 500){
          this.noTweets = true
          return
        }       
      }
    },
    visit(id,pathName){
      this.visitUserPage(id,pathName)
    }
  },
  beforeRouteUpdate(to, from, next){
    const {id} = to.params
    this.fetchUserTweets(id)
    next()
  },
  created(){
    const {id} = this.$route.params
    this.fetchUserTweets(id)
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/_basic.scss";
h3{
  text-align: center;
  margin-top: 1rem;
}
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
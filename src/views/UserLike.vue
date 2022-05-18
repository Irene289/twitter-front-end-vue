<template>
  <div class="user-like scrollbar">
    <UserTweetCard 
      v-for="like in likes"
      :key="like.TweetId"
      >
      <template v-slot:avatar>
        <img 
          @click.stop.prevent="visit(like.Tweet.User.id, 'user-tweets')"
          class="avatar" :src="like.Tweet.User.avatar_img" alt="">
      </template>
       <template v-slot:name>
         <div @click.stop.prevent="visit(like.Tweet.User.id, 'user-tweets')">
            {{like.Tweet.User.name}}
         </div>       
      </template>
       <template v-slot:id>
         {{'@'+like.Tweet.User.account}}
      </template>
       <template v-slot:post-time>
         {{like.Tweet.created_at | fromNow}}
      </template>
       <template v-slot:text>
         {{like.Tweet.description}}
        <div class="icons">
          <div 
            @click.stop.prevent="visit(like.TweetId, 'twitter-replies')"
            class="icon-wrapper">
            <img src="../assets/static/images/reply@2x.png" alt="">
            <p class="count">{{like.Tweet.replyCount}}</p>
          </div>
          <div class="icon-wrapper">
            <img 
              @click.stop.prevent="unlikeTweet(like.TweetId)"
              v-show="like.likeUnlike" 
              src="../assets/static/images/redHeart@2x.png" alt="">
            <img
              @click.stop.prevent="likeTweet(like.TweetId)" 
              v-show="!like.likeUnlike" 
              src="../assets/static/images/like@2x.png" alt="">
            <p class="count">{{like.Tweet.likeCount}}</p>
          </div>     
        </div>
      </template>
      
    </UserTweetCard>  
  </div>
</template>
<script>
import tweetAPI from '../apis/tweet'
import {visitPage} from '../utils/mixins'
import userAPI from '../apis/user'
import {Toast} from '../utils/helpers'
import { fromNowFilter } from './../utils/mixins'
import UserTweetCard from '../components/UserTweetCard.vue'
export default {
  mixins: [fromNowFilter, visitPage],
  components:{
    UserTweetCard
  },
   data(){
    return{
       likes:[]   
    }
   
  },
  methods:{
      // TODO:篩除非user的用戶
      async fetchUserLikes(id){
        try{
          const {data, statusText} = await userAPI.getLikes({id})
          this.likes = data
          console.log(data)
          if(statusText !== "OK"){
            throw new Error (statusText)
          }
        }catch(error){
          Toast({
            icon: 'error',
            title: '無法取的用戶喜歡的推文，請稍後再試'
          })
        }
      },
      async likeTweet(id){
        try{
          const {data} = await tweetAPI.likeTweet({id})
          console.log(data)
          this.likes = this.likes.map(tweet => {
           if(tweet.TweetId !== id){
             return tweet
           } else if (tweet.TweetId === id){
              console.log()
              return {
              ...tweet,
              likeUnlike: true,
                
              }
            }            
          })
        }catch(error){
          Toast.fire({
            icon: 'error',
            title: '無法對推文點讚，請稍後再試'
          })
        }
      },
      async unlikeTweet(id){
        try{
          const response = await tweetAPI.unlikeTweet({id})
          console.log(response)
          this.likes = this.likes.map(tweet => {
           if(tweet.TweetId !== id){
             return tweet
           } else if (tweet.TweetId === id){
              return {
              ...tweet,
              likeUnlike: false
              }
            }            
          })
        }catch(error){
          Toast.fire({
            icon: 'error',
            title: '無法對推文點讚，請稍後再試'
          })
        }
      },
      visit(id, pathName){
         this.visitUserPage(id, pathName)
      }
  },
  created(){
    const {id} = this.$route.params
    this.fetchUserLikes(id)
  }
  
}
</script>
<style lang="scss" scoped>
  .icon-wrapper{
    cursor: pointer;
  }
</style>

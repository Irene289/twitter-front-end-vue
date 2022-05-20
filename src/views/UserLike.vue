<template>
  <div class="user-like">
    <h3 v-if="noLikes">使用者尚無喜歡的貼文</h3>
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
         {{like.Tweet.description | tweetFilter}}
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
              v-show="like.is_like" 
              src="../assets/static/images/redHeart@2x.png" alt="">
            <img
              @click.stop.prevent="likeTweet(like.TweetId)" 
              v-show="!like.is_like" 
              src="../assets/static/images/like@2x.png" alt="">
            <p class="count">{{like.Tweet.likeCount}}</p>
          </div>     
        </div>
      </template>
      
    </UserTweetCard>  
  </div>
</template>
<script>
import {textFilter} from '../utils/mixins'
import tweetAPI from '../apis/tweet'
import {visitPage} from '../utils/mixins'
import userAPI from '../apis/user'
import {Toast} from '../utils/helpers'
import { fromNowFilter } from './../utils/mixins'
import UserTweetCard from '../components/UserTweetCard.vue'
export default {
  mixins: [fromNowFilter, visitPage, textFilter],
  components:{
    UserTweetCard
  },
   data(){
    return{
       likes:[],
       noLikes: false   
    }
  },
  methods:{
      async fetchUserLikes(id){
        try{
          const {data, statusText} = await userAPI.getLikes({id})
          // 篩除非user的用戶
          console.log(data)
          this.likes = data.filter( like => like.Tweet.User.role === 'user')
          if(statusText !== "OK"){
            throw new Error (statusText)
          }
        }catch(error){
          if(error.response.status === 500){
            this.noLikes = true
            return
          } 
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
              return {
              ...tweet,
              is_like: true,  
              Tweet: {
                  ...tweet.Tweet,
                  likeCount: tweet.Tweet.likeCount+1
                }             
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
          const {statusText} = await tweetAPI.unlikeTweet({id})
          console.log(statusText)
          if(statusText !== "OK"){
            throw new Error (statusText)
          }
          this.likes = this.likes.map(tweet => {
           if(tweet.TweetId !== id){
             return tweet
           } else if (tweet.TweetId === id){
              return {
                ...tweet,
                is_like: false,  
                Tweet: {
                    ...tweet.Tweet,
                    likeCount: tweet.Tweet.likeCount-1
                }     
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
  beforeRouteUpdate(to, from, next){
    const {id} = to.params
    this.fetchUserLikes(id)
    next()
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
  h3{
    text-align: center;
    margin-top: 1rem;
  }
</style>

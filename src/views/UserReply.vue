<template>
  <div class="user-reply scrollbar">
    <UserTweetCard 
      v-for="reply in replies"
      :key="reply.id"
      >
      <template v-slot:avatar>
        <img 
          @click.prevent.stop="visit(reply.User.id, 'user-tweets')"
          class="avatar" :src="reply.User.avatarImg" alt="">
      </template>
       <template v-slot:name>
         {{reply.User.name}}
      </template>
       <template v-slot:id>
         {{reply.User.account}}
      </template>
       <template v-slot:post-time>
         {{reply.created_at | fromNow}}
      </template>
       <template v-slot:text>
         <div 
          @click.prevent.stop="visit(reply.Tweet.id, 'twitter-replies')"
          class="reply-tag">回覆 <span>@{{reply.Tweet.User.account}}</span></div>
         {{reply.comment}}
      </template>   
    </UserTweetCard>  
  </div>
</template>
<script>
import {visitPage} from '../utils/mixins'
import UserTweetCard from '../components/UserTweetCard.vue'
import { fromNowFilter } from './../utils/mixins'
import userAPI from '../apis/user'
import {Toast} from '../utils/helpers'

export default {
  mixins: [fromNowFilter, visitPage],
  components:{
    UserTweetCard
  },
  data(){
    return{
       replies:[]    
    } 
  },
  methods:{
      // TODO:篩除非user的用戶
    async fetchUserReplies(id){
      try{
        const {data, statusText} = await userAPI.getReplies({id})
        this.replies = data
        console.log(data)
        if(statusText !== 'OK'){
          throw new Error (statusText)
        }
      }catch(error){
        Toast.fire({
          icon:'error',
          title: '無法載入使用者回覆，請稍後再試'
        })
      }
    },
    visit(id,pathName){
      this.visitUserPage(id,pathName)
    }
  },
  created(){
    const {id} = this.$route.params
    this.fetchUserReplies(id)
  }
}
</script>
<style lang="scss" scoped>
@import "../assets/scss/_basic.scss";
  .reply-tag{
    @extend %tweet-account;
    margin-bottom: 8px;
    span{
      color: $orange;
      font-family: $number-font;
    }
  }
</style>

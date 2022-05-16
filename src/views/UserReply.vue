<template>
  <div class="user-reply scrollbar">
    <UserTweetCard 
      v-for="reply in replies"
      :key="reply.id"
      >
      <template v-slot:avatar>
        <img class="avatar" :src="reply.img" alt="">
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
         <div class="reply-tag">回覆 <span>@{{reply.to}}</span></div>
         {{reply.comment}}
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
  mixins: [fromNowFilter],
  components:{
    UserTweetCard
  },
  data(){
    return{
       replies:[]    
    } 
  },
  methods:{
    //TODO:缺用戶avatar和回覆對象帳號，待補
    async fetchUserReplies(id){
      try{
        const {data, statusText} = await userAPI.getReplies({id})
        this.replies = data
        if(statusText !== 'OK'){
          throw new Error (statusText)
        }
      }catch(error){
        Toast.fire({
          icon:'error',
          title: '無法載入使用者回覆，請稍後再試'
        })
      }
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

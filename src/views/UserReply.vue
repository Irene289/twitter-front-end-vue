<template>
  <div class="user-reply">
    <h3 v-if="noReplies">使用者尚無回覆</h3>
    <UserTweetCard 
      v-for="reply in replies"
      :key="reply.id"
      >
      <template v-slot:avatar>
        <img 
          @click.prevent.stop="visit(reply.User.id, 'user-tweets')"
          class="avatar" :src="reply.User.avatarImg | avatarFilter" alt="">
      </template>
       <template v-slot:name>
         {{reply.User.name}}
      </template>
       <template v-slot:id>
         {{'@'+reply.User.account}}
      </template>
       <template v-slot:post-time>
         {{reply.created_at | fromNow}}
      </template>
       <template v-slot:text>
         <div 
          @click.prevent.stop="visit(reply.Tweet.id, 'twitter-replies')"
          class="reply-tag">回覆 <span>@{{reply.Tweet.User.account}}</span></div>
         {{reply.comment | tweetFilter}}
      </template>   
    </UserTweetCard>  
  </div>
</template>
<script>
import { imgFilter } from '../utils/mixins'
import {textFilter} from '../utils/mixins'
import {visitPage} from '../utils/mixins'
import UserTweetCard from '../components/UserTweetCard.vue'
import { fromNowFilter } from './../utils/mixins'
import userAPI from '../apis/user'
// import {Toast} from '../utils/helpers'

export default {
  mixins: [fromNowFilter, visitPage, textFilter, imgFilter],
  components:{
    UserTweetCard
  },
  data(){
    return{
       replies:[],
       noReplies: false    
    } 
  },
  methods:{
    async fetchUserReplies(id){
      try{
        const {data, statusText} = await userAPI.getReplies({id})
        if(statusText !== 'OK'){
          throw new Error (statusText)
        }
        // 篩除非user的用戶
        this.replies = data.filter( reply => reply.Tweet.User.role === 'user')
      }catch(error){
        if(error.response.status === 500){
          this.noReplies = true
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
    this.fetchUserReplies(id)
    next()
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
  h3{
    text-align: center;
    margin-top: 1rem;
  }
</style>

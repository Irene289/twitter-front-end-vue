<template>
  <div class="follower-container">
    <UserFollowCard
      v-for="follower in followers"
      :key="follower.id"
    >
      <template v-slot:avatar>
        <img
          @click.stop.prevent="visit(follower.id, 'user-tweets')"
          class="avatar" :src="follower.avatarImg" alt="">
        
      </template>
       <template v-slot:name>
         {{follower.name}}
      </template>
       <template v-slot:id>
         {{follower.account}}
      </template>
       <template v-slot:btn>
        <div class="btn-group">
          <button v-show="!follower.is_following" class="follow">跟隨</button>
          <button v-show="follower.is_following" class="following">正在跟隨</button>
        </div>       
      </template>
       <template v-slot:text>
         {{follower.bio | textFilter}}
      </template>
    </UserFollowCard>
  </div>
  
</template>
<script>
import {textFilter} from '../utils/mixins'
import {visitPage} from '../utils/mixins'
import UserFollowCard from '../components/UserFollowCard.vue'
import userAPI from '../apis/user'
import {Toast} from '../utils/helpers'
export default {
  name: 'UserFollower',
  components:{
    UserFollowCard
  },
  mixins:[textFilter, visitPage],
  data(){
    return{
      followers:[]
    } 
  },
  methods:{
    async fetchUserFollowers(id){
      try{
        const {data, statusText} = await userAPI.get({id})
        const followers = data.Follower
        this.followers = followers
        if(statusText !== 'OK'){
          throw new Error(statusText)
        }
      }catch(error){
        Toast.fire({
          icon:'error',
          title: '無法取得追蹤中用戶資料，請稍後再試'
        })
      }
    },
    visit(id,pathName){
      //使用mixins裡的函式
      this.visitUserPage(id, pathName)
    }
    
  },
  created(){
    const {id} = this.$route.params
    this.fetchUserFollowers(id)
  }
}
</script>
<style lang="scss" scoped>
  @import "../assets/scss/_basic.scss";
  .follower-container{
    position: relative;
  }
  .btn-group{
    position: absolute;
    right: 30px;
    .follow{
      @extend %follow;
    }
    .following{
      @extend %following;
    }
    
  }
</style>
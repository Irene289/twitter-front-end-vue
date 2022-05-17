<template>
  <div class="follower-container">
    <UserFollowCard
      v-for="following in followings"
      :key="following.id"
    >
       <template v-slot:avatar>
        <img 
          @click.stop.prevent="visit(following.id,'user-tweets')"
          class="avatar" :src="following.avatarImg" alt="">
      </template>
       <template v-slot:name>
         {{following.name}}
      </template>
       <template v-slot:id>
         {{following.account}}
      </template>
       <template v-slot:btn>
        <div class="btn-group">
          <button v-show="!following.is_following" class="follow">跟隨</button>
          <button v-show="following.is_following" class="following">正在跟隨</button>
        </div>       
      </template>
       <template v-slot:text>
         {{following.introduction| textFilter}}
      </template>
    </UserFollowCard>
  </div>
  
</template>
<script>
import UserFollowCard from '../components/UserFollowCard.vue'
import {visitPage} from '../utils/mixins'
import {textFilter} from '../utils/mixins'
import userAPI from '../apis/user'
import {Toast} from '../utils/helpers'
export default {
  name:'UserFollowing',
  components:{
    UserFollowCard
  }, 
  mixins: [textFilter, visitPage],
  data(){
    return{
      followings:[]
    }
  },
  methods:{
      // TODO:篩除非user的用戶
    async fetchUserFollowings(id){
      try{
        const {data, statusText} = await userAPI.get({id})
        const followings = data.Following
        this.followings = followings
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
      this.visitUserPage(id,pathName)
    }
  },  
  created(){
    const {id} = this.$route.params
    console.log(id)
    this.fetchUserFollowings(id)
  }
}
</script>
<style lang="scss" scoped>
  @import "../assets/scss/_basic.scss";
  .follower-container{
    position: relative;
    height: 100vh;
    overflow-y: scroll;
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
<template>
  <div class="follower-container">
    <h3 v-if="noFollowings">尚未追蹤其他用戶</h3>
    <template>
       <UserFollowCard
        v-for="following in followingFilter"
        :key="following.id"
      >
        <template v-slot:avatar>
          <img 
            @click.stop.prevent="visit(following.id,'user-tweets')"
            class="avatar" :src="following.avatarImg | avatarFilter" alt="">
        </template>
        <template v-slot:name>
          {{following.name}}
        </template>
        <template v-slot:id>
          {{following.account}}
        </template>
        <template v-slot:btn>
          <div class="btn-group">
            <template  
              v-if="following.id !== currentUser.id" 
            >
              <button 
              @click.stop.prevent="follow(following.id)"
              v-show="!following.is_following" class="follow">跟隨
              </button>
              <button 
                @click.stop.prevent="unfollow(following.id)"
                v-show="following.is_following" class="following">正在跟隨
              </button>
            </template>            
            <button 
              v-else
              disabled
              class="following">
              用戶本人
            </button>
          </div>       
        </template>
        <template v-slot:text>
          {{following.introduction| textFilter}}
        </template>
      </UserFollowCard>
    </template>
   
  </div>
  
</template>
<script>
import {imgFilter} from '../utils/mixins'
import {mapState} from 'vuex'
import followShipAPI from '../apis/followShip'
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
  mixins: [textFilter, visitPage, imgFilter],
  data(){
    return{
      followings:[],
      noFollowings: false
    }
  },
  methods:{
    async fetchUserFollowings(id){
      try{
        const {data, statusText} = await userAPI.get({id})
        const followings = data.Follower
        // 篩除非user的用戶
        this.followings = followings.filter( follower => follower.role === 'user')
        if(followings.length === 0){
          this.noFollowings = true
        }else {
          this.noFollowings = false
        }
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
      async follow(id){
      try{
        const {statusText} = await followShipAPI.follow({id})
        if(statusText !=='OK'){
          throw new Error(statusText)
        }
        this.followings = this.followings.map(user => {
          if(user.id !== id) {
            return user
          }
          if(user.id === id) {
            return{
              ...user,
              is_following: true
            }
          }
        })
      }catch(error){
        Toast.fire({
          icon:'error',
          title:'無法追蹤此用戶，請稍後再試'
        })
      }       
    },
    async unfollow(id){  
      try{
        const {statusText} = await followShipAPI.unFollow({id})
        if(statusText !== 'OK'){
          throw new Error (statusText)
        }
        this.followings = this.followings.map(user => {
          if(user.id !== id) {
            return user
          }
          if(user.id === id) {
            return{
              ...user,
              is_following: false
            }
          }
        })
      }catch(error){
          Toast.fire({
          icon:'error',
          title:'無法取消追蹤此用戶，請稍後再試'
        })
      }       
    },  
    visit(id,pathName){
      //使用mixins裡的函式
      this.visitUserPage(id,pathName)
    }
  },
  computed:{
    ...mapState(['currentUser']),
    followingFilter(){
      return this.followings.filter(user => user.is_following)    
    }
  },
  beforeRouteUpdate(to, from, next){
    const {id} = to.params
    this.fetchUserFollowings(id)
    next()
  },
  created(){
    const {id} = this.$route.params
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
  h3{
    text-align: center;
    margin-top: 1rem;
  }    
</style>
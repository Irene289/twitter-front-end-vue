<template>
  <div class="follower-container">
    <template>
      <h3 v-if="noFollowings">尚未追蹤其他用戶</h3>
      <template>
        <UserFollowCard
          v-for="following in followings"
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
                  :disabled="isProcessing"
                  @click.stop.prevent="follow(following.id)"
                  v-show="!following.is_following" class="follow"
                >
                  跟隨
                </button>
                <button 
                  :disabled="isProcessing"
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
    UserFollowCard,
  }, 
  mixins: [textFilter, visitPage, imgFilter],
  data(){
    return{
      followings:[...this.initialFollowings],
      noFollowings: false,
      isProcessing: false,
    }
  },
  props: {
    // 點擊 Popular 追蹤/取消追蹤後更新的資料
    initialFollowings: {
      type: Array,
      required: true
    }
  },
  methods:{
    async fetchUserFollowings(id){
      try{
        this.$store.commit("setIsLoading", true);
        const {data, statusText} = await userAPI.get({id})
        const followings = data.Follower
        // 篩除非user的用戶
        this.followings = followings.filter( follower => follower.role === 'user')
        // this.$store.commit('setUserFollowing',this.followings)
        if(followings.length === 0){
          this.noFollowings = true
        }else {
          this.noFollowings = false
        }
        if(statusText !== 'OK'){
          throw new Error(statusText)
        }
        this.$store.commit("setIsLoading", false);
      }catch(error){
        this.$store.commit("setIsLoading", false);
        Toast.fire({
          icon:'error',
          title: '無法取得追蹤中用戶資料，請稍後再試'
        })
      }
    },
    async follow(id){
      try{
        this.isProcessing = true
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
        // 當點擊追蹤時，emit 回 UserFollow，讓 UserFollow 去 fetchTopUsers 打 API 更新 topUsers
        this.$emit('after-userfollow')
        console.log('afterUserFollow')
        this.isProcessing = false
      }catch(error){
        this.isProcessing = false
        Toast.fire({
          icon:'error',
          title:'無法追蹤此用戶，請稍後再試'
        })
      }       
    },
    async unfollow(id){  
      try{
        this.isProcessing = true
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
        // 同上
        this.$emit('after-userfollow')
        this.isProcessing = false
      }catch(error){
        this.isProcessing = false
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
    ...mapState(['currentUser'])
  },
  beforeRouteUpdate(to, from, next){
    const {id} = to.params
    this.fetchUserFollowings(id)
    next()
  },
  created(){
    const {id} = this.$route.params
    this.fetchUserFollowings(id)
  },
  watch: {
    // 當 initialFollowings 有更新，就重新賦值給 followings
    initialFollowings(newVal) {
      this.followings = [...newVal]
    }
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
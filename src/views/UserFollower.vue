<template>
  <div class="follower-container">
    <template>
      <h3 v-if="noFollowers">尚無追蹤者</h3>
      <template v-else>
        <UserFollowCard
          v-for="follower in followers"
          :key="follower.id"
        >
          <template v-slot:avatar>
            <img
              @click.stop.prevent="visit(follower.id, 'user-tweets')"
              class="avatar" :src="follower.avatarImg | avatarFilter" alt="">      
          </template>
          <template v-slot:name>
            {{follower.name}}
          </template>
          <template v-slot:id>
            {{follower.account}}
          </template>
          <template v-slot:btn>
            <div class="btn-group">
              <div v-if="currentUser.id !== follower.id">
                <button 
                :disabled="isProcessing"
                @click.stop.prevent="follow(follower.id)"
                v-show="!follower.is_following" class="follow">
                跟隨
                </button>
                <button 
                  :disabled="isProcessing"
                  @click.stop.prevent="unfollow(follower.id)"
                  v-show="follower.is_following" class="following">
                  正在跟隨
                </button>
              </div>
                <button 
                v-else
                disabled
                class="following">
                用戶本人
              </button>         
            </div>       
          </template>
          <template v-slot:text>
            {{follower.introduction | textFilter}}
          </template>
        </UserFollowCard>
      </template>
    </template>
    
  </div>
  
</template>
<script>
import {imgFilter} from '../utils/mixins'
import {mapState} from 'vuex'
import {textFilter} from '../utils/mixins'
import followShipAPI from '../apis/followShip'
import {visitPage} from '../utils/mixins'
import UserFollowCard from '../components/UserFollowCard.vue'
import userAPI from '../apis/user'
import {Toast} from '../utils/helpers'
export default {
  name: 'UserFollower',
  components:{
    UserFollowCard
  },
  mixins:[textFilter, visitPage, imgFilter],
  data(){
    return{
      followers:[],
      noFollowers: false,
      isProcessing: false
    } 
  },
  props: {
    // 點擊 Popular 追蹤/取消追蹤後更新的資料
    initialFollowers: {
      type: Array,
      required: true
    }
  },
  methods:{
    async fetchUserFollowers(id){
      try{
        this.$store.commit("setIsLoading", true);
        const {data, statusText} = await userAPI.get({id})
        const followers = data.Following
        // 篩除非user的用戶
        this.followers = followers.filter( follower => follower.role === 'user')

        if(followers.length === 0) {
          this.noFollowers = true
        } else {
          this.noFollowers = false
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
        this.followers = this.followers.map(user => {
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
        this.$emit('after-userfollow')
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
        this.followers = this.followers.map(user => {
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
      this.visitUserPage(id, pathName)
    }   
  },
  computed:{
    ...mapState(['currentUser'])
  },
  created(){
    const {id} = this.$route.params
    this.fetchUserFollowers(id)
  },
  beforeRouteUpdate(to, from, next){
    const {id} = to.params
    this.fetchUserFollowers(id)
    next()
  },
  watch: {
    // 當 initialFollowers 有更新，就重新賦值給 followers
    initialFollowers(newVal) {
      this.followers = [...newVal]
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../assets/scss/_basic.scss";
  .follower-container{
    position: relative;
  }
  h3{
    text-align: center;
    margin-top: 1rem;
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
<template>
  <div id="popular">
    <h1>跟隨誰</h1>
    <div class="popular__list">
      <div 
        v-for="user in popularUsers"
        :key="user.id"
        @click.stop.prevent="visit(user.id, 'user-tweets')"
        class="popular__list__item">
        <img :src="user.avatar_img | avatarFilter" alt="">
        <div class="item-account">
          <p class="name">{{user.name}}</p>
          <p class="id">{{'@'+ user.account}}</p>
        </div>
        <button 
          v-if="user.is_following" 
          :disabled="isProcessing"
          @click.stop.prevent="unfollow(user.id)"
          class="following">正在跟隨
        </button>
        <button
          v-else-if="!user.is_following"
          :disabled="isProcessing"
          @click.stop.prevent="follow(user.id)"
          class="follow">跟隨
        </button>
      </div>
    </div> 
  </div>
</template>
<script>
import {imgFilter} from '../utils/mixins'
import {mapState} from 'vuex'
import followShipAPI from '../apis/followShip'
import {visitPage} from '../utils/mixins'
import userAPI from '../apis/user'
import {Toast} from '../utils/helpers'
export default {
  name:'Popular',
  mixins:[visitPage, imgFilter],
  data(){
    return{
      popularUsers:[],
      isProcessing: false
    }
  },
  props: {
    // 點擊 UserFollowing 或 UserFollower 後，從 UserFollow 更新後傳來的資料
    topUsers: {
      type: Array,
      required: true
    }
  },
  methods:{
    visit(id,pathName){
      this.visitUserPage(id,pathName)
    },
    async fetchTopUsers(rank){
      try{
        const {data, statusText} = await userAPI.getTopUsers({rank})
        // 後端已篩過非user
        this.popularUsers = data.filter(user => user.id !== this.currentUser.id )
        if(statusText !== "OK"){
          throw new Error(statusText)
        }
      }catch(error){
        Toast.fire({
          icon: 'error',
          title: '無法取得人氣用戶，請稍後再試'
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
          this.popularUsers = this.popularUsers.map(user => {
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
          // 當點擊追蹤時，emit 回 UserFollow，讓 UserFollow 去 fetchUser 打 API 更新 followers 跟 followings
          
          this.$emit('after-follow', {
            id,
            status: 'follow'
          })
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
        this.popularUsers = this.popularUsers.map(user => {
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
        this.$emit('after-follow', {
          id,
          status: 'unfollow'
        })
        this.isProcessing = false
      }catch(error){
        this.isProcessing = false
        Toast.fire({
          icon:'error',
          title:'無法取消追蹤此用戶，請稍後再試'
        })
      }       
    }   
  },
  created(){
    this.fetchTopUsers(10)
  },
  computed:{
    ...mapState(['currentUser'])
  },
  watch: {
    // 當 topUsers 資料更新時，同步更新 popularUsers 資料
    topUsers(newVal) {
      this.popularUsers = [...newVal]
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../assets/scss/_basic.scss";
  #popular{
    width:100%;
    margin-top: 13px;
    margin-bottom: 13px;
    max-width:273px;
    background: #FAFAFB;
    border-radius: 16px;
    height: calc(100vh - 2 * 13px);
    img{
      width:50px;
      height: 50px;
      border-radius: 50%;
    }
    h1{
      border-bottom: 1px solid #E6ECF0;
      padding: 24px;
      font-family: $main-font;
      font-size: 24px;
    }
    .popular__list {
      height: calc(100% - 2 * 37px - 1px);
      overflow-y: scroll;
    }
    .popular__list__item{  
      cursor: pointer; 
      display: flex;
      padding: 1rem 1rem 5px 1rem; 
      .item-account{
        flex: 1;
        width: 74px;
        padding-right: 2px;
        margin-left: 8px;       
        font-family: $main-font;        
        .name{
          color: $font-black;
          font-weight:700; 
          @extend %single-ellipsis;   
        }
        .id{
          color: $id-grey;
          font-weight: 500;
          font-size: 14px;
          @extend %single-ellipsis;  
        }
      } 
    } 
    button{
      height: 40px;
    }
    .following{
      @extend %following;         
    }
    .follow{
      @extend %follow;
      margin-left:28px;
    }
  }

</style>
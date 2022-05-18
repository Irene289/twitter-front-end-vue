<template>
  <div id="popular">
    <h1>跟隨誰</h1>
    <div class="popular__list">
      <div 
        v-for="user in topUsers"
        :key="user.id"
        @click.stop.prevent="visit(user.id, 'user-tweets')"
        class="popular__list__item">
        <img :src="user.avatar_img" alt="">
        <div class="item-account">
          <p class="name">{{user.name}}</p>
          <p class="id">{{'@'+ user.account}}</p>
        </div>
        <div v-if="user.id !== currentUser.id">
           <button 
          v-if="user.is_following" 
          @click.stop.prevent="unfollow(user.id)"
          class="following">正在跟隨
          </button>
          <button
            v-else-if="!user.is_following"
            @click.stop.prevent="follow(user.id)"
            class="follow">跟隨
          </button>
        </div>
        <button
          v-else
          disabled
          class="following">
          用戶本人
        </button>
      </div>
    </div> 
  </div>
</template>
<script>
import {mapState} from 'vuex'
import followShipAPI from '../apis/followShip'
import {visitPage} from '../utils/mixins'
import userAPI from '../apis/user'
import {Toast} from '../utils/helpers'
export default {
  name:'Popular',
  mixins:[visitPage],
  data(){
    return{
      topUsers:[]
    }
  },
  methods:{
    visit(id,pathName){
      this.visitUserPage(id,pathName)
    },
    async fetchTopUsers(rank){
      try{
        const {data, statusText} = await userAPI.getTopUsers({rank})
        this.topUsers = data
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
          const {statusText} = await followShipAPI.follow({id})
          if(statusText !=='OK'){
            throw new Error(statusText)
          }
          this.topUsers = this.topUsers.map(user => {
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
        this.topUsers = this.topUsers.map(user => {
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
    }   
  },
  created(){
    this.fetchTopUsers(10)
  },
  computed:{
    ...mapState(['currentUser'])
  }
  //TODO:個人資料編輯後topUsers名稱沒有同步，
}
</script>
<style lang="scss" scoped>
  @import "../assets/scss/_basic.scss";
  #popular{
    width:100%;
    margin-top: 13px;
    max-width:273px;
    height:731px;
    background: #FAFAFB;
    border-radius: 16px;
    img{
      width:50px;
      border-radius: 50%;
    }
    h1{
      border-bottom: 1px solid #E6ECF0;
      padding: 24px;
      font-family: $main-font;
      font-size: 24px;
    }
    .popular__list__item{  
      cursor:pointer; 
      display: flex;
      padding: 1rem; 
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
<template>
  <div id="user">
    <div class="user__container">
      <div class="user__image-container">
        <div class="background-wrapper">
          <img :src="user.coverImg | coverFilter" alt="" class="background">
        </div>
        <div class="avatar-wrapper">
          <img :src="user.avatarImg | avatarFilter" alt="" class="avatar">
        </div>      
      </div>
      <div class="user__btn__group">
        <div class="user__btn__group__list">
          <template v-if="user.id !== currentUser.id">
            <div class="group-item">
            <img 
              @click.stop.prevent="sendDm"
              src="../assets/static/images/msg@2x.png" alt="">          
            </div>
            <div class="group-item">
              <img 
                v-if="!isSubscribe"
                @click.stop.prevent="toggleSub" 
                class="notify" src="../assets/static/images/notfi@2x.png" alt=""
              >
              <img v-else 
                 @click.stop.prevent="toggleSub" 
                class="notified" src="../assets/static/images/notfied@2x.png" alt="">
            </div>
            <div v-if="!user.isFollowing" class="group-item follow">
              <button 
                @click.stop.prevent="follow(user.id)"
                class="follow">跟隨</button>
            </div>
            <div v-else 
              @click.stop.prevent="unfollow(user.id)"
              class="group-item">           
                <button class="following">正在跟隨</button>           
            </div>
          </template>         
          <div v-else class="group-item">
            <button 
              :disabled="isProcessing"
              @click="openModal"
              class="edit">{{isProcessing? '處理中...':'編輯個人資料'}}</button>
          </div>
        </div>
      </div>
      <div class="user__container__info">
        <p class="name">{{user.name}}</p>
        <p class="id">@{{user.account}}</p>
        <p class="intro">{{user.introduction | textFilter}}</p>
        <div class="user__follow">
          <router-link
            :to="{
              name:'following',
              params: {id: user.id}
            }"
          >
            <p class="user__follow__item following">
              <span class="num">{{user.followingCount}}</span>個<span class="status">跟隨中</span>
            </p>
          </router-link>
          <router-link
           :to="{
              name:'follower',
              params: {id: user.id}
            }"
          >
            <p class="user__follow__item follower">
              <span class="num">{{user.followerCount}}</span>個<span class="status">跟隨者</span>
            </p>
          </router-link>
        </div>
      </div>
    </div> 
    <template v-if="isEditing">
      <Modal
        :initial-user-edit="user"
        @after-submit="afterSubmit"
        @close-modal="closeModal"
      />
    </template>       
  </div> 
</template>
<script>
import {imgFilter} from '../utils/mixins'
import {textFilter} from '../utils/mixins'
import followShipAPI from '../apis/followShip'
import {mapState} from 'vuex'
import userAPI from '../apis/user'
import {Toast} from '../utils/helpers'
import Modal from '../components/EditModal.vue'
export default {
  components:{
    Modal
  },
  mixins:[textFilter, imgFilter],   
  props:{
    initialUser:{
      type: Object,
      default: () => {
        return {
          name: '',
          id:'',
          introduction:'',
          account:'',
          avatarImg:'',
          coverImg:'',
          is_following:'',
          followerCount:'',
          followingCount:'',
        }
      }
    }
  },
  data(){
    return{
      route: '',
      isEditing: false,
      isCurrentUser: true,
      isSubscribe: false,
      isProcessing: false,
      user:{...this.initialUser}
    }
  },
  methods:{
    switchRoute(newRoute){
      this.route = newRoute
    },
    closeModal(){
      this.isEditing = false
    },
    openModal(){
      this.isEditing = true
    },
    toggleSub(){
      if(this.isSubscribe === false){
          this.isSubscribe = true
      } else {
        this.isSubscribe = false
      }       
    },
    sendDm(){
      Toast.fire({
        icon:'warning',
        title: '私訊功能開發中'
      })
    },
    async follow(id){
      console.log(id)
      try{
        const {statusText} = await followShipAPI.follow({id})
        if(statusText !=='OK'){
          throw new Error(statusText)
        }
        this.user = {
        ...this.user,
        isFollowing: true
      }
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
        this.user = {
        ...this.user,
        isFollowing: false
      }
      }catch(error){
          Toast.fire({
          icon:'error',
          title:'無法取消追蹤此用戶，請稍後再試'
        })
      }       
    },
    async afterSubmit(formData){    
      try{
        this.isProcessing = true
        const {data, statusText} = await userAPI.updateProfile({
          userId: this.currentUser.id,
          formData
        })
        const {name, introduction, avatarImg, coverImg} = data
        this.user = {
          ...this.user,
          name,
          introduction,
          avatarImg,
          coverImg
        }
        if(statusText !== "OK"){
          throw new Error (statusText)
        }
        Toast.fire({
          icon:'success',
          title: '已儲存更新'
        })
        this.isProcessing = false
        this.$store.commit('setCurrentUser', this.user)
      }catch(error){
        this.isProcessing = false
        Toast.fire({
          icon:'error',
          title: '無法儲存編輯，請稍後再試'
        })
      }
    }   
  },
  computed:{
    ...mapState(['currentUser'])
  },
  watch:{
    initialUser(newValue){
      this.user = {
        ...this.user,
        ...newValue
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../assets/scss/_basic.scss";
  #user{
    .user__container{
      padding-bottom: 10px;
    }
    .user__image-container{
      position: relative;
      .background-wrapper{
        width: 100%;
        height: 200px;
        overflow: hidden;
        img{
          width: 100%;
          object-fit: cover;
        }
      }
      .avatar-wrapper{
        position: absolute;
        margin-left: 1rem;
        bottom: -70px;
        width: 140px;
        height: 140px;
        border: 5px solid white;
        border-radius: 50%;
        img{
          width:100%;
          height:100%;
          object-fit: cover;
          border-radius: 50%;
        }
      }
    }
    .user__btn__group{
      img{
          width:40px;
          height:40px;
        }
      &__list{
        display: flex;
        justify-content: end;
      }
      .group-item{
        padding: 1rem 0.5rem;
        cursor: pointer;
      }
      button{
        &.following{
         @extend %following;        
        }
        &.follow {
          @extend %follow;   
        }
        &.edit {
          @extend %button-white;
          width: 128px;
          height: 40px;
        }        
      }      
    }
    .user__container__info{   
      margin: 0 1rem;  
      .user__follow{
        padding-top: 8px;
        display: flex;
        @extend %tweet-text;
        .status{
          color: $font-small;
        }
        &__item{
          cursor: pointer;
          padding-right: 20px;
          .num{
            font-family: $number-font;
          }
        }
      }
      .name{
        @extend %tweet-name;
        font-size: 18px;
      }
      .id{
        @extend %tweet-account;
        font-family: $number-font;
        vertical-align: middle;
      }
      .intro{
        @extend %tweet-text;
        line-height: 22px;
        margin-top: 6px;
        word-break: break-all;
      }
    }
  }
</style>
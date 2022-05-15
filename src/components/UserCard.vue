<template>
  <div id="user">
    <div class="user__container">
      <div class="user__image-container">
        <div class="background-wrapper">
          <img :src="user.coverImg" alt="" class="background">
        </div>
        <div class="avatar-wrapper">
          <img :src="user.avatarImg" alt="" class="avatar">
        </div>      
      </div>
      <div class="user__btn__group">
        <div class="user__btn__group__list">
          <template v-if="!isCurrentUser">
            <div class="group-item">
            <img src="../assets/static/images/msg@2x.png" alt="">          
            </div>
            <div class="group-item">
              <img v-if="!isSubscribe" class="notify" src="../assets/static/images/notfi@2x.png" alt="">
              <img v-else class="notified" src="../assets/static/images/notfied@2x.png" alt="">
            </div>
            <div v-if="!user.isFollowing" class="group-item follow">
              <button 
                @click.stop.prevent="follow"
                class="follow">跟隨</button>
            </div>
            <div v-else 
              @click.stop.prevent="unfollow"
              class="group-item">           
                <button class="following">正在跟隨</button>           
            </div>
          </template>         
          <div v-else class="group-item">
            <button 
              @click="openModal"
              class="edit">編輯個人資料</button>
          </div>
        </div>
      </div>
      <div class="user__container__info">
        <p class="name">{{user.name}}</p>
        <p class="id">{{user.account}}</p>
        <p class="intro">{{user.bio}}</p>
        <div class="user__follow">
          <router-link
            :to="{
              name:'follower',
              params: {id: user.id}
            }"
          >
            <p class="user__follow__item following">
              <span class="num">{{user.followingCount}}</span>個<span class="status">跟隨中</span>
            </p>
          </router-link>
          <router-link
           :to="{
              name:'following',
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
      @close-modal="closeModal"
      />
    </template>       
  </div> 
</template>
<script>
import userAPI from '../apis/user'
import {Toast} from '../utils/helpers'
import Modal from '../components/EditModal.vue'
export default {
  components:{
    Modal
  },
  data(){
    return{
      isEditing: false,
      isCurrentUser: true,
      isSubscribe: false,
      user:{
        name: '',
        id:'',
        account:'',
        avatarImg:'',
        coverImg:'',
        is_following:'',
        followerCount:'',
        followingCount:'',
      },      
      currentUserId:8      
    }
    },
    methods:{
      closeModal(){
        this.isEditing = false
      },
      openModal(){
        this.isEditing = true
      },
      async fetchUser(userId){
        try{
          const {data, statusText} = await userAPI.get({id:userId})       
          const {userData} = data
          const {id,name, account ,coverImg, avatarImg, bio, is_following:isFollowing, Following: following, Follower: follower} = userData[0]
          let newBio = ''
          if(bio.length > 160){
            newBio = bio.slice(0,160) 
          }else{
            newBio = bio
          }
          this.user = {
            id,
            name,
            account,
            coverImg,
            avatarImg,
            bio: newBio,
            isFollowing,
            followingCount: following.length,
            followerCount: follower.length
          }
          if(this.user.id === this.currentUserId){
            this.isCurrentUser = true
          }else{
            this.isCurrentUser = false
          }
          if(statusText !== 'OK'){
            throw new Error(statusText)
          }

        }catch(error){
          Toast.fire({
            icon:'error',
            title:'無法載入使用者資訊，請稍後再試'
          })
        }       
      },
      follow(){
        //TODO: 串 /followships
        this.user = {
          ...this.user,
          isFollowing: true
        }
      },
      unfollow(){
         //TODO: 串 /followships/:followingId
       this.user = {
          ...this.user,
          isFollowing: false
        }

      }   
    },
    created(){
      const {id} = this.$route.params
      this.fetchUser(id)
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
        img{
          width: 100%;
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
      margin-left: 1rem;  
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
      }
      .intro{
        @extend %tweet-text;
        line-height: 22px;
        margin-top: 6px;
      }
    }
  }
</style>
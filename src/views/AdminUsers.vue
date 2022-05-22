<template>
  <div class="container">
    <Loading v-if="isLoading" />
      <div class="side-bar">
        <Sidebar />
      </div>    
      <div class="users-div scrollbar" action="">
        <div class="title">
          <h1 class="users-div__title">使用者列表</h1>
        </div>
        <!-- scrollbar -->
            <div class="users-div__user ">
                <div 
                v-for="user in users"
                :key ="user.id"
                class="users-div__user--card"
                >
                <img class="card-background" :src="user.coverImg" alt="">
                <img class="card-avatar" :src="user.avatarImg" alt="">
                <div class="card-info">
                  <div class="card-info-name">{{user.name}}</div>
                  <div class="card-info-account">@{{user.account}}</div>
                  <div class="card-info-tweets-likes">
                    <div class="card-info-tweets">
                      <img src="../assets/static/images/post@2x.png" alt="">
                      <span class="counts">{{user.tweetAmount.count}}</span>
                    </div>
                    <div class="card-info-likes">
                      <img src="../assets/static/images/like@2x.png" alt="">
                      <span class="counts">{{user.likeAmount.count}}</span>
                    </div>
                  </div>
                  <div class="card-info-follow">
                    <div class="card-info-followings">
                      <span class="counts">{{user.followedAmount.count}} 個</span>
                      <span class="type">跟隨中</span>
                    </div>
                    <div class="card-info-followers">
                      <span class="counts">{{user.followingAmount.count}}  位</span>
                      <span class="type">跟隨者</span>
                    </div>
                  </div>
                </div> 
              </div>
              </div>
             
            </div>       
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import adminAPI from '../apis/admin'
import {Toast} from '../utils/helpers'
import Loading from '../components/Loading'

export default {
  components: { 
    Sidebar,
    Loading
  },
  data(){
    return{
      users:[],
      isLoading: false,
    }   
  },
  methods: {
    async getUsers(){
      try{
        this.isLoading = true
        const {data, statusText} = await adminAPI.get()
        this.users = data.filter( user => user.role === 'user')
        this.users = this.users.map(user => {
          if(!user.coverImg || !user.avatarImg){
            return{
              ...user,
              coverImg: 'https://picsum.photos/630/300',
              avatarImg: require('../assets/static/images/noImage@2x.png')
            }
          }else {
            return user
          }
        })
        if(statusText !== 'OK'){
          throw new Error(statusText)
        }
        this.isLoading = false
      }catch(error){
        this.isLoading = false
        Toast.fire({
          icon: 'error',
          title: '無法取的使用者，請稍後再試'
        })
      }     
    }
  },
  created(){
    this.getUsers()
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/basic.scss";

.container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 100vh;
  grid-column-gap: 24px;
}
.side-bar{
  grid-column: 1/2;
}
.users-div {
  grid-column: 2/13;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  border-left: 1px solid $border-grey;
}
.title {
  width: 100%;
  border-bottom: 1px solid $border-grey;
  h1 {
    @extend %heading-24;
    margin: 24px auto 24px 25px;
  }
}
.users-div__user {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-template-rows: auto;
  overflow-y: scroll;
  grid-gap: 16px;
  margin-left: 8px;
  padding-top: 16px;
  &--card {
    height: 314px;
  }
}
.scrollbar {
  padding-left: 6px;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.1);
  }
}
// card
.users-div__user--card {
  position: relative;
  background-color: 
  $card-grey;
  border-radius: 10px;
  z-index: -2;
  .card-background {
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: 10px 10px 0px 0px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
  .card-avatar {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 100px;
    aspect-ratio: 1/1;
    object-fit: cover;
    border: 4px solid $white;
    border-radius: 50%;
  }
}
.card-info {
  position: absolute;
  width: 200px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  
  &-name {
    @extend %single-ellipsis;
    width: 100%;
    color: $font-black;
    font-size: 16px;
    font-weight: 700;
    line-height: 26px;
    text-align: center;
    padding: 0 16px;
  }
  &-account {
    @extend %single-ellipsis;
    color: $font-small;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    text-align: center;
    padding: 0 16px;
  }
  &-tweets-likes, &-follow {
    display: flex;
  }
  &-tweets-likes img {
    width: 24px;
    height: 24px;
  }
  &-tweets, &-likes {
    display: flex;
    align-items: center;
    margin: 16px 8px 8px 8px;
    font-family: $number-font;
    font-size: 16px;
    font-weight: 500;
    line-height: 15px;
  }
  &-follow {
    font-family: $main-font;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
  }
  &-followings, &followers {
    margin: 0 8px;
  }
  img {
    margin-right: 8px;
  }
  .counts {
    color: $font-black;
  }
  .type {
    color: $font-small;
  }
}
@media screen and (min-width: 961px){
  .side-bar{
    grid-column: 1/3;
  }
  .users-div {
  grid-column: 3/13;
  }
}
</style>
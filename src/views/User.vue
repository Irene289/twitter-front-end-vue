<template>
  <main>
    <Loading v-if="isLoading" />
    <div class="container">
      <div class="row">
        <div class="col-1 col-lg-2  sidebar">
          <Sidebar />
        </div>
        <div class="col-7 col-lg-7  content-container">
          <router-link to="/twitter" class="nav-link">
            <div class="title">
              <img
                class="title__item"
                src="../assets/static/images/leftArrow@2x.png"
                alt=""
              />
              <div class="title__item user">
                <p class="name">{{ user.name }}</p>
                <p class="tweet-num">{{tweetNum+'推文'}}</p>
              </div>
            </div>
          </router-link>

          <div class="scrollbar">
            <UserCard :initial-user="user" />
            <div class="nav-container">
              <NavTab>
                <template v-slot:nav-item>
                    <router-link
                      :to="{
                        name: 'user-tweets',
                        params:{id: user.id}
                      }"
                      class="nav-link"
                    >
                    <p class="nav-item">推文</p>
                  </router-link>
                </template>
              </NavTab>
              <NavTab>
                <template v-slot:nav-item>
                  <router-link
                    :to="{
                      name: 'user-replies',
                      params:{id: user.id}
                    }"
                     class="nav-link"
                  >
                    <p  class="nav-item">回覆</p>
                  </router-link>
                </template>
              </NavTab>
              <NavTab>
                <template v-slot:nav-item>
                  <router-link
                    :to="{
                      name: 'user-like',
                      params: {id: user.id}
                    }"
                    class="nav-link"
                  >
                    <p  class="nav-item">喜歡的內容</p>
                  </router-link>
                </template>
              </NavTab>
            </div>
            <div>
              <router-view />
            </div>
          </div>
        </div>
        <div class="col-4 col-lg-3 popular-users">
          <Popular />
        </div>
      </div>
    </div>
  </main>
</template>
<script>
  import {mapState} from 'vuex' 
  import {Toast} from '../utils/helpers'
  import userAPI from '../apis/user'
  import Popular from '../components/Popular.vue'
  import Sidebar from '../components/Sidebar.vue'
  import UserCard from '../components/UserCard.vue'
  import NavTab from './../components/NavTab.vue'
  import Loading from '../components/Loading'
  export default {
    name: 'User',   
    components:{
      Popular,
      Sidebar,
      UserCard,
      NavTab,
      Loading
    },
    data(){
      return {
        tweetNum:0,
        user:{
          name: '',
          id:'',
          introduction:'',
          account:'',
          avatarImg:'',
          coverImg:'',
          is_following:'',
          followerCount:'',
          followingCount:'',
          isLoading: false,
        }  
      }
    },
    methods:{     
      async fetchUser(userId){
        try{
          this.isLoading = true
          // TODO:篩除非user的用戶
          const {data, statusText} = await userAPI.get({id:userId})   
          const {id,role, name, account ,coverImg, avatarImg, introduction, is_following:isFollowing, Following: following, Follower: follower} = data

          this.user = {
            id,
            role,
            name,
            account,
            coverImg: coverImg? coverImg : "",
            avatarImg: avatarImg? avatarImg : "",            
            introduction: introduction? introduction: "",
            isFollowing,
            followingCount: follower.length? follower.length : 0,
            followerCount: following.length? following.length : 0,
          }

          if(statusText !== 'OK'){
            throw new Error(statusText)
          }
          this.isLoading = false
        }catch(error){
          this.isLoading = false
          Toast.fire({
            icon:'error',
            title: '無法載入使用者資訊，請稍後再試'
          })
        }
      },
      async fetchUserTweets(id){
        try{
          const {data,statusText} = await userAPI.getTweets({id})
          this.tweetNum = data.length
          if(statusText !== 'OK'){
            throw new Error(statusText)
          }
        } catch(error){
          if(error.response.status === 500){
            this.tweetNum = 0
            return
          }       
        }
      },
    },
    computed:{
      ...mapState(['currentUser'])
    },
     beforeRouteUpdate(to, from, next){
      const {id} = to.params
      this.newRoute = id
      this.fetchUser(id)
      this.fetchUserTweets(id)
      next()
    },
    created(){
      const {id} = this.$route.params
      this.fetchUser(id)
      this.fetchUserTweets(id)
    }      
  }
</script>
<style lang="scss" scoped>
@import "../assets/scss/_basic.scss";
//nav tab active
.nav-link.active,
.nav-link:focus{
  .nav-item{
    border-bottom: 2px solid $orange;   
  } 
}
.nav-item{
  padding: 15px 0;
}
.container{
  width:100%;
  max-width: 1140px;
}
.content-container {
  padding: 0;
  border: 1px solid $border-grey;
}
.title {
  padding-left: 28px;
  height: 75px;
  display: flex;
  align-items: center;
  img {
    width: 17px;
    height: 14px;
    cursor: pointer;
  }
  .user {
    margin-left: 19px;
    .name {
      @extend %tweet-name;
      font-size: 18px;
    }
    .tweet-num {
      @extend %tweet-account;
      font-weight: 500;
      font-size: 13px;
      line-height: 18px;
    }
  }
}
.nav-container {
  display: flex;
  border-bottom: 1px solid $border-grey;
}
.popular-users{
  height: 100vh;
}
.scrollbar {
  height: calc(100vh - 75px);
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 1px $scrollbar;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: $scrollbar;
  }
}
</style>
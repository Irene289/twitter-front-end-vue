<template>
   <main>
    <div class="container">
      <div class="row">
        <div class="col-2 sidebar">
          <Sidebar />
        </div>
        <div class="col-7 content-container">
          <div class="title">
            <img
              @click.stop.prevent="visit(userId, 'user-tweets')" 
              class="title__item " 
              src="../assets/static/images/leftArrow@2x.png" 
              alt=""
            >
            <div 
              @click.stop.prevent="visit(userId, 'user-tweets')"
              class= "title__item user">
              <p class= "name">{{userName}}</p>
              <p class= "tweet-num">{{tweetNum+'推文'}}</p>
            </div>          
          </div>
          <div class="nav-container">
            <NavTab>
              <template v-slot:nav-item> 
                <router-link
                  :to="{
                    name:'follower',
                    params: {id: userId}
                  }"
                  class="nav-link"
                >
                <p class="nav-item">追蹤者</p> 
                </router-link>         
              </template>
            </NavTab>
            <NavTab>
              <template v-slot:nav-item> 
                <router-link
                  :to="{
                    name:'following',
                    params: {id: userId}
                  }"
                  class="nav-link"
                >
                <p class="nav-item">正在追隨</p> 
                </router-link>         
              </template>
            </NavTab>
          </div>     
          <div class="scrollbar">
            <router-view 
              :initial-followings="followings"
              :initial-followers="followers"
              @after-userfollow="afterUserFollow"
            />
          </div>
        </div>
        <div class="col-3  popular-users">
          <Popular 
            :top-users="topUsers"
            @after-follow="afterPopularClick"
          />
        </div>
      </div>      
    </div>  
  </main>
</template>
<script>
  import {visitPage} from '../utils/mixins'
  import userAPI from '../apis/user'
  import {Toast} from '../utils/helpers'
  import Popular from '../components/Popular.vue'
  import Sidebar from '../components/Sidebar.vue'
  import NavTab from './../components/NavTab.vue'
  import {mapState} from 'vuex'

  export default {
    name: 'UserFollow',
    mixins:[visitPage],
    components:{
      Popular,
      Sidebar,
      NavTab
    },
    data(){
      return {
        userId:8,
        userName:'',
        tweetNum:0,
        followings: [],  // 要放 followers
        followers: [],   // 要放 followings
        topUsers: []
      }
    },
    methods:{
      visit(id,pathName){
        this.visitUserPage(id,pathName)
      },
      async fetchUser(userId){
        try{
          const {data, statusText} = await userAPI.get({id:userId})   
          const {id,name} = data
          this.userId = id
          this.userName = name  
          this.followings = data.Follower  
          this.followers = data.Following
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
      async fetchTopUsers(rank){
        try{
          const {data, statusText} = await userAPI.getTopUsers({rank})
          this.topUsers = [...data]
          // 後端已篩過非user
          this.topUsers = data.filter(user => user.id !== this.currentUser.id )
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
      afterPopularClick() {
        const {id} = this.$route.params
        // 接受 Popular 的 emit 後，去 fetchUser 打 API 更新 followers 跟 followings
        this.fetchUser(id)
      },
      afterUserFollow() {
        // 接受 UserFollowing 跟 UserFollower 的 emit 後，去 fetchTopUsers 打 API 更新 topUsers
        // 再把 topUsers 用 props 傳遞到 Popular
        this.fetchTopUsers(10)
      }
    },
     created(){
      const {id} = this.$route.params
      this.fetchUser(id)
      this.fetchUserTweets(id)
      this.fetchTopUsers(10)
    },
    computed:{
      ...mapState(['currentUser'])
    }, 
  }
</script>
<style lang="scss" scoped>
@import "../assets/scss/_basic.scss";
.nav-link.active,
.nav-link:focus{
  .nav-item{
    border-bottom: 2px solid $orange;   
  } 
}
.nav-item{
  padding: 15px 0;
}
.content-container{
  padding:0;
  border-left: 1px solid $border-grey;
  border-right: 1px solid $border-grey;
}
.title{
  cursor: pointer;
  padding-left: 28px;
  height: 75px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid $border-grey;
  img{
    width: 17px;
    height: 14px;
    cursor: pointer;
  }
  .user{
    margin-left: 19px;
    .name{
      @extend %tweet-name;
      font-size: 18px;
    }
    .tweet-num{
        @extend %tweet-account;
        font-weight: 500;
        font-size:13px;
        line-height: 18px;
    }
  }
}
.nav-container{
  display: flex;
  height: 54px;
  border-bottom: 1px solid $border-grey;
}
.scrollbar {
    height: calc(100vh - 76px - 55px);
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
<template>
  <main>
    <div class="container">
      <div class="row">
        <div class="col-2 sidebar">
      <Sidebar />
      </div>
      <div class="col-7 content-container">
         <router-link to="/twitter">
            <div class="title">
              <img 
                class="title__item " 
                src="../assets/static/images/leftArrow@2x.png" 
                alt=""
              >
            
                <div class= "title__item user">
                  <p class= "name">{{user.name}}</p>
                  <p class= "tweet-num">45推文</p>
                </div> 
                              
            </div> 
          </router-link>     
        <UserCard 
          :initial-user="user"
        />
        <div class="nav-container">       
          <NavTab >
            <template v-slot:nav-item> 
              <router-link
                :to="{
                  name:'user-tweets',
                  params:user.id
                }"
              >
              <p>推文</p> 
              </router-link>         
            </template>
          </NavTab>
          <NavTab >
            <template v-slot:nav-item> 
              <router-link
               :to="{
                  name:'user-replies',
                  params:user.id
                }"
              >
              <p>回覆</p> 
              </router-link>         
            </template>
          </NavTab>
          <NavTab >
            <template v-slot:nav-item> 
              <router-link
                :to="{
                  name:'user-like',
                  params:user.id
                }"
              >
              <p>喜歡的內容</p> 
              </router-link>         
            </template>
          </NavTab>
        </div>
        <div class="scrollbar">
          <router-view />
        </div>
      </div>
      <div class="col-3  popular-users">
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
  export default {
    name: 'User',   
    components:{
      Popular,
      Sidebar,
      UserCard,
      NavTab
    },
    data(){
      return {
        newRoute:this.$route.params.id,
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
        }  
      }
    },
    methods:{     
      async fetchUser(userId){
        try{
          // TODO:篩除非user的用戶
          const {data, statusText} = await userAPI.get({id:userId})   
          const {id,name, account ,coverImg, avatarImg, introduction, is_following:isFollowing, Following: following, Follower: follower} = data
          this.user = {
            id,
            name,
            account,
            coverImg: coverImg? coverImg : "",
            avatarImg: avatarImg? avatarImg : "",            introduction,
            isFollowing,
            followingCount: following.length? following.length : 0,
            followerCount: follower.length? follower.length : 0,
          }
          if(statusText !== 'OK'){
            throw new Error(statusText)
          }
        }catch(error){

          Toast.fire({
            icon:'error',
            title: '無法載入使用者資訊，請稍後再試'
          })
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
      next()
    },
    created(){
      const {id} = this.$route.params
      this.fetchUser(id)
    }      
  }
</script>
<style lang="scss" scoped>
 @import "../assets/scss/_basic.scss";
  .content-container{
    padding:0;
    border: 1px solid $border-grey;   
  }
  .title{
    padding-left: 28px;
    height: 75px;
    display: flex;
    align-items: center;
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
    border-bottom: 1px solid $border-grey;
  }
  .scrollbar {
    height: calc(100vh - 516px);
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
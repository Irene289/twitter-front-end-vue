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
              <p class= "tweet-num">45推文</p>
            </div>          
          </div>
          <div class="nav-container">
            <NavTab>
              <template v-slot:nav-item> 
                <router-link
                  :to="{
                    name:'follower',
                    params: userId
                  }"
                >
                <p>追蹤者</p> 
                </router-link>         
              </template>
            </NavTab>
            <NavTab>
              <template v-slot:nav-item> 
                <router-link
                  :to="{
                    name:'following',
                    params: userId
                  }"
                >
                <p>正在追隨</p> 
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
  import {visitPage} from '../utils/mixins'
  import userAPI from '../apis/user'
  import {Toast} from '../utils/helpers'
  import Popular from '../components/Popular.vue'
  import Sidebar from '../components/Sidebar.vue'
  import NavTab from './../components/NavTab.vue'
  export default {
    name: 'User',
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
        navList:[
          
          { id: 1,
            title: '追蹤者',
            path: '/users/:id/follow'
          },
          { 
            id: 2,
            title: '正在追隨',
            path: '/users/:id/follow/following'
          }
        ]       
      }
    },
    methods:{
      visit(id,pathName){
        console.log(id)
        this.visitUserPage(id,pathName)
      },
       async fetchUser(userId){
        try{
          const {data, statusText} = await userAPI.get({id:userId})   
          const {id,name} = data
          this.userId = id
          this.userName = name        
          if(statusText !== 'OK'){
            throw new Error(statusText)
          }

        }catch(error){
          Toast.fire({
            icon:'error',
            title:'無法載入使用者資訊，請稍後再試'
          })
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
.content-container{
  padding:0;
  border: 1px solid $border-grey;
  
}
.title{
  cursor:pointer;
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
    height: calc(100vh - 130px);
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
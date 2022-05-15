<template>
  <nav id="sidebar">  
    <TweetModal :d-none="dNone" @tweet-modal="tweetModal" />
    <ul class="nav__list">
      <img class="logo" src="../assets/static/images/navLogo@2x.png" alt="">
      <template v-if="!isAdmin">
      <li class="nav__list__item ">
        <router-link to="/twitter">
          <div class="nav__list__item__wrapper">
            <img class="active" src="../assets/static/images/orangeHome@2x.png" alt="">
            <img class="inactive" src="../assets/static/images/home@2x.png" alt="">
            <p>首頁</p>
          </div>  
        </router-link>     
      </li>
       <li class="nav__list__item ">
        <router-link 
          :to="{
            name:'user-tweets',
            params:{id:currentUserId}
            
            }">
          <div class="nav__list__item__wrapper">
            <img class="active" src="../assets/static/images/orangeUser@2x.png" alt="">
            <img class="inactive" src="../assets/static/images/user@2x.png" alt="">
            <p>個人資料</p>
          </div>  
        </router-link>     
      </li>
       <li class="nav__list__item ">
        <router-link to="/users/:id/setting">
          <div class="nav__list__item__wrapper">
            <img class="active" src="../assets/static/images/orangeSet@2x.png" alt="">
            <img class="inactive" src="../assets/static/images/setIcon@2x.png" alt="">
            <p>設定</p>
          </div>  
        </router-link>     
      </li>
      </template>
      <template v-else>
        <li 
          v-for="item in navAdmin"
          :key="item.id"
          class="nav__list__item ">
          <router-link
            :to="item.path"
          >
            <div class="nav__list__item__wrapper">
            <img class="active" :src="item.iconActive" alt="">
            <img class="inactive" :src="item.iconInactive" alt="">
            <p>{{item.title}}</p>
          </div>    
          </router-link>
             
        </li> 
      </template>
           
    </ul>  
    <button 
      v-if="!isAdmin"
      @click.stop.prevent="tweetModal"
    >
      推文
    </button>  
    <div 
      class="logout nav__list__item__wrapper"
      @click.stop.prevent="onClickLogout"
    >
      <img class="active" src="../assets/static/images/orangeLogout@2x.png" alt="">
      <img 
        class="inactive" 
        src="../assets/static/images/logout@2x.png" alt=""
      >
      <p>登出</p>
    </div>       
  </nav>
</template>
<script>
import TweetModal from "../components/TweetModal";

export default {
  name:'Sidebar',
  components: {
    TweetModal
  },
  data(){
    return{
      route: 'user',
      isAdmin: false,
      currentUserId:'8',
      navAdmin:[
         {
          title: '推文清單',
          id:4,
          iconActive: require('../assets/static/images/orangeHome@2x.png'),
          iconInactive: require('../assets/static/images/home@2x.png'),
          path:'/admin/tweets'        
        },{
          title: '使用者列表',
          id:5,
          iconActive: require('../assets/static/images/orangeUser@2x.png'),
          iconInactive: require('../assets/static/images/user@2x.png'),
          path:'/admin/users'        
        }
      ],
      dNone: true,
    }
  },
  methods:{
    toggleNavList(){
      const route = this.$route.name
      if (route === "admin-tweets" || route === "admin-users"){
        this.isAdmin = true
      } else {
        this.isAdmin = false
      }
    },
    onClickLogout () {
      this.$store.commit('revokeAuthentication')
      localStorage.removeItem('token')
      this.$router.push('/signin')
    },
    tweetModal() {
      this.dNone = !this.dNone;
    },
  },
  created(){
    this.toggleNavList()
  },
}
</script>

<style lang="scss" scoped>
  @import "../assets/scss/_basic.scss";
  nav{ 
    height:100%;
    position: relative;
    padding-top: 13px;
    .nav__list{
      padding-left: 20px;
      .logo{
        width: 40px;
        height: 40px;
      }
    }    
    .nav__list__item{  
      margin-top:40px;
      margin-bottom:40px;        
      &__wrapper{
        cursor: pointer; 
        display: flex;
        img{
          width:20px;
          height:20px;
        }
        p{
          margin-left: 17px;
          font-weight: 700;
          color: #44444F;
        }
        .active{
          display: none;
        }
        &:hover{
          p{
            color: $orange;
          }
          .active{
            display: block;
          }
          .inactive{
            display: none;
          }
        }
      }
    }
    button{
      @extend %button-orange;
      width:100%;
      max-width: 178px;
      height: 46px;
      font-size: 20px;
    }
    .logout{
      position: absolute;
      bottom: 13px;
      left: 13px;
    }
  }

</style>

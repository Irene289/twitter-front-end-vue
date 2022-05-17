<template>
  <nav id="sidebar">  

    <!-- modal -->
    <div 
      class="container" 
      :class="{'d-none': dNoneReplyModal}"
    >
      <div class="modal row">
        <form class="modal-content col-6" action="">
          <div class="modal-content-cancel">
            <button class="btn" @click.stop.prevent="handleCloseBtn">
              <img src="../assets/static/images/orangeClose@2x.png" alt="" />
            </button>
          </div>

          <TweetModal>
            <!--   推文 -->
            <template 
              v-slot:isReplyModel
              v-if="isReplyModel"
            >
              <div class="tweet-div">
              </div>
            </template>  
            <!-- <template v-slot:replytoAvatarImg>
              <img class="avatar" :src="user.avatarImg" alt="" />
            </template>
            <template v-slot:replyto>
              <p class="content-info-name">{{ tweets.description }}</p>
              <p class="content-info-account">@{{ user.account }}</p>
              <p class="content-info-time">{{ tweets.createdAt }}</p>
            </template>
            <template v-slot:replytoAccount> @{{ user.account }} </template> -->

            <!-- 回覆 -->
            <template v-slot:avatarImg>
              <img class="modal-content-avatar" :src="currentUser.avatarImg" alt="" />
            </template>
            <template v-slot:text>
              <textarea
                v-model="text"
                name="tweet"
                placeholder="有什麼新鮮事？"
              >
              </textarea>
            </template>
            <template v-slot:alert>
              <p class="modal-alert">
                字數不可超過 140 字</p>
            </template>
          </TweetModal>

          <button
            class="modal-tweet"
            @click.stop.prevent="tweetModal"
          >
            推文
          </button>
        </form>
      </div>
    </div>
    <!-- <TweetModal :d-none="dNone" @tweet-modal="tweetModal" /> -->

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
            params:{id:currentUser.id}           
            }">
          <div class="nav__list__item__wrapper">
            <img class="active" src="../assets/static/images/orangeUser@2x.png" alt="">
            <img class="inactive" src="../assets/static/images/user@2x.png" alt="">
            <p>個人資料</p>
          </div>  
        </router-link>     
      </li>
       <li class="nav__list__item ">
        <router-link :to="{name: 'user-setting', params: {id: currentUser.id}}">
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
      class="tweet-btn"
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
import TweetModal from "../components/TweetModal"
import { mapState } from 'vuex'
export default {
  name:'Sidebar',
  components: {
    TweetModal
  },
  data(){
    return{
      route: 'user',
      isAdmin: false,
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
      text: '',
      dNoneReplyModal: true,
      isReplyModel: true,
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
    handleCloseBtn () {
      this.dNoneReplyModal = true
    },
    onClickLogout () {
      this.$store.commit('revokeAuthentication')
      localStorage.removeItem('token')
      this.$router.push('/signin')
    },
    tweetModal() {
      this.dNoneReplyModal = !this.dNoneReplyModal;
    },
  },
  computed: {
    ...mapState(['currentUser'])
  },
  created(){
    this.toggleNavList()
  }

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
    .tweet-btn {
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
  // modal
.modal {
  background-color: $modal-background; 
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  .modal-content {
  background-color: $white;
  border-radius: 14px;
  margin: auto;
  margin-top: 56px;
  padding: 0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  &-cancel {
    width: 100%;
    border-bottom: 1px solid $border-grey;
  }
  &-cancel img {
    width: 24px;
    height: 24px;
    margin: 16px;
  }
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}
.modal-tweet {
  @extend %button-orange;
  min-width: 76px;
  height: 40px;
}
}

</style>

<template>
  <div class="container">
    <form class="signin-form" action="">
      <div class="logo">
        <img
          class="signin-form__logo-img"
          src="../assets/static/images/logo@2x.jpg"
          alt=""
        />
      </div>
      <div class="title">
        <h1 
          v-if="frontStage"
          class="signin-form__title"
        >
          登入 Alphitter
        </h1>
        <h1 
          v-else
          class="signin-form__title "
        >
          後台登入
        </h1>
      </div>
      <div class="form-container">
        <SignInForm 
          @after-click-signin="afterClickSignin"
        />
      </div>
        <div 
        v-if="frontStage"
        class="cancel-signin"
      >
        <p>
          <router-link class="regist" to="/regist"> 註冊 </router-link>
        </p>
        <p>・</p>
        <p 
          class="backstage-signin sign-in" 
          @click="toggleRoute"
        >
          後台登入
        </p>
      </div>
      <div 
        v-else
        class="cancel-signin"
      >
        <p
          class="frontstage-signin sign-in" 
          @click="toggleRoute"
        >
          前台登入
        </p>
      </div>
    </form>
    
  </div>
</template>

<script>
import SignInForm from '../components/SignInForm.vue'
// import {Toast} from './../utils/helpers'
export default {
  name: 'AdminSignin',
  components:{
    SignInForm
  },
  data () {
    return {
      isAdmin: true,
      frontStage: true,
    }
  },
  methods:{
    // afterClickSignin(isAdmin){
    //   console.log(isAdmin)
    //   const route = this.$route.name
    //   this.isAdmin = isAdmin
    //   if(isAdmin && route === 'admin'){
    //     this.$router.push('/admin/tweets')
    //     return
    //     } 
    //   else if(!isAdmin && route === 'sign-in'){
    //     this.$router.push('/twitter')
    //     return
    //   } else {
    //       Toast.fire({
    //         icon:'warning',
    //         title:'此帳號不存在'
    //       })
    //     }
    // },
     toggleRoute () {
      const route = this.$route.path
      if (route === '/signin') {
        this.frontStage = false
        this.$router.push('/admin')
      } else if (route === '/admin') {
        this.frontStage = true
        this.$router.push('/signin')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/basic.scss";

.signin-form {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
.form-container{
  width:365px;
}
.logo img {
  width: 50px;
  height: 50px;
  margin-top: 69px;
}
.title h1 {
  @extend %heading;
  margin-top: 24px;
  margin-bottom: 8px;
}

.cancel-signin {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 356px;
  height: 36px;
  .frontstage-signin {
    color: $form-link-blue;
    font-size: 16px;
    font-weight: 400;
    padding: 6px 12px;
  }
}
.sign-in, .regist{
  cursor: pointer;
  color: $form-link-blue;
  text-decoration: underline;
}
</style>
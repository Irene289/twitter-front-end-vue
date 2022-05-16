<template>
  <div class="container">
    <form 
      @submit.stop.prevent="handleSubmit"
      action="">
       <div class="signin-form__div signin-form__input-account">
        <label for="">帳號</label>
        <input 
          :class="{warning:!isValid}"
          v-model="account" 
          type="text" placeholder="請輸入帳號" />
        <p v-if="!isValid" :class="{invalid:!isValid}">此帳號不存在</p>
      </div>

      <div class="signin-form__div signin-form__input-password">
        <label for="">密碼</label>
        <input 
          :class="{warning:!isValid}"
          v-model="password" type="password" 
          placeholder="請輸入密碼" />
        <p v-if="!isValid" :class="{invalid:!isValid}">此帳號不存在</p>
      </div>

      <button class="btn btn-signin" type="submit" :disabled="isProcessing">
        登入
      </button>
    </form>    
  </div>
</template>

<script>
import authorizationAPI from './../apis/authorization'
import {Toast} from './../utils/helpers'
export default {
  name: 'SignInForm',
  data () {
    return {
      isProcessing: false,
      isValid: true,
      account:'',
      password:'',
    }
  },
  watch:{
    //當切換前台或後台登入的頁面時會將顯示的不是當前登入者提示移除
    $route(){
      this.isValid = true
    }
  },
  methods:{
    async handleSubmit(){
      console.log('click')
      try{
        this.isProcessing = true
        if ( !this.account || !this.password ) {
          Toast.fire({
            icon: 'warning',
            title: '請輸入帳密'
          })
          return
        } 
        const {data} = await authorizationAPI.signIn({
          account: this.account,
          password: this.password
        })
        if ( data.status !== 'success' ) {
          throw new Error(data.message)
        }
        const {user} = data.data
        const isAdmin = user.is_admin
        const route = this.$route.name
        if(!user.id){
          this.isValid = false
        }
       if(isAdmin && route === 'admin'){
         // token
        localStorage.setItem('token', data.data.token)
        this.$store.commit('setCurrentUserToken', user)
        this.$router.push('/admin/tweets')
        return
        } 
      else if(!isAdmin && route === 'sign-in'){
        localStorage.setItem('token', data.data.token)
        this.$store.commit('setCurrentUser',user )
        this.$router.push('/twitter')
        return
      } else {
        this.isValid = false
        }
         this.password = ''
      
        this.isProcessing = false
      }catch(error){
        this.isProcessing = false
        this.password = ''
        this.isValid = false     
        console.log('Error', error)
        Toast.fire({
          icon: 'warning',
          title: '請確認您輸入了正確的帳號密碼'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../assets/scss/basic.scss";

  .invalid{
    color:#FC5A5A;
  }
  
  .signin-form__div {
    @extend %input-block;
    display: flex;
    flex-flow: column nowrap;
    label {
      @extend %form-label;
    }
    input {
      @extend %form-input;
      border: none;
      background: $form-input-grey;
      &.warning {
      border-bottom: 2px red solid;
    }
    }
    input::placeholder {
      color: $form-input-placeholder;
    }
    &::after {
      content: "";
      @extend %input-bottom;
    }
    
  }
  .btn {
    @extend %button-orange;
    width: 356px;
    height: 46px;
    margin-top: 40px;
    margin-bottom: 16px;
    font-size: 20px;
    line-height: 30px;
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
      text-decoration: none;
      padding: 6px 12px;
    }
  }
</style>

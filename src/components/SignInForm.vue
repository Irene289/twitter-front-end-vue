<template>
  <div class="container">
    <form 
      @submit.stop.prevent="handleSubmit"
      action="">
       <div class="signin-form__div signin-form__input-account">
        <label for="">帳號</label>
        <input v-model="account" type="text" placeholder="請輸入帳號" />
      </div>

      <div class="signin-form__div signin-form__input-password">
        <label for="">密碼</label>
        <input v-model="password" type="password" placeholder="請輸入密碼" />
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
      account:'',
      password:''
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
        // token
        localStorage.setItem('token', data.data.token)
        const {user} = data.data
        console.log(user)
        const isAdmin = user.is_admin
        console.log(isAdmin)
        //回傳是否為admin
        this.$emit('after-click-signin', isAdmin)
        this.isProcessing = false
      }catch(error){
        this.isProcessing = false
        this.password = ''

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

  // .signin-form {
  //   display: flex;
  //   flex-flow: column nowrap;
  //   justify-content: center;
  //   align-items: center;
  // }
  // .logo img {
  //   width: 50px;
  //   height: 50px;
  //   margin-top: 69px;
  // }
  // .title h1 {
  //   @extend %heading;
  //   margin-top: 24px;
  //   margin-bottom: 8px;
  // }
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

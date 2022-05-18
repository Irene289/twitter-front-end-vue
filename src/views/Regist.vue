<template>
  <div class="container">
    <form 
      @submit.stop.prevent="handleSubmit"
      class="regist-form" action="">
      <div class="logo">
        <img
          class="regist-form__logo-img"
          src="../assets/static/images/logo@2x.jpg"
          alt=""
        />
      </div>

      <div class="title">
        <h1 class="regist-form__title">建立你的帳號</h1>
      </div>

      <div class="regist-form__div regist-form__input-account">
        <label for="">帳號</label>
        <input v-model="account" type="text" name="account" placeholder="請輸入帳號" />
      </div>

      <div class="regist-form__div regist-form__input-name">
        <label for="">名稱</label>
        <input v-model="name" name="name" type="text" placeholder="請輸入使用者名稱" />
      </div>

      <div class="regist-form__div regist-form__input-email">
        <label for="">Email</label>
        <input v-model="email" name="email" type="text" placeholder="請輸入 Email" />
      </div>

      <div class="regist-form__div regist-form__input-password">
        <label for="">密碼</label>
        <input v-model="password" name="password" type="text" placeholder="請設定密碼" />
      </div>

      <div class="regist-form__div regist-form__input-password-check">
        <label for="">密碼確認</label>
        <input v-model="passwordCheck" type="passwordCheck" name="passwordCheck" placeholder="請再次輸入密碼" />
      </div>

      <button class="btn btn-regist" type="submit" :disabled="isProcessing">
        註冊
      </button>

      <div class="cancel-regist">
        <p>
          <router-link class="frontstage-signin" to="/signin">
            取消
          </router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import authorizationAPI from '../apis/authorization'
import {Toast} from '../utils/helpers' 
export default {
  name: 'Regist',
  data(){
    return{
      isProcessing: false,
      account: "",
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    }
  },
  methods:{
    async handleSubmit(){
      try{
        this.isProcessing = true
        const {data} = await authorizationAPI.regist({
          account: this.account,
          name: this.name,
          email: this.email,
          password: this.password,
          passwordCheck: this.passwordCheck
        })
        if(data.status !== 'success'){
          throw new Error (data.data.status )
        } 
        //自動登入功能   
        localStorage.setItem('token', data.data.token) 
        // this.$store.commit('setToken')
        this.$router.push('/signin')       
        
      }catch(error){
        this.isProcessing = false
        console.log(error.toJSON() )
        if(error.response.status === 500){
          Toast.fire({
            icon:'warning',
            title:'此帳戶已重複註冊'
          })
        }else{
          Toast.fire({
            icon:'error',
            title:'暫時無法註冊，請稍後再試'
          })
        }       
      }
    }
  }

};
</script>

<style lang="scss" scoped>
@import "../assets/scss/basic.scss";

.regist-form {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
.logo img {
  width: 50px;
  height: 50px;
  margin-top: 69px;
}
.title h1 {
  @extend %heading;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  margin-top: 24px;
  margin-bottom: 8px;
  &.warning{
  color: red;
  }
}
.regist-form__div {
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
  &:hover::after{
    background: transparent;
    @extend %focus;
  }
}
.btn {
  @extend %button-orange;
  width: 356px;
  height: 46px;
  margin-top: 40px;
  margin-bottom: 22px;
  font-size: 20px;
  line-height: 30px;
}
.frontstage-signin {
  color: $form-link-blue;
  font-size: 16px;
  line-height: 24px;
  text-decoration: none;
}

</style>
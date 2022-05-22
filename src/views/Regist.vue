<template>
  <div class="container">
    <form 
      @submit.stop.prevent="handleSubmit" autocomplete="off"
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
        <input 
          v-model.trim="account" 
          type="text" 
          name="account" 
          placeholder="請輸入帳號" 
          @change="inputWarning"
          required
        />
        <div class="text-limits">
          <span 
            v-show="wrongAccount"
            class="text-limit">
            請輸入英文字母或數字
          </span>
        </div>
      </div>

      <div class="regist-form__div regist-form__input-name">
        <label for="">名稱</label>
        <input 
          v-model.trim="name" 
          name="name" 
          type="text" 
          placeholder="請輸入使用者名稱"
          @change="inputWarning"
          required
        />
        <div class="text-limits text-limit-length">
          <span 
            v-show="wrongName"
            class="text-limit">
            請輸入英文姓名（可包含 - 與空白，不包含其它符號）
          </span>
          <span class="text-length" :class="{ waring: isExceed }">
            {{ textWarning(name.length) }}
            {{ name.length }}/50</span
          >
        </div>
      </div>

      <div class="regist-form__div regist-form__input-email">
        <label for="">Email</label>
        <input 
          v-model.trim="email" 
          name="email" 
          type="email" 
          placeholder="請輸入 Email"
          autocomplete="new-email"
          @change="inputWarning"
          required
        />
        <div class="text-limits">
          <span 
            v-if="wrongEmail"
            class="text-limit"
          >
            請輸入正確 email 格式
          </span>
        </div>
      </div>

      <div class="regist-form__div regist-form__input-password">
        <label for="">密碼</label>
        <input 
          v-model.trim="password" 
          name="password" 
          type="password" 
          placeholder="請設定密碼" 
          @change="inputWarning"
          
          required
        />
        <div class="text-limits">
          <span 
            v-show="wrongPassword"
            class="text-limit"
          >
            請輸入英文字母或數字
          </span>
        </div>
      </div>

      <div class="regist-form__div regist-form__input-password-check">
        <label for="">密碼確認</label>
        <input 
          v-model.trim="passwordCheck" 
          type="password" 
          name="passwordCheck" 
          placeholder="請再次輸入密碼"
          @change="inputWarning"
          required 
        />
        <div class="text-limits">
          <span 
            v-show="wrongPasswordCheck"
            class="text-limit"
          >
            請輸入英文字母或數字
          </span>
        </div>
      </div>

      <button 
        class="btn btn-regist" 
        type="submit" :disabled="isExceed"
      >
        {{isProcessing ? "處理中" : "註冊"}}
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
      account: "",
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
      wrongAccount: false,
      wrongName: false,
      wrongEmail: false,
      wrongPassword: false,
      wrongPasswordCheck: false,
      isProcessing: false,
      isExceed: false,
      isWarning: false
    }
  },
  methods:{
    async handleSubmit(){
      if(
        !this.account ||
        !this.name ||
        !this.email ||
        !this.password ||
        !this.passwordCheck
      ){
        Toast.fire({
          icon:"warning",
          title:"輸入欄位不可為空白"
        })
        return
      } 
      if(this.password !== this.passwordCheck){
         Toast.fire({
          icon:"warning",
          title:"密碼不一致，請再次輸入"
        })
        return
      }
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
        this.isProcessing = false
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
    },
    textWarning(length){
      length > 50 ? this.isExceed = true : this.isExceed = false
    },
    inputWarning() {
      const re = /^[A-Za-z0-9]*$/
      const nameRe = /^([A-Za-z]{1,}\s?-?)*[A-Za-z]{1,}$/
      const emailRe = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/

      re.test(this.account)
        ? this.wrongAccount = false 
        : this.wrongAccount = true

      nameRe.test(this.name) || !this.name.trim() === ''
        ? this.wrongName = false 
        : this.wrongName = true

      emailRe.test(this.email) || this.email.trim() === ''
        ? this.wrongEmail = false 
        : this.wrongEmail = true

      re.test(this.password) || this.password.trim() === ''
        ? this.wrongPassword = false 
        : this.wrongPassword = true

      re.test(this.passwordCheck) || this.passwordCheck.trim() === ''
        ? this.wrongPasswordCheck = false 
        : this.wrongPasswordCheck = true
        
      if (re.test(this.account) 
        && nameRe.test(this.name)
        && emailRe.test(this.email)
        && re.test(this.password)
        && re.test(this.passwordCheck)
      ) {
        this.isWarning = false
      } else {
        this.isWarning = true
      }
    },
  },
  watch:{
    name(){
      this.textWarning()
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
    &:focus{
    background: transparent;
    @extend %focus;
  }
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
.text-limits {
  color: $modal-alert;
  display: flex;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  padding-top: 4px;

  .text-limit {
    color: $modal-alert;
    margin-left: 10px;
  }
  .text-length {
    @extend %form-label;
    display: inline-block;
    margin-left: auto;
    margin-top: -4px;
  }
  .waring {
    color: $modal-alert;
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
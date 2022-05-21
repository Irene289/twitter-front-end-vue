<template>
  <div class="modal">
    <form 
      @submit.stop.prevent="handleSubmit"
      class="form" action="submit">
      <div class="top__bar">
        <img
          @click="closeModal"
          class="icon" src="../assets/static/images/orangeClose@2x.png" alt="">
        <p class="top__bar__title">編輯個人資料</p>
        <button class="submit" type="submit">儲存</button>
      </div>
      <div class="user__image">
        <div class="user__image__form-item item-background">
          <div class="background-wrapper">
            <img :src="user.coverImg | coverFilter" alt="" class="background">
          </div>
          <div class="label-group">
            <label for="background-update">
              <img class="icon" src="../assets/static/images/update@2x.png" alt="">
            </label>
            <label>
              <img 
                @click.stop.prevent ="cancelUpdateCover"
                class="icon" src="../assets/static/images/whiteClose@2x.png" alt="">
            </label>
          </div>
          <input 
            @change.stop.prevent="handleCoverChange"
            type="file" id="background-update" name="cover_img" accept="image/*">
        </div>
        <div class="user__image__form-item item__avatar">
          <div class="avatar-wrapper">
            <img :src="user.avatarImg | avatarFilter" alt="" class="avatar">
          </div>
          <label
            
            class="label-avatar" for="avatar-update"> 
            <img class="icon" src="../assets/static/images/update@2x.png" alt="">
          </label>
          <input
            @change.stop.prevent="handleAvatarChange"
            type="file" id="avatar-update" name="avatar_img" accept="image/*">
        </div>
      </div>
      <div class="user__info">
        <div class="info-item">
          <label for="name">名稱</label>
          <input 
            v-model.trim="user.name" :class="{red:!nameIsValid}" 
            class="name" name="name" type="text" 
          />
          <div class="hint-group">
            <p :class="{hidden:nameIsValid}" class="warning">字數超出上限</p>
            <p class="length">{{user.name.length}}/50</p>
          </div>
        </div>
        <div class="info-item">
          <label for="introduction">自我介紹</label>
          <textarea 
            v-model="user.introduction" :class="{red:!introIsValid}"
            name="introduction" class="intro" cols="30" rows="10" ></textarea>
          <div class="hint-group">
            <p :class="{hidden:introIsValid}" class="warning" >字數超出上限</p>
            <p class="length">{{user.introduction.length}}/160</p>
          </div>
        </div>        
      </div>     
    </form>
  </div>
</template>
<script>
import {imgFilter} from '../utils/mixins'
import {Toast} from '../utils/helpers'
export default {
  props:{
    initialUserEdit:{
      type: Object,
      default: () => {
        return{
          id: -1,
          name:'',
          coverImg: '',
          avatarImg: require('../assets/static/images/noImage@2x.png'),
          introduction: ''
        }       
      }  
    }
  },
  mixins:[imgFilter],
  data(){
    return{
      user:{...this.initialUserEdit},
      initialAvatar:'',
      initialCover:this.initialUserEdit.coverImg,
      nameIsValid: true,
      introIsValid: true
    }
  },
  methods:{
    closeModal(){
      this.$emit('close-modal')
    },
    handleAvatarChange(e){
      const file = e.target.files
      if(file.length === 0) {
      // 沒有選取相片使用原本預設的舊照片，如果沒有設定if(file.length===0) return，在下一步window.URL.createObjectURL(file[0])時會因為取不到資料而報錯
      this.user.coverImg = this.initialCover
      return
      }  
      const imgUrl = window.URL.createObjectURL(file[0]) 
      this.user.avatarImg = imgUrl
    },
    handleCoverChange(e){
      //TODO: bug:取消再選擇時無法重複選擇同一張，一定要先選別張，才能再選原本那張，推斷原因是因為change，由於取消後file裡面的檔案是一樣的，再次選擇同一張時，因為沒有改變故無法觸發change
      let file = e.target.files
      if(file.length === 0) {
      this.user.coverImg = this.initialCover
      return
      }
      const imgUrl = window.URL.createObjectURL(file[0]) 
      this.user.coverImg = imgUrl
    },
    cancelUpdateCover(){
      this.user.coverImg = this.initialCover
    },
    handleSubmit(e){
      //排除name輸入空格
      const name = this.user.name.replace(/ /g,'')
      if(name.length === 0 ){
        Toast.fire({
          icon: 'warning',
          title: '名稱不可為空白'
        }) 
        return 
      }
      if(this.user.name.length > 50 || this.user.introduction.length > 160) {
         return
      } 
      const form = e.target
      const formData = new FormData(form)
      this.$emit('after-submit',formData)
      this.closeModal()
     
    },
    warning(){
      const name = this.user.name
      const intro = this.user.introduction
      if(name.length > 50){
        this.nameIsValid = false
      } 
      if(intro.length > 160){
       this.introIsValid = false
      }
      if(name.length < 50){
        this.nameIsValid = true
      }
      if(intro.length < 160){
       this.introIsValid = true
      }
    }
  },
  watch:{
    user:{
      deep: true,
      handler: function(){
        this.warning()
      }
    }
  },
  
}
</script>
<style lang="scss" scoped>
 @import "../assets/scss/_basic.scss";
  .icon{
    cursor: pointer;
    width: 20px;
    height: 20px;
    padding:0;
  }
  .hint-group{
    position:absolute;
    bottom:0.7rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .hidden{
    visibility:hidden;
  }
  .warning{
    color:#FC5A5A;
  }
  .modal {
    position: fixed;
    z-index: 1; 
    padding-top: 100px; 
    left: 0;
    top: 0;
    width: 100%; 
    height: 100%; 
    overflow: auto; 
    background-color: rgb(0, 0, 0); 
    background-color: rgba(0, 0, 0, 0.4);
  }
  .form {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    opacity: 1;
    padding-bottom: 40px;
    width: 634px;
    height: 610px;
    background: white;
    border-radius: 14px;
    label {
      cursor: pointer;
    }
    .top__bar {
      padding-left: 15px;
      position: relative;
      height: 57px;
      display: flex;
      align-items: center;
      &__title{
        padding-left: 30px;
        font-weight: 700;
        font-size: 18px;
      }
      button {
        @extend %following;
        width: 64px;
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translatey(-50%);
      }
    }
    .user__image {
      position: relative;
      input {
          display: none;
      }
      .label-group {
        display: flex;
        label {
          margin: 30px;
        }
        
      }
      .label-avatar,
      .label-group {
        position: absolute;
        right: 50%;
        top: 50%;
        transform: translate(50%, -50%);
      }
      &__form-item {
        position: relative;
      }
      .background-wrapper {
        width: 100%;
        height: 200px;
        
        img {
          width: 100%;
          height: 100%;
        }
      }
      .item__avatar {
        position: absolute;
        margin-left: 1rem;
        bottom: -70px;
        .avatar-wrapper {
          width: 140px;
          height: 140px;
          border: 5px solid white;
          border-radius: 50%;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
      }
      .background-wrapper, .avatar-wrapper{
        img{
          filter: brightness(80%);
        }
      }
    }
  }
  .user__info{
    padding: 80px 16px 16px 16px;
    height: 353px;   
    .info-item{
      position: relative;
      .length{
          font-size: 12px;
          color: $font-small;
        }
      label{
        cursor: none;
        position: absolute;
        @extend %form-label;
      }
      input, textarea{
        padding: 24px 0 0 16px;
        border-bottom: 1px solid;
        width: 100%;
        margin-bottom: 32px;  
        background: $form-input-grey;
        &.name{
          height: 52px;
        }
        &.intro{
          height: 145px;
        } 
        &.red{
          border-bottom: 2px solid #FC5A5A;
        }      
      }
    }
  }



</style>
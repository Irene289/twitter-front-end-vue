<template>
  <div id="popular">
    <h1>跟隨誰</h1>
    <div class="popular__list">
      <div 
        v-for="user in topUsers"
        :key="user.id"
        @click.stop.prevent="visit(user.id, 'user-tweets')"
        class="popular__list__item">
        <img :src="user.avatar_img" alt="">
        <div class="item-account">
          <p class="name">{{user.name}}</p>
          <p class="id">{{'@'+ user.account}}</p>
        </div>
        <button class="following">正在跟隨</button>
        <button class="follow">跟隨</button>
      </div>
    </div> 
  </div>
</template>
<script>
import {visitPage} from '../utils/mixins'
import userAPI from '../apis/user'
import {Toast} from '../utils/helpers'
export default {
  name:'Popular',
  mixins:[visitPage],
  data(){
    return{
      topUsers:[]
    }
  },
  methods:{
    visit(id,pathName){
      this.visitUserPage(id,pathName)
    },
    async fetchTopUsers(rank){
      try{
        console.log(rank)
        const {data, statusText} = await userAPI.getTopUsers({rank})
        this.topUsers = data
        console.log(data)
        if(statusText !== "OK"){
          throw new Error(statusText)
        }

      }catch(error){
        Toast.fire({
          icon: 'error',
          title: '無法取得人氣用戶，請稍後再試'
        })
      }
    }
  },
  created(){
    this.fetchTopUsers(10)
  }
}
</script>
<style lang="scss" scoped>
  @import "../assets/scss/_basic.scss";
  #popular{
    width:100%;
    margin-top: 13px;
    max-width:273px;
    height:731px;
    background: #FAFAFB;
    border-radius: 16px;
    img{
      width:50px;
      border-radius: 50%;
    }
    h1{
      border-bottom: 1px solid #E6ECF0;
      padding: 24px;
      font-family: $main-font;
      font-size: 24px;
    }
    .popular__list__item{  
      cursor:pointer; 
      display: flex;
      padding: 1rem; 
      .item-account{
        flex: 1;
        width: 74px;
        padding-right: 2px;
        margin-left: 8px;       
        font-family: $main-font;        
        .name{
          color: $font-black;
          font-weight:700; 
          @extend %single-ellipsis;   
        }
        .id{
          color: $id-grey;
          font-weight: 500;
          font-size: 14px;
          @extend %single-ellipsis;  
        }
      } 
    } 
    button{
      height: 40px;
    }
    .following{
      @extend %following;         
    }
    .follow{
      @extend %follow;
      display: none;
      margin-left:28px;
    }
  }

</style>
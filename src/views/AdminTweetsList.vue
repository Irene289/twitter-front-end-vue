<template>
  <div class="container">
    <Loading v-if="isLoading" />
    <div class="side-bar"> 
      <Sidebar />
    </div>
    
    <div class="tweets-div scrollbar" action="">
      <div class="title">
        <h1 class="tweets-div__title">推文清單</h1>
      </div>
      <div class="tweets-div__tweets">
        <div 
          v-for ="tweet in tweets"
          :key ="tweet.id"
          class="tweets-div__tweet">
          <div class="tweets-div__tweet--img">
            <img :src="tweet.User.avatarImg | avatarFilter" alt="" class="avatar">
          </div>
          <div class="tweets-div__tweet--content">
            <div class="content-info">
              <p class="content-info-name">{{tweet.User.name}}</p>
              <p class="content-info-account">@{{tweet.User.account}}</p>
              <p class="content-info-time">{{tweet.createdAt | fromNow }}</p>
            </div>
            <div class="content-text">
              <p>{{ tweet.description | adminTextFilter }}</p>
            </div>
            <button
              :disabled="isProcessing" 
              class="btn close-btn"
              @click.stop.prevent="confirmDelete(tweet.id)"
            >
              <img src="../assets/static/images/close@2x.png" alt="">
            </button>           
          </div>   
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {imgFilter} from '../utils/mixins'
import Swal from 'sweetalert2'
import {textFilter} from '../utils/mixins'
import { fromNowFilter } from './../utils/mixins'
import Sidebar from '../components/Sidebar.vue'
import {Toast} from '../utils/helpers'
import tweetAPI from '../apis/tweet'
import Loading from '../components/Loading'
export default {
  name:'AdminTweetsList',
  components: { 
    Sidebar,
    Loading
  },
  mixins:[fromNowFilter, textFilter, imgFilter],
  data () {
    return {
      tweets:[],
      isAdmin: true,
      isProcessing: false,
      isLoading: false,
      isConfirm: false
    }
  },
  methods: {
    async deleteTweet (id) {   
      try{
        this.isProcessing = true
        const {statusText} = await tweetAPI.deleteTweet({id})
        if(statusText !== 'OK'){
          throw new Error (statusText)
        }
        this.tweets = this.tweets.filter(tweet => tweet.id !== id)
        this.isProcessing = false
      }catch(error){
        this.isProcessing = false
        Toast.fire({
          icon: 'error',
          title: '無法刪除貼文，請稍後再試'
        })
      }     
    },
     
    async fetchTweets(){
      try{  
        this.isLoading = true
        const {data, statusText} = await tweetAPI.getTweets()
        this.tweets = data
        if(statusText !== 'OK'){
          throw new Error(statusText) 
        }
        this.isLoading = false
      }catch(error){
        this.isLoading = false
        Toast.fire({
          icon:'error',
          title:'無法取得推文資料，請稍後再試'
        })
      }
    },
    confirmDelete(id){
       Swal.fire({
        icon: 'warning',
        title: '確定要刪除推文嗎？',
        showCancelButton: true
      }).then( result => {
          if(result.value){
            console.log('刪除',result.value)
            return this.deleteTweet(id)
          }else if(result.dismiss === 'cancel'){
            console.log('取消',result)
            return        
          }
        }
      )         
    }
  
  },
  created(){
    this.fetchTweets()
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/basic.scss";

.container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 100vh;
  grid-gap: 24px;
}
.side-bar{
  grid-column: 1/2;
}
.tweets-div {
  grid-column: 2/13;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  border-left: 1px solid $border-grey;
  border-right: 1px solid $border-grey;
}
.title {
  width: 100%;
  border-bottom: 1px solid $border-grey;
  h1 {
    @extend %heading-24;
    margin: 24px auto 24px 25px;
  }
}
.tweets-div__tweet {
  display: flex;
  border-bottom: 1px solid $border-grey;
  padding: 16px 0;
  &--img img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-left: 24px;
    margin-right: 8px;
  }
  &--content .content-info {
    display: flex;
    align-items: center;
  }
}
.tweets-div__tweets {
  width: 100%;
  overflow-y: scroll;
  .tweets-div__tweet {
    position: relative;
  }
}
.scrollbar {
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.tweets-div__tweet--content {
  width:100%;
  .content-info {
    &-name {
      @extend %tweet-name;
      margin-right: 8px;
    }
    &-account, &-time {
      @extend %tweet-account;
    }
    &-account::after {
      content: '・';
      font-weight: 700;
    }
  }
  .content-text {
    @extend %tweet-text;
    margin-top: 8px;
    margin-right: 82px;
  }
  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1px;
    img {
      width: 24px;
      height: 24px;
    }
  }
}
@media screen and (min-width: 961px){
  .side-bar {
    grid-column: 1/3;
  }
  .tweets-div {
    grid-column: 3/13;
  }
}
</style>
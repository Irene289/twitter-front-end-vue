<template>
  <div class="container">
    <Sidebar />
    <div class="tweets-div" action="">
      <div class="title">
        <h1 class="tweets-div__title">推文清單</h1>
      </div>
      <div class="tweets-div__tweets scrollbar">
        <div 
          v-for ="tweet in tweets"
          :key ="tweet.id"
          class="tweets-div__tweet">
          <div class="tweets-div__tweet--img">
            <img :src="tweet.User.avatarImg" alt="" class="avatar">
          </div>
          <div class="tweets-div__tweet--content">
            <div class="content-info">
              <p class="content-info-name">{{tweet.User.name}}</p>
              <p class="content-info-account">@{{tweet.User.account}}</p>
              <p class="content-info-time">{{tweet.createdAt | fromNow }}</p>
            </div>
            <div class="content-text">
              <p>{{ ellipsisWords(tweet.description) }}</p>
            </div>
            <button 
              class="btn close-btn"
              @click.stop.prevent="deleteTweet(tweet.id)"
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
//TODO:日期顯示待調整
import { fromNowFilter } from './../utils/mixins'
import Sidebar from '../components/Sidebar.vue'
import {Toast} from '../utils/helpers'
import tweetAPI from '../apis/tweet'
export default {
  components: { 
    Sidebar 
  },
  mixins:[fromNowFilter],
  data () {
    return {
      tweets:[],
      isAdmin: true,
    }
  },
  methods: {
    ellipsisWords (text) {
      const words = text
      const word = words.split(' ')
      const wordLength = word.length
      if (wordLength > 50) {
        let txt = word.slice(0, 50).join(' ') + '...'
        return txt
      }
      return text
    },
    async deleteTweet (id) {
      try{
        const {statusText} = await tweetAPI.deleteTweet({id})
        if(statusText !== 'OK'){
          throw new Error (statusText)
        }
        this.tweets = this.tweets.filter(tweet => tweet.id !== id)
      }catch(error){
        Toast.fire({
          icon: 'error',
          title: '無法刪除貼文，請稍後再試'
        })
      }
    },
    async fetchTweets(){
      try{  
        const {data, statusText} = await tweetAPI.getTweets()
        this.tweets = data
        if(statusText !== 'OK'){
          throw new Error(statusText) 
        }
      }catch(error){
        Toast.fire({
          icon:'error',
          title:'無法取得推文資料，請稍後再試'
        })
      }
    },
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
  grid-template-columns: 178px 937px auto;
  grid-template-rows: 100vh;
  grid-gap: 24px;
}
.tweets-div {
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
  width: 937px;
  overflow-y: scroll;
  .tweets-div__tweet {
    position: relative;
    // left: -6px;
  }
}
.scrollbar {
  // padding-left: 6px;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.tweets-div__tweet--content {
  width: 849px;
  position: relative;
  .content-info {
    // margin-bottom: 8px;
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
    
    // height: 52px;
    // display: -webkit-box;
    // -webkit-box-orient: vertical;
    // -webkit-line-clamp: 2;
    // overflow: hidden;
    // text-overflow: ellipsis;
  }
  .close-btn {
    position: absolute;
    top: 1px;
    right: 1px;
    img {
      width: 24px;
      height: 24px;
    }
  }
}
</style>
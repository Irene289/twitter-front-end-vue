<template>
  <div class="user-tweet">
    <h3 v-if="noTweets">使用者尚無推文</h3>
    <template v-else>
      <UserTweetCard v-for="tweet in tweets" :key="tweet.id">
        <template v-slot:avatar>
          <img
            @click.prevent.stop="visit(tweet.User.id, 'user-tweets')"
            class="avatar"
            :src="tweet.User.avatarImg | avatarFilter"
            alt=""
          />
        </template>
        <template v-slot:name>
          {{ tweet.User.name }}
        </template>
        <template v-slot:id>
          {{ tweet.User.account }}
        </template>
        <template v-slot:post-time>
          {{ tweet.created_at | fromNow }}
        </template>
        <template v-slot:text>
              {{tweet.description | tweetFilter}}       
          <div class="icons">
            <div
              @click.prevent.stop="visit(tweet.id, 'twitter-replies')"
              class="icon-wrapper"
            >
              <img
                class="link"
                src="../assets/static/images/reply@2x.png"
                alt=""
              />
              <p class="count">{{ tweet.Replies.replyTotal }}</p>
            </div>
            <div class="icon-wrapper">
              <img 
                v-show="!tweet.Likes.isLike"
                src="../assets/static/images/like@2x.png" 
                alt="" 
                @click.stop.prevent="likeTweet(tweet.id)"
              />
              <img 
                v-show="tweet.Likes.isLike"
                src="../assets/static/images/redHeart@2x.png" 
                alt="" 
                @click.stop.prevent="unlikeTweet(tweet.id)"
              />
              <p class="count">{{ tweet.Likes.likeTotal}}</p>
            </div>
          </div>
        </template>
      </UserTweetCard>
    </template>
  </div>
</template>
<script>
import { imgFilter } from '../utils/mixins'
import { textFilter } from '../utils/mixins'
import { visitPage } from "../utils/mixins"
import UserTweetCard from "../components/UserTweetCard.vue"
import { fromNowFilter } from "./../utils/mixins"
import userAPI from "../apis/user"
import tweetAPI from "../apis/tweet"
import {Toast} from '../utils/helpers'

export default {
  name: "UserTweets",
  mixins: [fromNowFilter, visitPage, textFilter, imgFilter],
  components: {
    UserTweetCard,
  },
  data() {
    return {
      tweets: [],
      noTweets: false,
      isLikes: false,
      isProcessing: false 
    };
  },
  methods: {
    async fetchUserTweets(id) {
      try {
        const { data, statusText } = await userAPI.getTweets({ id });
        if (data.length === 0) {
          this.noTweets = true;
        } else {
          this.noTweets = false;
        }
        // 篩除非user的用戶
        this.tweets = data.filter( tweet => tweet.User.role === 'user')
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
      } catch (error) {
        if (error.response.status === 500) {
          this.noTweets = true;
          return;
        }
      }
    },
    visit(id, pathName) {
      this.visitUserPage(id, pathName);
    },
    // 按讚
    async likeTweet(id) {
      try {
        this.isProcessing = true
        const { data } = await tweetAPI.likeTweet({id})

        if (data.status !== "success") {
            throw new Error(data.status)
        }
        // this.isLikes = true
        this.tweets = this.tweets.map( tweet => { 
          if (tweet.id !== id) {
            return tweet
          } else {
            console.log(typeof tweet.Likes.likeTotal)
            return {
              ...tweet,
              Likes: {
                ...tweet.Likes,
                isLike: true,
                likeTotal: tweet.Likes.likeTotal+1  
              }
            }
          }
        })
        this.isProcessing = false
      } catch (error) {
        this.isProcessing = false
        Toast.fire({
          icon: 'error',
          title: '無法按讚，請稍後再試'
        })
      }
    },
    // 取消讚
    async unlikeTweet(id) {
      this.isProcessing = true
      try {
        const { data } = await tweetAPI.unlikeTweet({id})

        if (data.status !== "success") {
            throw new Error(data.status)
        }
        this.tweets = this.tweets.map( tweet => { 
          if (tweet.id !== id) {
            return tweet
          } else {
            return {
              ...tweet,
              Likes: {
                ...tweet.Likes,
                isLike: false,
                likeTotal: tweet.Likes.likeTotal-1
              }
            }
          }
        })
        this.isProcessing = false
      } catch (error) {
        this.isProcessing = false
        Toast.fire({
          icon: 'error',
          title: '無法取消讚，請稍後再試'
        })
      }
    },
  },
  beforeRouteUpdate(to, from, next) {
    const { id } = to.params;
    this.fetchUserTweets(id);
    next();
  },
  created() {
    const { id } = this.$route.params;
    this.fetchUserTweets(id);
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/_basic.scss";
h3 {
  text-align: center;
  margin-top: 1rem;
}
</style>
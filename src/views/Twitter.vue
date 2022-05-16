<template>
  <div>
    <div class="title">
      <h1>首頁</h1>
    </div>
    <div class="tweet-div">
      <form action="">
        <img src="../assets/static/images/noImage@2x.png" alt="" />
        <label for=""></label>
        <textarea v-model="text" name="tweet" placeholder="有什麼新鮮事？">
        </textarea>
        <button class="btn tweet-btn" @click.stop.prevent="tweetModal">
          推文
        </button>
      </form>
    </div>
    <div class="tweet-content scrollbar">
      <!-- slot -->
      <UserTweetCard v-for="tweet in tweets" :key="tweet.id">
        <template v-slot:avatar>
          <router-link
            :to="{name: 'user-tweets', params: { id: tweet.User.id }}"
            @click.stop.prevent="onClickAvatar"
          >
            <img
              class="avatar"
              :src="tweet.User.avatarImg"
              alt=""
            />
          </router-link>
        </template>
        <template v-slot:name>
          {{ tweet.User.name }}
        </template>
        <template v-slot:id> @{{ tweet.User.account }} </template>
        <template v-slot:post-time>
          {{ tweet.createdAt | fromNow}}
        </template>
        <template v-slot:text>
          <router-link
            :to="{name: 'twitter-replies', params: { id: tweet.id }}"
          >
            <p class="tweet-content-text">
              {{ tweet.description }}
            </p>
          </router-link>
          <div class="icons">
            <div class="icon-wrapper">
              <img
                src="../assets/static/images/reply@2x.png"
                alt=""
                @click.stop.prevent="replyModal"
              />
              <p class="count">{{ tweet.Replies }}</p>
            </div>
            <div class="icon-wrapper">
              <img src="../assets/static/images/like@2x.png" alt="" />
              <p class="count">{{ tweet.Likes }}</p>
            </div>
          </div>
        </template>
      </UserTweetCard>
    </div>

    <!-- Modal -->
    <ReplyModal
      :d-none-reply-modal="dNoneReplyModal"
      @reply-modal="replyModal"
    />
    <TweetModal :d-none="dNone" @tweet-modal="tweetModal" />
  </div>
</template>

<script>
import UserTweetCard from "../components/UserTweetCard"
import TweetModal from "../components/TweetModal"
import ReplyModal from "../components/ReplyModal"
import { fromNowFilter } from './../utils/mixins'
import tweetAPI from '../apis/tweet'
import { Toast } from '../utils/helpers'

export default {
  name: "Twitter",
  mixins: [fromNowFilter],
  components: {
    UserTweetCard,
    TweetModal,
    ReplyModal,
  },
  data() {
    return {
      text: "",
      dNone: true,
      dNoneReplyModal: true,
      tweets: []
    };
  },
  created () {
    this.fetchTweets()
  },
  methods: {
    async fetchTweets () {
      try {
        const response = await tweetAPI.getTweets()

        if (response.statusText !== 'OK') {
          throw new Error(response.statusText)
        }

        const { data } = response
        this.tweets = data

      } catch (error) {
        console.log(error)
        Toast.fire({
            icon: 'error',
            title: '暫時無法取得推文'
          })
      }
    },
    onClickAvatar() {
      console.log(this.tweets.User.id)
    },
    // onClickText() {
    //   console.log(this.tweets.id)
    // },
    tweetModal() {
      this.dNone = !this.dNone;
    },
    replyModal() {
      this.dNoneReplyModal = !this.dNoneReplyModal;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/basic.scss";

.title {
  display: flex;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid $border-grey;
  h1 {
    @extend %heading-24;
  }
}
.tweet-div {
  width: 100%;
  height: 140px;
  border-bottom: 10px solid $border-grey;
  position: relative;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    position: absolute;
    top: 16px;
    left: 25px;
  }
  textarea {
    width: calc(100% - 110px);
    height: 50px;
    border: none;
    resize: none;
    color: $font-black;
    font-weight: 400;
    font-size: 18px;
    line-height: 26px;
    position: absolute;
    top: 28px;
    right: 27px;
    left: 83px;
    &::placeholder {
      color: $font-small;
      font-weight: 700;
    }
  }
  .tweet-btn {
    @extend %button-orange;
    width: 64px;
    height: 40px;
    position: absolute;
    top: 80px;
    right: 25px;
  }
}
.tweet-content {
  height: calc(100vh - 3*24px - 140px);
  overflow-y: scroll;
}
// scrollbar
.scrollbar {
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 1px $scrollbar;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: $scrollbar;
  }
}
.tweet-content-text,
.icon-wrapper img {
 cursor: pointer;
}
</style>
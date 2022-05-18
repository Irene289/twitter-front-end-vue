<template>
  <div>
    <div class="title">
      <h1>首頁</h1>
    </div>
    <div class="tweet-div">
      <form action="">
        <img :src="user.avatarImg" alt="" />
        <label for=""></label>
        <textarea v-model="text" name="tweet" placeholder="有什麼新鮮事？" @blur="onBlur" >
        </textarea>
        <span class="text-length">{{text.length}}/140</span>
        <span v-if="isEmpty" class="text-empty">內容不可空白</span>
        <span v-if="isExceed" class="text-exceed">字數不可超過 140 字</span>
        <button 
          class="btn tweet-btn" 
          @click.stop.prevent="createTweet"
          :disabled="isEmpty || isExceed"
        >
          推文
        </button>
      </form>
    </div>
    <div class="tweet-content scrollbar">
      <!-- slot -->
      <UserTweetCard v-for="tweet in tweets" :key="tweet.id">
        <template v-slot:avatar>
          <router-link
            :to="{ name: 'user-tweets', params: { id: tweet.User.id } }"
            @click.stop.prevent="onClickAvatar"
          >
            <img class="avatar" :src="tweet.User.avatarImg" alt="" />
          </router-link>
        </template>
        <template v-slot:name>
          {{ tweet.User.name }}
        </template>
        <template v-slot:id> @{{ tweet.User.account }} </template>
        <template v-slot:post-time>
          {{ tweet.createdAt | fromNow }}
        </template>
        <template v-slot:text>
          <router-link
            :to="{ name: 'twitter-replies', params: { id: tweet.id } }"
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
                @click.stop.prevent="replyModal(tweet.id)"
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

    <!-- modal -->
    <div class="container" :class="{ 'd-none': dNoneReplyModal }">
      <div class="modal row">
        <form class="modal-content col-6" action="">
          <div class="modal-content-cancel">
            <button class="btn" @click.stop.prevent="handleCloseBtn">
              <img src="../assets/static/images/orangeClose@2x.png" alt="" />
            </button>
          </div>

          <TweetModal>
            <!--   推文 -->
            <template v-slot:isReplyModel v-if="!isReplyModel">
              <div class="tweet-div"></div>
            </template>
            <template v-slot:replytoAvatarImg>
              <img class="avatar" :src="tweet.User.avatarImg" alt="" />
            </template>
            <template v-slot:replyto>
              <p class="content-info-name">{{ tweet.User.name }}</p>
              <p class="content-info-account">@{{ tweet.User.account }}</p>
              <p class="content-info-time">{{ tweet.createdAt | fromNow }}</p>
            </template>
            <template v-slot:replytoAccount>
              @{{ tweet.User.account }}
            </template>
            <template v-slot:replytoText>
              {{tweet.description}}
            </template>

            <!-- 回覆 -->
            <template v-slot:avatarImg>
              <img
                class="modal-content-avatar"
                :src="user.avatarImg"
                alt=""
              />
            </template>
            <template v-slot:text>
              <textarea
                v-model="textReply"
                name="tweet"
                :placeholder="placeholder"
              >
              </textarea>
            </template>
            <template v-slot:alert>
              <span class="text-length">{{ isReplyModel ? textReply.length : text.length }}/140</span>
              <span v-if="isModalEmpty" class="text-empty modal-alert">內容不可空白</span>
              <span v-if="isModalExceed" class="text-exceed modal-alert">字數不可超過 140 字</span>
            </template>
          </TweetModal>

          <button
            v-if="isReplyModel"
            class="btn modal-tweet"
            @click.stop.prevent="handleReply(tweet.id)"
            :disabled="isProcessing"
          >
            {{ isProcessing ? "處理中" : "回覆" }}
          </button>
          <button
            v-else
            class="btn modal-tweet"
            @click.stop.prevent="createTweet2"
            :disabled="isProcessing"
          >
            {{ isProcessing ? "處理中" : "推文" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import UserTweetCard from "../components/UserTweetCard"
import TweetModal from "../components/TweetModal"
import { fromNowFilter } from "./../utils/mixins"
import { textFilter } from "./../utils/mixins"
import tweetAPI from "../apis/tweet"
import { Toast } from "../utils/helpers"
import { mapState } from "vuex"

export default {
  name: "Twitter",
  mixins: [fromNowFilter, textFilter],
  components: {
    UserTweetCard,
    TweetModal,
  },
  data() {
    return {
      user: {
        avatarImg: ''
      },
      text: "",                // 推文
      textReply: "",           // 回覆
      tweets: {},              // 全部推文
      tweet: {                 // 單一推文
        id: -1,
        description: "",
        createdAt: "",
        User: {
          avatarImg: '',
          name: '',
          account: '',
        },
        Replies: [],
        likeTotal: 0
      }, 
      newTweet: {},            // 新增推文
      newReply: {},            // 新增推文回覆
      dNoneReplyModal: true,   // 控制 Modal
      isReplyModel: true,      // 控制 Modal
      placeholder: "",         // 控制推文跟回覆的 placeholder
      isProcessing: false,     // 按鈕送出
      isEmpty: false,
      isExceed: false,
      isSubmit: false,
      isModalEmpty: false,
      isModalExceed: false
    }
  },
  watch: {
    text: {
      handler: function() {
        this.textWarning()
        // this.isSubmit = false
      },
      // deep: true
    },
    textReply: {
      handler: function() {
        this.modalWarning()
        // this.isSubmit = false
      },
      // deep: true
    }
  },
  created() {
    this.fetchUser()
    this.fetchTweets()
  },
  methods: {
    fetchUser() {
      this.user = this.currentUser
    },
    // 拿到全部推文
    async fetchTweets() {
      try {
        const { data, statusText } = await tweetAPI.getTweets()
        if (statusText !== "OK") {
          throw new Error(statusText)
        }
        // console.log(data)
        this.tweets = data
        // this.newTweet = data.description  // 新增
      } catch (error) {
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "暫時無法取得推文",
        });
      }
    },
    textWarning() {
      if (!this.text) {
        this.isEmpty = true
        this.isExceed = false
        this.isProcessing = false
      } else if (this.text.length > 140) {
        this.isEmpty = false
        this.isExceed = true
        this.isProcessing = false
      } 
      else {
        this.isEmpty = false
        this.isExceed = false
      }
      return
    },
    modalWarning(){
      if (!this.textReply) {
        this.isModalEmpty = true
        this.isModalExceed = false
        this.isProcessing = false
      } else if (this.textReply.length > 140) {
        this.isModalEmpty = false
        this.isModalExceed = true
        this.isProcessing = false
      } 
      else {
        this.isModalEmpty = false
        this.isModalExceed = false
      }
      return
    },
    onBlur() {
      this.isEmpty = false
    },
    // 推一則推文
    async createTweet() {
      try {
        const { data } = await tweetAPI.createTweet({
          description: this.text,
          UserId: this.currentUser.id
        })

        const { id, description, UserId, createdAt } = data.data

        this.newTweet = {
          id,
          description,
          User: { id: UserId },
          createdAt,
        }

        this.tweets = [
          {...this.newTweet},
          ...this.tweets
        ]

        if (data.status !== "success") {
          throw new Error(data.message)
        }
        this.text = "" 
      } catch (error) {
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "暫時無法推文",
        })
      }
    },
    // 回覆一則推文
    async handleReply(TweetId) {
      try {
        // 內容字數警告
        this.textWarning()

        // const { id, comment, UserId, TweetId, createdAt } = payload

        const { data } = await tweetAPI.createReply({ 
          TweetId, 
          comment: this.textReply, 
          UserId: this.currentUser.id,
        })

        const { id, comment, UserId, createdAt } = data.data

        this.newReply = {
          id,
          comment,
          User: {
            id: UserId,
            createdAt
          },
        }

        // this.tweets = this.tweets.map( tweets => {
        //   if ( tweets.id !== TweetId ) {
        //     return
        //   } else {
        //     return {
        //       ...tweets,
        //       Replies: tweets.Replies + 1
        //     }
        //   }
        // })

        this.tweet = {
          Replies: [
            {...this.newReply},
            ...this.tweet.Replies
          ],
          replyTotal: replyTotal + 1
        }
        
        // this.tweet.replyTotal = this.tweet.replyTotal + 1
        // this.tweets.Replies = this.tweet.replyTotal

        console.log(TweetId)
        console.log(this.tweet.id)

        if (data.status !== "success") {
          throw new Error(data.message)
        } else {
          Toast.fire({
          icon: 'success',
          title: "成功送出回覆",
          })
          this.textReply = ""
          this.dNoneReplyModal = !this.dNoneReplyModal
        }

        // console.log(data)
      } catch (error) {
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "暫時無法回覆推文",
        })
      }
    },
    // 點擊頭像瀏覽個人頁面
    onClickAvatar() {
      console.log(this.tweets.User.id);
    },
    // 關閉 Modal
    handleCloseBtn() {
      this.dNoneReplyModal = !this.dNoneReplyModal;
      this.textReply = "";
    },
    // 開啟推文 Modal
    tweetModal() {
      this.dNoneReplyModal = !this.dNoneReplyModal
      this.isReplyModel = false;
      this.placeholder = "有什麼新鮮事？";
    },
    // 開啟回覆 Modal
    async replyModal(id) {
      try {
        this.modalWarning()
        // console.log(id)
        const { data, statusText } = await tweetAPI.getReply({ id })
        // console.log(data)

        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        this.tweet = data;

        this.dNoneReplyModal = !this.dNoneReplyModal;
        this.isReplyModel = true;
        this.placeholder = "推你的回覆";
      } catch (error) {
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "暫時無法取得推文",
        });
      }
    },
  },
  // 取得 currentUser
  computed: {
    ...mapState(["currentUser"]),
  },
}
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
  .text-length {
    @extend %form-label;
    position: absolute;
    right: 16px;
    top: 8px;
  }
  .text-empty,
  .text-exceed {
    @extend %tweet-text-warning;
    position: absolute;
    right: 101px;
    bottom: 22px;
  }
  .tweet-btn {
    @extend %button-orange;
    width: 64px;
    height: 40px;
    position: absolute;
    top: 80px;
    right: 25px;
    &:disabled {
      background: $form-input-placeholder;
    }
  }
}
.tweet-content {
  height: calc(100vh - 3 * 24px - 140px);
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
// modal
.modal {
  background-color: $modal-background;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.modal-content {
  background-color: $white;
  border-radius: 14px;
  margin: auto;
  margin-top: 56px;
  padding: 0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  &-cancel {
    width: 100%;
    border-bottom: 1px solid $border-grey;
  }
  &-cancel img {
    width: 24px;
    height: 24px;
    margin: 16px;
  }
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}
.modal-tweet {
  @extend %button-orange;
  min-width: 76px;
  height: 40px;
}
</style>
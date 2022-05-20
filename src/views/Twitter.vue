<template>
  <div>
    <div class="title">
      <h1>首頁</h1>
    </div>
    <div class="tweet-div">
      <form action="">
        <img :src="currentUser.avatarImg" alt="" />
        <label for=""></label>
        <textarea v-model="text" name="tweet" placeholder="有什麼新鮮事？">
        </textarea>
        <!-- <span class="text-length">{{text.length}}/140</span> -->
        <span v-if="!isEmpty" class="text-empty">內容不可空白</span>
        <span v-if="isExceed" class="text-exceed">字數不可超過 140 字</span>
        <button
          class="btn tweet-btn"
          @click.stop.prevent="createTweet"
          :disabled="isExceed"
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
              {{ tweet.description | tweetFilter }}
            </p>
          </router-link>
          <div class="icons">
            <div class="icon-wrapper">
              <img
                src="../assets/static/images/reply@2x.png"
                alt=""
                @click.stop.prevent="replyModal(tweet.id)"
              />
              <p class="count">{{ tweet.Replies.replyTotal }}</p>
            </div>
            <div class="icon-wrapper">
              <img
                v-if="!tweet.Likes.isLike"
                src="../assets/static/images/like@2x.png"
                alt=""
                :disabled="isProcessing"
                @click.stop.prevent="likeTweet(tweet.id)"
              />
              <img
                v-else
                src="../assets/static/images/redHeart@2x.png"
                alt=""
                :disabled="isProcessing"
                @click.stop.prevent="unlikeTweet(tweet.id)"
              />
              <p class="count">{{ tweet.Likes.likeTotal }}</p>
            </div>
          </div>
        </template>
      </UserTweetCard>
    </div>

    <!-- modal -->
    <div class="container" :class="{ 'd-none': dNoneModal }">
      <div class="modal row">
        <form class="modal-content col-6" action="">
          <div class="modal-content-cancel">
            <button class="btn" @click.stop.prevent="handleCloseBtn">
              <img src="../assets/static/images/orangeClose@2x.png" alt="" />
            </button>
          </div>
          <TweetModal>
            <!--   推文 -->
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
              {{ tweet.description | tweetFilter }}
            </template>

            <!-- 回覆 -->
            <template v-slot:avatarImg>
              <img
                class="modal-content-avatar"
                :src="currentUser.avatarImg"
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
              <!-- <span class="text-length">{{ isReplyModel ? textReply.length : text.length }}/140</span> -->
              <span v-if="!isModalEmpty" class="text-empty modal-alert warning"
                >內容不可空白</span
              >
              <span v-if="isModalExceed" class="text-exceed modal-alert warning"
                >字數不可超過 140 字</span
              >
            </template>
          </TweetModal>

          <div class="btn-group"></div>
          <button
            class="btn modal-tweet button-reply"
            @click.stop.prevent="handleReply(tweet.id)"
            :disabled="isProcessing || isModalExceed"
          >
            {{ isProcessing ? "處理中" : "回覆" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import UserTweetCard from "../components/UserTweetCard";
import TweetModal from "../components/TweetModal";
import { fromNowFilter, textFilter } from "./../utils/mixins";
import tweetAPI from "../apis/tweet";
import { Toast } from "../utils/helpers";
import { mapState } from "vuex";

export default {
  name: "Twitter",
  mixins: [fromNowFilter, textFilter],
  components: {
    UserTweetCard,
    TweetModal,
  },
  data() {
    return {
      text: "",            // 推文
      textReply: "",       // 回覆
      tweets: [],          // 全部推文
      tweet: {},           // 單一推文
      newTweet: {},        // 新增推文
      newReply: {},        // 新增推文回覆
      dNoneModal: true,    // 控制 Modal
      isReplyModel: true,  // 控制 Modal
      placeholder: "",     // 控制推文跟回覆的 placeholder
      isProcessing: false, // 按鈕送出
      isEmpty: true,
      isExceed: false,
      isModalEmpty: true,
      isModalExceed: false,
    };
  },
  watch: {
    text() {
      this.textWarning();
    },
    textReply() {
      this.modalWarning();
    },
  },
  created() {
    this.fetchTweets();
  },
  methods: {
    // 拿到全部推文
    async fetchTweets() {
      try {
        const { data, statusText } = await tweetAPI.getTweets();

        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        // 篩除非user的用戶
        this.tweets = data.filter((data) => data.User.role === "user");
      } catch (error) {
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "暫時無法取得推文",
        });
      }
    },
    // 推一則推文
    async createTweet() {
      try {
        if (!this.text) {
          this.isEmpty = false;
          return;
        } else if (this.text.trim() === "") {
          this.isEmpty = false;
          return;
        }
        this.isProcessing = true;

        const { data } = await tweetAPI.createTweet({
          description: this.text,
          UserId: this.currentUser.id,
        });

        const { id, description, UserId, createdAt } = data.data;

        this.newTweet = {
          id,
          description,
          User: { 
            id: UserId, 
            account: this.currentUser.account,
            name: this.currentUser.name,
            avatarImg: this.currentUser.avatarImg,
          },
          Replies: { replyTotal: 0 },
          Likes: {
            isLike: false,
            likeTotal: 0,
          },
          createdAt,
        };

        this.tweets = [{ ...this.newTweet }, ...this.tweets];

        if (data.status !== "success") {
          throw new Error(data.message);
        }
        this.text = "";
        this.isEmpty = true;
        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        if (error.response.status === 500) {
          return;
        } else {
          console.log(error);
          Toast.fire({
            icon: "error",
            title: "暫時無法推文",
          });
        }
      }
    },
    // Modal 回覆一則推文
    async handleReply(TweetId) {
      try {
        // 內容字數警告
        if (!this.textReply) {
          this.isModalEmpty = false;
          return;
        } else if (this.textReply.trim() === "") {
          this.isModalEmpty = false;
          return;
        }
        this.isProcessing = true;

        const { data } = await tweetAPI.createReply({
          TweetId,
          comment: this.textReply,
        });

        this.tweets = this.tweets.map((tweets) => {
          if (tweets.id !== TweetId) {
            return tweets;
          } else {
            return {
              ...tweets,
              Replies: {
                ...tweets.Replies,
                replyTotal: tweets.Replies.replyTotal + 1,
              },
            };
          }
        });

        if (data.status !== "success") {
          throw new Error(data.message);
        } else {
          Toast.fire({
            icon: "success",
            title: "成功送出回覆",
          });
          this.textReply = "";
          this.isProcessing = false;
          this.dNoneModal = true;
        }
      } catch (error) {
        this.isProcessing = false;
        if (error.response.status === 500) {
          return;
        } else {
          console.log(error);
          Toast.fire({
            icon: "error",
            title: "暫時無法回覆推文",
          });
        }
      }
    },
    // 按讚
    async likeTweet(id) {
      try {
        this.isProcessing = true;
        const { data } = await tweetAPI.likeTweet({ id });

        if (data.status !== "success") {
          throw new Error(data.status);
        }

        this.tweets = this.tweets.map((tweet) => {
          if (tweet.id !== id) {
            return tweet;
          } else {
            return {
              ...tweet,
              Likes: {
                isLike: true,
                likeTotal: tweet.Likes.likeTotal + 1,
              },
            };
          }
        });
        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法按讚，請稍後再試",
        });
      }
    },
    // 取消讚
    async unlikeTweet(id) {
      try {
        const { data } = await tweetAPI.unlikeTweet({ id });

        if (data.status !== "success") {
          throw new Error(data.status);
        }

        this.tweets = this.tweets.map((tweet) => {
          if (tweet.id !== id) {
            return tweet;
          } else {
            return {
              ...tweet,
              Likes: {
                isLike: false,
                likeTotal: tweet.Likes.likeTotal - 1,
              },
            };
          }
        });
      } catch (error) {
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法取消讚，請稍後再試",
        });
      }
    },
    // 開啟 Modal
    async replyModal(id) {
      try {
        const { data, statusText } = await tweetAPI.getTweet({ id });

        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.tweet = data;
        this.dNoneModal = !this.dNoneModal;
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
    // 關閉 Modal
    handleCloseBtn() {
      this.isModalEmpty = true
      this.dNoneModal = !this.dNoneModal;
      this.textReply = "";
    },
    // 字數警示
    textWarning() {
      if (this.text.length > 140) {
        this.isExceed = true;
        this.isProcessing = false;
      } else {
        this.isEmpty = true;
        this.isExceed = false;
      }
      return;
    },
    // Modal 字數警示
    modalWarning() {
      if (this.textReply.length > 140) {
        this.isModalExceed = true;
        this.isProcessing = false;
      } else {
        this.isModalEmpty = true;
        this.isModalExceed = false;
      }
      return;
    },
  },
  // 取得 currentUser
  computed: {
    ...mapState(["currentUser"]),
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
  position: relative;
  background-color: $white;
  border-radius: 14px;
  margin: auto;
  margin-top: 56px;
  padding: 0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  &-cancel {
    width: 100%;
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
  &.button-reply {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
  }
  &:disabled {
    background: $form-input-placeholder;
  }
}
</style>
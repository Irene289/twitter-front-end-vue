<template>
  <div>
    <div class="title">
      <img
        src="../assets/static/images/back@2x.png"
        alt=""
        @click="$router.back()"
      />
      <h1>推文</h1>
    </div>
    <div class="reply-div scrollbar">
      <div class="reply-div-user">
        <div class="user-img avatar">
          <img :src="tweet.User.avatarImg" alt="" />
        </div>
        <div class="user-info">
          <p class="user-info-name">{{ tweet.User.name }}</p>
          <p class="user-info-account">@{{ tweet.User.account }}</p>
        </div>
      </div>
      <div class="reply-div-content">
        <div class="content-text">
          <p>
            {{ tweet.description | tweetFilter }}
          </p>
        </div>
        <div class="content-when">
          <p>{{ tweet.createdAt | format }}</p>
        </div>
        <div class="content-counts">
          <div class="content-counts-reply">
            <span>{{ tweet.replyTotal }}</span> 回覆
          </div>
          <div class="content-counts-like">
            <span>{{ tweet.likeTotal }}</span> 喜歡次數
          </div>
        </div>
        <div class="content-response">
          <img
            class="content-response-reply"
            src="../assets/static/images/reply@2x.png"
            alt=""
            @click.stop.prevent="replyModal"
          />
          <img
            v-if="!tweet.isLike"
            class="content-response-like"
            src="../assets/static/images/like@2x.png"
            alt=""
            :disabled="isProcessing"
            @click.stop.prevent="likeTweet(tweet.id)"
          />
          <img
            v-else
            class="content-response-like"
            src="../assets/static/images/redHeart@2x.png"
            alt=""
            :disabled="isProcessing"
            @click.stop.prevent="unlikeTweet(tweet.id)"
          />
        </div>
      </div>
      <!-- slot -->
      <UserTweetCard v-for="reply in replies" :key="reply.id">
        <template v-slot:avatar>
          <router-link
            :to="{ name: 'user-tweets', params: { id: reply.User.id } }"
          >
            <img class="avatar" :src="reply.User.avatarImg" alt="" />
          </router-link>
        </template>
        <template v-slot:name>
          {{ reply.User.name }}
        </template>
        <template v-slot:id>
          {{ reply.User.account }}
        </template>
        <template v-slot:post-time>
          {{ reply.createdAt | fromNow }}
        </template>
        <template v-slot:text>
          <div class="reply-tag">
            回覆 <span>@{{ tweet.User.account }}</span>
          </div>
          {{ reply.comment | tweetFilter }}
          <div class="icons">
            <div class="icon-wrapper">
              <img src="../assets/static/images/reply@2x.png" alt="" />
              <!-- TODO:暫填，非真實數據 -->
              <p class="count">{{ reply.User.id }}</p>
            </div>
            <div class="icon-wrapper">
              <img src="../assets/static/images/like@2x.png" alt="" />
              <!-- <img
                v-else
                src="../assets/static/images/redHeart@2x.png"
                alt=""
                @click.stop.prevent="unlikeTweet(tweet.id)"
              /> -->
              <!-- TODO:暫填，非真實數據 -->
              <p class="count">{{ reply.User.id }}</p>
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
            <template v-slot:replytoAvatarImg>
              <img
                class="avatar top-avatar"
                :src="tweet.User.avatarImg"
                alt=""
              />
            </template>
            <template v-slot:replyto>
              <div class="modal-topic-content">
                <div class="modal-user-content">
                  <p class="content-info-name">{{ tweet.User.name }}</p>
                  <p class="content-info-account">@{{ tweet.User.account }}</p>
                  <p class="content-info-time">
                    {{ tweet.createdAt | fromNow }}
                  </p>
                </div>
                <p class="content-info-description">
                  {{ tweet.description | tweetFilter }}
                </p>
              </div>
            </template>
            <template v-slot:replytoAccount>
              @{{ tweet.User.account }}
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
                placeholder="推你的回覆"
              >
              </textarea>
            </template>
            <template v-slot:alert>
              <span v-if="!isModalEmpty" class="text-empty modal-alert warning"
                >內容不可空白</span
              >
              <span v-if="isModalExceed" class="text-exceed modal-alert warning"
                >字數不可超過 140 字</span
              >
            </template>
          </TweetModal>

          <button
            class="btn modal-tweet"
            @click.stop.prevent="handleReply(tweet.id)"
            :disabled="isModalExceed"
          >
            {{ isProcessing ? "處理中" : "回覆" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import UserTweetCard from "../components/UserTweetCard.vue";
import TweetModal from "../components/TweetModal";
import { fromNowFilter, textFilter } from "./../utils/mixins";
import tweetAPI from "../apis/tweet";
import { Toast } from "../utils/helpers";
import { mapState } from "vuex";

export default {
  name: "TwitterReply",
  mixins: [fromNowFilter, textFilter],
  components: {
    UserTweetCard,
    TweetModal,
  },
  data() {
    return {
      tweet: {},       // 要回覆的對象
      replies: [],     // 回覆對象的其他回覆
      textReply: "",
      dNoneModal: true,
      isProcessing: false,
      isModalEmpty: true,
      isModalExceed: false,
    };
  },
  watch: {
    textReply() {
      this.modalWarning();
    },
  },
  created() {
    const { id } = this.$route.params;
    this.fetchTweet(id);
    this.fetchReplies(id);
  },
  methods: {
    // 顯示推文資訊
    async fetchTweet(id) {
      try {
        const { data, statusText } = await tweetAPI.getTweet({ id });

        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        this.tweet = data;
      } catch (error) {
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "暫時無法取得推文",
        });
      }
    },
    // 顯示推文底下留言資訊
    async fetchReplies(id) {
      try {
        const { data, statusText } = await tweetAPI.getReplies({ id });
        
        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        this.replies = data;
      } catch (error) {
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "暫時無法取得回覆",
        });
      }
    },
    // 回覆一則推文
    async handleReply(TweetId) {
      try {
        // 內容空白處理
        if (!this.textReply || this.textReply.trim() === '') {
          this.isModalEmpty = false;
          return
        } 
        this.isProcessing = true;

        const { data } = await tweetAPI.createReply({
          TweetId,
          comment: this.textReply,
        });

        this.textReply = {
          comment: this.textReply,
          createdAt: new Date(),
          User: {
            id: this.currentUser.id,
            account: this.currentUser.account,
            name: this.currentUser.name,
            avatarImg: this.currentUser.avatarImg,
            createdAt: new Date(),
          },
        };

        this.replies = [
          { ...this.textReply }, 
          ...this.replies
        ];

        this.tweet = {
          ...this.tweet,
          replyTotal: this.tweet.replyTotal + 1
        }

        if (data.status !== "success") {
          throw new Error(data.message);
        } else {
          Toast.fire({
            icon: "success",
            title: "成功送出回覆",
          });
          this.textReply = "";
          this.dNoneModal = !this.dNoneModal;
        }
      } catch (error) {
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
    // 對推文按讚
    async likeTweet(id) {
      try {
        this.isProcessing = true;
        const { data } = await tweetAPI.likeTweet({ id });

        if (data.status !== "success") {
          throw new Error(data.status);
        }

        this.tweet.isLike = true;
        this.tweet = {
          ...this.tweet,
          likeTotal: this.tweet.likeTotal + 1,
        };
        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法點讚，請稍後再試",
        });
      }
    },
    // 對推文取消讚
    async unlikeTweet(id) {
      try {
        this.isProcessing = true;
        const { data } = await tweetAPI.unlikeTweet({ id });

        if (data.status !== "success") {
          throw new Error(data.status);
        }
        this.tweet.isLike = false;
        this.tweet = {
          ...this.tweet,
          likeTotal: this.tweet.likeTotal - 1,
        };
        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法取消讚，請稍後再試",
        });
      }
    },
    // 開啟 Modal
    replyModal() {
      this.dNoneModal = !this.dNoneModal;
    },
    // 關閉 Modal
    handleCloseBtn() {
      this.dNoneModal = !this.dNoneModal;
      this.textReply = "";
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
    //TODO:功能待後端補資料
    // async likeTweet(id){
    //   try{
    //     const {data} = await tweetAPI.likeTweet({id})
    //     console.log(data)
    //     this.likes = this.likes.map(tweet => {
    //       if(tweet.TweetId !== id){
    //         return tweet
    //       } else if (tweet.TweetId === id){
    //         console.log()
    //         return {
    //         ...tweet,
    //         likeUnlike: true,

    //         }
    //       }
    //     })
    //   }catch(error){
    //     Toast.fire({
    //       icon: 'error',
    //       title: '無法對推文點讚，請稍後再試'
    //     })
    //   }
    // },
  },
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
}
.title h1 {
  @extend %heading-24;
}
.title img {
  width: 24px;
  height: 24px;
  margin-right: 16px;
  cursor: pointer;
}
.reply-div {
  height: calc(100vh - 72px);
  padding: 16px 0;
  overflow-y: scroll;
}
.reply-div-user,
.reply-div-content {
  padding: 0 16px;
}
.reply-div-user,
.content-when,
.content-counts {
  display: flex;
  align-items: center;
}
.user-img img {
  @extend %avatar;
  margin-right: 8px;
}
.user-info-name {
  @extend %tweet-name;
}
.user-info-account {
  @extend %tweet-account;
}
.content-text {
  @extend %tweet-text;
  font-size: 24px;
  line-height: 36px;
}
.content-when {
  @extend %tweet-account;
  padding: 8px 0;
  border-bottom: 1px solid $border-grey;
  &-time::after {
    content: "・";
    font-weight: 700;
  }
}
.content-counts {
  color: $font-small;
  padding: 16px 0;
  border-bottom: 1px solid $border-grey;
  span {
    color: $font-black;
    font-family: $number-font;
    font-weight: 700;
    font-size: 19px;
    line-height: 23px;
  }
  &-reply {
    margin-right: 24px;
  }
}
.content-response {
  padding: 20px 0;
  position: relative;
  &::after {
    content: "";
    display: block;
    width: calc(100% + 32px);
    height: 1px;
    background: $border-grey;
    position: absolute;
    bottom: 0;
    left: -16px;
  }
  img {
    @extend %icon-30;
    cursor: pointer;
  }
  &-reply {
    margin-right: 128px;
  }
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
.reply-tag {
  @extend %tweet-account;
  margin-bottom: 8px;
  span {
    color: $orange;
    font-family: $number-font;
  }
}
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
    border-bottom: 1px solid $border-grey;
  }
  &-cancel img {
    width: 24px;
    height: 24px;
    margin: 16px;
  }
  .avatar {
    position: absolute;
    left: 24px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    &.top-avatar {
      margin-top: 16px;
    }
  }
  .modal-topic-content {
    display: flex;
    flex-flow: column;
  }
  .modal-user-content {
    display: flex;
  }
  .content-info-description {
    line-height: 26px;
    margin-top: 8px;
  }
}
// 回覆按鈕
.modal-tweet {
  @extend %button-orange;
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  min-width: 76px;
  height: 40px;
  &:disabled {
    background: $form-input-placeholder;
  }
}
</style>
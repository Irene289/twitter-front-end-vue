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
          <img :src="user.avatarImg" alt="" />
        </div>
        <div class="user-info">
          <p class="user-info-name">{{ user.name }}</p>
          <p class="user-info-account">@{{ user.account }}</p>
        </div>
      </div>
      <div class="reply-div-content">
        <div class="content-text">
          <p>
            {{ tweet.description }}
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
            class="content-response-like"
            src="../assets/static/images/like@2x.png"
            alt=""
          />
        </div>
      </div>
      <!-- slot -->
      <UserTweetCard v-for="reply in replies" :key="reply.id">
        <template v-slot:avatar>
          <img class="avatar" :src="reply.User.avatarImg" alt="" />
        </template>
        <template v-slot:name>
          {{ reply.User.name }}
        </template>
        <template v-slot:id>
          {{ reply.User.account }}
        </template>
        <template v-slot:post-time>
          {{ tweet.User.createdAt | fromNow }}
        </template>
        <template v-slot:text>
          <div class="reply-tag">
            回覆 <span>@{{ tweet.User.account }}</span>
          </div>
          {{ reply.comment }}
        </template>
      </UserTweetCard>
    </div>

    <!-- modal -->
    <div 
      class="container" 
      :class="{ 'd-none': dNoneReplyModal }"
    >
      <div class="modal row">
        <form class="modal-content col-6" action="">
          <div class="modal-content-cancel">
            <button class="btn" @click.stop.prevent="handleCloseBtn">
              <img src="../assets/static/images/orangeClose@2x.png" alt="" />
            </button>
          </div>

          <TweetModal>
            <!--   推文 -->
            <template v-slot:isReplyModel>
              <div v-show="true" class="tweet-div"></div>
            </template>
            <template v-slot:replytoAvatarImg>
              <img class="avatar" :src="currentUser.avatarImg" alt="" />
            </template>
            <template v-slot:replyto>
              <p class="content-info-name">
                {{ tweet.description }}
                <!-- jdfhjdsahf -->
              </p>
              <p class="content-info-account">@{{ currentUser.account }}</p>
              <p class="content-info-time">{{ currentUser.createdAt }}</p>
            </template>
            <template v-slot:replytoAccount> @{{ currentUser.account }} </template>

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
              <p class="modal-alert">內容不可空白</p>
            </template>
          </TweetModal>

          <button class="btn modal-tweet">回覆</button>
        </form>
      </div>
    </div>

    <!-- <ReplyModal 
      :d-none-reply-modal="dNoneReplyModal"
      @reply-modal="replyModal"
    /> -->
  </div>
</template>

<script>
import UserTweetCard from "../components/UserTweetCard.vue";
import TweetModal from "../components/TweetModal";
import { fromNowFilter } from "./../utils/mixins";
import tweetAPI from "../apis/tweet";
import { Toast } from "../utils/helpers";

export default {
  name: "TwitterReply",
  mixins: [fromNowFilter],
  components: {
    UserTweetCard,
    TweetModal
  },
  data() {
    return {
      currentUser: {
        account: "user",
        avatarImg: "https://i.pravatar.cc/300",
        id: 5,
        name: "Favian",
      },
      // 要回覆的對象
      tweet: {},
      user: {
        avatarImg: "",
        name: "",
        account: "",
      },
      // 回覆對象的其他回覆
      replies: [],
      avatarImg: "",
      textReply: "",
      // isReplyModel: true,
      dNoneReplyModal: true,
    };
  },
  created() {
    const { id: id } = this.$route.params;
    this.fetchReplies(id);
  },
  methods: {
    async fetchReplies(id) {
      try {
        const { data, statusText } = await tweetAPI.getReply({ id });

        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        const { Replies } = data;

        this.tweet = data;
        this.user = data.User;
        this.replies = Replies;

        console.log(data.User);
        // console.log(Replies)
      } catch (error) {
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "暫時無法取得推文",
        });
      }
    },
    replyModal() {
      this.dNoneReplyModal = !this.dNoneReplyModal;
    },
    handleCloseBtn() {
      this.dNoneReplyModal = !this.dNoneReplyModal;
      this.textReply = "";
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
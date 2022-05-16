<template>
  <div>
    <div class="title">
      <h1>首頁</h1>
    </div>
    <div class="tweet-div">
      <form action="">
        <img :src="user.avatarImg" alt="" />
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
    <div 
      class="container" 
      :class="{'d-none': dNoneReplyModal}"
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
            <template 
              v-slot:isReplyModel
              v-if="!isReplyModel"
            >
              <div class="tweet-div">
              </div>
            </template>  
            <template v-slot:replytoAvatarImg>
              <img class="avatar" :src="user.avatarImg" alt="" />
            </template>
            <template v-slot:replyto>
              <p class="content-info-name">{{ tweets.description }}</p>
              <p class="content-info-account">@{{ user.account }}</p>
              <p class="content-info-time">{{ tweets.createdAt }}</p>
            </template>
            <template v-slot:replytoAccount> @{{ user.account }} </template>

            <!-- 回覆 -->
            <template v-slot:avatarImg>
              <img class="modal-content-avatar" :src="user.avatarImg" alt="" />
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
              <p class="modal-alert">
                {{ isReplyModel ? "內容不可空白" : "字數不可超過 140 字" }}</p>
            </template>
          </TweetModal>

          <button 
            v-if="isReplyModel"
            class="btn modal-tweet"
          >
            回覆
          </button>
          <button 
            v-else
            class="btn modal-tweet"
          >
            推文
          </button>
        </form>
      </div>
    </div>

    <!-- <TweetModal :d-none="dNone" @tweet-modal="tweetModal">
      <template v-slot:avatarImg>
        <img class="modal-content-avatar" :src="user.avatarImg" alt="" />
      </template>
      <template v-slot:text>
        <textarea
          v-model="textTweet"
          class="scrollbar"
          name="tweet"
          placeholder="有什麼新鮮事？"
        >
        </textarea>
      </template>
      <template v-slot:alert>
        <p class="modal-alert">字數不可超過 140 字</p>
      </template>
      <template v-slot:btn>
        <button class="btn modal-tweet" @click.stop.prevent>推文</button>
      </template>
    </TweetModal> -->
  </div>
</template>

<script>
import UserTweetCard from "../components/UserTweetCard";
import TweetModal from "../components/TweetModal";
import { fromNowFilter } from "./../utils/mixins";
import tweetAPI from "../apis/tweet";
import { Toast } from "../utils/helpers";

const dummyUser = {
  status: "success",
  data: {
    user: {
      id: 2,
      account: "user1",
      name: "Kamron25",
      email: "user1@example.com",
      nickname: "Rubye",
      coverImg: "https://picsum.photos/800/300",
      avatarImg: "https://i.pravatar.cc/300",
      bio: "Pariatur accusantium et magnam sint sed voluptate quia aperiam.",
      identityId: 2,
      createdAt: "2022-05-14T17:34:57.000Z",
      updatedAt: "2022-05-14T17:34:57.000Z",
      Tweets: [
        {
          id: 1,
          description:
            "At alias aut quo rem commodi harum voluptatem dolorum. Saepe quas eum natus laudantium reprehenderit delectus neque. Et molestiae velit dicta ducimus eum ea nam.",
          UserId: 2,
          createdAt: "2022-05-14T17:34:57.000Z",
          updatedAt: "2022-05-14T17:34:57.000Z",
          userId: 2,
        },
        {
          id: 7,
          description:
            "Est omnis ducimus exercitationem minima consectetur cum ut. Ea quia sapiente. Dolores excepturi occaecati eum aut alias eum velit. Totam explicabo totam ipsam.",
          UserId: 2,
          createdAt: "2022-05-14T17:34:57.000Z",
          updatedAt: "2022-05-14T17:34:57.000Z",
          userId: 2,
        },
        {
          id: 10,
          description:
            "Dignissimos quod dolor eius. Occaecati vel voluptates quia hic aperiam cumque. Qui similique alias corrupti sunt quisquam nostrum. Saepe doloribus et fugit aut magni laboriosam. A repudiandae et rem aut amet laborum.\n \rOdio rerum porro fugit. Est suscipit deleniti magni alias. Cupiditate impedit porro id similique consequatur quo eos.\n \rEum dolor voluptas quo ea aut. Sed odio ut laudantium. Est cupiditate tempore nesciunt consequatur consequatur dolores occaecati veritatis. Est laboriosam quam quia qui ratione dolorem recusandae.",
          UserId: 2,
          createdAt: "2022-05-14T17:34:57.000Z",
          updatedAt: "2022-05-14T17:34:57.000Z",
          userId: 2,
        },
        {
          id: 19,
          description:
            "Quia a tempora ullam.\nVoluptatum ad explicabo at similique omnis neque aut.\nQuia quae est sapiente ea aspernatur ducimus quia provident.",
          UserId: 2,
          createdAt: "2022-05-14T17:34:57.000Z",
          updatedAt: "2022-05-14T17:34:57.000Z",
          userId: 2,
        },
        {
          id: 27,
          description: "Occaecati rem quia.",
          UserId: 2,
          createdAt: "2022-05-14T17:34:57.000Z",
          updatedAt: "2022-05-14T17:34:57.000Z",
          userId: 2,
        },
        {
          id: 33,
          description:
            "Voluptatum quia commodi. Ut et quam placeat ipsam laborum ut mollitia dolor non. Tempore praesentium ea assumenda. Laboriosam provident molestiae neque quia. Quas voluptates at repellendus doloremque.",
          UserId: 2,
          createdAt: "2022-05-14T17:34:57.000Z",
          updatedAt: "2022-05-14T17:34:57.000Z",
          userId: 2,
        },
        {
          id: 35,
          description: "et",
          UserId: 2,
          createdAt: "2022-05-14T17:34:57.000Z",
          updatedAt: "2022-05-14T17:34:57.000Z",
          userId: 2,
        },
        {
          id: 44,
          description:
            "Sunt dolor vel dolores nihil dolorem omnis provident. Quo odio eos. Nostrum repellat aut. Quasi dolorem eum sit dolores sit.",
          UserId: 2,
          createdAt: "2022-05-14T17:34:57.000Z",
          updatedAt: "2022-05-14T17:34:57.000Z",
          userId: 2,
        },
        {
          id: 47,
          description: "Aperiam qui magni.",
          UserId: 2,
          createdAt: "2022-05-14T17:34:57.000Z",
          updatedAt: "2022-05-14T17:34:57.000Z",
          userId: 2,
        },
      ],
      Follower: [
        {
          id: 4,
          account: "user3",
          name: "Gino_OConnell77",
          email: "user3@example.com",
          password:
            "$2a$10$0CiK27bSCHhIXI9BdRSBS.NTeW6z/hxoLX/GPHlfo1sKJXJi5IDdC",
          nickname: "Elmore",
          coverImg: "https://picsum.photos/800/300",
          avatarImg: "https://i.pravatar.cc/300",
          bio: "Sed laborum assumenda ut est ea et delectus. Quas voluptas neque sunt eum dolorum accusantium. Maiores esse rem. Ut quo eveniet.",
          identityId: 2,
          createdAt: "2022-05-14T17:34:57.000Z",
          updatedAt: "2022-05-14T17:34:57.000Z",
          Followship: {
            followerId: 2,
            followingId: 4,
            createdAt: "2022-05-14T17:34:57.000Z",
            updatedAt: "2022-05-14T17:34:57.000Z",
          },
        },
      ],
      Following: [],
      is_admin: false,
    },
  },
};

export default {
  name: "Twitter",
  mixins: [fromNowFilter],
  components: {
    UserTweetCard,
    TweetModal,
  },
  data() {
    return {
      user: "",
      text: "",
      textReply: "",
      dNone: true,
      dNoneReplyModal: true,
      tweets: [],
      isReplyModel: true,
      placeholder: ''
    };
  },
  created() {
    this.fetchUser();
    this.fetchTweets();
  },
  methods: {
    fetchUser() {
      const { data } = dummyUser;
      const { user } = data;
      // console.log(data)
      // console.log(user)
      this.user = user;
    },
    async fetchTweets() {
      try {
        const response = await tweetAPI.getTweets();

        if (response.statusText !== "OK") {
          throw new Error(response.statusText);
        }

        const { data } = response;
        this.tweets = data;
      } catch (error) {
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "暫時無法取得推文",
        });
      }
    },
    onClickAvatar() {
      console.log(this.tweets.User.id);
    },
    // onClickText() {
    //   console.log(this.tweets.id)
    // },
    handleCloseBtn() {
      // this.$emit('reply-modal')
      this.dNoneReplyModal = !this.dNoneReplyModal;
      this.textReply = "";
    },
    tweetModal() {
      this.dNoneReplyModal = !this.dNoneReplyModal;
      // this.dNone = !this.dNone;
      this.isReplyModel = false
      this.placeholder = '有什麼新鮮事？'
    },
    replyModal(id) {
      console.log(id)
      this.dNoneReplyModal = !this.dNoneReplyModal
      this.isReplyModel = true
      this.placeholder = '推你的回覆'
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
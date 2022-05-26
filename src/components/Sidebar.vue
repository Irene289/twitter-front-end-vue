<template>
  <nav id="sidebar">
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
            <template v-slot:isReplyModel>
              <div class="tweet-div"></div>
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
                v-model="text"
                name="tweet"
                placeholder="有什麼新鮮事？"
                maxlength="140"
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
            class="modal-tweet"
            :disabled="isProcessing || isModalExceed"
            @click.stop.prevent="updateTweet"
          >
            推文
          </button>
        </form>
      </div>
    </div>
    <img class="logo" src="../assets/static/images/navLogo@2x.png" alt="" />
    <ul class="nav__list">     
      <template v-if="!isAdmin">
        <li class="nav__list__item">
          <router-link to="/twitter">
            <div class="nav__list__item__wrapper">
              <img
                class="active"
                src="../assets/static/images/orangeHome@2x.png"
                alt=""
              />
              <img
                class="inactive"
                src="../assets/static/images/home@2x.png"
                alt=""
              />
              <p class="hidden">首頁</p>
            </div>
          </router-link>
        </li>
        <li class="nav__list__item">
          <router-link
            :to="{
              name: 'user-tweets',
              params: { id: currentUser.id },
            }"
          >
            <div class="nav__list__item__wrapper">
              <img
                class="active"
                src="../assets/static/images/orangeUser@2x.png"
                alt=""
              />
              <img
                class="inactive"
                src="../assets/static/images/user@2x.png"
                alt=""
              />
              <p class="hidden">個人資料</p>
            </div>
          </router-link>
        </li>
        <li class="nav__list__item">
          <router-link
            :to="{ name: 'user-setting', params: { id: currentUser.id } }"
          >
            <div class="nav__list__item__wrapper">
              <img
                class="active"
                src="../assets/static/images/orangeSet@2x.png"
                alt=""
              />
              <img
                class="inactive"
                src="../assets/static/images/setIcon@2x.png"
                alt=""
              />
              <p class="hidden">設定</p>
            </div>
          </router-link>
        </li>
      </template>
      <template v-else>
        <li v-for="item in navAdmin" :key="item.id" class="nav__list__item">
          <router-link :to="item.path">
            <div class="nav__list__item__wrapper">
              <img class="active" :src="item.iconActive" alt="" />
              <img class="inactive" :src="item.iconInactive" alt="" />
              <p class="hidden">{{ item.title }}</p>
            </div>
          </router-link>
        </li>
      </template>
    </ul>

    <button 
      class="tweet-btn" 
      v-if="!isAdmin" 
      @click.stop.prevent="tweetModal"
    >
      <p class="hidden">推文</p>
      <img class="show" src="../assets/static/images/tweet@2x.png" alt="">  
    </button>
    <div 
      class="logout nav__list__item__wrapper"
      @click.stop.prevent="onClickLogout"
    >
      <img
        class="active"
        src="../assets/static/images/orangeLogout@2x.png"
        alt=""
      />
      <img
        class="inactive"
        src="../assets/static/images/logout@2x.png"
        alt=""
      />
      <p class="hidden">登出</p>
    </div>
  </nav>
</template>
<script>
import TweetModal from "../components/TweetModal";
import tweetAPI from "../apis/tweet";
import { Toast } from "../utils/helpers";
import { mapState } from "vuex";
// import store from '../store/index'

export default {
  name: "Sidebar",
  components: {
    TweetModal,
  },
  data() {
    return {
      route: "user",
      isAdmin: false,
      navAdmin: [
        {
          title: "推文清單",
          id: 4,
          iconActive: require("../assets/static/images/orangeHome@2x.png"),
          iconInactive: require("../assets/static/images/home@2x.png"),
          path: "/admin/tweets",
        },
        {
          title: "使用者列表",
          id: 5,
          iconActive: require("../assets/static/images/orangeUser@2x.png"),
          iconInactive: require("../assets/static/images/user@2x.png"),
          path: "/admin/users",
        },
      ],
      tweets: [],
      text: "",              // 推文
      newTweet: {},          // 新增推文
      dNoneModal: true,      // 控制 Modal
      isReplyModel: true,    // 控制 Modal
      isProcessing: false,   // 按鈕送出
      isModalEmpty: true,
      isModalExceed: false,
    };
  },
  methods: {
    toggleNavList() {
      const route = this.$route.name;
      if (route === "admin-tweets" || route === "admin-users") {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    },
    // 登出
    onClickLogout() {
      this.$store.commit("revokeAuthentication");
      localStorage.removeItem("token");
      this.$router.push("/signin");
    },
    // 拿到全部推文
    async fetchTweets() {
      try {
        this.isLoading = true
        const { data, statusText } = await tweetAPI.getTweets();

        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        // 篩除非user的用戶
        this.tweets = data.filter((data) => data.User.role === "user");
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "暫時無法取得推文",
        });
      }
    },
    async createTweet() {
      try {
        // 內容空白處理
        if (!this.text) {
          this.isModalEmpty = false;
          return;
        } else if (this.text.trim() === "") {
          this.isModalEmpty = false;
          return;
        }
        this.isProcessing = true;

        const { data } = await tweetAPI.createTweet({
          description: this.text,
          UserId: this.currentUser.id,
        });

        const { id, description, UserId, createdAt } = data.data

        this.newTweet = {
          id, // 推文 id
          description,
          createdAt,
          User: { id: UserId },
        };

        this.tweets = [
          { ...this.newTweet }, 
          ...this.tweets
        ];

        if (data.status !== "success") {
          throw new Error(data.message);
        } else {
          Toast.fire({
            icon: "success",
            title: "成功送出回覆",
          });
          this.text = "";
          this.dNoneModal = true;
          this.isProcessing = false;
        }
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
    updateTweet() {
      this.createTweet()
      this.fetchTweets()
      // 點擊 Modal 中的推文按鈕後，emit 到 TwitterMain
      this.$emit('update')
    },
    // 開啟 Modal
    tweetModal() {
      this.dNoneModal = !this.dNoneModal;
    },
    // 關閉 Modal
    handleCloseBtn() {
      this.isModalEmpty = true
      this.dNoneModal = true;
      this.text = ''
    },
    // 字數警示
    textWarning() {
      if (this.text.length > 140) {
        this.isModalExceed = true;
        this.isProcessing = false;
      } else {
        this.isModalEmpty = true;
        this.isModalExceed = false;
      }
      return;
    },
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  watch: {
    text() {
      this.textWarning();
    },
  },
  created() {
    this.toggleNavList();
    // this.fetchTweets()
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/_basic.scss";

nav {
  width:100%;
  height: 100%;
  position: relative;
  padding-top: 13px;
  display: flex;
  flex-flow: column;
  align-items: center;
  .hidden{
    display: none;
  }
  .show{
    width: 20px;
    height: 20px;
  }
  .logo {
    width: 32px;
    height: 32px;
  }
  .nav__list__item {
    margin-top: 40px;
    margin-bottom: 40px;
    &__wrapper {
      cursor: pointer;
      display: flex;
      img {
        width: 20px;
        height: 20px;
      }
      p {
        margin-left: 17px;
        font-weight: 700;
        color: #44444f;
      }
      .active {
        display: none;
      }
      &:hover {
        p {
          color: $orange;
        }
        .active {
          display: block;
        }
        .inactive {
          display: none;
        }
      }
    }
  }
  .tweet-btn {
    @extend %button-orange;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    img{
      transform: translateY(8px);
    }
  }
  .logout {
    position: absolute;
    bottom: 13px;
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
  z-index: 1000;
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
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
  .modal-alert {
    bottom: 10px;
  }
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
}
@media screen and (min-width:961px){
  nav{
    align-items:start;
    .hidden{
    display: block;
    }
    .logo{
      width: 40px;
      height: 40px;
      margin-left: 20px;
    }
    .nav__list {
    padding-left: 20px;
    }
    .tweet-btn{
      border-radius: 50px;
      width: 100%; 
      max-width: 178px;
      height: 46px;
      font-size: 20px;
    }
    .show{
      display: none;
    }
    .logout{
      left: 13px;
    }
  }
 
}
</style>
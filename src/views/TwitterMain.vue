<template>
  <main>
    <Loading v-if="isLoading" />
    <div class="container">
      <div class="row">
        <!-- sidebar -->
        <div class="col-1 col-lg-2 sidebar">
          <Sidebar @update="update" />
        </div>

        <!-- twitter / twitterReply -->
        <div class="col-7 col-lg-7  content-container">
          <router-view
            :initial-tweets="tweets"
          />
        </div>

        <!-- popular -->
        <div class="col-4 col-lg-3 popular-users">
          <Popular />
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import Popular from "../components/Popular.vue";
import Sidebar from "../components/Sidebar.vue";
import tweetAPI from "../apis/tweet"
import { Toast } from "../utils/helpers"
import Loading from '../components/Loading'

export default {
  name: "TwitterMain",
  components: {
    Popular,
    Sidebar,
    Loading
  },
  data(){
    return {
      tweets: [],          // 全部推文
      isLoading: false
    }
  },
  methods: {
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
    update(tweets) {
      this.fetchTweets()
      this.tweets = [...tweets]
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/basic.scss";

.content-container {
  border-left: 1px solid $border-grey;
  border-right: 1px solid $border-grey;
  padding: 0;
}
</style>
<template>
  <main>
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
          <Popular :top-users="topUsers" />
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

export default {
  name: "TwitterMain",
  components: {
    Popular,
    Sidebar
  },
  data(){
    return {
      tweets: [],          // 全部推文
      topUsers: []
    }
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
    update() {
      // 接受 Sidebar 推文的 emit，重新打 fetchTweets API
      this.fetchTweets()
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
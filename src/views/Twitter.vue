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
          <img
            class="avatar"
            :src="tweet.img"
            alt=""
            @click.stop.prevent="onClickAvatar"
          />
        </template>
        <template v-slot:name>
          {{ tweet.name }}
        </template>
        <template v-slot:id> @{{ tweet.account }} </template>
        <template v-slot:post-time>
          {{ tweet.createdAt | fromNow}}
        </template>
        <template v-slot:text>
          <p class="tweet-content-text" @click.stop.prevent="onClickText">
            {{ tweet.text }}
          </p>
          <div class="icons">
            <div class="icon-wrapper">
              <img
                src="../assets/static/images/reply@2x.png"
                alt=""
                @click.stop.prevent="replyModal"
              />
              <p class="count">{{ tweet.replyNum }}</p>
            </div>
            <div class="icon-wrapper">
              <img src="../assets/static/images/like@2x.png" alt="" />
              <p class="count">{{ tweet.likeNum }}</p>
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
import UserTweetCard from "../components/UserTweetCard";
import TweetModal from "../components/TweetModal";
import ReplyModal from "../components/ReplyModal";
import { fromNowFilter } from './../utils/mixins'
import { Toast } from '../utils/helpers';

const dummyData = {
  status: "success",
  data: [
    {
      id: 1,
      account: "root",
      name: "root",
      email: "root@example.com",
      password: "$2a$10$lvYqyY7mfVRmhHlQSJjeMed8Yd3yNAsEYoY0TzurnyQzTmI90Sz4S",
      nickname: "root",
      coverImg: "https://picsum.photos/800/300",
      avatarImg: "https://i.pravatar.cc/300",
      bio: null,
      identityId: 1,
      createdAt: "2022-05-13T01:31:35.000Z",
      updatedAt: "2022-05-13T01:31:35.000Z",
      Identity: {
        id: 1,
        identity: "admin",
        createdAt: "2022-05-13T01:31:34.000Z",
        updatedAt: "2022-05-13T01:31:34.000Z",
      },
    },
    {
      id: 2,
      account: "user1",
      name: "Otilia4",
      email: "user1@example.com",
      password: "$2a$10$6UumyIwJD5H9VOcVqYjwv.gMNbELZJ54EH0sPTvI1kF7AMyssX3Xe",
      nickname: "Arielle",
      coverImg: "https://picsum.photos/800/300",
      avatarImg: "https://i.pravatar.cc/300",
      bio: "sed",
      identityId: 2,
      createdAt: "2022-05-13T01:31:35.000Z",
      updatedAt: "2022-05-13T01:31:35.000Z",
      Identity: {
        id: 2,
        identity: "user",
        createdAt: "2022-05-13T01:31:34.000Z",
        updatedAt: "2022-05-13T01:31:34.000Z",
      },
    },
    {
      id: 3,
      account: "user2",
      name: "Daron.Pagac",
      text: 'hahaha',
      email: "user2@example.com",
      password: "$2a$10$ZwjL4hrLqD5BcXS0XD9NgOuPR8iTOR7F5L5dcgzpkvbua5Yuv0/NK",
      nickname: "Arjun",
      coverImg: "https://picsum.photos/800/300",
      avatarImg: "https://i.pravatar.cc/300",
      bio: "Aut quisquam omnis.",
      identityId: 2,
      createdAt: "2022-05-13T01:31:35.000Z",
      updatedAt: "2022-05-13T01:31:35.000Z",
      Identity: {
        id: 2,
        identity: "user",
        createdAt: "2022-05-13T01:31:34.000Z",
        updatedAt: "2022-05-13T01:31:34.000Z",
      },
    },
    {
      id: 4,
      account: "user3",
      name: "Lessie88",
      email: "user3@example.com",
      password: "$2a$10$mKsynwpYSf1FigePcenQRuMD6OmH3VPnek73sH.dvz6z9RfYxLOxi",
      nickname: "Glennie",
      coverImg: "https://picsum.photos/800/300",
      avatarImg: "https://i.pravatar.cc/300",
      bio: "Voluptas veritatis dolor.\nOfficiis aperiam corporis possimus ipsam.\nDistinctio doloremque adipisci reprehenderit cupiditate praesentium esse et.",
      identityId: 2,
      createdAt: "2022-05-13T01:31:35.000Z",
      updatedAt: "2022-05-13T01:31:35.000Z",
      Identity: {
        id: 2,
        identity: "user",
        createdAt: "2022-05-13T01:31:34.000Z",
        updatedAt: "2022-05-13T01:31:34.000Z",
      },
    },
    {
      id: 5,
      account: "user4",
      name: "Jasen_Rosenbaum",
      email: "user4@example.com",
      password: "$2a$10$AcBzRD2L5iiVqGh9dX/gTOxY1lewVDykoQg33wqorNSl1iALur8AG",
      nickname: "Lon",
      coverImg: "https://picsum.photos/800/300",
      avatarImg: "https://i.pravatar.cc/300",
      bio: "Sint atque consequuntur voluptatem. Vero cumque modi tenetur rem et cum. Eius consequatur aliquid. Qui odio voluptatem ad repudiandae sed velit aut modi.\n \rEt sed non facere id repellendus asperiores natus. Eos eaque aspernatur omnis iste sed dolor nemo ut. Quam est in voluptatem dolorem eaque nostrum. Id eum accusantium dolorum reprehenderit aspernatur saepe sit odit magnam.\n \rNecessitatibus voluptatem fuga et est quos dolores. Commodi modi est assumenda est et voluptatibus quasi. Occaecati sequi ut molestiae dolor. Asperiores molestiae dolorem unde nam sequi nulla asperiores atque suscipit. Error quia autem ad possimus. Possimus corporis aut numquam sit tenetur odio est.",
      identityId: 2,
      createdAt: "2022-05-13T01:31:35.000Z",
      updatedAt: "2022-05-13T01:31:35.000Z",
      Identity: {
        id: 2,
        identity: "user",
        createdAt: "2022-05-13T01:31:34.000Z",
        updatedAt: "2022-05-13T01:31:34.000Z",
      },
    },
    {
      id: 6,
      account: "user5",
      name: "Alanis.DuBuque30",
      email: "user5@example.com",
      password: "$2a$10$49NgHGvD.pdvIgQVNWG36OdNWPpqIRBZ7kyoQsbegn07tBAyaXYjC",
      nickname: "Brionna",
      coverImg: "https://picsum.photos/800/300",
      avatarImg: "https://i.pravatar.cc/300",
      bio: "Aperiam dolor veritatis necessitatibus at aut pariatur esse. Modi saepe repellendus labore doloremque natus consequatur alias. Aut at voluptatem vero omnis deleniti deleniti. Sed non aliquam sit omnis vel sint veritatis. Voluptas dolores fugit harum et iusto perferendis.",
      identityId: 2,
      createdAt: "2022-05-13T01:31:35.000Z",
      updatedAt: "2022-05-13T01:31:35.000Z",
      Identity: {
        id: 2,
        identity: "user",
        createdAt: "2022-05-13T01:31:34.000Z",
        updatedAt: "2022-05-13T01:31:34.000Z",
      },
    },
    {
      id: 7,
      account: "root",
      name: "root",
      email: "root@example.com",
      password: "$2a$10$QVpCHzZxN7oRtAWJYBxDte.QguiOhZ3zTHDFn7yaecN/3gJ59p/KO",
      nickname: "root",
      coverImg: "https://picsum.photos/800/300",
      avatarImg: "https://i.pravatar.cc/300",
      bio: null,
      identityId: 1,
      createdAt: "2022-05-13T02:08:28.000Z",
      updatedAt: "2022-05-13T02:08:28.000Z",
      Identity: {
        id: 1,
        identity: "admin",
        createdAt: "2022-05-13T01:31:34.000Z",
        updatedAt: "2022-05-13T01:31:34.000Z",
      },
    },
    {
      id: 8,
      account: "user1",
      name: "Rosanna31",
      email: "user1@example.com",
      password: "$2a$10$nT.YnX5V6YHo8GZlljqDru4.zF.6XvQciLjqYBg3KNlSgtd19TJN6",
      nickname: "Verdie",
      coverImg: "https://picsum.photos/800/300",
      avatarImg: "https://i.pravatar.cc/300",
      bio: "Quae ducimus facilis blanditiis. Ut mollitia aliquid saepe sint consequuntur nam nihil. Non in eaque et nam sint. Est et et magni. Quis fugiat non sit suscipit eaque aut nobis. Ea ipsum officiis tempora magni et.",
      identityId: 2,
      createdAt: "2022-05-13T02:08:28.000Z",
      updatedAt: "2022-05-13T02:08:28.000Z",
      Identity: {
        id: 2,
        identity: "user",
        createdAt: "2022-05-13T01:31:34.000Z",
        updatedAt: "2022-05-13T01:31:34.000Z",
      },
    },
    {
      id: 9,
      account: "user2",
      name: "Valentina_Ernser",
      email: "user2@example.com",
      password: "$2a$10$CR6.oSZR20YUvIkq6sEulOlDIvGptOZrPGU8HZQffG7yRV.tSehwe",
      nickname: "Matilde",
      coverImg: "https://picsum.photos/800/300",
      avatarImg: "https://i.pravatar.cc/300",
      bio: "Tenetur quo iusto corrupti omnis velit culpa pariatur alias ipsam. Et natus quibusdam fuga veritatis nulla voluptas rerum.",
      identityId: 2,
      createdAt: "2022-05-13T02:08:28.000Z",
      updatedAt: "2022-05-13T02:08:28.000Z",
      Identity: {
        id: 2,
        identity: "user",
        createdAt: "2022-05-13T01:31:34.000Z",
        updatedAt: "2022-05-13T01:31:34.000Z",
      },
    },
    {
      id: 10,
      account: "user3",
      name: "Yvonne13",
      email: "user3@example.com",
      password: "$2a$10$Hw.PY0bTWYhWDNPcOJQQEuKiAJ8ue2JA3SvBbaSpLx3S7zi60zgty",
      nickname: "Emely",
      coverImg: "https://picsum.photos/800/300",
      avatarImg: "https://i.pravatar.cc/300",
      bio: "ducimus reiciendis ex",
      identityId: 2,
      createdAt: "2022-05-13T02:08:28.000Z",
      updatedAt: "2022-05-13T02:08:28.000Z",
      Identity: {
        id: 2,
        identity: "user",
        createdAt: "2022-05-13T01:31:34.000Z",
        updatedAt: "2022-05-13T01:31:34.000Z",
      },
    },
    {
      id: 11,
      account: "user4",
      name: "Zoila11",
      email: "user4@example.com",
      password: "$2a$10$j7z6asgpupVP2iOxNVxmeuqkkcLpUFNkC.vxV/livSKd7tHjQ17s2",
      nickname: "Jacinto",
      coverImg: "https://picsum.photos/800/300",
      avatarImg: "https://i.pravatar.cc/300",
      bio: "Perferendis deleniti et ab iure eligendi est. Doloribus magnam dignissimos nam odit quia non. Sapiente iure molestiae. Veritatis eos perspiciatis ipsam. Eius error sunt quos. Nesciunt quas vel omnis unde dolores sed.",
      identityId: 2,
      createdAt: "2022-05-13T02:08:29.000Z",
      updatedAt: "2022-05-13T02:08:29.000Z",
      Identity: {
        id: 2,
        identity: "user",
        createdAt: "2022-05-13T01:31:34.000Z",
        updatedAt: "2022-05-13T01:31:34.000Z",
      },
    },
    {
      id: 12,
      account: "user5",
      name: "Alicia21",
      email: "user5@example.com",
      password: "$2a$10$VkeseNYh8280XACwkHDM1uZcHE730KDc9oh.n58Roy07d4kRBcM2C",
      nickname: "Lloyd",
      coverImg: "https://picsum.photos/800/300",
      avatarImg: "https://i.pravatar.cc/300",
      bio: "Consectetur molestiae quidem perferendis optio. Dolores deleniti quis et. Non ut aspernatur.",
      identityId: 2,
      createdAt: "2022-05-13T02:08:29.000Z",
      updatedAt: "2022-05-13T02:08:29.000Z",
      Identity: {
        id: 2,
        identity: "user",
        createdAt: "2022-05-13T01:31:34.000Z",
        updatedAt: "2022-05-13T01:31:34.000Z",
      },
    },
    {
      id: 13,
      account: "root",
      name: "root",
      email: "root@example.com",
      password: "$2a$10$rvvas9sZo2Dm4w.a6XeoJ.tZKAXEQ7P1LzNsIDVD6JMIK7MUom6Am",
      nickname: "root",
      coverImg: "https://picsum.photos/800/300",
      avatarImg: "https://i.pravatar.cc/300",
      bio: null,
      identityId: 1,
      createdAt: "2022-05-13T02:21:05.000Z",
      updatedAt: "2022-05-13T02:21:05.000Z",
      Identity: {
        id: 1,
        identity: "admin",
        createdAt: "2022-05-13T01:31:34.000Z",
        updatedAt: "2022-05-13T01:31:34.000Z",
      },
    },
    {
      id: 14,
      account: "user1",
      name: "Hiram_Schaden",
      email: "user1@example.com",
      password: "$2a$10$Kaqcy0XraRSFHEeNC9.HUO0wa0JFixrRmuOpEE7hOyMHYuK46e2s2",
      nickname: "Marina",
      coverImg: "https://picsum.photos/800/300",
      avatarImg: "https://i.pravatar.cc/300",
      bio: "non",
      identityId: 2,
      createdAt: "2022-05-13T02:21:05.000Z",
      updatedAt: "2022-05-13T02:21:05.000Z",
      Identity: {
        id: 2,
        identity: "user",
        createdAt: "2022-05-13T01:31:34.000Z",
        updatedAt: "2022-05-13T01:31:34.000Z",
      },
    },
    {
      id: 15,
      account: "user2",
      name: "Jovany.Johnson",
      email: "user2@example.com",
      password: "$2a$10$NK1sFaUfr/Em0h1r4bgu.u6ASHdsgxBN2cYNYHH8gT00KWKKqaEBW",
      nickname: "Cassandra",
      coverImg: "https://picsum.photos/800/300",
      avatarImg: "https://i.pravatar.cc/300",
      bio: "Nulla tenetur odio. Non totam sequi occaecati deserunt nam molestias aspernatur velit voluptatem. Voluptas id dicta ipsam aspernatur dolore praesentium harum non.",
      identityId: 2,
      createdAt: "2022-05-13T02:21:05.000Z",
      updatedAt: "2022-05-13T02:21:05.000Z",
      Identity: {
        id: 2,
        identity: "user",
        createdAt: "2022-05-13T01:31:34.000Z",
        updatedAt: "2022-05-13T01:31:34.000Z",
      },
    },
    {
      id: 16,
      account: "user3",
      name: "Yolanda71",
      email: "user3@example.com",
      password: "$2a$10$gniKpvFoWXFsn1wBvd8w5OS/nupjY1/BPLyP.7WZD7RaXrdxOReK.",
      nickname: "Joey",
      coverImg: "https://picsum.photos/800/300",
      avatarImg: "https://i.pravatar.cc/300",
      bio: "Qui quia ut ut vitae facere.\nLaboriosam repellendus incidunt labore voluptatibus minus ipsum cum.\nEligendi quo eligendi ducimus numquam.\nConsequatur vel sed.\nConsequuntur quia cumque omnis adipisci.",
      identityId: 2,
      createdAt: "2022-05-13T02:21:05.000Z",
      updatedAt: "2022-05-13T02:21:05.000Z",
      Identity: {
        id: 2,
        identity: "user",
        createdAt: "2022-05-13T01:31:34.000Z",
        updatedAt: "2022-05-13T01:31:34.000Z",
      },
    },
    {
      id: 17,
      account: "user4",
      name: "Monique.Hamill",
      email: "user4@example.com",
      password: "$2a$10$3UrA3iPIAvx2m0QDr9IkG.E7k1Dt/l3isFsADSZgcI.cDrW27hkJa",
      nickname: "Fae",
      coverImg: "https://picsum.photos/800/300",
      avatarImg: "https://i.pravatar.cc/300",
      bio: "Enim excepturi quo id doloremque et possimus et quisquam. Harum deserunt nulla quia et illo quisquam beatae dolorem nesciunt. Atque ab ipsum et.",
      identityId: 2,
      createdAt: "2022-05-13T02:21:05.000Z",
      updatedAt: "2022-05-13T02:21:05.000Z",
      Identity: {
        id: 2,
        identity: "user",
        createdAt: "2022-05-13T01:31:34.000Z",
        updatedAt: "2022-05-13T01:31:34.000Z",
      },
    },
    {
      id: 18,
      account: "user5",
      name: "Lamar90",
      email: "user5@example.com",
      password: "$2a$10$67d1O2ai.grDrFOQU/sQ4u0w/TBJMaG206yMI6ZDTURSHCsfIAO9K",
      nickname: "Florine",
      coverImg: "https://picsum.photos/800/300",
      avatarImg: "https://i.pravatar.cc/300",
      bio: "Sapiente sed dolorem autem expedita et magni pariatur qui nam. Qui dolorem rerum. Saepe iste adipisci natus. Illo voluptatem explicabo dolorem et optio illum saepe quasi. Excepturi nisi et ut omnis laborum aut sequi. Quod dolor ipsum sit.",
      identityId: 2,
      createdAt: "2022-05-13T02:21:05.000Z",
      updatedAt: "2022-05-13T02:21:05.000Z",
      Identity: {
        id: 2,
        identity: "user",
        createdAt: "2022-05-13T01:31:34.000Z",
        updatedAt: "2022-05-13T01:31:34.000Z",
      },
    },
  ],
};

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
      tweets: 
        {
          id: -1,
          img: '',
          name: '',
          account: '',
          createdAt: -1,
          text: "Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt reprehenderit elit laborum.",
          replyNum: 36,
          likeNum: 136,
        },
    };
  },
  created () {
    this.fetchTweets()
  },
  methods: {
    fetchTweets () {
      // TODO:API
      const { data } = dummyData

      // 條件判斷
      if (dummyData.status !== 'success') {
        // throw new Error(data.message)
        Toast.fire({
          icon: 'warning',
          title: '暫時無法取得推文'
        })
      }
      this.tweets = data
    },
    onClickAvatar() {
      this.$router.push("/users/:id");
    },
    onClickText() {
      this.$router.push("/twitter/replies");
    },
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
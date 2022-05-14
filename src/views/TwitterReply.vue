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
          <img src="../assets/static/images/noImage@2x.png" alt="" />
        </div>
        <div class="user-info">
          <p class="user-info-name">{{items.name}}</p>
          <p class="user-info-account">@{{items.account}}</p>
        </div>
      </div>
      <div class="reply-div-content">
        <div class="content-text">
          <p>
            {{items.text}}
          </p>
        </div>
        <div class="content-when">
          <p>{{items.createdAt | format}}</p>
          <!-- <p class="content-when-time">上午 10:05</p>
          <p class="content-date">2021年11月10日</p> -->
        </div>
        <div class="content-counts">
          <div class="content-counts-reply"><span>{{items.replyNum}}</span> 回覆</div>
          <div class="content-counts-like"><span>{{items.likeNum}}</span> 喜歡次數</div>
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
      <UserTweetCard 
        v-for="reply in replies"
        :key="reply.id"
        >
        <template v-slot:avatar>
          <img class="avatar" :src="reply.img" alt="">
        </template>
        <template v-slot:name>
          {{reply.name}}
        </template>
        <template v-slot:id>
          {{reply.account}}
        </template>
        <template v-slot:post-time>
          {{reply.createdAt | fromNow}}
        </template>
        <template v-slot:text>
          <div class="reply-tag">回覆 <span>@{{reply.to}}</span></div>
          {{reply.text}}
        </template>   
      </UserTweetCard>  

    </div>
    <ReplyModal 
      :d-none-reply-modal="dNoneReplyModal"
      @reply-modal="replyModal"
    />
  </div>
</template>

<script>
import UserTweetCard from '../components/UserTweetCard.vue'
import ReplyModal from "../components/ReplyModal"
import { fromNowFilter } from './../utils/mixins'

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
  name: "TwitterReply",
  mixins: [fromNowFilter],
  components: {
    UserTweetCard,
    ReplyModal,
  },
  data() {
    return {
      items: {
        id: 3,
        account: "user2",
        name: "Daron.Pagac",
        text: 'hahaha',
        avatarImg: "https://i.pravatar.cc/300",
        createdAt: "2022-05-13T01:31:35.000Z",
        likeNum: 145,
        replyNum: 45
      },
      replies: {
        id: -1,
        name: '',
        avatarImg: '',
        account: '',
        text:'The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to.',
        likeNum: 0,
        replyNum: 0,
        createdAt: '',
        to: 'apple' 
      },
      dNoneReplyModal: true,
    };
  },
  created () {
    this.fetchReplies()
  },
  methods: {
    fetchReplies() {
      const { data } = dummyData
      this.replies = data
      console.log(this.items)
    },
    replyModal() {
      this.dNoneReplyModal = !this.dNoneReplyModal;
    },
  }
}
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
.reply-tag{
    @extend %tweet-account;
    margin-bottom: 8px;
    span{
      color: $orange;
      font-family: $number-font;
    }
  }
</style>
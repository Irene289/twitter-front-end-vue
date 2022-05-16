<template>
  <main>
    <!-- <div class="container">
      <div class="modal row">
        <form class="modal-content col-6" action=""> -->
          <!-- <div class="modal-content-cancel"> -->
            <!-- <slot name="closeBtn"> -->
              <!-- <button class="btn">
                <img src="" alt="">
              </button>   -->
            <!-- </slot> -->
          <!-- </div> -->

          <!-- 推文 -->
          <slot name="isReplyModel">
            <div class="tweet-div">
            
              <div class="tweet-div-avatar">
                <slot name="replytoAvatarImg">
                  <img class="avatar" src="" alt="">
                </slot>
              </div>
              <div class="tweet-div-content">
                <div class="content-info">
                  <slot name="replyto">
                    <p class="content-info-name">Apple</p>
                    <p class="content-info-account">@apple</p>
                    <p class="content-info-time">3 小時</p>
                  </slot>
                </div>
                <div class="content-text">
                  <p><slot name="replytoText"></slot></p>
                </div>
                <div class="content-replyto">
                  回覆給 <span><slot name="replytoAccount">
                    </slot></span>
                </div>
              </div>
            </div>
          </slot>
          <!-- 回覆 -->
          <div class="reply-div">
            <slot name="avatarImg">
              <img
                class="modal-content-avatar" src="" alt=""
              />
            </slot>
            <slot name="text">
              <textarea
                class="scrollbar"
                name="tweet"
              >
              </textarea>
            </slot>
            <slot name="alert">
              <p class="modal-alert"></p>
            </slot>
            <!-- <button 
              class="btn modal-tweet"
            >
              回覆
            </button> -->
          </div>
        <!-- </form>
      </div>
    </div> -->
  </main>
</template>

<script>
export default {
name: 'TweetModal',
// props: {
//   dNoneReplyModal: {
//     type: Boolean,
//     default: true
//   }
// },
}
</script>


<style lang="scss" scoped>
@import "../assets/scss/basic.scss";

main{
  max-width: 1140px;
  margin: 0 auto;    
}

// .modal {
//   background-color: $modal-background; 
//   position: fixed;
//   top: 0;
//   right: 0;
//   bottom: 0;
//   left: 0;
// }
// .modal-content {
//   background-color: $white;
//   border-radius: 14px;
//   margin: auto;
//   margin-top: 56px;
//   padding: 0;
//   box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
//   &-cancel {
//     width: 100%;
//     border-bottom: 1px solid $border-grey;
//   }
//   &-cancel img {
//     width: 24px;
//     height: 24px;
//     margin: 16px;
//   }
//   .avatar {
//     width: 50px;
//     height: 50px;
//     border-radius: 50%;
//   }
// }
// 推文
.tweet-div {
  width: 100%;
  display: flex;
  // padding: 16px;
  
  &-avatar {
    margin-right: 8px;
    position: relative;
    &::after {
      content: '';
      display: block;
      width: 2px;
      height: calc(100% - 4*16px);
      background: $form-input-placeholder;
      position: absolute;
      top: calc(50px + 32px);
      bottom: calc(0);
      left: 50px;
    }
  }
  &-content {
    margin-top: 16px;
    margin-left: 82px;
  }
  .content-info {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    &-name {
      @extend %tweet-name;
      margin-right: 8px;
    }
    &-account, &-time {
      @extend %tweet-account;
    }
    &-account::after {
      content: '・';
      font-weight: 700;
    }
  }
  .content-text {
    color: $font-black;
    font-weight: 400;
    font-size: 16px;
    line-height: 26px;
    margin-bottom: 8px;
  }
  .content-replyto {
    color: $font-small;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    span {
      color: $orange;
    }
  }
}
// 回覆
.reply-div {
  display: flex;
  align-items: flex-start;
  // padding: 0 16px 16px 16px;
  margin: 0 16px 16px 16px;
  position: relative;
   .modal-content-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-top: 32px;
      margin-left: 8px;
   }
}
textarea {
  width: calc(100%);
  height: 250px;
  border: none;
  resize : none;
  color: $font-black;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
  overflow-y: scroll;
  margin-top: 44px;
  margin-left: 8px;
  &::placeholder {
    color: $font-small;
  }
}
// scrollbar
// .scrollbar {
//   &::-webkit-scrollbar {
//     width: 2px;
//   }
//   &::-webkit-scrollbar-track {
//     box-shadow: inset 0 0 1px $scrollbar; 
//     border-radius: 4px;
//   }
//   &::-webkit-scrollbar-thumb {
//     border-radius: 4px;
//     background-color: $scrollbar;
//   }
// }
// .modal-tweet {
//   @extend %button-orange;
//   min-width: 76px;
//   height: 40px;
//   align-self: flex-end;
// }
.modal-alert {
  color: $modal-alert;
  font-weight: 500;
  font-size: 15px;
  line-height: 15px;
  position: absolute;
  bottom: 27px;
  right: 108px;
}
</style>
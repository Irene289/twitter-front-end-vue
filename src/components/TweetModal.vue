<template>
  <main>
    <!-- 推文 -->
    <slot name="isReplyModel">
      <div class="tweet-div">
        <div class="tweet-div-avatar">
          <slot name="replytoAvatarImg">
            <img class="avatar" src="" alt="" />
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
            回覆給 <span><slot name="replytoAccount"> </slot></span>
          </div>
        </div>
      </div>
    </slot>
    <!-- 回覆 -->
    <div class="reply-div">
      <slot name="avatarImg">
        <img class="modal-content-avatar" src="" alt="" />
      </slot>
      <slot name="text">
        <textarea class="scrollbar" name="tweet"> </textarea>
      </slot>
      <slot name="alert">
        <span class="text-reply-length"></span>
        <span class="text-empty modal-alert"></span>
        <span class="text-exceed modal-alert"></span>
      </slot>
    </div>
  </main>
</template>

<script>
export default {
  name: "TweetModal",
};
</script>


<style lang="scss" scoped>
@import "../assets/scss/basic.scss";

main {
  max-width: 1140px;
  margin: 0 auto;
}

// 推文
.tweet-div {
  width: 100%;
  display: flex;
  &-avatar {
    margin-right: 8px;
    position: relative;
    &::after {
      content: "";
      display: block;
      width: 2px;
      height: calc(100% - 4 * 16px);
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
    &-account,
    &-time {
      @extend %tweet-account;
    }
    &-account::after {
      content: "・";
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
  resize: none;
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
.text-reply-length {
  @extend %form-label;
  position: absolute;
  bottom: 8px;
  left: 0;
}
.modal-alert {
  color: $modal-alert;
  font-weight: 500;
  font-size: 15px;
  line-height: 15px;
  position: absolute;
  bottom: 10px;
  right: 108px;
}
</style>
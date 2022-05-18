<template>
  <main>
    <div class="container">
      <div class="row">
        <!-- sidebar -->
        <div class="col-2 sidebar">
          <Sidebar />
        </div>

        <!-- form -->
        <form
          class="col-7 content-container setting-forms"
          action=""
          @submit.stop.prevent="handleSubmit"
        >
          <div class="setting-form-title">
            <h1>帳戶設定</h1>
          </div>

          <div class="setting-form setting-form__input-account">
            <label for="">帳號</label>
            <input
              v-model="user.account"
              type="text"
              name="account"
              placeholder="請輸入帳號"
              required
            />
          </div>

          <div class="setting-form setting-form__input-name">
            <label for="">名稱</label>
            <input
              v-model="user.name"
              type="text"
              name="name"
              placeholder="請輸入使用者名稱"
              required
            />
            <div class="text-length" :class="{ waring: isExceed}">
              {{textWarning(user.name.length)}}
              {{user.name.length}}/50</div>
          </div>

          <div class="setting-form setting-form__input-email">
            <label for="">Email</label>
            <input
              v-model="user.email"
              type="email"
              name="email"
              placeholder="請輸入 Email"
              required
            />
          </div>

          <div class="setting-form setting-form__input-password">
            <label for="">密碼</label>
            <input
              v-model="user.password"
              type="password"
              name="password"
              placeholder="請設定密碼"
              required
            />
          </div>

          <div class="setting-form setting-form__input-password-check">
            <label for="">密碼再確認</label>
            <input
              v-model="user.passwordCheck"
              type="password"
              name="passwordCheck"
              placeholder="請再次輸入密碼"
              required
            />
          </div>

          <button
            class="btn btn-setting"
            type="submit"
            :disabled="isProcessing || isExceed"
          >
            {{ isProcessing ? "處理中" : "儲存" }}
          </button>
        </form>

        <!-- blank -->
        <div class="col-3"></div>
      </div>
    </div>
  </main>
</template>

<script>
import Sidebar from "../components/Sidebar"
import userAPI from '../apis/user'
import { Toast } from "../utils/helpers"
import { mapState } from "vuex"

export default {
  name: "Setting",
  components: {
    Sidebar,
  },
  data() {
    return {
      user: {
        id: -1,
        account: "",
        name: "",
        email: "",
        password: "",
        passwordCheck: "",
      },
      isProcessing: false,
      isExceed: false
    }
  },
  // watch: {
  //   user: {
  //     handler: function() {
  //       this.textWarning()
  //     },
  //     deep: true
  //   }
  // },
  created() {
    if (this.currentUser.id === -1) return
    const { id } = this.$route.params
    this.setUser(id)
  },
  methods: {
    setUser() {
      const { id, account, name, email } = this.currentUser;

      this.user = {
        id,
        account,
        name,
        email,
      }
    },
    textWarning(length) {
      if (!length) {
        this.isExceed = false
      } else if (length > 50) {
        this.isExceed = true
        length = length.toString().slice(0, 50)
      } 
    },
    async handleSubmit(e) {
      try {
        this.isProcessing = true

        // 必填而未填處理
        if (
          !this.user.account ||
          !this.user.name ||
          !this.user.email ||
          !this.user.password ||
          !this.user.passwordCheck
        ) {
          Toast.fire({
            icon: "warning",
            title: "請輸入所有欄位",
          });
          this.isProcessing = false;
        }

        // 密碼錯誤處理
        if (this.user.password !== this.user.passwordCheck) {
          Toast.fire({
            icon: 'warning',
            title: '密碼不一致，請再次輸入'
          })
          this.isProcessing = false
        }

        const form = e.target
        const formData = new FormData(form)
        console.log(formData)

        const { data, statusText } = await userAPI.update({
          userId: this.user.id,
          formData,
        })

        if (statusText !== "OK") {
          throw new Error(data.message)
        } else {
          Toast.fire({
            icon: 'success',
            title: '修改完成'
          })
        }
        
        this.isProcessing = false
      } catch (error) {
        this.isProcessing = false
        console.log("Error", error);
        Toast.fire({
          icon: "error",
          title: "無法編輯，請稍後再試",
        });
      }
    },
  },
  computed: {
    ...mapState(["currentUser"]),
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/basic.scss";

main {
  max-width: 1140px;
  margin: 0 auto;
}
.content-container {
  height: 100vh;
  border-left: 1px solid $border-grey;
  border-right: 1px solid $border-grey;
  padding: 0;
}
.setting-forms {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
}
.setting-form-title {
  width: 100%;
  border-bottom: 1px solid $border-grey;
  h1 {
    @extend %heading-24;
    margin: 24px auto 24px 24px;
  }
}
.setting-form {
  @extend %input-block;
  width: calc(100% - 2 * 24px);
  display: flex;
  flex-flow: column nowrap;
  margin: 24px 24px 8px 24px;
  label {
    @extend %form-label;
  }
  input {
    @extend %form-input;
    background: $form-input-grey;
    border: none;
  }
  input::placeholder {
    color: $form-input-placeholder;
  }
  &::after {
    content: "";
    @extend %input-bottom;
    width: 100%;
  }
}
.text-length {
  @extend %form-label;
  align-self: flex-end;
}
.waring {
  color: #FC5A5A;
}
.btn {
  @extend %button-orange;
  width: 88px;
  height: 46px;
  margin: 32px 24px auto auto;
  font-size: 20px;
  line-height: 30px;
  &:disabled {
    background: $form-input-placeholder;
  }
}
</style>
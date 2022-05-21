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
              v-model.trim="user.account"
              type="text"
              name="account"
              placeholder="請輸入帳號"
              @change="inputWarning"
              required
            />
            <div class="text-limits">
              <span 
                v-show="wrongAccount"
                class="text-limit">
                請輸入英文字母或數字
              </span>
            </div>
          </div>

          <div class="setting-form setting-form__input-name">
            <label for="">名稱</label>
            <input
              v-model.trim="user.name"
              type="text"
              name="name"
              placeholder="請輸入使用者名稱"
              @change="inputWarning"
              required
            />
            <div class="text-limits text-limit-length">
              <span 
                v-show="wrongName"
                class="text-limit">
                請輸入英文字母或數字
              </span>
              <span class="text-length" :class="{ waring: isExceed }">
                {{ textWarning(user.name.length) }}
                {{ user.name.length }}/50</span
              >
            </div>
          </div>

          <div class="setting-form setting-form__input-email">
            <label for="">Email</label>
            <input
              v-model.trim="user.email"
              type="email"
              name="email"
              placeholder="請輸入 Email"
              @change="inputWarning"
              required
            />
            <div class="text-limits">
              <span 
                v-show="wrongEmail"
                class="text-limit"
              >
                請輸入正確 email 格式
              </span>
            </div>
          </div>

          <div class="setting-form setting-form__input-password">
            <label for="">密碼</label>
            <input
              v-model.trim="user.password"
              type="password"
              name="password"
              placeholder="請設定密碼"
              @change="inputWarning"
              required
            />
            <div class="text-limits">
              <span 
                v-show="wrongPassword"
                class="text-limit"
              >
                請輸入英文字母或數字
              </span>
            </div>
          </div>

          <div class="setting-form setting-form__input-password-check">
            <label for="">密碼確認</label>
            <input
              v-model.trim="user.passwordCheck"
              type="password"
              name="passwordCheck"
              placeholder="請再次輸入密碼"
              @change="inputWarning"
              required
            />
            <div class="text-limits">
              <span 
                v-show="wrongPasswordCheck"
                class="text-limit"
              >
                請輸入英文字母或數字
              </span>
            </div>
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
import Sidebar from "../components/Sidebar";
import userAPI from "../apis/user";
import { Toast } from "../utils/helpers";
import { mapState } from "vuex";

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
      },
      wrongAccount: false,
      wrongName: false,
      wrongEmail: false,
      wrongPassword: false,
      wrongPasswordCheck: false,
      isProcessing: false,
      isExceed: false,
    };
  },
  watch: {
    user() {
      this.textWarning()
    }
  },
  created() {
    if (this.currentUser.id === -1) return;
    const { id } = this.$route.params;
    this.setUser(id);
  },
  beforeRouteUpdate(to, from, next) {
    if (this.currentUser.id === -1) return;
    const { id } = to.params;
    this.setUser(id);
    next();
  },
  methods: {
    setUser(userId) {
      const { id, name, account, email } = this.currentUser;
      this.user = {
        id,
        name,
        account,
        email,
      };
      if (userId.toString() !== id.toString()) {
        this.$router.push({ name: "not-fount" });
        return;
      }
    },
    textWarning(length) {
      if (!length) {
        this.isExceed = false;
      } else if (length > 50) {
        this.isExceed = true;
      }
    },
    inputWarning() {
      const re = /^[A-Za-z0-9]*$/
      const emailRe = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/

      re.test(this.user.account)
        ? this.wrongAccount = false 
        : this.wrongAccount = true

      re.test(this.user.name)
        ? this.wrongName = false 
        : this.wrongName = true

      emailRe.test(this.user.email)
        ? this.wrongEmail = false 
        : this.wrongEmail = true

      re.test(this.user.password)
        ? this.wrongPassword = false 
        : this.wrongPassword = true

      re.test(this.user.passwordCheck)
        ? this.wrongPasswordCheck = false 
        : this.wrongPasswordCheck = true
        
      if (re.test(this.user.account) 
        && re.test(this.user.name)
        && emailRe.test(this.user.email)
        && re.test(this.user.password)
        && re.test(this.user.passwordCheck)
      ) {
        this.isProcessing = false
      } else {
        this.isProcessing = true
      }
    },
    async handleSubmit() {
      try {
        this.isProcessing = true;

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
          return;
        }

        // 密碼錯誤處理
        if (this.user.password !== this.user.passwordCheck) {
          Toast.fire({
            icon: "warning",
            title: "密碼不一致，請再次輸入",
          });
          this.isProcessing = false;
          return;
        } else if (
          this.user.password.includes(" ") &&
          this.user.passwordCheck.includes(" ")
        ) {
          Toast.fire({
            icon: "warning",
            title: "密碼不可包含空格",
          });
          this.isProcessing = false;
          return;
        }

        const formData = {
          account: this.user.account,
          name: this.user.name,
          email: this.user.email,
          password: this.user.password,
          passwordCheck: this.user.passwordCheck,
        };

        const { data, statusText } = await userAPI.update({
          userId: this.user.id,
          formData,
        });

        if (statusText !== "OK") {
          throw new Error(data.message);
        } else {
          Toast.fire({
            icon: "success",
            title: "修改完成",
          });
          this.user.password = "";
          this.user.passwordCheck = "";
          this.$store.commit("setCurrentUser", this.user);
        }

        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        if (error.response.status === 500) {
          console.log(error);
          console.log(error.response);
          Toast.fire({
            icon: "warning",
            title: "account/email 已存在！",
          });
        } else {
          Toast.fire({
            icon: "error",
            title: "無法編輯，請稍後再試",
          });
        }
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
.text-limits {
  color: $modal-alert;
  display: flex;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  padding-top: 4px;

  .text-limit {
    color: $modal-alert;
    margin-left: 10px;
  }
  .text-length {
    @extend %form-label;
    display: inline-block;
    margin-left: auto;
    margin-top: -4px;
  }
  .waring {
    color: $modal-alert;
  }
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
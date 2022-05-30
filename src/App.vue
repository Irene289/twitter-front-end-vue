<template>
  <div id="twitter">
    <Loading v-if="isLoading" />
    <main role="main">
      <router-view />
    </main>
  </div>
</template>

<script>
// 載入bootstrap格線系統
import "bootstrap/dist/css/bootstrap-grid.min.css";
import Loading from "./components/Loading.vue";
export default {
  name: "App",
  components: {
    Loading,
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading;
    },
  },
};
</script>
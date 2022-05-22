<template>
  <main>
    <div class="container">
      <div class="row">
        <!-- sidebar -->
        <div class="col-1 col-lg-2 sidebar">
          <Sidebar />
        </div>

        <!-- tweeter / twitterReply -->
        <div class="col-7 col-lg-7  content-container">
          <router-view />
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

export default {
  name: "TwitterMain",
  components: {
    Popular,
    Sidebar,
  },
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
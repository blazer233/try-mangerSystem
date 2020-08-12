<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
export default {
  name: "app",
  created() {
    if (localStorage.eleToken) {
      const decoded = jwt_decode(localStorage.eleToken);
      this.$store.dispatch("setAuthenticated", !this.$isEmpty(decoded));
      this.$store.dispatch("setUser", decoded); 
    }
  }
};
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

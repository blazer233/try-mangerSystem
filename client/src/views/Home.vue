<template>
  <div class="home">
    <div class="leave">部门</div>
    <div class="container">
      <tree />
    </div>
  </div>
</template>

<script>
import tree from "@/components/tree/control";
export default {
  components: {
    tree
  }
};
</script>
<style scoped>
.home {
  width: 100%;
  background: white;
  background-size: 100% 100%;
}
.leave {
  font-size: 25px;
  border-bottom: 1px solid;
  margin: 1rem 5rem;
  padding: 2rem 2rem;
}
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-left: 50px;
  /* background-color: rgba(0, 0, 0, 0.7); */
  text-align: center;
  color: white;
}
</style>

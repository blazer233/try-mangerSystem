<template>
  <div class="index">
    <HeadNav></HeadNav>
    <LeftNav></LeftNav>
    <div class="rightContainer">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <router-view />
        </keep-alive>
      </transition>
    </div>

    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import HeadNav from "../components/HeadNav";
import LeftNav from "../components/LeftNav";
export default {
  name: "index",
  components: {
    HeadNav,
    LeftNav
  }
};
</script>

<style scoped>
.index {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.rightContainer {
  position: relative;
  top: 4rem;
  left: 150px;
  width: calc(100% - 150px);
  height: calc(100% - 60px);
  overflow: auto;
}
canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>

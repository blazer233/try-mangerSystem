<template>
  <div class="all">
    <div class="leave">业务展板</div>
    <div class="schart-all">
      <div class="schart-box">
        <schart class="schart" canvasId="bar" :options="options1"></schart>
      </div>
      <div class="schart-box">
        <schart class="schart" canvasId="line" :options="options2"></schart>
      </div>
      <div class="schart-box">
        <schart class="schart" canvasId="pie" :options="options3"></schart>
      </div>
      <div class="schart-box">
        <schart class="schart" canvasId="ring" :options="options4"></schart>
      </div>
    </div>
  </div>
</template>

<script>
import Schart from "vue-schart";
export default {
  name: "basecharts",
  components: {
    Schart
  },
  data() {
    return {
      options1: {
        type: "bar",
        title: {
          text: "最近一周各品类销售图"
        },
        bgColor: "#fbfbfb",
        labels: ["周一", "周二", "周三", "周四", "周五"],
        datasets: [
          {
            label: "家电",
            fillColor: "rgba(241, 49, 74, 0.5)",
            data: [234, 278, 270, 190, 230]
          },
          {
            label: "百货",
            data: [164, 178, 190, 135, 160]
          },
          {
            label: "食品",
            data: [144, 198, 150, 235, 120]
          }
        ]
      },
      options2: {
        type: "line",
        title: {
          text: "最近几个月各品类销售趋势图"
        },
        bgColor: "#fbfbfb",
        labels: ["6月", "7月", "8月", "9月", "10月"],
        datasets: [
          {
            label: "家电",
            data: [234, 278, 270, 190, 230]
          },
          {
            label: "百货",
            data: [164, 178, 150, 135, 160]
          },
          {
            label: "食品",
            data: [114, 138, 200, 235, 190]
          }
        ]
      },
      options3: {
        type: "pie",
        title: {
          text: "服装品类销售饼状图"
        },
        legend: {
          position: "left"
        },
        bgColor: "#fbfbfb",
        labels: ["T恤", "牛仔裤", "连衣裙", "毛衣", "七分裤", "短裙", "羽绒服"],
        datasets: [
          {
            data: [334, 278, 190, 235, 260, 200, 141]
          }
        ]
      },
      options4: {
        type: "ring",
        title: {
          text: "环形三等分"
        },
        showValue: false,
        legend: {
          position: "bottom",
          bottom: 40
        },
        bgColor: "#fbfbfb",
        labels: ["vue", "react", "angular"],
        datasets: [
          {
            data: [500, 500, 500]
          }
        ]
      }
    };
  }
};
</script>

<style scoped>
.leave {
  font-size: 25px;
  border-bottom: 1px solid;
  margin: 1rem 5rem;
  padding: 1rem 2rem 0.5rem 2rem;
}
.schart-all {
  flex-wrap: wrap;
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 1300px;
  height: 900px;
    transform: scale(0.85);
}
.schart-box {
  margin: 20px;
}
.schart {
  width: 600px;
  height: 400px;
}
</style>

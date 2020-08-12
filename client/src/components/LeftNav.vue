<template>
  <el-row class="menu_page">
    <el-col>
      <el-menu
        class="el-menu-vertical-demo"
        background-color="#324057"
        text-color="#bfcbd9"
        active-text-color="#20a0ff"
        unique-opened
        router
      >
        <template v-for="item in summary">
          <template v-if="item.children">
            <el-submenu :index="item.path" :key="item.path">
              <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title">{{ item.title }}</span>
              </template>
              <template v-for="i in item.children">
                <el-menu-item :index="i.path" :key="i.path">{{ i.title }}</el-menu-item>
              </template>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="item.path" :key="item.path">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "left-nav",
  data() {
    return {
      summary: [
        {
          title: "首页",
          icon: "el-icon-house",
          path: "home"
        },
        {
          title: "资金管理",
          icon: "el-icon-edit",
          path: "fundlist",
          children: [{ path: "fundlist", title: "资金流水" }]
        },
        {
          title: "员工管理",
          icon: "el-icon-date",
          path: "worker",
          children: [{ path: "workerlist", title: "员工请假" }]
        },
        {
          title: "业务展板",
          icon: "el-icon-s-marketing", 
          path: "schart",
        },
        {
          title: "信息管理",
          icon: "el-icon-user",
          path: "infoshow",
        }
      ]
    };
  }
};
</script>

<style scoped>
.menu_page {
  position: fixed;
  top: 71px;
  left: 0;
  min-height: 100%;
  background-color: #324057;
  z-index: 99;
}
.el-menu {
  border: none;
}
.fa-margin {
  margin-right: 5px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 150px;
  min-height: 400px;
}
.el-menu-vertical-demo {
  width: 35px;
}
.el-submenu .el-menu-item {
  min-width: 150px;
}

.hiddenDropdown,
.hiddenDropname {
  display: none;
}
a {
  text-decoration: none;
}
</style>

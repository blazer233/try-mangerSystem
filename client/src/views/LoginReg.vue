<template>
  <div class="form_">
    <!-- 登录表单 -->
    <el-card class="box-card">
      <span class="login-title">后台管理系统</span>
      <div class="index_Form" v-if="login">
        <koa-search
          :type_="4"
          :search_all="log_tableSearch"
          :controlType="controlType"
          @getList="submitForm_login"
          ref="Form_log"
          size="mini"
          :isinline="false"
        />
      </div>

      <!-- 注册表单 -->
      <div class="index_Form" v-else>
        <koa-search
          :type_="5"
          :search_all="reg_tableSearch"
          :controlType="controlType"
          @getList="submitForm_reg"
          ref="Form_reg"
          size="mini"
          :isinline="false"
        />
      </div>
      <span class="title2">
        {{point_0}}
        <a @click="control">{{point}}</a>
      </span>
    </el-card>
    <canvas ref="canvas"></canvas>
  </div>
</template>
<script>
import { Config } from "@/components/config/config";
import { controlUser } from "@/api/api";
import jwt_decode from "jwt-decode";
export default {
  name: "form_",
  components: {},
  data() {
    return {
      login: true,
      point: "点击注册",
      point_0: "没有账户",
      reg_tableSearch: Config.controlUser.reg_search,
      log_tableSearch: Config.controlUser.log_search,
      controlType: Config.controlType
    };
  },
  methods: {
    async submitForm_reg(obj) {
      let res = await controlUser("/register", obj);
      if (res.data.info) {
        this.$message({ message: res.data.info, type: "error" });
      } else {
        this.$message({ message: "注册成功！", type: "success" });
        this.$refs.Form_reg.resetForm("search_from");
        this.login = true;
        this.point = "点击注册";
        this.point_0 = "没有账户";
      }
    },
    async submitForm_login(obj) {
      let res = await controlUser("/login", obj);
      if (!res.data.success) {
        this.$message({
          message: res.data.info,
          type: "error"
        });
      } else {
        const { token } = res.data;
        localStorage.setItem("eleToken", token);
        const decoded = jwt_decode(token);
        this.$store.dispatch("setAuthenticated", !this.$isEmpty(decoded));
        console.log(decoded)
        this.$store.dispatch("setUser", decoded);
        this.$socket.emit("login", {
          username: decoded.name
        });
        this.$router.push("/home");
      }
    },
    control() {
      this.login = this.login ? false : true;
      if (this.point == "点击登录") {
        this.point = "点击注册";
        this.point_0 = "没有账户";
        this.$refs.Form_reg.resetForm("search_from");
      } else {
        this.point = "点击登录";
        this.point_0 = "已有账户";
        this.$refs.Form_log.resetForm("search_from");
      }
    }
  }
};
</script>
 
<style scoped>
.form_ {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  animation: colorswitch 20s infinite;
}
@keyframes colorswitch {
  0% {
    background: #0087c9;
  }
  20% {
    background: #c4e17f;
  }

  40% {
    background: #33d5d4;
  }

  60% {
    background: #f0776c;
  }

  80% {
    background: #669ae1;
  }

  100% {
    background: #0087c9;
  }
}
.form_ .el-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  margin: 0 auto;
  border: 0;
  overflow: hidden;
  z-index: 5;
}
.form_ .login-title {
  padding: 28px 0 20px;
  margin-bottom: 22px;
  text-align: center;
  font-size: 30px;
  color: #aaa;
}
.form_ .el-card::before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  display: block;
  width: 100%;
  height: 8px;
  background: linear-gradient(
    to right,
    #c4e17f,
    #c4e17f 12.5%,
    #f7fdca 12.5%,
    #f7fdca 25%,
    #fecf71 25%,
    #fecf71 37.5%,
    #f0776c 37.5%,
    #f0776c 50%,
    #db9dbe 50%,
    #db9dbe 62.5%,
    #c49cde 62.5%,
    #c49cde 75%,
    #669ae1 75%,
    #669ae1 87.5%,
    #62c2e4 87.5%,
    #62c2e4
  );
}
.title2 {
  font-size: 10px;
  position: relative;
  top: 0px;
  left: 20rem;
}
.title2 > a {
  text-decoration: underline;
  color: slateblue;
  cursor: pointer;
}
canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>

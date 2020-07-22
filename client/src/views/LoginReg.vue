<template>
  <div class="form_">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">后台管理系统</span>
        <!-- 登录表单 -->
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
          没有账户？
          <a @click="control">{{point}}</a>
        </span>
      </div>
    </section>
  </div>
</template>
<script>
import { Config } from "@/components/config/config";
import { controlUser } from "@/api/api";
import jwt_decode from "jwt-decode";
import { isEmpty } from "@/utils/utils";
export default {
  name: "form_",
  components: {},
  data() {
    return {
      login: true,
      point: "点击注册",
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
        this.$store.dispatch("setAuthenticated", !isEmpty(decoded));
        this.$store.dispatch("setUser", decoded);
        this.$router.push("/index");
      }
    },
    control() {
      this.login = this.login ? false : true;
      this.point = this.point == "点击注册" ? "点击登录" : "点击注册";
    }
  }
};
</script>
 
<style scoped>
.title2 {
  font-size: 10px;
  position: relative;
  top: -20px;
  right: -7rem;
}
.title2 > a {
  text-decoration: underline;
  color: slateblue;
  cursor: pointer;
}
.form_ {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/timg.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form_container {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -80%);
  padding: 25px;
  border-radius: 5px;
  text-align: center;
}
.form_container .manage_tip .title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: currentColor;
}
.index_Form {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}
</style>

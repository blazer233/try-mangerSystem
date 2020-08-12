<template>
  <div class="infoshow">
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="8">
        <div class="leave">个人信息</div>
        <div class="user">
          <img
            :src="user.avatar"
            ref="img_ava"
            @mouseenter="enterAvatarImage()"
            @mouseleave="leaveAvatarImage()"
          />
          <span
            class="span_alert"
            v-show="span_alert_"
            @click="setAvatarImage"
            @mousemove="enterAvatarImage()"
          >切换头像</span>
        </div>
        <div class="crop-demo">
          <input
            class="crop-input"
            ref="filElem"
            type="file"
            name="image"
            accept="image/*"
            @change="setImage"
          />
        </div>

        <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
          <vue-cropper
            ref="cropper"
            :src="imgSrc"
            :ready="cropImage"
            :zoom="cropImage"
            :cropmove="cropImage"
            style="width:100%;height:300px;"
          ></vue-cropper>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="dialogVisible = false"
              @click.prevent="cropperStart()"
            >确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
      <el-col :span="16">
        <div class="userinfo">
          <div class="user-item">
            <i class="el-icon-info"></i>
            <span>{{user.name}}</span>
          </div>
          <div class="user-item">
            <i class="el-icon-setting"></i>
            <span>{{user.identity? "管理员" : "普通用户"}}</span>
          </div>
          <div class="user-item">
            <i class="el-icon-setting"></i>
            <span>{{user.email}}</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VueCropper from "vue-cropperjs";
import { controlUser, self } from "@/api/api";
export default {
  name: "infoshow",
  data() {
    return {
      dialogVisible: false,
      imgSrc: "",
      span_alert_: false,
      user: {}
    };
  },
  mounted() {
    this.user = this.$store.getters.user;
  },
  components: {
    VueCropper
  },
  methods: {
    enterAvatarImage() {
      this.span_alert_ = true;
      this.$refs.img_ava.classList.add("filter_");
    },
    leaveAvatarImage() {
      this.span_alert_ = false;
      this.$refs.img_ava.classList.remove("filter_");
    },
    setAvatarImage() {
      this.$refs.filElem.dispatchEvent(new MouseEvent("click"));
      this.span_alert_ = false;
      this.$refs.img_ava.classList.remove("filter_");
    },
    setImage(e) {
      const file = e.target.files[0];
      if (!file.type.includes("image/")) return;
      let reader = new FileReader();
      reader.onload = event => {
        this.dialogVisible = true;
        this.imgSrc = event.target.result;
        this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
      };
      reader.readAsDataURL(file);
    },
    cropImage() {
      this.$refs.img_ava.classList.remove("filter_");
      this.span_alert_ = false;
    },
    async cropperStart() {
      let obj = {
        img_: this.$refs.cropper
          .getCroppedCanvas()
          .toDataURL()
          .replace(/^data:image\/\w+;base64,/, ""),
        _id: this.$store.getters.user.id
      };
      let { data } = await controlUser("/userImg", obj);
      if (data.success) {
        this.$message({ message: "更换成功！下次登录时变更", type: "success" });
        let res = await self();
        this.userInfo = res.data;
        this.$store.getters.user.avatar = this.userInfo.avatar;
      } else {
        this.$message({ message: "更换失败！", type: "error" });
      }
    },
    handleError() {
      this.$notify.error({
        title: "上传失败",
        message: "图片上传接口上传失败，可更改为自己的服务器接口"
      });
    }
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
.infoshow {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  /* padding: 16px; */
}
.row-bg {
  width: 100%;
  height: 100%;
}
.user {
  text-align: center;
  position: relative;
  top: 30%;
}
.user img {
  width: 150px;
  height: 150px;
  position: absolute;
  left: 53%;
}
.user span {
  display: block;
  text-align: center;
  margin-top: 20px;
  font-size: 20px;
  font-weight: bold;
}
.userinfo {
  height: 100%;
  background-color: #eee;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.user-item {
  position: relative;
  top: 30%;
  padding: 26px;
  font-size: 28px;
  color: #333;
}
.btn_ {
  position: relative;
  width: 100px;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  margin-left: 30px;
  background-color: #409eff;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;
  box-sizing: border-box;
  top: 30rem;
  left: 20rem;
}
.input_ {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
.cropper-content .cropper {
  width: auto;
  height: 300px;
}
.crop-demo {
  display: flex;
  align-items: flex-end;
}
.crop-input {
  opacity: 0;
}
.span_alert {
  position: absolute;
  z-index: 2;
  top: 3rem;
  left: 21.6rem;
  cursor: pointer;
}
.filter_ {
  filter: blur(2px);
}
</style>

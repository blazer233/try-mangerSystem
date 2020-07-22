<template>
  <div class="infoshow">
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="8">
        <div class="user">
          <img :src="user.avatar" />
        </div>
        <div class="crop-demo">
          <img :src="cropImg" />
          <div class="crop-demo-btn">
            选择图片
            <input
              class="crop-input"
              type="file"
              name="image"
              accept="image/*"
              @change="setImage"
            />
          </div>
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
            <el-button @click="cancelCrop">取 消</el-button>
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
            <span v-DateFormat="user.date"></span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VueCropper from "vue-cropperjs";
import { controlUser } from "@/api/api";
export default {
  name: "infoshow",
  data() {
    return {
      dialogVisible: false,
      imgSrc: "",
      cropImg: "",
      user: {}
    };
  },
  created() {
    this.user = this.$store.getters.user;
  },
  components: {
    VueCropper
  },
  methods: {
    setImage(e) {
      let res = window.URL.createObjectURL(e.target.files[0]);
      this.imgSrc = res;
      this.$refs.cropper && this.$refs.cropper.replace(res);
      this.dialogVisible = true;
    },
    cropImage() {
      this.user.avatar = this.Base64UrlToBlob(
        this.$refs.cropper.getCroppedCanvas().toDataURL()
      );
      console.log(this.user.avatar)
    },
    Base64UrlToBlob(urlData) {
      urlData = urlData.substring(urlData.indexOf(",") + 1);
      var binary = atob(urlData);
      var array = [];
      for (var i = 0, len = binary.length; i < len; i++) {
        array.push(binary.charCodeAt(i));
      }
      return window.URL.createObjectURL(
        new Blob([new Uint8Array(array)], { type: "image/jpeg" })
      );
    },
    async cropperStart() {
      console.log(
        this.Base64UrlToBlob(this.$refs.cropper.getCroppedCanvas().toDataURL())
      );
      let obj = {
        img_: this.Base64UrlToBlob(
          this.$refs.cropper.getCroppedCanvas().toDataURL()
        ),
        _id: this.$store.getters.user.id
      };
      let { data } = await controlUser("/userImg", obj);
      if (data.success) {
        this.$message({ message: "更换成功！", type: "success" });
        this.$store.dispatch("setUser_img", obj.img_);
      } else {
        this.$message({ message: "更换失败！", type: "error" });
      }
    },
    cancelCrop() {
      this.dialogVisible = false;
      this.user.avatar = this.$store.getters.user.avatar;
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
.crop-demo-btn {
  line-height: 40px;
  padding: 0 20px;
  background-color: #409eff;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;
  box-sizing: border-box;
  transform: translate(355%, 500px);
}
.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
</style>

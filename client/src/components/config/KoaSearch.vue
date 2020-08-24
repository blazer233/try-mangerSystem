<template>
  <div class="panel">
    <div class="content">
      <el-form
        :inline="isinline"
        :label-position="position_"
        label-width="auto"
        show-message
        :model="search_from"
        size="mini"
        :rules="rules_type"
        ref="search_from"
      >
        <el-form-item
          v-for="item in search_all"
          :label="item.label"
          :prop="item.prop"
          :key="item.label"
          :class="el_form_item_class"
        >
          <template v-if="controlType[item.controlType] === 'date'">
            <el-date-picker
              v-model="search_from[item.prop]"
              type="date"
              :class="'width' + item.width"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </template>
          <template v-else-if="controlType[item.controlType] === 'year'">
            <el-date-picker
              v-model="search_from[item.prop]"
              type="year"
              :class="'width' + item.width"
              value-format="yyyy"
            ></el-date-picker>
          </template>
          <template v-else-if="controlType[item.controlType] === 'daterange'">
            <el-date-picker
              v-model="search_from[item.prop]"
              type="daterange"
              align="right"
              unlink-panels
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :class="'width' + item.width"
            ></el-date-picker>
          </template>
          <template v-else-if="controlType[item.controlType] === 'select'">
            <el-select
              v-model="search_from[item.prop]"
              :multiple="item.multiple"
              clearable
              :class="'width' + item.width"
            >
              <el-option
                v-for="(i,index) in item.options"
                :key="index"
                :label="i.label"
                :value="i.value"
              ></el-option>
            </el-select>
          </template>
          <template v-else-if="controlType[item.controlType] == 'tree'">
            <el-button type="text" @click="open">选择部门</el-button>
            <tree />
          </template>
          <template v-else-if="controlType[item.controlType] == 'quill'">
            <quill-editor
              ref="myTextEditor"
              v-model="search_from[item.prop]"
              :options="editorOption"
              style="height: 10rem;"
            ></quill-editor>
          </template>
          <template v-else-if="controlType[item.controlType] == 'textare'">
            <el-input
              v-if="type_==3"
              type="textarea"
              :rows="17"
              v-model="search_from[item.prop]"
              clearable
              :class="'width' + item.width"
            ></el-input>
            <el-input
              v-else
              type="textarea"
              :rows="3"
              v-model="search_from[item.prop]"
              clearable
              :class="'width' + item.width"
            ></el-input>
          </template>
          <template v-else-if="controlType[item.controlType] == 'password'">
            <el-input
              type="password"
              v-model="search_from[item.prop]"
              clearable
              :class="'width' + item.width"
            ></el-input>
          </template>
          <template v-else-if="controlType[item.controlType] == 'file'">
            <div class="file_">
              <el-upload
                :data="upload_id"
                class="upload-demo"
                :action="UploadUrl"
                accept=".pdf"
                :before-upload="beforeUpload"
                name="file"
                :limit="1"
                :on-preview="handlePreview"
                :file-list="fileLists"
                :on-error="getErr"
                :on-exceed="handleExceed"
                :on-remove="removeList"
                :on-success="handleSuccess"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip" v-show="file_up">请上传pdf格式文件</div>
              </el-upload>
            </div>
          </template>
          <template v-else-if="controlType[item.controlType] === 'inputselect'">
            <el-select
              v-if="item.remoteMethodName === 'personGet'"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder
              :visible-change="toggleSelect"
              :remote-method="personGet"
              no-match-text="未找到"
              v-model="search_from[item.prop]"
              :class="'width' + item.width"
            >
              <el-option
                v-for="(item,index) in personData"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
          <template
            v-else-if="controlType[item.controlType] === 'radio'"
            :class="'width' + item.width"
          >
            <el-radio-group v-model="search_from[item.prop]">
              <el-radio
                v-for="(radio,index) in item.radioData"
                :label="radio.value"
                :key="index"
              >{{ radio.name }}</el-radio>
            </el-radio-group>
          </template>
          <template v-else>
            <el-input v-model="search_from[item.prop]" clearable :class="'width' + item.width"></el-input>
          </template>
        </el-form-item>

        <el-button-group :class="el_button_group">
          <el-button
            type="primary"
            size="mini"
            @click.native="searchTable('search_from')"
          >{{formName}}</el-button>
          <el-button
            type="primary"
            size="mini"
            v-if="reformName"
            @click.native="resetForm('search_from')"
          >{{reformName}}</el-button>
        </el-button-group>
      </el-form>
    </div>
  </div>
</template>
 
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import tree from "@/components/tree/control";
import { quillEditor } from "vue-quill-editor";
import { findUser } from "@/api/api";
import { Config } from "@/components/config/config";

export default {
  name: "SearchBar",
  data() {
    return {
      file_up: true,
      upload_id: { _id: localStorage.getItem("_id") },
      fileLists: [], 
      UploadUrl: "http://localhost:5000/api/profiles/toFile",
      search_from: {},
      personData: [],
      editorOption: {
        theme: "snow",
        placeholder: "Hello World",
        modules: {
          toolbar: [
            [
              "bold",
              "italic",
              "underline",
              { color: [] },
              { background: [] },
              { align: [] }
            ],
            [
              { size: ["small", false, "large", "huge"] },
              { header: [1, 2, 3, 4, false] },
              { list: "ordered" },
              { list: "bullet" },
              "blockquote"
            ],
            ["link", "image", "code-block"]
          ]
        }
      }
    };
  },
  watch: {
    search_from: {
      immediate: true,
      handler(val) {
        if (val.file && val.file.length) {
          this.file_up = false;
          this.fileLists = this.search_from.file;
        } else {
          this.file_up = true;
          this.fileLists = [];
        }
      }
    },
    type_: {
      immediate: true,
      handler(val) {
        switch (val) {
          case 0:
            this.formName = "搜索";
            this.reformName = "";
            this.position_ = "right";
            this.rules_type = Config.rules_.rules_0;
            this.el_form_item_class = "";
            this.el_button_group = "el-button-group_1";
            break;
          case 1:
            this.formName = "提交";
            this.reformName = "重置";
            this.position_ = "top";
            this.rules_type = Config.rules_.rules_1;
            this.el_form_item_class = "el_form_item_class1";
            this.el_button_group = "el-button-group_2";
            break;
          case 2:
            this.formName = "提交";
            this.reformName = "重置";
            this.position_ = "top";
            this.rules_type = Config.rules_.rules_2;
            this.el_form_item_class = "el_form_item_class1";
            this.el_button_group = "el-button-group_3";
            break;
          case 3:
            this.formName = "提交";
            this.reformName = "";
            this.position_ = "top";
            this.rules_type = Config.rules_.rules_3;
            this.el_form_item_class = "el_form_item_class1";
            this.el_button_group = "el-button-group_2";
            break;
          case 4:
            this.formName = "提交";
            this.reformName = "重置";
            this.position_ = "left";
            this.rules_type = Config.rules_.rules_4;
            this.el_form_item_class = "el_form_item_class1";
            this.el_button_group = "el-button-group_login_reg";
            break;
          case 5:
            this.formName = "提交";
            this.reformName = "重置";
            this.position_ = "left";
            this.rules_type = Config.rules_.rules_5;
            this.el_form_item_class = "el_form_item_class1";
            this.el_button_group = "el-button-group_login_reg";
            break;
        }
      }
    }
  },
  mounted() {
    this.search_all.map(item => {
      this.$set(this.search_from, item.prop, "");
      if (item.getDataMethodName) {
        this[item.getDataMethodName](item);
      }
    });
  },
  props: {
    type_: {
      type: Number
    },
    isinline: {
      type: Boolean
    },
    controlType: {
      type: Object,
      default: () => {}
    },
    search_all: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    open() {
      this.$alert("<tree/>", {
        dangerouslyUseHTMLString: true
      });
    },
    async searchTable(res) {
      await this.$nextTick();
      this.$refs[res].validate(valid => {
        valid
          ? this.$emit(
              "getList",
              Object.assign(this.search_from, { file: this.fileLists })
            )
          : "";
      });
    },
    resetForm(res) {
      this.$refs[res].resetFields();
    },
    toggleSelect(flag) {
      if (!flag) this.personData = [];
    },
    async personGet(query) {
      if (query) {
        let res = await findUser(query);
        let Dataclone = this.$clone(res.data);
        this.personData = Dataclone.map(i => {
          i.value = i.id;
          i.label = i.username;
          return i;
        });
      } else {
        this.personData = [];
      }
    },
    beforeUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (testmsg !== "pdf") {
        this.$message({ message: "上传文件只能是 pdf 格式!", type: "error" });
        return false;
      }
    },
    getErr(err) {
      console.log(err);
      this.$message({ message: "上传文件失败", type: "error" });
    },
    handlePreview(file) {
      window.open(`http://localhost:5000${file.url}`);
    },
    handleSuccess(res, file, fileList) {
      this.file_up = false;
      fileList.forEach(i => {
        this.fileLists.push({
          name: i.name,
          url: i.response.url
        });
      });
      this.$message({ message: "上传文件成功", type: "success" });
    },
    removeList(file, fileList) {
      this.fileLists = [];
    },
    handleExceed(files, fileList) {
      this.$message({ message: "只能上传一个PDF文件", type: "error" });
    }
  },
  components: {
    quillEditor,
    tree
  }
};
</script>

<style scoped>
.el_form_item_class1 {
  margin-top: 1rem;
}
.content {
  padding: 10px;
}
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 4px;
}

.el-button-group_1 {
  margin-left: 5rem;
}
.el-button-group_2 {
  float: right;
  margin-top: 1rem;
}
.el-button-group_3 {
  float: right;
  margin-top: 6rem;
}
.el-button-group_login_reg {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}
.file_ {
  position: absolute;
  right: 0%;
  top: -3rem;
  width: 20rem;
}
.el-radio-group {
  width: 100vw/24 * 4 - 75px - 20px;
}
.width4 {
  width: 100vw/24 * 4 - 75px - 20px;
}
.width6 {
  width: 100vw/24 * 6 - 75px - 20px;
}
.width8 {
  width: 100vw/24 * 8 - 75px - 20px;
}
</style>

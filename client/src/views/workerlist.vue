<template>
  <div class="notfound">
    <div class="everyItem">
      <div style="flex: 0.5;">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="请假人">
            <el-input v-model="form.name" style="width: 13rem;"></el-input>
          </el-form-item>
          <el-form-item label="请假类型">
            <el-select v-model="form.region" placeholder="请选择请假类型">
              <el-option label="事假" value="事假"></el-option>
              <el-option label="病假" value="病假"></el-option>
              <el-option label="产假" value="产假"></el-option>
              <el-option label="丧假" value="丧假"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请假时间">
            <el-col :span="11">
              <el-date-picker
                v-model="form.date"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="是否带薪办公">
            <el-switch v-model="form.delivery"></el-switch>
          </el-form-item>
          <el-form-item label="请假原因">
            <quill-editor
              ref="myTextEditor"
              v-model="form.descc"
              :options="editorOption"
              style="height: 30rem;"
            ></quill-editor>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit" class="btn_">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" style="width: 100%;height: 100%;">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="姓名">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="请假类型">
                <span>{{ props.row.region }}</span>
              </el-form-item>
              <el-form-item label="编号">
                <span>{{ props.row._id }}</span>
              </el-form-item>
              <el-form-item label="是否带薪">
                <span>{{ props.row.delivery ? '是':'否'}}</span>
              </el-form-item>
              <el-form-item label="原因">
                <span v-html="props.row.desc"></span>
              </el-form-item>
              <el-form-item label="请假时间">
                <span>{{ props.row.data1 }}---{{ props.row.date0 }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="请假类型" prop="region"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getWeek, controlWeek } from "@/api/api";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
export default {
  data() {
    return {
      form: {
        name: this.$store.getters.user.name,
        upload: "",
        region: "",
        date: "",
        delivery: false,
        descc: ""
      },
      value: new Date(),
      tableData: [],
      editorOption: {
        placeholder: "Hello World"
      }
    };
  },
  methods: {
    async onSubmit() {
      let submit = {
        find_id: this.$store.getters.user.id,
        name: this.form.name,
        region: this.form.region,
        date0: this.form.date[0],
        data1: this.form.date[1],
        desc: this.form.descc, 
        delivery: this.form.delivery
      };
      let res = await controlWeek("/add", submit);
      if (res.status == 200) {
        this.onFind();
        this.$message({
          message: "提交成功！",
          type: "success"
        });
        this.$refs.form.resetFields();
      }
    },
    async onFind() {
      let res = await getWeek(this.$store.getters.user.id);
      this.tableData = res.data;
      console.log(this.tableData);
    },
    onEditorChange({ editor, html, text }) {
      console.log(editor, html, text);
    }
  },
  created() {
    this.onFind();
  },
  components: {
    quillEditor
  }
};
</script>
<style scoped>
.notfound {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.everyItem {
  display: flex;
  justify-content: space-around;
  margin: 3rem 0 0 1rem;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.btn_ {
  margin: 7rem 0 0 45rem;
}
</style>

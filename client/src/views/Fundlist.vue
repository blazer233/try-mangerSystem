<template>
  <div>
    <div class="leave">资金流水</div>
    <div class="content_">
      <div class="center_">
        <!-- 筛选表单 -->
        <koa-search
          :type_="0"
          :search_all="tableSearch"
          :controlType="controlType"
          @getList="getProfile"
          size="mini"
          :isinline="true"
        />
        <input
          type="file"
          ref="up"
          id="files_"
          style="visibility: hidden;"
          name="excel"
          accept=".xls*"
          @input="setExcel"
        />
        <el-button type="loadOne" plain size="mini" title="导入表单" @click="upFile">导入表单</el-button>
        <el-button
          type="loadOne"
          plain
          size="mini"
          title="导出表单"
          @click="loadFile"
          style="margin-left: -10rem;"
        >导出表单</el-button>
        <i class="el-icon-edit-outline addOne" @click="onAddMoney" title="添加"></i>
      </div>
      <!-- 内容表格    action="http://localhost:5000/api/profiles/upFile"-->
      <!-- <p v-py="name"></p> -->
      <!-- <input type="text" id="input" v-debounce="find" /> -->
      <koa-table
        :tableHeader="tableHeader"
        :tableData="tableData"
        :total="total"
        @pagination_size_change="set_getProfile"
        @delOne="onDeleteMoney"
        @editOne="onEditMoney"
      />
    </div>
    <!-- 弹框页面 -->
    <el-dialog
      :visible.sync="dialog.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      v-dialogDrag
      class="dialogClass"
    >
      <div slot="title" class="dialog_class">
        <span>{{dialog.title}}</span>
      </div>
      <div style="height:500px">
        <!-- 弹框表单 -->
        <koa-search
          ref="search_"
          :search_all="tableSearch_"
          :controlType="controlType"
          :type_="1"
          @getList="onSubmit"
          size="mini"
          :isinline="false"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getProfiles,
  deleteProfiles,
  controlProfiles,
  loadFiles,
  upFiles
} from "@/api/api";
import { Config } from "@/components/config/config";
import fileSaver from "file-saver";
export default {
  name: "fundlist",
  data() {
    return {
      name: "注册",
      tableSearch: Config.indexTable.search,
      tableSearch_: Config.dialog.search,
      controlType: Config.controlType,
      tableData: [],
      allTableData: [],
      PageSize: { page_index: 1, page_size: 15 },
      total: 0,
      dialog: {
        show: false,
        title: "",
        option: "edit"
      }
    };
  },
  computed: {
    tableHeader() {
      return this.$store.getters.user.identity
        ? Config.indexTable.table
        : Config.indexTable.table_employee;
    }
  },
  created() {
    this.getProfile();
  },
  methods: {
    find() {
      console.log("ajax发送的数据为： " + input.value);
    },
    set_getProfile(obj) {
      this.PageSize.page_index = obj.page_index;
      this.PageSize.page_size = obj.page_size;
      this.getProfile();
    },
    // 获取表格数据
    async getProfile(obj = {}) {
      let cc = Object.assign(
        {
          date1: obj.date ? new Date(obj.date[0]).getTime() : "",
          date2: obj.date ? new Date(obj.date[1]).getTime() : ""
        },
        this.PageSize
      );
      let res = await getProfiles(cc);
      this.tableData = res.data.list;
      this.total = res.data.total;
    },
    async dialog_(obj) {
      const url = this.dialog.option == "add" ? "add" : `edit/${obj.id}`;
      let res = await controlProfiles(url, obj);
      if (res) {
        this.$message({
          message: "保存成功！",
          type: "success"
        });
        this.dialog.show = false;
        this.getProfile();
      }
    },
    // 编辑
    async onEditMoney(row) {
      localStorage.setItem("_id", row._id);
      this.dialog = {
        show: true,
        title: "修改资金信息",
        option: "edit"
      };
      await this.$nextTick();
      this.$refs.search_.search_from = {
        type: row.type,
        describe: row.describe,
        income: row.income,
        expend: row.expend,
        cash: row.cash,
        remark: row.remark,
        file: row.file,
        id: row._id,
        date: new Date().getTime()
      };
    },
    //导出表格为excel
    async loadFile() {
      let res = await loadFiles();
      let buffer = new Uint8Array(res.data.info.data);
      let blob = new Blob([buffer], { type: "application/octet-stream" });
      fileSaver.saveAs(blob, "资金表格清单.xlsx");
    },
    upFile() {
      this.$refs.up.value = null;
      this.$refs.up.dispatchEvent(new MouseEvent("click"));
    },
    async setExcel() {
      if (files_.files[0].name.includes(".xlsx")) {
        let reader = new FileReader();
        reader.readAsDataURL(files_.files[0]);
        reader.onload = async event => {
          let { data } = await upFiles({
            file: event.target.result.split(",")[1]
          });
          console.log(data);
          data.success
            ? this.getProfile()
            : this.$message({ message: data.info, type: "error" });
        }; 
      } else {
        this.$message({ message: "请上传.xlsx类型文件", type: "error" });
      }
    },
    // 弹出添加添加
    onAddMoney() {
      this.dialog = {
        show: true,
        title: "添加资金信息",
        option: "add"
      };
      this.$nextTick(() => {
        this.$refs.search_.search_from = {};
      });
    },
    // 删除
    async onDeleteMoney(row) {
      let res = await deleteProfiles(row._id);
      if (res.status == 200) {
        this.$message("删除成功");
        this.getProfile();
      }
    },
    onSubmit(res) {
      res.date = new Date().getTime();
      this.dialog_(res);
    }
  }
};
</script> 
<style >
.content_ {
  margin: 0rem 5rem 0 5rem;
}
.leave {
  font-size: 25px;
  border-bottom: 1px solid;
  margin: 1rem 5rem;
  padding: 1rem 2rem 0.5rem 2rem;
}
.dialog_class {
  font-weight: bold;
  font-size: 20px;
  font-size: 18px;
  color: white;
}
.dialogClass .el-dialog__body {
  padding: 0px 20px 120px 20px !important;
  color: #606266;
  font-size: 14px;
}
.addOne {
  font-size: 30px;
  margin-right: 3rem;
  cursor: pointer;
}
.center_ {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btnRight {
  float: right;
}

.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>

<template>
  <div class="notfound">
    <div class="leave" v-if="$store.getters.user.identity">请假审批</div>
    <div class="leave" v-else>请假填写</div>
    <div class="leaveFrom2" v-if="$store.getters.user.identity">
      <koa-table
        :tableHeader="tableHeader_er"
        :tableData="tableData"
        :total="total"
        :border="false"
        :expand="true"
        :type_="2"
        @editOne="onControl"
        @pagination_size_change="onFind"
      />
      <!-- 弹框页面 -->
      <el-dialog
        :visible.sync="show"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :modal-append-to-body="false"
        v-dialogDrag
        class="dialogClass"
      >
        <div slot="title" class="dialog_class">
          <span>审批</span>
        </div>
        <div style="height:500px">
          <!-- 弹框表单 -->
          <koa-search
            ref="search_er"
            :search_all="tableSearch_er"
            :controlType="controlType"
            :type_="3"
            @getList="onSubmit"
            size="mini"
            :isinline="false"
          />
        </div>
      </el-dialog>
    </div>
    <div class="leaveFrom1" v-else>
      <koa-search
        ref="search_ee"
        :type_="2"
        :search_all="tableSearch_ee"
        :controlType="controlType"
        @getList="onSubmit"
        size="mini"
      />
      <koa-table
        :tableHeader="tableHeader_ee"
        :tableData="tableData"
        :total="total"
        :border="false"
        :expand="true"
        :type_="2"
        @pagination_size_change="onFind"
      />
    </div>
  </div>
</template>
<script>
import { getWeek, controlWeek } from "@/api/api";
import { Config } from "@/components/config/config";
import KoaTable from "@/components/config/table_all";
import KoaSearch from "@/components/config/from_all";
export default {
  data() {
    return {
      tableHeader_ee: Config.weekTable.table,
      tableSearch_ee: Config.weekTable.search,
      tableHeader_er: Config.weekTable_employer.table,
      tableSearch_er: Config.weekTable_employer.search,
      controlType: Config.controlType,
      tableData: [],
      id: "",
      show: false,
      total: 0
    };
  },
  methods: {
    async onSubmit(obj) {
      let submit = {};
      if (obj.date) {
        submit = {
          super_id: obj.find_id,
          name_id: this.$store.getters.user.id,
          region: obj.region,
          date0: obj.date[0],
          date1: obj.date[1],
          desc: obj.desc,
          delivery: obj.delivery
        };
      } else {
        submit = {
          isPass: obj.isPass,
          passRes: obj.passRes ? obj.passRes : "",
          id: this.id
        };
      }
      let url = this.$store.getters.user.identity ? "approval" : "add";
      let res = await controlWeek(url, submit);
      if (res.status == 200) {
        this.onFind();
        this.$message({
          message: "提交成功！",
          type: "success"
        });
        this.show = false;
        this.$nextTick(function() {
          this.$store.getters.user.identity
            ? this.$refs.search_er.resetForm("search_from")
            : this.$refs.search_ee.resetForm("search_from");
        });
      }
    },
    // 操作
    onControl(row) {
      this.id = row._id;
      this.show = true;
    },
    async onFind() {
      let url = this.$store.getters.user.identity ? "employer" : "one";
      let res = await getWeek(this.$store.getters.user.id, url);
      this.tableData = res.data.list;
      this.total = res.data.total;
    }
  },
  mounted() {
    this.onFind();
  },
  components: {
    KoaTable,
    KoaSearch
  }
};
</script>
<style scoped>
.notfound {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.dialogClass .el-dialog__body {
  padding: 0px 20px 40px 20px !important;
  color: #606266;
  font-size: 14px;
}
.dialog_class {
  font-weight: bold;
  font-size: 20px;
  font-size: 18px;
  color: white;
}
.leave {
  font-size: 25px;
  border-bottom: 1px solid;
  margin: 1rem 5rem;
  padding: 2rem 2rem;
}
.leaveFrom2 {
  margin: 0rem 5rem 0 5rem;
}
.leaveFrom1 {
  margin: 0rem 5rem 0 5rem;
  display: flex;
}
.leaveFrom1 > div {
  width: 50%;
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

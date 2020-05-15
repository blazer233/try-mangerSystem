<template>
  <div class="fillcontain">
    <div>
      <el-form :inline="true" ref="search_data" :model="search_data">
        <el-form-item label="投标时间筛选:">
          <el-date-picker v-model="search_data.startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>--
          <el-date-picker v-model="search_data.endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="search" @click="onScreeoutMoney()">筛选</el-button>
        </el-form-item>
        <el-form-item class="btnRight">
          <el-button type="primary" size="small" icon="view" @click="onAddMoney()">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table
        v-if="tableData.length > 0"
        :data="tableData"
        max-height="850"
        border
        fit
        highlight-current-row
        :default-sort="{prop: 'date', order: 'descending'}"
        style="width: 100%"
        :cell-style="{padding:'9px 0'}"
      >
        <el-table-column
          v-for="(item, index) in tableLabel"
          :type="item.type"
          :key="index"
          :align="item.align"
          :prop="item.prop"
          :width="item.width"
          :label="item.label"
        ></el-table-column>
        <el-table-column
          prop="operation"
          align="center"
          label="操作"
          fixed="right"
          width="180"
          v-if="show"
        >
          <template slot-scope="scope">
            <el-button type="warning" icon="edit" size="small" @click="onEditMoney(scope.row)">编辑</el-button>
            <el-button
              type="danger"
              icon="delete"
              size="small"
              @click="onDeleteMoney(scope.row,scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              v-if="paginations.total > 0"
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.page_size"
              :layout="paginations.layout"
              :total="paginations.total"
              :current-page.sync="paginations.page_index"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            ></el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 弹框页面 -->
    <DialogFound :dialog="dialog" :form="form" @update="getProfile"></DialogFound>
  </div>
</template>

<script>
import DialogFound from "../components/DialogFound";

export default {
  name: "fundlist",
  data() {
    return {
      tableLabel: [
        {
          type: "index",
          label: "序号",
          align: "center",
          width: "70"
        },
        {
          prop: "date",
          label: "创建时间",
          align: "center",
          width: "250"
        },
        {
          prop: "type",
          label: "收支类型",
          align: "center",
          width: "150"
        },
        {
          prop: "describe",
          label: "收支描述",
          align: "center",
          width: "180"
        },
        {
          prop: "income",
          label: "收入",
          align: "center",
          width: "170"
        },
        {
          prop: "expend",
          label: "支出",
          align: "center",
          width: "170"
        },
        {
          prop: "cash",
          label: "账户现金",
          align: "center",
          width: "170"
        },
        {
          prop: "remark",
          label: "备注",
          align: "center",
          width: "220"
        }
      ],
      show: false,
      tableData: [],
      allTableData: [],
      filterTableData: [],
      dialog: {
        show: false,
        title: "",
        option: "edit"
      },
      form: {},
      //需要给分页组件传的信息
      paginations: {
        page_index: 1, // 当前位于哪页
        total: 0, // 总数
        page_size: 15, // 1页显示多少条
        page_sizes: [15, 20, 25, 30], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
      },
      search_data: {
        startTime: "",
        endTime: ""
      }
    };
  },
  components: {
    DialogFound
  },
  created() {
    this.getProfile();
    this.show = this.$store.getters.user.identity == "manager" ? true : false;
  },
  methods: {
    // 获取表格数据
    async getProfile() {
      let res = await this.$axios("/api/profiles");
      this.allTableData = res.data;
      this.filterTableData = res.data;
      this.setPaginations();
    },
    onEditMoney(row) {
      // 编辑
      this.dialog = { show: true, title: "修改资金信息", option: "edit" };
      this.form = {
        type: row.type,
        describe: row.describe,
        income: row.income,
        expend: row.expend,
        cash: row.cash,
        remark: row.remark,
        id: row._id
      };
    },
    async onDeleteMoney(row, index) {
      // 删除
      let res = await this.$axios.delete(`/api/profiles/delete/${row._id}`);
      if (res.status == 200) {
        this.$message("删除成功");
        this.getProfile();
      }
    },
    onAddMoney() {
      // 添加
      this.dialog = {
        show: true,
        title: "添加资金信息",
        option: "add"
      };
      this.form = {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      };
    },
    handleCurrentChange(page) {
      // 取到的页数
      let sortnum = this.paginations.page_size * (page - 1);
      let table = this.allTableData.filter((item, index) => {
        return index >= sortnum;
      });
      // 设置默认分页数据
      this.tableData = table.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    handleSizeChange(page_size) {
      // 切换的一页数目
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    setPaginations() {
      // 总页数
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 15;
      // 设置默认分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    onScreeoutMoney() {
      // 筛选
      if (!this.search_data.startTime || !this.search_data.endTime) {
        this.$message({
          type: "warning",
          message: "请选择时间区间"
        });
        this.getProfile();
        return;
      }
      const stime = this.search_data.startTime.getTime();
      const etime = this.search_data.endTime.getTime();
      this.allTableData = this.filterTableData.filter(item => {
        let date = new Date(item.date);
        let time = date.getTime();
        return time >= stime && time <= etime;
      });
      // 分页数据
      this.setPaginations();
    }
  }
};
</script>
<style scoped>
.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>

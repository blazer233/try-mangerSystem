<template>
  <div>
    <el-table
      :data="tableData"
      :border="border"
      highlight-current-row
      :default-sort="{prop: 'date', order: 'descending'}"
      :cell-style="{padding:'9px 0'}"
    >
      <el-table-column type="expand" v-if="expand">
        <template slot-scope="props">
          <div v-if="type_==2" v-html="props.row.desc" class="desc_">{{props.row.desc}}</div>
        </template>
      </el-table-column>
      <el-table-column v-if="index" type="index" label="序号" align="center" width="55"></el-table-column>
      <el-table-column v-if="checkbox" type="selection" width="40"></el-table-column>
      <template v-for="item in tableHeader">
        <el-table-column
          :key="item.label"
          :prop="item.prop"
          :label="item.label"
          :width="item.width || ''"
          :type="item.type || ''"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="item.type==='btn_0'">
              <el-button type="warning" icon="edit" size="mini" @click="Edit(scope.row)">编辑</el-button>
              <el-button type="danger" icon="delete" size="mini" @click="Del(scope.row)">删除</el-button>
            </div>
            <div v-if="item.type==='btn_1'">
              <el-button type="warning" icon="edit" size="mini" @click="Edit(scope.row)">操作</el-button>
            </div>
            <div
              v-else-if="item.type==='date'"
              class="over_ellipsis"
              v-DateFormat="scope.row[item.prop]"
            ></div>
            <div v-else-if="item.type==='file'">
              <a
                :href="'http://localhost:5000'+scope.row[item.prop][0].url"
                :title="scope.row.type+'--'+scope.row[item.prop][0].name"
                class="pdf_"
                target="_black"
              >{{scope.row.type}}--{{scope.row[item.prop][0].name}}</a>
            </div>
            <div
              v-else-if="item.type==='delivery'"
              class="over_ellipsis"
            >{{scope.row[item.prop]?'带薪':'不带薪'}}</div>
            <div
              v-else-if="item.type==='isPass'"
              class="over_ellipsis"
            >{{scope.row[item.prop]?'已批准':'未批准'}}</div>
            <div
              v-else-if="item.type==='date_week'"
              class="over_ellipsis"
            >{{ scope.row.date0}}--{{ scope.row.date1}}</div>
            <span :title="scope.row[item.prop]" v-else>
              {{
              scope.row[item.prop]
              }}
            </span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div style="text-align: center;" v-if="hasPage">
      <el-pagination
        class="pagination-container"
        :page-sizes="paginations.page_sizes"
        :layout="paginations.layout"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page.sync="paginations.page_index"
        :page-size="paginations.page_size"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "Table",
  props: {
    index: { type: Boolean, default: true }, //是否需要索引
    checkbox: { type: Boolean, default: false }, //是否需要选框
    hasPage: { type: Boolean, default: true }, //是否需要分页
    expand: { type: Boolean, default: false }, //是否需要展开项
    border: { type: Boolean, default: true }, //是否需要边框
    type_: { type: Number },
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    tableHeader: {
      type: Array,
      default: () => {
        return [];
      }
    },
    total: {
      type: Number
    }
  },
  data() {
    return {
      paginations: {
        page_sizes: [5, 10, 15, 20, 25, 30],
        layout: "total, sizes, prev, pager, next, jumper",
        page_size: 15,
        page_index: 1
      }
    };
  },
  methods: {
    Edit(res) {
      this.$emit("editOne", res);
    },
    Del(res) {
      this.$emit("delOne", res);
    },
    handleSizeChange(val) {
      this.paginations.page_index = 1;
      this.paginations.page_size = val;
      this.$emit("pagination_size_change", this.paginations);
    },
    handleCurrentChange(val) {
      this.paginations.page_index = val;
      this.$emit("pagination_size_change", this.paginations);
    }
  }
};
</script>

<style>
.el-pagination__sizes
  > div
  > div.el-input.el-input--mini.el-input--suffix
  > input {
  height: 22px;
}
.desc_ {
  height: 8rem;
  overflow-y: scroll;
}
.over_ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
.table_a {
  cursor: pointer;
  text-decoration: underline;
}
.pagination-container {
  margin-top: 10px;
}
.el-table .cell {
  white-space: nowrap;
  word-break: break-all;
}
.expandTable {
  border-bottom: 1px dashed #d8d8d8;
  padding: 0.5rem 0 0.5rem 0;
  margin-left: 5rem;
  display: inline-block;
}
.expandTable > span {
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  margin-left: 3px;
}
.expandTable:last-child {
  border-bottom: none;
}
.demo-table-expand {
  margin: -1rem;
}
.demo-table-expand .el-form-item {
  margin-right: 4rem;
  margin-bottom: 0;
}
.el-form-item {
  margin-bottom: 10px;
}
.pdf_ {
  text-decoration: none;
}
</style>

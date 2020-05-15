<template>
  <div class="notfound">
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
            <el-form-item label="请假时间">
              <span>{{ props.row.date0 }}-{{ props.row.date1 }}</span>
            </el-form-item>
            <el-form-item label="原因">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="编号" prop="_id"></el-table-column>
      <el-table-column label="请假类型" prop="region"></el-table-column>
      <el-table-column label="原因" prop="desc"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  methods: {
    handleClick(row) {
      console.log(row);
    }
  },

  data() {
    return {
      tableData: []
    };
  },
  methods: {
    async onFind() {
      let res = await this.$axios.get(`/api/Week/`);
      this.tableData = res.data;
    }
  },
  created() {
    this.onFind();
  }
};
</script>
<style scoped>
.notfound {
  width: 100%;
  height: 100%;
  background-color: aqua;
}
</style>

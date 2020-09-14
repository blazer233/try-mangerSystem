<template>
  <div class="home">
    <div class="leave">部门</div>
    <div class="container">
      <el-button size="mini" class="float" @click="out_table">导出部门表格</el-button>
      <tree ref="tree_" />
      <div id="excel_" style="dispalt:none"></div>
    </div>
  </div>
</template>

<script>
import tree from "@/components/tree/control";
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  components: {
    tree
  },
  methods: {
    out_table() {
      let res_table = "<table>" + this.$refs.tree_.table_str + "</table>";
      excel_.innerHTML = res_table;
      this.exportFunc();
    },
    exportFunc(e) {
      // 从表生成工作簿对象
      var wb = XLSX.utils.table_to_book(excel_);
      // 得到二进制字符串作为输出
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        type: "binary"
      });
      let blob = new Blob([this.s2ab(wbout)], {
        type: "application/octet-stream"
      });
      FileSaver.saveAs(blob, "a.xlsx");
    },
    s2ab(s) {
      var cuf;
      var i;
      if (typeof ArrayBuffer !== "undefined") {
        cuf = new ArrayBuffer(s.length);
        var view = new Uint8Array(cuf);
        for (i = 0; i !== s.length; i++) {
          view[i] = s.charCodeAt(i) & 0xff;
        }
        return cuf;
      } else {
        cuf = new Array(s.length);
        for (i = 0; i !== s.length; ++i) {
          cuf[i] = s.charCodeAt(i) & oxFF;
        }
        return cuf;
      }
    }
  }
};
</script>
<style scoped>
.home {
  width: 100%;
  background: white;
  background-size: 100% 100%;
}
.leave {
  font-size: 25px;
  border-bottom: 1px solid;
  margin: 1rem 5rem;
  padding: 2rem 2rem;
}
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-left: 50px;
  /* background-color: rgba(0, 0, 0, 0.7); */
  text-align: center;
  color: white;
}
.float {
  position: fixed;
  top: 11.5rem;
  z-index: 4;
  right: 6rem;
}
</style>

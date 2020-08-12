<!-- 树状选择器 -->
<template>
  <div>
    <div class="ly-tree-container">
      <selectTree :treeDate="treeDate" v-if="treeDate.length" @ctrl="ctrljsons" />
    </div>
  </div>
</template> 

<script>
import { getDepartment, ctrlDepartment } from "@/api/api";
import selectTree from "./selectTree";
export default {
  data() {
    return { treeDate: [] };
  },
  mounted() {
    this.getjsons();
  },
  components: {
    selectTree
  },
  methods: {
    async ctrljsons(data) {
      switch (data.sendType) {
        case "add":
          delete data["sendType"];
          let addRes = await ctrlDepartment("add", data);
          this.$message({ type: "info", message: addRes.data.info });
          this.getjsons();
          break;
        case "edit":
          delete data["sendType"];
          let editRes = await ctrlDepartment("edit", data);
          this.$message({ type: "info", message: editRes.data.info });
          this.getjsons();
          break;
        case "deltel":
          let deltelRes = await this.$confirm(
            "此操作将永久删除该文件, 是否继续?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          );
          if (deltelRes) {
            let delResult = await ctrlDepartment("delete", data);
            this.$message({ type: "info", message: delResult.data.info });
            this.getjsons();
          } else {
            this.$message({ type: "info", message: "已取消删除!" });
          }
          break;
      }
    },
    async getjsons() {
      let { data } = await getDepartment();
      let pids = data.list.map(i => i.pid);
      let all = data.list.map(i => {
        if (pids.includes(i._id)) {
          i.type = true;
        }
        return i; 
      });
      this.treeDate = this.deal(all);
    },
    //合并父子树状数据
    deal(arr) {
      let tree = arr.reduce((obj, i) => {
        obj[i["_id"]] = i;
        return obj;
      }, {});
      return arr.reduce((arrs, i) => {
        let pid = i.pid; //返回每一项的id
        let parent = tree[pid]; //通过id进行查找父级
        if (parent) {
          parent.child ? parent.child.push(i) : (parent.child = [i]);
        } else if (pid == 0) {
          arrs.push(i);
        }
        return arrs;
      }, []);
    }
  }
};
</script>

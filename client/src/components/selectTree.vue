<template>
  <div>
    <el-tree
      :data="treeDate"
      :props="defaultProps"
      default-expand-all
      :render-content="renderContent"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
    ></el-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isEdit: false,
      select_id: "",
      select_pid: "",
      select_node: "",
      edit_label: "",
      defaultProps: {
        children: "child",
        label: "label"
      }
    };
  },
  props: {
    treeDate: {
      type: Array,
      default: []
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
    check() {
      if (this.isEdit) {
        this.$notify({
          type: "error",
          title: "操作提示",
          message: "有正在编辑或添加的选项未完成！",
          duration: 2000
        });
        return false;
      } else {
        return true;
      }
    },
    edit(node, data) {
      if (this.check()) {
        this.select_id = data._id;
        this.select_pid = data.pid;
        this.edit_label = data.label;
        this.isEdit = true;
        data.isEdit = true;
      }
    },
    addOne(node, data) {
      if (this.check()) {
        this.select_id = data._id;
        this.edit_label = "";
        let newChild = {
          label: "",
          pid: data._id,
          isEdit: true
        };
        this.isEdit = true;
        if (!data.child) this.$set(data, "child", []);
        if (!data.type) this.$set(data, "type", true);
        data.child.unshift(newChild);
      }
    },
    removeOne(data) {
      if (this.check()) {
        data.sendType = "deltel";
        this.$emit("ctrl", data);
      }
    },
    ok(data, node) {
      if (this.edit_label) {
        //修改节点时
        if (data._id) {
          let params = {
            label: this.edit_label,
            _id: data._id,
            sendType: "edit"
          };
          this.$emit("ctrl", params);
        } else {
          //添加节点时
          let virtualNode = node.parent;
          let params = {
            label: this.edit_label,
            pid: virtualNode.data._id,
            sendType: "add"
          };
          this.$emit("ctrl", params);
        }
      }
      this.isEdit = false;
    },
    concal(data, node) {
      if (!data._id) {
        node.parent.data.child.forEach((item, i) => {
          if (!item._id) {
            node.parent.data.child.splice(i, 1);
          }
        });
      }
      this.select_id = "";
      this.select_label = "";
      this.edit_label = data.label;
      this.isEdit = false;
    },
    labelChange(e) {
      e = event || window.event;
      this.edit_label = e.target.value.trim();
    },
    isSelect(data) {
      console.log(data);
      return data.id === this.select_id && data.label === this.select_label;
    },
    renderContent(h, { node, data, store }) {
      return (
        <div>
          {data.type ? (
            node.expanded ? (
              <i class="el-icon-folder-opened"></i>
            ) : (
              <i class="el-icon-folder"></i>
            )
          ) : (
            <i class="el-icon-document"></i>
          )}
          {(this.isEdit && this.isSelect(data)) || data.isEdit ? (
            <input
              placeholder="名称不能为空"
              class="ly-edit__text"
              on-keyup={() => this.labelChange()}
              value={this.edit_label}
            />
          ) : (
            <span>{data.label}</span>
          )}

          {this.$store.getters.user.identity ? (
            (this.isEdit && this.isSelect(data)) || data.isEdit ? (
              <span class="ly-visible">
                <el-button
                  size="mini"
                  type="text"
                  on-click={() => this.concal(data, node)}
                >
                  取消
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  on-click={() => this.ok(data, node)}
                >
                  确认
                </el-button>
              </span>
            ) : (
              <span class="ly-visible">
                <el-button
                  size="mini"
                  type="text"
                  on-click={() => this.edit(node, data)}
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  on-click={() => this.addOne(node, data)}
                >
                  添加
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  on-click={() => this.removeOne(data)}
                >
                  删除
                </el-button>
              </span>
            )
          ) : (
            ""
          )}
        </div>
      );
    }
  }
};
</script>

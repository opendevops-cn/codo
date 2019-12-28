<template>
  <div style="height:100%">
      <Row :gutter="16">
        <Col span="12">
          <Card>
          <tables ref="tables"
                :height="700"
                editable
                searchable
                search-place="top"
                v-model="tableData"
                :columns="columns"
                @on-search-table="handleSearchTable"
              >
                <div slot="new_btn" class="search-con search-col">
                  <Button
                    type="info"
                    class="search-btn"
                    @click="showModal('', 'menu', 'post', '添加菜单')"
                  >添加菜单</Button>
                </div>
              </tables>
          </Card>
        </Col>

        <Col span="12">
        <Card>
        <tables
                ref="tables"
                :height="700"
                editable
                searchable
                search-place="top"
                v-model="tableData1"
                :columns="columns1"
                @on-search-table="handleSearchTable1"
              >
                <div
                  slot="new_btn"
                  class="search-con search-col"
                >
                  <Button
                    type="info"
                    class="search-btn"
                    @click="showModal('', 'component', 'post', '添加组件')"
                  >添加组件</Button>
                </div>
              </tables>
          </Card>
        </Col>
      </Row>
    <Modal
      v-model="modalMap.modalVisible"
      :title="modalMap.modalTitle"
      :loading=true
      :footer-hide=true
    >
      <form-group
        :list="formList"
        @on-submit-success="handleSubmit"
      ></form-group>
    </Modal>
  </div>
</template>

<script>
import Icons from "_c/icons";
import Tables from "_c/tables";
import FormGroup from "_c/form-group";
import {
  getMenuslist,
  getComponentslist,
  operationMenu,
  operationComponent
} from "@/api/user";
export default {
  components: {
    Icons,
    Tables,
    FormGroup
  },
  data() {
    return {
      // 分割
      offset: 0.5,
      // 弹出框
      modalMap: {
        modalVisible: false,
        modalTitle: "title"
      },
      tableData: [],
      tableData1: [],
      formList: [],
      newDataType: "",
      editModalData: "",
      columns: [
        { title: "菜单名称", key: "menu_name", minWidth: 200, sortable: true },
        {
          title: "状态",
          key: "status",
          width: 80,
          align: "center",
          render: (h, params, vm) => {
            return h("div", [
              h("i-switch", {
                props: {
                  value: params.row.status === "0" // 控制开关的打开或关闭状态，官网文档属性是value
                },
                style: {
                  marginRight: "5px"
                },
                on: {
                  "on-change": () => {
                    this.onSwitch(params, "menu");
                  }
                }
              })
            ]);
          }
        },
        {
          title: "操作",
          align: "center",
          key: "handle",
          button: [
            (h, params, vm) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "success",
                      size: "small"
                    },
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        this.showModal(params.index, "menu", "put", "编辑菜单");
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    },
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        this.handleDelete(params, "menu");
                      }
                    }
                  },
                  "删除"
                )
              ]);
            }
          ]
        }
      ],
      columns1: [
        {
          title: "组件名称",
          key: "component_name",
          minWidth: 200,
          sortable: true
        },
        {
          title: "状态",
          key: "status",
          width: 80,
          align: "center",
          render: (h, params, vm) => {
            return h("div", [
              h("i-switch", {
                props: {
                  value: params.row.status === "0" // 控制开关的打开或关闭状态，官网文档属性是value
                },
                style: {
                  marginRight: "5px"
                },
                on: {
                  "on-change": () => {
                    this.onSwitch(params, "component");
                  }
                }
              })
            ]);
          }
        },
        {
          title: "操作",
          align: "center",
          key: "handle",
          button: [
            (h, params, vm) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "success",
                      size: "small"
                    },
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        this.showModal(
                          params.index,
                          "component",
                          "put",
                          "编辑组件"
                        );
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    },
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        this.handleDelete(params, "component");
                      }
                    }
                  },
                  "删除"
                )
              ]);
            }
          ]
        }
      ]
    };
  },
  methods: {
    // 获取菜单列表
    getMenusList(key, value) {
      getMenuslist(key, value).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data;
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },
    // 获取组件列表
    getComponentsList(key, value) {
      getComponentslist(key, value).then(res => {
        if (res.data.code === 0) {
          this.tableData1 = res.data.data;
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },
    // 添加 修改
    handleSubmit(value) {
      setTimeout(() => {
        if (this.newDataType === "menu") {
          operationMenu(value.data, this.editModalData).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`);
              this.getMenusList();
              this.modalMap.modalVisible = false;
            } else {
              this.$Message.error(`${res.data.msg}`);
            }
          });
        } else if (this.newDataType === "component") {
          operationComponent(value.data, this.editModalData).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`);
              this.getComponentsList();
              this.modalMap.modalVisible = false;
            } else {
              this.$Message.error(`${res.data.msg}`);
            }
          });
        } else {
          this.$Message.error("你在提交个锤子啊");
        }
      }, 1000);
    },
    // 弹出对话框
    showModal(index, value, meth, mtitle) {
      this.modalMap.modalVisible = true;
      this.modalMap.modalTitle = mtitle;
      this.editModalData = meth;
      this.newDataType = value;
      if (value === "menu") {
        this.formList = [
          {
            name: "menu_id",
            value: meth === "put" ? this.tableData[index].menu_id : ""
          },
          {
            name: "menu_name",
            type: "i-input",
            value: meth === "put" ? this.tableData[index].menu_name : "",
            label: "菜单名称",
            rule: [{ required: true, message: "名称不能为空", trigger: "blur" }]
          }
        ];
      } else {
        this.formList = [
          {
            name: "comp_id",
            value: meth === "put" ? this.tableData1[index].comp_id : ""
          },
          {
            name: value === "menu" ? "menu_name" : "component_name",
            type: "i-input",
            value: meth === "put" ? this.tableData1[index].component_name : "",
            label: "组件名称",
            rule: [{ required: true, message: "名称不能为空", trigger: "blur" }]
          }
        ];
      }
    },
    // 删除
    handleDelete(params, value) {
      if (confirm(`确定要删除?`)) {
        if (value === "menu") {
          operationMenu({ menu_id: params.row.menu_id }, "delete").then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`);
              this.tableData.splice(params.index, 1);
            } else {
              this.$Message.error(`${res.data.msg}`);
            }
          });
        } else if (value === "component") {
          operationComponent({ comp_id: params.row.comp_id }, "delete").then(
            res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`);
                this.tableData1.splice(params.index, 1);
              } else {
                this.$Message.error(`${res.data.msg}`);
              }
            }
          );
        } else {
          this.$Message.error("你在删除个锤子啊");
        }
      }
    },
    handleSearchTable(key, val) {
      this.getMenusList(key, val);
    },
    handleSearchTable1(key, val) {
      this.getComponentsList(key, val);
    },
    // 调用开关
    onSwitch(params, value) {
      if (value === "menu") {
        operationMenu({ menu_id: params.row.menu_id }, "patch").then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`);
          } else {
            this.$Message.error(`${res.data.msg}`);
          }
        });
      } else if (value === "component") {
        operationComponent({ comp_id: params.row.comp_id }, "patch").then(
          res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`);
            } else {
              this.$Message.error(`${res.data.msg}`);
            }
          }
        );
      } else {
        this.$Message.error("你在禁用个锤子啊");
      }
    },
    //
    filterMethod(data, query) {
      return data.label.indexOf(query) > -1;
    }
  },
  mounted() {
    this.getMenusList();
    this.getComponentsList();
  }
};
</script>

<style>
.split {
  height: 100%;
  border: 1px solid #dcdee2;
}
.split-pane {
  padding: 10px;
}
</style>

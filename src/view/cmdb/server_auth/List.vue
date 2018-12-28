<template>
  <div>
    <Card>
      <tables
        border
        ref="tables"
        editable
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-delete="handleDelete"
        @on-search-table="handleSearchTable"
      >
        <div
          slot="new_btn"
          class="search-col"
          style="width:250px"
        >
          <Button
            type="info"
            class="search-btn"
            @click="handleAdd"
          >添加规则</Button>
        </div>
      </tables>
      </br>
      <Page
        :total="pageTotal"
        :current="getParams.pageNum"
        :page-size="getParams.pageSize"
        :page-size-opts=[10,25,50,100]
        show-sizer
        show-total
        @on-change="changePage"
        @on-page-size-change="handlePageSize"
      ></Page>
    </Card>
    <Add
      :dialog="dialog"
      :formData="formData"
      :systemUser="systemUser"
      @e-update="getData"
      @e-close="closeModal"
    ></Add>
    <Detail
      :dialog="dialog2"
      :formData="formData"
      @e-close="closeModal"
    ></Detail>
    <Modal
      v-model="del_dialog.show"
      :title="del_dialog.title"
      :loading=true
      @on-ok="removeServer(del_dialog.id)"
      @on-cancel="closeDelModal"
    >
      <p>确定要进行删除操作?</p>
    </Modal>
    <copyRight> </copyRight>
  </div>
</template>

<script>
import { Tag } from "iview";
import copyRight from "@/components/public/copyright";
import Tables from "_c/tables";
import {
  getTableData,
  getSystemUser,
  loginGW,
  delRule
} from "@/api/cmdb/server_auth.js";
import Add from "./Add";
import Detail from "./Detail";
export default {
  name: "list",
  components: {
    copyRight,
    Tables,
    Tag,
    Add,
    Detail
  },
  data() {
    return {
      // 弹出框
      systemUser: [],
      loading: false,
      dialog: {
        show: false,
        title: ""
      },
      dialog2: {
        show: false,
        title: "规则详情"
      },
      del_dialog: {
        show: false,
        title: "删除主机"
      },
      columns: [
        {
          title: "ID",
          key: "id",
          sortable: true,
          sortType: "desc",
          width: 70,
          align: "center"
        },
        {
          title: "规则名",
          key: "name",
          sortable: true,
          align: "center",
          render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.handleDetail(params.index, params.row);
                  }
                }
              },
              params.row.name
            );
          }
        },
        {
          title: "用户",
          key: "user",
          align: "center",
          render: (h, params) => {
            let user_list = params.row.user.split(",");
            return h("div", [
              h(Tag, { props: { color: "warning" } }, user_list.length)
            ]);
          }
        },
        {
          title: "主机",
          key: "server",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(Tag, { props: { color: "primary" } }, params.row.server.length)
            ]);
          }
        },
        {
          title: "主机组",
          key: "servergroup",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                Tag,
                { props: { color: "primary" } },
                params.row.servergroup.length
              )
            ]);
          }
        },
        {
          title: "操作",
          key: "handle",
          width: 200,
          align: "center",
          button: [
            (h, params, vm) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        //this.show(params.index)
                        this.handleEdit(params.index, params.row);
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
                    on: {
                      click: () => {
                        //this.remove(params.index)
                        this.handleRemove(params.row);
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
      getParams: {
        pageNum: 1, // 当前页码
        pageSize: 10 // 每页条数
      },
      pageTotal: 0, // 数据总数
      tableData: [],
      formData: {
        name: "",
        comment: "",
        user: [],
        server: [],
        servergroup: []
      },
      ttylog_data: [],
      record_data: {}
    };
  },
  methods: {
    handleDelete(params) {
      console.log(params);
    },
    show(index) {
      this.$Modal.info({
        title: "开始发布",
        content: `项目名称：${this.tableData[index].name}<br>运行时间：${
          this.tableData[index].time
        }<br>镜像：${this.tableData[index].iamge}`
      });
    },
    showTtyLog(row) {
      //get tty_data
      getTtyLogData(row.id).then(res => {
        this.ttylog_data = res.data;
      });
      this.dialog = {
        show: true,
        title: "命令记录"
      };
    },
    // 弹出对话框
    showModal() {
      this.dialog.show = true;
    },
    // 新增
    handleAdd() {
      this.dialog = {
        show: true,
        title: "添加授权规则",
        option: "add"
      };
    },
    // 详情
    handleDetail(index, row) {
      this.dialog2.show = true;
      this.formData = {
        id: row.id,
        name: row.name,
        user: JSON.parse(row.user),
        server: row.server_display,
        servergroup: row.servergroup_display,
        comment: row.comment
      };
    },

    // 编辑
    handleEdit(index, row) {
      this.dialog = {
        show: true,
        title: "编辑授权规则",
        option: "edit"
      };
      this.formData = {
        id: row.id,
        name: row.name,
        user: JSON.parse(row.user),
        server: row.server,
        servergroup: row.servergroup,
        comment: row.comment
      };
    },
    //删除
    handleRemove(row) {
      this.del_dialog = {
        show: true,
        title: "删除 " + row.name,
        id: row.id
      };
    },
    removeServer(id) {
      delRule(id)
        .then(res => {
          this.$Message.success({
            content: "Success!",
            duration: 3
          });
          this.closeDelModal();
          this.getData();
        })
        .catch(error => {
          this.$Message.error({
            content: JSON.stringify(error.response.data),
            duration: 10
          });
        });
    },
    changePage(value) {
      // 切换页码时
      this.getParams.pageNum = value;
      this.getData();
    },
    // 切换每页显示条数时
    handlePageSize(value) {
      this.getParams.pageSize = value;
      this.getData();
    },
    handleSearchTable(k, v) {
      //子组件table发送过来的搜索条件
      this.getParams = {
        pageNum: 1,
        pageSize: 10
      };
      if (k !== "") {
        // 模糊匹配
        this.getParams[k + "__contains"] = v; //contanis包含,﻿startswith开始
      }
      this.getData();
    },

    getSystemUserData() {
      //获取所有系统用户
      getSystemUser()
        .then(res => {
          if (res.data.code === 0) {
            console.log("Get SystemUser Success! ");
            this.systemUser = res.data.data;
          }
        })
        .catch(error => {
          console.log("Get SystemUser Faild! ");
        });
      // loginGW()
      //   .then(res => {
      //     //console.log(res)
      //     if (res.data.code === 0) {
      //       console.log("GW Login Success! ");
      //     }
      //   })
      //   .catch(error => {
      //     console.log("GW Login Faild! ");
      //   });
    },

    getData() {
      //获取数据
      getTableData(this.getParams).then(res => {
        // console.log(res)
        this.tableData = res.data;
        this.pageTotal = res.data.length;
        //console.log(this.tableData)
      });
    },
    closeDelModal() {
      this.del_dialog.show = false;
    },
    closeModal() {
      //关闭modal
      this.dialog.show = false;
    },
    closeModal2() {
      //关闭modal
      this.$refs.child_record.set_close();
      this.record_dialog.show = false;
    }
  },
  mounted() {
    /** 获取表格数据 **/
    this.getData();
    this.getSystemUserData();
    //console.log('get user->'+ this.$store.getters.user.id)
  }
};
</script>

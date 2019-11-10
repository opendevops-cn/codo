<template>
  <Card>
    <Alert>管理用户是用来可以登陆你的主机的用户，如：AWS提供的ec2-user的密钥,或者aliyun/qcloud等自己创建的密钥，管理用户默认限制15个，一般来说运维管理用户不会有多个</Alert>
    <div class="search-con search-con-top">
      <Select
        v-model="searchKey"
        class="search-col"
      >
        <Option
          v-for="item in columns"
          v-if="item.key !== 'handle' && item.key !== 'status' && item.key !== ''"
          :value="item.key"
          :key="`search-col-${item.key}`"
        >{{ item.title }}</Option>
      </Select>
      <Input
        @on-change="handleClear"
        clearable
        placeholder="输入关键字搜索"
        class="search-input"
        v-model="searchValue"
      />
      <Button
        @click="handleSearch"
        class="search-btn"
        type="primary"
      >搜索</Button>
      <slot name="new_btn">
        <Button type="primary" @click="editModal('', 'post', '新建用户')" class="search-btn" >新建用户</Button>
        </slot>
    </div>
    <Table
      size="small"
      height="660"
      ref="selection"
      border
      :columns="columns"
      :data="tableData"
    ></Table>
    <Modal
      v-model="modalMap.modalVisible"
      :title="modalMap.modalTitle"
      :loading=true
      :footer-hide=true
      width=760
    >
    <div style="marginRight: 35px;">
      <form-group :list="formList" @on-submit-success="handleSubmit"></form-group>
    </div>
    </Modal>
    <Modal
      v-model="modalMapCorrelation.modalVisible"
      :title="modalMapCorrelation.modalTitle"
      :loading=true
      :footer-hide=true
    >


    </Modal>
    <Modal
      v-model="modalMapShow.modalVisible"
      :title="modalMapShow.modalTitle"
      :loading=true
      :footer-hide=true
      width=600

    >
      <Input v-model="modalMapShow.user_key" type="textarea"  :autosize="{minRows: 30,maxRows: 300}" placeholder="Enter something..."></Input>
    </Modal>
  </Card>
</template>

<script>
import FormGroup from "_c/form-group";
import { getAdminUserList, operationAdminUser } from "@/api/cmdb2/admin_user";

export default {
  components: {
    FormGroup
  },
  data() {
    return {
      columns: [
        {
          title: "ID",
          key: "id",
          align: "center",
          width: 100,
          sortable: true
        },
        {
          title: "管理用户",
          key: "admin_user",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                    this.handleDetail(params.row.user_key)
                }
              }
            }, params.row.admin_user
            )
          }
        },
        {
          title: "系统用户",
          key: "system_user",
          align: "center",
          minWidth: 100,
        //   render: (h, params) => {
        //     return h('a', {
        //       on: {
        //         click: () => {
        //           if (params.row.nicknames) {
        //             this.existUser = params.row.nicknames.split(",");
        //           }else{
        //              this.existUser = []
        //           }
        //             this.relevanceUser(params.row.id);
        //         }
        //       }
        //     }, params.row.nicknames ? params.row.nicknames : '未添加用户，请关联通知用户'
        //   )}
        },
        {
          title: "描述",
          key: "remarks",
          align: "center",
          minWidth: 120,
        //   width: 120,
        },
                {
          title: "更新时间",
          key: "update_time",
          align: "center",
          minWidth: 120,
        //   width: 120,
        },
        {
          title: "操作",
          key: "handle",
          width: 180,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      this.editModal(params.index, "put", "编辑用户");
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
                      this.delData(params);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      tableData: [],
      modalMap: {
        modalVisible: false,
        modalTitle: "新建"
      },
      modalMapCorrelation: {
        modalVisible: false,
        modalTitle: "关联用户"
      },
      modalMapCopy: {
        modalVisible: false,
        modalTitle: "COPY API"
      },
      modalMapShow: {
        modalVisible: false,
        modalTitle: "用户密钥",
        user_key: '',
      },
      formList: [],
      editModalData: "",
      //
      searchKey: "",
      searchValue: "",
      //
      alert_id: "",
      config_api:"",
      allUser: [], // 所有用户
      existUser: [] // 已存在用户
    };
  },
  methods: {
    // 获取管理用户列表
    getAdminUserList (page, limit, key, value) {
        getAdminUserList(page, limit, key, value).then(res => {
            if (res.data.code === 0) {
            //this.$Message.success(`${res.data.msg}`)
            this.pageTotal = res.data.count
            this.tableData = res.data.data
            } else {
            this.$Message.error(`${res.data.msg}`)
            }
        })
    },
    //查看Key详细信息
    handleDetail(user_key) {
      this.modalMapShow.modalVisible = true;
      this.modalMapShow.user_key=user_key
    },
    // handleDetail (index) {
    //     this.$Modal.info({
    //         title: '用户信息',
    //         content: `<strong>名称</strong>：${this.tableData[index].name}<br><strong>用户名</strong>：${this.tableData[index].admin_user}<br><strong>用户密钥</strong>：${this.tableData[index].user_key}<br><strong>备注</strong>：${this.tableData[index].remarks}<br><strong>更新时间</strong>：${this.tableData[index].update_time}`
    //     })
    // },
    editModal(index, meth, mtitle) {
      this.modalMap.modalVisible = true;
      this.modalMap.modalTitle = mtitle;
      this.editModalData = meth;
      this.formList = [
        {
          name: "id",
          value: meth === "put" ? this.tableData[index].id : ""
        },
        {
          name: "admin_user",
          type: "i-input",
          value: meth === "put" ? this.tableData[index].admin_user : "",
          label: "管理用户",
          placeholder: "管理用户，建议使用英文",
          rule: [{ required: true, message: "名称不能为空", trigger: "blur" }]
        },
        {
          name: "system_user",
          type: "i-input",
          value: meth === "put" ? this.tableData[index].system_user : "root",
          label: "系统用户",
          placeholder: "请输入系统用户",
          rule: [
            {
              required: true,
              message: "系统用户",
              trigger: "blur"
            }
          ]
        },
        {
          name: "user_key",
          type: "i-input",
          type1:'textarea',
          maxlength: 8000,
          value: meth === "put" ? this.tableData[index].user_key : "",
          label: "密钥",
          placeholder: "请输入用户私钥",
          rule: [
            {
              required: true,
              message: "私钥不可为空",
              trigger: "blur"
            }
          ]
        },
        {
          name: "remarks",
          type: "i-input",
          type1:'textarea',
          maxlength: 300,
          value: meth === "put" ? this.tableData[index].remarks : "",
          label: "描述",
          placeholder: "描述",
        }

      ];
    },
    handleSubmit(value) {
      setTimeout(() => {
        operationAdminUser(value.data, this.editModalData).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`);
            this.getAdminUserList(this.searchKey, this.searchValue);
            this.modalMap.modalVisible = false;
          } else {
            this.$Message.error(`${res.data.msg}`);
          }
        });
      }, 1000);
    },
    // 删除
    delData(params) {
      if (confirm(`确定要删除 ${params.row.admin_user}`)) {
        operationAdminUser({ id: params.row.id }, "delete" ).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`);
            this.tableData.splice(params.index, 1);
          } else {
            this.$Message.error(`${res.data.msg}`);
          }
        });
      }
    },
    setDefaultSearchKey() {
      this.searchKey =
        this.columns[0].key && this.columns[0].key !== "handle"
          ? this.columns[0].key
          : this.columns.length > 1
            ? this.columns[1].key
            : "";
    },
    handleClear(e) {
      if (e.target.value === "") this.tableData = this.value;
    },
    handleSearch() {
      this.getAdminUserList(this.searchKey, this.searchValue);
    }
  },
//   watch: {
//     searchValue(val) {
//       this.getAdminUserList(this.searchKey, val);
//     }
//   },
  mounted() {
      this.getAdminUserList()
      this.setDefaultSearchKey()
  }
};
</script>

<style lang="less" scoped>
.search-con {
  padding: 10px 0;
  .search {
    &-col {
      display: inline-block;
      width: 200px;
    }
    &-input {
      display: inline-block;
      width: 200px;
      margin-left: 2px;
    }
    &-btn {
      margin-left: 2px;
    }
  }
}
</style>

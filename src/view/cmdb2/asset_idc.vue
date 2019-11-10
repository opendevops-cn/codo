<template>
  <Card>
    <Alert>自定义创建IDC、记录IDC机房信息、一般不会超过多个，默认限制50个</Alert>
    <div class="search-con search-con-top">
      <Input
        @on-change="handleClear"
        clearable
        placeholder="输入关键字全局搜索"
        class="search-input"
        v-model="searchValue"
      />
      <Button @click="handleSearch" class="search-btn" type="primary">搜索</Button>
      <slot name="new_btn">
        <Button type="primary" @click="editModal('', 'post', '新建IDC')" class="search-btn">新建IDC</Button>
      </slot>
    </div>
    <Table size="small" height="660" ref="selection" border :columns="columns" :data="tableData"></Table>
    <Modal
      v-model="modalMap.modalVisible"
      :title="modalMap.modalTitle"
      :loading="true"
      :footer-hide="true"
      width="650"
    >
      <div style="marginRight: 35px;">
        <form-group :list="formList" @on-submit-success="handleSubmit"></form-group>
      </div>
    </Modal>
  </Card>
</template>

<script>
import FormGroup from "_c/form-group";
import { getIDClist, operationIdc } from "@/api/cmdb2/idc";

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
          title: "IDC名称",
          key: "name",
          align: "center",
          minWidth: 150,
          render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    // this.$Message.info('开发中')
                    this.handleDetail(params.index);
                  }
                }
              },
              params.row.name
            );
          }
        },
        {
          title: "联系人",
          key: "contact",
          align: "center",
          minWidth: 100,
        },
        {
          title: "Email",
          key: "email",
          align: "center",
          minWidth: 150,
          //   width: 120,
        },
        {
          title: "Phone",
          key: "phone",
          align: "center",
          minWidth: 100,
          //   width: 120,
        },
        {
          title: "备注",
          key: "remarks",
          align: "center",
          minWidth: 100,
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
                      this.editModal(params.index, "put", "编辑IDC");
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

      formList: [],
      editModalData: "",
      searchKey: "",
      searchValue: ""
    };
  },
  methods: {
    // 获取IDC List
    getIDCList(page, limit, key, value) {
      getIDClist(page, limit, key, value).then(res => {
        if (res.data.code === 0) {
          //this.$Message.success(`${res.data.msg}`)
          this.pageTotal = res.data.count;
          this.tableData = res.data.data;
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },
    handleDetail(index) {
      this.$Modal.info({
        title: "IDC信息",
        width: 600,
        content: `
            <strong>名称</strong>：${this.tableData[index].name}<br>
            <strong>联系人</strong>：${this.tableData[index].contact}<br>
            <strong>Email</strong>：${this.tableData[index].email}<br>
            <strong>电话</strong>：${this.tableData[index].phone}<br>
            <strong>地址</strong>：${this.tableData[index].address}<br>
            <strong>网络</strong>：${this.tableData[index].network}<br>
            <strong>带宽</strong>：${this.tableData[index].bandwidth}<br>
            <strong>地址段</strong>：${this.tableData[index].ip_range}<br>
            <strong>备注</strong>：${this.tableData[index].remarks}<br>
            `
      });
    },
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
          name: "name",
          type: "i-input",
          value: meth === "put" ? this.tableData[index].name : "",
          label: "IDC名称",
          placeholder: "IDC机房名称",
          rule: [{ required: true, message: "名称不能为空", trigger: "blur" }]
        },
        {
          name: "contact",
          type: "i-input",
          value: meth === "put" ? this.tableData[index].contact : "",
          label: "联系人",
          placeholder: "请输入联系人"
          // rule: [
          //   {
          //     required: true,
          //     message: "请输入联系人",
          //     trigger: "blur"
          //   }
          // ]
        },
        {
          name: "email",
          type: "i-input",
          value: meth === "put" ? this.tableData[index].email : "",
          label: "Email",
          placeholder: "联系人Email"
          // rule: [
          //   {
          //     required: true,
          //     message: "",
          //     trigger: "blur"
          //   }
          // ]
        },

        {
          name: "phone",
          type: "i-input",
          value: meth === "put" ? this.tableData[index].phone : "",
          label: "电话",
          placeholder: "联系人电话"
          // rule: [
          //   {
          //     required: true,
          //     message: "",
          //     trigger: "blur"
          //   }
          // ]
        },
        {
          name: "address",
          type: "i-input",
          value: meth === "put" ? this.tableData[index].address : "",
          label: "IDC地址",
          placeholder: "IDC地址"
          // rule: [
          //   {
          //     required: true,
          //     message: "",
          //     trigger: "blur"
          //   }
          // ]
        },
        {
          name: "network",
          type: "i-input",
          value: meth === "put" ? this.tableData[index].network : "BGP",
          label: "机房网络",
          placeholder: "请输入机房网络"
          // rule: [
          //   {
          //     required: true,
          //     message: "",
          //     trigger: "blur"
          //   }
          // ]
        },
        {
          name: "bandwidth",
          type: "i-input",
          value: meth === "put" ? this.tableData[index].bandwidth : "100M",
          label: "机房带宽",
          placeholder: "请输入机房带宽,默认100M"
          // rule: [
          //   {
          //     required: true,
          //     message: "",
          //     trigger: "blur"
          //   }
          // ]
        },

        {
          name: "ip_range",
          type: "i-input",
          type1: "textarea",
          maxlength: 1000,
          value: meth === "put" ? this.tableData[index].ip_range : "",
          label: "IP地址段",
          placeholder: "请输入机房IP地址段"
          // rule: [
          //   {
          //     required: true,
          //     message: "IP地址段",
          //     trigger: "blur"
          //   }
          // ]
        },
        {
          name: "remarks",
          type: "i-input",
          type1: "textarea",
          maxlength: 300,
          value: meth === "put" ? this.tableData[index].remarks : "",
          label: "描述",
          placeholder: "描述"
        }
      ];
    },
    handleSubmit(value) {
      setTimeout(() => {
        console.log('value.data-->',value.data)
        operationIdc(value.data, this.editModalData).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`);
            this.getIDCList();
            this.modalMap.modalVisible = false;
          } else {
            this.$Message.error(`${res.data.msg}`);
          }
        });
      }, 1000);
    },
    // 删除
    delData(params) {
      if (confirm(`确定要删除 ${params.row.name}`)) {
        operationIdc({ id: params.row.id }, "delete").then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`);
            this.tableData.splice(params.index, 1);
          } else {
            this.$Message.error(`${res.data.msg}`);
          }
        });
      }
    },
    handleClear(e) {
      if (e.target.value === "") this.tableData = this.value;
    },
    handleSearch() {
      this.getIDCList(this.searchValue);
      // this.getIDCList(this.searchKey, this.searchValue);
    }
  },
  mounted() {
    this.getIDCList();
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

<template>
  <Card style="height:100%">
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
        <Button type="primary" @click="editModal('', 'post', '新建通知')" class="search-btn" >新建通知</Button>
        <Button type="warning" @click="handlerRefresh()" class="search-btn" >更新用户</Button>
        <Button type="info" @click="handlerCopy()" class="search-btn">用法示例</Button>
        </slot>
    </div>
    <Table
      size="small"
      height="720"
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
    >
      <form-group :list="formList" @on-submit-success="handleSubmit"></form-group>
    </Modal>
    <Modal
      v-model="modalMapCorrelation.modalVisible"
      :title="modalMapCorrelation.modalTitle"
      :loading=true
      :footer-hide=true
    >
      <Select class="search-input-long" v-model="existUser" filterable multiple placeholder="请选择关联的用户" >
        <Option
          v-for="item in allUser"
          :value="item.nickname"
          :key="item.user_id"
        >{{ item.nickname }}</Option>
      </Select>
      <Button
        type="success"
        style="margin-top: 10px;"
        @click="handlerSubmitUser"
        long
      >确定关联</Button>
    </Modal>
    <Modal
      v-model="modalMapShow.modalVisible"
      :title="modalMapShow.modalTitle"
      :loading=true
      :footer-hide=true
    >
      <Input v-model="modalMapShow.config_file" type="textarea" :autosize="{minRows: 20,maxRows: 100}" placeholder="Enter something..."></Input>
    </Modal>
    <Modal v-model="modalMapCopy.modalVisible" :title="modalMapCopy.modalTitle" :loading=true >
      <div slot="footer"> </div>
       <Alert type="success" closable>
        <p>本示例用webhook告警，规则名称为post数据中的alertname，匹配相关的报警用户。POST API地址 点击API按钮复制。</p>
        <p> 使用的时候修改webhook的url地址即可，参考配置文件传送门：
          <a href="https://github.com/yanghongfei/Kubernetes/blob/master/kube-prometheus/manifests/alertmanager/alertmanager.yaml" target="_blank">alertmanager.yaml</a>
        </p>
       </Alert>
       <Input v-model="config_api">
        <Button slot="append" v-clipboard:copy="config_api" v-clipboard:success="onCopy" v-clipboard:error="onError">API</Button>
       </Input>
    </Modal>
  </Card>
</template>

<script>
import FormGroup from "_c/form-group";
import { getPrometheusAlertlist, operationPrometheusAlert } from "@/api/devops-tools";
import { getuserlist } from "@/api/user";
// import VueClipboard from 'vue-clipboard2'

// Vue.use(VueClipboard)
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
          title: "规则名称",
          key: "keyword",
          align: "center",
          width: 500,
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.handleDetail(params.row.nicknames, params.row.config_file)
                }
              }
            }, params.row.keyword
            )
          }
        },
        {
          title: "通知用户",
          key: "nicknames",
          align: "center",
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  if (params.row.nicknames) {
                    this.existUser = params.row.nicknames.split(",");
                  }else{
                     this.existUser = []
                  }
                    this.relevanceUser(params.row.id);
                }
              }
            }, params.row.nicknames ? params.row.nicknames : '未添加用户，请关联通知用户'
          )}
        },
        {
          title: "告警级别",
          key: "alert_level",
          align: "center",
          width: 120,
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
                      this.editModal(params.index, "put", "编辑规则");
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
        modalTitle: "配置详情",
        nicknames: '',
        config_file:''
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
    getPrometheusAlertList(key, value) {
      getPrometheusAlertlist(key, value).then(res => {
        this.config_api = `${res.request.responseURL.split('/tools/')[0]}/tools/v1/tools/send/prometheus/`
        if (res.data.code === 0) {
          this.tableData = res.data.data;
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },
    // 获取用户列表
    getUserList() {
      getuserlist(1, 10000).then(res => {
        if (res.data.code === 0) {
          this.allUser = res.data.data;
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },
    relevanceUser(val) {
      this.modalMapCorrelation.modalVisible = true;
      this.modalMapCorrelation.modalTitle = "关联用户";
      this.alert_id = val;
    },
    handlerSubmitUser() {
      setTimeout(() => {
        operationPrometheusAlert(
          {
            nicknames: this.existUser.join(","),
            alert_id: this.alert_id
          },
          "patch"
        ).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`);
            this.getPrometheusAlertList(this.searchKey, this.searchValue);
            this.modalMapCorrelation.modalVisible = false;
          } else {
            this.$Message.error(`${res.data.msg}`);
          }
        });
      }, 1000);
    },
    handlerRefresh() {
      this.$Message.info("每隔一个小时，自动刷新");
    },
    handlerCopy(){
      this.modalMapCopy.modalVisible = true;
      this.modalMapCopy.modalTitle = "示例用法";
    },
    onCopy(){
       this.$Message.success('复制成功')
    },
    onError(){
      this.$Message.error('复制失败')
    },
    handleDetail(nicknames,config_file) {
      this.modalMapShow.modalVisible = true;
      this.modalMapShow.nicknames=nicknames
      this.modalMapShow.config_file=config_file

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
          name: "keyword",
          type: "i-input",
          value: meth === "put" ? this.tableData[index].keyword : "",
          label: "规则名称",
          placeholder: "匹配配置文件中的rules下alert字段 ,webhook接受数据中的alertname",
          rule: [{ required: true, message: "规则名称不能为空", trigger: "blur" }]
        },
        {
          name: "alert_level",
          type: "i-input",
          value: meth === "put" ? this.tableData[index].alert_level : "严重",
          label: "报警等级",
          placeholder: "请输入报警等级，仅供参考，具体查看配置信息",
          rule: [
            {
              required: true,
              message: "报警等级不能为空",
              trigger: "blur"
            }
          ]
        },
        {
          name: "config_file",
          type: "i-input",
          type1:'textarea',
          maxlength: 8000,
          value: meth === "put" ? this.tableData[index].config_file : "",
          label: "配置文件",
          placeholder: "请输入配置文件，仅供参考，方便查阅",
          rule: [
            {
              required: true,
              message: "请输入配置文件，方便查阅",
              trigger: "blur"
            }
          ]
        }
      ];
    },
    handleSubmit(value) {
      setTimeout(() => {
        operationPrometheusAlert(value.data, this.editModalData).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`);
            this.getPrometheusAlertList(this.searchKey, this.searchValue);
            this.modalMap.modalVisible = false;
          } else {
            this.$Message.error(`${res.data.msg}`);
          }
        });
      }, 1000);
    },
    // 删除
    delData(params) {
      if (confirm(`确定要删除 ${params.row.keyword}`)) {
        operationPrometheusAlert({ alert_id: params.row.id }, "delete" ).then(res => {
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
      this.getPrometheusAlertList(this.searchKey, this.searchValue);
    }
  },
  watch: {
    searchValue(val) {
      this.getPrometheusAlertList(this.searchKey, val);
    }
  },
  mounted() {
    this.getPrometheusAlertList();
    this.setDefaultSearchKey();
    this.getUserList();
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

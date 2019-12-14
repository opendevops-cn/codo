<template>
  <Card style="height:100%">
    <Alert show-icon>
      Some reminders
      <Icon type="ios-bulb-outline" slot="icon"></Icon>
      <template slot="desc">你可以在此创建一些提醒相关的内容，默认提醒时间：每天09：00--10：00，如果字体被渲染成红色，证明已满足提醒条件.</template>
    </Alert>
    <div class="search-con search-con-top">
      <Input clearable search placeholder="输入关键字全局搜索" class="search-input" v-model="searchVal"/>

      <ButtonGroup class="search-btn">
        <Button @click="editModal('', 'post', '新建提醒')"> 新建提醒</Button>
        <Button   :loading="handLoading"  @click="handTiggerRemind">手动触发提醒</Button>
      </ButtonGroup>

    </div>
    <Table size="default" height="580" ref="selection" :columns="columns" :data="tableData"></Table>
    <Modal
      v-model="modalMap.modalVisible"
      :title="modalMap.modalTitle"
      :loading="true"
      :footer-hide="true"
      :width="820"
    >
      <Alert show-icon>你可以在此记录一些需要提醒的消息</Alert>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="110">
        <div v-if="editModalData && editModalData == 'put'">
          <FormItem label="提醒名称" prop="remind_name">
            <Input
              v-model="formValidate.remind_name"
              disabled
              :maxlength="80"
              placeholder="请输入提醒名称"
            ></Input>
          </FormItem>
        </div>
        <div v-else>
          <FormItem label="提醒名称" prop="remind_name">
            <Input v-model="formValidate.remind_name" :maxlength="80" placeholder="请输入提醒名称"></Input>
          </FormItem>
        </div>

        <FormItem label="提醒类型" prop="remind_type">
          <Select v-model="formValidate.remind_type" placeholder="选择提醒的类型">
            <Option value="费用提醒">费用提醒</Option>
            <Option value="工作提醒">工作提醒</Option>
            <Option value="任务提醒">任务提醒</Option>
            <Option value="其他提醒">其他提醒</Option>
          </Select>
        </FormItem>

        <FormItem label="提醒方式" prop="remind_method">
          <Select v-model="formValidate.remind_method" placeholder="选择你要提醒的方式">
            <Option value="email">邮件</Option>
            <Option value="dingding">钉钉</Option>
            <Option value="work_wechat">企业微信</Option>
          </Select>
        </FormItem>

        <div v-if="formValidate.remind_method === 'email'">
          <FormItem label="通知人" prop="remind_email">
            <Select
              class="search-input-long"
              v-model="formValidate.remind_email"
              filterable
              multiple
              placeholder="请选择关联的用户"
            >
              <Option
                v-for="item in allUser"
                :value="item.nickname"
                :key="item.user_id"
              >{{ item.nickname }}</Option>
            </Select>
          </FormItem>
        </div>
        <div v-if="formValidate.remind_method === 'work_wechat'">
          <FormItem label="机器人地址" prop="webhook_addr">
            <Input
              v-model="formValidate.webhook_addr"
              :maxlength="200"
              placeholder="请输入企业微信机器人webhook地址"
            ></Input>
          </FormItem>
        </div>

        <div v-if="formValidate.remind_method === 'dingding'">
          <FormItem label="机器人地址" prop="webhook_addr">
            <Input
              v-model="formValidate.webhook_addr"
              :maxlength="200"
              placeholder="请输入钉钉机器人webhook地址"
            ></Input>
          </FormItem>
        </div>

        <FormItem label="最后提醒时间" prop="remind_time">
          <DatePicker
            v-model="formValidate.remind_time"
            type="datetime"
            :options="optionsDate"
            format="yyyy-MM-dd HH:mm:ss"
            show-week-numbers
            editable
            placeholder="选择一个通知提醒时间"
            style="width: 360px"
          ></DatePicker>
        </FormItem>
        <alert>你希望是在提醒时间前（提前多少天）提醒呢?</alert>
        <FormItem label="提前天数" prop="remind_day">
          <InputNumber
            :max="180"
            :min="1"
            v-model="formValidate.remind_day"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            :maxlength="20"
            placeholder="提前多少天进行提醒"
          ></InputNumber>
        </FormItem>
        <FormItem label="备注详情" label-position="top" prop="remind_content">
          <Input
            type="textarea"
            v-model="formValidate.remind_content"
            :rows="6"
            placeholder="please enter the description"
          />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: left;">
        <Page
          :total="pageTotal"
          :current="pageNum"
          :page-size="pageSize"
          :page-size-opts="[13,35,50,100]"
          show-sizer
          show-total
          @on-change="changePage"
          @on-page-size-change="handlePageSize"
        ></Page>
      </div>
    </div>
  </Card>
</template>

<script>
import FormGroup from "_c/form-group";
import {
  getremindlist,
  operationremind,
  handtiggerremind
} from "@/api/devops-tools";
import { getuserlist } from "@/api/user";

export default {
  data() {
    return {
      formValidate: {
        remind_name: "",
        remind_type: "",
        remind_method: "",
        remind_day: 10,
        remind_time: "",
        remind_content: "",
        webhook_addr: "",
        remind_email: []
      },
      ruleValidate: {
        remind_name: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur"
          }
        ],
        remind_type: [
          {
            required: true,
            message: "类型不能为空",
            trigger: "blur"
          }
        ],
        remind_method: [
          {
            required: true,
            // type: "number",
            message: "提醒方式不能为空",
            trigger: "blur"
          }
        ],
        webhook_addr: [
          {
            required: true,
            message: "机器人webhook地址不能为空",
            trigger: "blur"
          }
        ],
        remind_email: [
          {
            required: true,
            type: "array",
            message: "请选择用户",
            trigger: "change"
          }
        ],
        remind_time: [
          {
            required: true,
            type: "date",
            message: "Please select the date",
            trigger: "change"
          }
        ],
        remind_content: [
          {
            required: true,
            message: "请简单描述下吧",
            trigger: "blur"
          }
        ]
      },
      columns: [
        {
          title: "提醒名称",
          key: "remind_name",
          align: "center",
          minWidth: 150,
          resizable: true,
          sortable: true,
          render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.handleDetail(params.index);
                  }
                }
              },
              params.row.remind_name
            );
          }
        },
        {
          title: "备注详情",
          key: "remind_content",
          align: "left",
          ellipsis: true,
          minWidth: 150,
          render: (h, params) => {
            if (params.row.state == 1) {
              return h("div", [
                h(
                  "p",
                  {
                    style: {
                      fontSize: "14px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      color: "red"
                    }
                  },
                  params.row.remind_content
                )
              ]);
            } else {
              return h("div", [
                h(
                  "p",
                  {
                    style: {
                      fontSize: "14px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      color: "black"
                    }
                  },
                  params.row.remind_content
                )
              ]);
            }
          }
        },
        {
          title: "创建人",
          key: "nickname",
          width: 100,
          align: "center",
          render: (h, params) => {
            if (params.row.state == 1) {
              return h("div", [
                h(
                  "p",
                  {
                    style: {
                      fontSize: "14px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      color: "red"
                    }
                  },
                  params.row.nickname
                )
              ]);
            } else {
              return h("div", [
                h(
                  "p",
                  {
                    style: {
                      fontSize: "14px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      color: "black"
                    }
                  },
                  params.row.nickname
                )
              ]);
            }
          }
        },
        {
          title: "提醒类型",
          key: "remind_type",
          minWidth: 150,
          align: "center",
          sortable: true,
          render: (h, params) => {
            if (params.row.state == 1) {
              return h("div", [
                h(
                  "p",
                  {
                    style: {
                      fontSize: "14px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      color: "red"
                    }
                  },
                  params.row.remind_type
                )
              ]);
            } else {
              return h("div", [
                h(
                  "p",
                  {
                    style: {
                      fontSize: "14px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      color: "black"
                    }
                  },
                  params.row.remind_type
                )
              ]);
            }
          }
        },
        {
          title: "提前天数",
          key: "remind_day",
          width: 120,
          align: "center",
          sortable: true,
          render: (h, params) => {
            if (params.row.state == 1) {
              return h("div", [
                h(
                  "p",
                  {
                    style: {
                      fontSize: "14px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      color: "red"
                    }
                  },
                  params.row.remind_day
                )
              ]);
            } else {
              return h("div", [
                h(
                  "p",
                  {
                    style: {
                      fontSize: "14px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      color: "black"
                    }
                  },
                  params.row.remind_day
                )
              ]);
            }
          }
        },

        {
          title: "最后提醒时间",
          key: "remind_time",
          width: 200,
          align: "center",
          sortable: true,
          render: (h, params) => {
            if (params.row.state == 1) {
              return h("div", [
                h(
                  "p",
                  {
                    style: {
                      fontSize: "14px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      color: "red"
                    }
                  },
                  params.row.remind_time
                )
              ]);
            } else {
              return h("div", [
                h(
                  "p",
                  {
                    style: {
                      fontSize: "14px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      color: "black"
                    }
                  },
                  params.row.remind_time
                )
              ]);
            }
          }
        },
        {
          title: "提醒方式",
          key: "remind_method",
          width: 150,
          align: "center",
          sortable: true,
          render: (h, params) => {
            if (params.row.remind_method == "email") {
              return h("div", [
                h("Tag", { props: { color: "green" } }, "邮件通知")
              ]);
            } else if (params.row.remind_method == "work_wechat") {
              return h("div", [
                h("Tag", { props: { color: "blue" } }, "企业微信")
              ]);
            } else if (params.row.remind_method == "dingding") {
              return h("div", [
                h("Tag", { props: { color: "geekblue" } }, "钉钉通知")
              ]);
            }
          }
        },
        {
          title: "操作",
          key: "handle",
          width: 160,
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
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.editModal(params.row, "put", "编辑提醒");
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
      pageNum: 1, // 当前页码
      pageTotal: 0, // 数据总数
      pageSize: 13, // 每页条数
      allUser: [], // 所有用户
      existUser: [], // 已存在用户
      searchKey: "",
      searchValue: "",
      searchVal: "",
      handLoading: false,
      optionsDate: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      }
    };
  },
  methods: {
    //
    getremindList() {
      getremindlist(this.pageNum, this.pageSize, this.searchVal)
        .then(res => {
          if (res.data.code === 0) {
            this.pageTotal = res.data.count;
            this.tableData = res.data.data;
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(error => {
          this.$Message.error({
            content: JSON.stringify(error.response.data),
            duration: 10
          });
        });
    },

    // 手动触发提醒
    // handTiggerRemind() {
    //   this.handLoading = true;
    //   handtiggerremind().then(res => {
    //     if (res.data.code === 0) {
    //       this.handLoading = false;
    //       this.$Message.info(`${res.data.msg}`);
    //     } else {
    //       this.handLoading = false;
    //       this.$Message.error(`${res.data.msg}`);
    //     }
    //   });
    // },
    handTiggerRemind() {
      this.loading = true;
      this.handLoading = true;
      this.$Modal.confirm({
        title: "提醒",
        content:
          "<p>将检测所有符合提醒的内容进行相对于的提醒操作,请不要多次提交,收到信息则代表发送提醒成功.</p>",
        loading: true,
        onOk: () => {
          setTimeout(() => {
            this.$Modal.remove();
            handtiggerremind().then(res => {
              if (res.data.code === 0) {
                this.handLoading = false;
                this.$Message.success(`${res.data.msg}`);
              } else {
                this.handLoading = false;
                this.$Message.error(`${res.data.msg}`);
              }
              this.loading = false;
            });
          }, 1000);
        },
        onCancel: () => {
          this.loading = false;
          this.$Message.info("Clicked cancel");
        }
      });
    },

    // 获取用户列表
    getUserList() {
      getuserlist(1, 1000).then(res => {
        if (res.data.code === 0) {
          this.allUser = res.data.data;
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },
    handleDetail(index) {
      this.$Modal.info({
        title: "提醒信息",
        width: 40,
        content: `
        <strong>提醒名称</strong>：${this.tableData[index].remind_name}<br>
        <strong>提醒类型</strong>：${this.tableData[index].remind_type}<br>
        <strong>提醒方式</strong>：${this.tableData[index].remind_method}<br>
        <strong>提前天数</strong>：${this.tableData[index].remind_day}<br>
        <strong>最后提醒时间</strong>：${this.tableData[index].remind_time}<br>
        <strong>机器人地址</strong>：${this.tableData[index].webhook_addr}<br>
        <strong>通知人Email</strong>：${this.tableData[index].remind_email}<br>
        <strong>备注详情</strong>：${this.tableData[index].remind_content}<br>
        `
      });
    },

    editModal(paramsRow, meth, mtitle) {
      this.modalMap.modalVisible = true;
      this.modalMap.modalTitle = mtitle;
      this.editModalData = meth;

      if (meth === 'put' && paramsRow && paramsRow.id) {
        this.formValidate = paramsRow
      } else {
        // post
        this.formValidate =this.$options.data().formValidate
      }
    },
    handleSubmit(value) {
      this.$refs[value].validate(valid => {
        if (valid) {
          setTimeout(() => {
            operationremind(this.formValidate, this.editModalData).then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`);
                this.getremindList(this.searchVal);
                this.modalMap.modalVisible = false;
              } else {
                this.$Message.error(`${res.data.msg}`);
              }
            });
          }, 1000);
          // this.$Message.success('Success!');
        } else {
          this.$Message.error("缺少必要参数");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    // 删除
    delData(params) {
      if (confirm(`确定要删除 ${params.row.remind_name}`)) {
        operationremind(
          {
            id: params.row.id
          },
          "delete"
        ).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`);
            this.tableData.splice(params.index, 1);
          } else {
            this.$Message.error(`${res.data.msg}`);
          }
        });
      }
    },

    // 翻页
    changePage(value) {
      this.pageNum = value;
      this.getremindList();
    },

    // 每页条数
    handlePageSize(value) {
      this.pageSize = value;
      this.pageNum = 1;
      this.getremindList();
    }
  },

  mounted() {
    this.getremindList();
    this.getUserList();
  },
  watch: {
    searchVal(val) {
      this.searchKey = val;
      this.getremindList(this.searchKey);
    }
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
      width: 220px;
      margin-left: 2px;
    }
    &-btn {
      margin-left: 2px;
    }
  }
}
</style>

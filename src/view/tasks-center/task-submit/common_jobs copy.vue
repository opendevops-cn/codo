<template>
  <Card>
    <div class="search-con search-con-top">
      <i-col>
        <Affix :offset-top="80"> 
          <Input autofocus="autofocus" v-model="searchVal" style="padding:6px;" placeholder="请输入作业名称进行模糊搜素" />
        </Affix>
      </i-col>
    </div>
    <Table size="small" height="660" ref="selection"  :columns="columns" :data="tableData"></Table>
    <div style="margin: 10px; overflow: hidden">
      <div style="float: left;">
        <Page  :total="pageTotal"  :current="pageNum" :page-size="pageSize" :page-size-opts="[15,35,50,100]" show-sizer
          show-total @on-change="changePage" @on-page-size-change="handlePageSize"
        ></Page>
      </div>
    </div>
    <div>
      <Drawer
        v-model="viewDrawer"
        :closable="false"
        :draggable="true"
        style="background-color: #f8f8f9"
        width="1020"
      >
        <alert>作业中心执行步骤</alert>
          <!-- <p v-for="item in temp_step_list">{{item}}</p> -->
        <!-- <Steps v-for="item in temp_step_list" :current="0" direction="vertical">
          <Step :title="'[脚本名称]：' + item.command_name" :content=" '[执行命令]：' + item.command  + '\n' + '[状态]：' + item.trgger"></Step>
        </Steps> -->
         <Table size="small" height="660" ref="selection" border :columns="viewStepcolumns" :data="temp_step_list"></Table>
      </Drawer>
    </div>
    <div>
      <Drawer
        v-model="execDrawer"
        :closable="false"
        :draggable="true"
        style="background-color: #f8f8f9"
        width="850"
      >
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
          <Alert show-icon>
            任务详情
            <Icon type="ios-bulb-outline" slot="icon"></Icon>
            <template slot="desc">你可以在提交任务前确定参数是否正确，点击提交任务后可在订单中心中查看详情.</template>
          </Alert>
          <FormItem label="作业名称：" prop="task_name">
            {{formValidate.task_name}}
            <!-- <Input v-model="formValidate.task_name" :maxlength="200" placeholder="请输入任务名称"></Input> -->
          </FormItem>
          <Row>
            <Col span="12">
              <FormItem label="模板ID：">
                <Input
                  v-model="formValidate.temp_id"
                  disabled
                  :maxlength="200"
                  placeholder="请输入任务名称"
                ></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="模板名称：">
                <Input v-model="tempname" disabled :maxlength="200" placeholder="请输入任务名称"></Input>
              </FormItem>
            </Col>
          </Row>
          <!-- <FormItem label="模板ID：">
            <Input v-model="formValidate.temp_id" disabled :maxlength="200" placeholder="请输入任务名称"></Input>
          </FormItem>-->
          <FormItem label="标签：" prop="tag">
            <Input v-model="formValidate.tag" disabled :maxlength="200" placeholder="请输入任务名称"></Input>
          </FormItem>
          <FormItem v-if="submitInfo.length > 0 " label="目标主机：">
            <span v-for="item in submitInfo">
              <tag color="success" :key="item" :name="item" @on-close="handleClose">{{item}}</tag>
            </span>
          </FormItem>
          <!-- <FormItem v-for="(key, val) in formValidate.args_items" :key="key" :label="val">{{key}}</FormItem> -->
          <FormItem
            v-for="(item, index) in formValidate.args_items"
            :key="index"
            :label="item.label"
          >
            <Input
              type="text"
              v-model="item.value"
              clearable
              :maxlength="120"
              :placeholder="`请输入参数${item.key}的值`"
            ></Input>
          </FormItem>
          <FormItem label="执行时间" prop="start_time">
            <DatePicker
              v-model="formValidate.start_time"
              type="datetime"
              :options="optionsDate"
              format="yyyy-MM-dd HH:mm:ss"
              show-week-numbers
              editable
              placeholder="选择一个执行时间，用来触发模板中的定时触发器"
              style="width: 360px"
            ></DatePicker>
          </FormItem>
          <FormItem label="备注详情" label-position="top" prop="detail">
            <Input type="textarea" v-model="formValidate.detail" :rows="6" placeholder="please enter the description"/>
          </FormItem>
          <FormItem>
              <Button type="primary" @click="handleSubmitJob('formValidate')">提交任务</Button>
          </FormItem>
        </Form>
      </Drawer>
    </div>

    <!-- 授权用户按钮 -->
    <div>
      <Modal v-model="modalMap.modalVisible1" :title="modalMap.modalTitle1" :loading="true" :footer-hide="true">
        <Select class="search-input-long" v-model="existUser" filterable multiple placeholder="请选择需要授权的用户">
          <Option v-for="item in allUser" :value="item.nickname" :key="item.user_id" >{{ item.nickname }}</Option>
        </Select>
        <Button type="success" style="margin-top: 10px;" @click="handlerSubmitUser" long>确定授权</Button>
      </Modal>
    </div>
    <!-- 授权用户按钮 -->
  </Card>
</template>

<script>
import { getCommonjobs, operationCommonjobs, handSubmittask } from "@/api/task-other";
import { getAuthTaglist, getCustomtask, operationCustomtask } from "@/api/task-other";
import { getTemplist, getTempargs, getDetailslist } from "@/api/task";
import { getuserlist } from "@/api/user";
// import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      editDrawer: false,
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
      columns: [
        // {
        //   title: "ID",
        //   key: "id",
        //   align: "center",
        //   width: 100,
        //   sortable: true
        // },
        {
          title: "作业名称",
          key: "task_name",
          align: "left",
          width: 400,
          sortable: true,
          render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.$Message.info('任务执行按钮在最右边！')
                  }
                }
              },
              params.row.task_name
            );
          }
        },
        {
          title: "执行主机",
          key: "hosts_name",
          align: "left"
        },
        {
          title: "模板ID",
          key: "temp_id",
          align: "center",
          width: 100,
        },
        {
          title: "创建者",
          key: "creator",
          align: "center",
          width: 150
        },
        {
          title: "创建时间",
          key: "create_time",
          align: "center",
          width: 180,
          sortable: true
        },
        {
          title: "更新时间",
          key: "update_time",
          align: "center",
          width: 180,
          sortable: true
        },
        {
          title: "",
          key: "handle",
          width: 360,
          align: "center",
          render: (h, params) => {
            return h("ButtonGroup", [
              h(
                "Button",
                {
                  props: {
                    // type: "success",
                    size: "small"
                  },
                  // style: {
                  //   marginRight: "8px"
                  // },
                  on: {
                    click: () => {
                      this.handleSubmitExecJob(params.row, "put", "执行作业");
                    }
                  }
                },
                "立即执行"
              ),
              h(
                "Button",
                {
                  props: {
                    // type: "info",
                    size: "small"
                  },
                  // style: {
                  //   marginRight: "8px"
                  // },
                  on: {
                    click: () => {
                      this.viewStep(params.row.temp_id);
                    }
                  }
                },
                "查看步骤"
              ),
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.$Message.info('开发中！')
                      this.editModal(params.row, "put", "编辑作业");
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    // type: "warning",
                    size: "small"
                  },
                  style: {
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {
                      this.relevanceUser(params.row);
                    }
                  }
                },
                "授权"
              ),
              h(
                "Button",
                {
                  props: {
                    // type: "error",
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
      viewStepcolumns: [
        {
          title: "优先级",
          key: "level",
          align: "center",
          width: 100,
          sortable: true
        },
        {
          title: "脚本名称",
          key: "command_name",
          align: "left",
          width: 250,
          sortable: true
        },
        {
          title: "脚本命令",
          key: "command",
          align: "left",
          sortable: true
        },
        {
          title: '状态',
          key: 'trigger',
          width: 85,
          align: 'center',
          render: (h, params) => {
            let status = params.row.trigger
            if (status === 'order') {
              return h('div', [
                h('Tag', { props: { color: 'default' } }, '默认')
              ])
            } else if (status === 'hand') {
              return h('div', [h('Tag', { props: { color: 'cyan' } }, '手动')])
            } else if (status === 'timed') {
              return h('div', [
                h('Tag', { props: { color: 'geekblue' } }, '定时')
              ])
            } 
          }
        }
      ],
      // 弹框
      modalMap: {
        modalVisible: false,
        modalTitle: "创建",
        modalVisible1: false,
        modalTitle1: "创建"
      },
      formValidate: {
        task_name: "",
        tag: "",
        temp_id: "",
        nickname: "",
        hostnames: "",
        args_items: []
      },
      formValidate2: {
        task_name: "",
        tag: "",
        temp_id: "",
        nickname: "",
        hostnames: "",
        args_items: []
      },
      ruleValidate: {
        tag: [
          {
            required: true,
            message: "The tag cannot be empty",
            trigger: "blur"
          }
        ],
        temp_id: [
          {
            required: true,
            type: "number",
            message: "必须选择一个执行模板",
            trigger: "blur"
          }
        ],
        start_time: [
          {
            required: true,
            type: "date",
            message: "Please select the date",
            trigger: "change"
          }
        ]
      },
      optionsDate: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      execDrawer: false,
      viewDrawer: false,
      tempList: [],
      tempinfo: [],
      tempname: "",
      submitInfo: [],
      allTagList: [],
      tableData: [],
      // 用户授权
      selectTaskname: "",
      existUser: [],
      allUser: [],
      //模板步骤详情
      temp_step_list:[],
      //
      editModalData: "",
      //
      searchKey: "",
      searchVal: "",
      pageNum: 1, // 当前页码
      pageTotal: 0, // 数据总数
      pageSize: 15 // 每页条数
    };
  },
  methods: {
    // 获取常用作业List
    getCommonJobs(key, value) {
      console.log(key, value)
      getCommonjobs(this.pageNum, this.pageSize, key, value)
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

    // 查看步骤 抽屉
    viewStep(temp_id) {
      this.viewDrawer = true;
      this.getDetailsList(temp_id)
    },

    // 触发立即执行按钮，弹出二次确认信息
    handleSubmitExecJob(paramsRow, meth, mtitle) {
      this.execDrawer = true;
      this.formValidate = {
        id: paramsRow.id,
        task_name: paramsRow.task_name,
        tag: paramsRow.tag,
        temp_id: paramsRow.temp_id,
        nickname: paramsRow.nickname,
        hostnames: paramsRow.hostnames,
        args_items: JSON.parse(paramsRow.args_items),
        detail: paramsRow.detail
      };
      // 获取模板名称
      let temp_id = paramsRow.temp_id;
      this.getTempName(temp_id);

      // 获取此任务的目标主机
      let tag = paramsRow.tag;
      getCustomtask("tag", tag).then(res => {
        if (res.data.code === 0) {
          this.submitInfo = res.data.data;
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
      // // 获取当前时间
      // formValidate.start_time = this.computedDateTime(new Date().toLocaleDateString())
    },

    //Step02:触发执行任务
    handleSubmitJob(value) {
      this.btn_loading = true;
      if (this.submitInfo.length === 0 || this.submitInfo.length > 100) {
        this.$Message.error(
          "请选择一个标签，并确保标签下有主机，并且主机不能大于100"
        );
        this.btn_loading = false;
        return;
      }
      this.$refs[value].validate(valid => {
        if (valid) {
          setTimeout(() => {
            this.formValidate["hostnames"] = this.submitInfo;
            operationCustomtask(this.formValidate, "post").then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`);
              } else {
                this.$Message.error(`${res.data.msg}`);
              }
            });
            this.btn_loading = false;
          }, 1000);
        } else {
          this.$Message.error("表单校验错误");
          this.btn_loading = false;
        }
      });
    },

    //获取模板名称
    getTempName(val) {
      getTemplist("temp_id", val).then(res => {
        if (res.data.code === 0) {
          this.tempinfo = res.data.data;
          this.tempname = res.data.data[0].temp_name;
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },

    //获取模板步骤详情
    getDetailsList(temp_id) {
      getDetailslist(temp_id).then(res => {
        if (res.data.code === 0) {
          this.temp_step_list = res.data.data.temp_list
          console.log('temp_step_list',this.temp_step_list)
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
    //授权用户
    relevanceUser(paramsRow) {
      this.modalMap.modalVisible1 = true;
      this.modalMap.modalTitle1 = "授权分享";
      this.getUserList();
      this.selectTaskname = paramsRow.task_name;
      this.existUser = paramsRow.authorized_user.split(",");
    },

    // 提交, 更新授权用户
    handlerSubmitUser() {
      operationCommonjobs(
        { authorized_user: this.existUser, task_name: this.selectTaskname },
        "patch"
      ).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`);
          this.modalMap.modalVisible1 = false;
          this.getCommonJobs();
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },

    //选择标签
    handleSelect(value) {
      getCustomtask("tag", value).then(res => {
        if (res.data.code === 0) {
          this.submitInfo = res.data.data;
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },

    // 获取标签列表
    getAllTagList() {
      getAuthTaglist().then(res => {
        if (res.data.code === 0) {
          this.allTagList = res.data.data;
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },

  // 模板list
    getTempList() {
      getTemplist().then(res => {
        if (res.data.code === 0) {
          this.tempList = res.data.data;
          // this.sqlTempList = res.data.data.filter(
          //   res => res.temp_name.search("SQL审核") === 0
          // );
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },
    handleClose(event, name) {
      const index = this.submitInfo.indexOf(name);
      this.submitInfo.splice(index, 1);
    },
    handlerSelectTemp(temp_id) {
      getTempargs(temp_id).then(res => {
        if (res.data.code === 0) {
          this.index = 0;
          this.formValidate2.args_items = [];
          //
          res.data.data.forEach(element => {
            this.index++;
            this.formValidate2.args_items.push({
              label: res.data.args_dict[element]
                ? res.data.args_dict[element]
                : element,
              key: element,
              value: "",
              index: this.index,
              status: 1
            });
          });
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },


    //编辑按钮，暂时没用Edit
    editModal(paramsRow, meth, mtitle) {
      this.editDrawer = true;
      this.formValidate2 = {
        id: paramsRow.id,
        task_name: paramsRow.task_name,
        tag: paramsRow.tag,
        temp_id: paramsRow.temp_id,
        nickname: paramsRow.nickname,
        hostnames: paramsRow.hostnames,
        args_items: JSON.parse(paramsRow.args_items),
        detail: paramsRow.detail
      };
      // 获取模板名称
      let temp_id = paramsRow.temp_id;
      this.getTempName(temp_id);
    },
    
    handleSubmit(value) {
      setTimeout(() => {
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
      if (confirm(`确定要删除 ${params.row.task_name}`)) {
        operationCommonjobs({ id: params.row.id }, "delete").then(res => {
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
      this.getCommonJobs();
    },
    // 切换每页多少数量
    handlePageSize(value) {
      this.pageSize = value;
      this.pageNum = 1;
      console.log(value)
      this.getCommonJobs();
    },
    // //获取当前时间
    // computedDateTime(val) {
    //   if (val) {
    //     return moment(val).format("YYYY-MM-DD HH:mm:ss");
    //   }
    // },
    handleClear(e) {
      if (e.target.value === "") this.tableData = this.value;
    },
  },
  mounted() {
    this.getCommonJobs();
    this.getAllTagList();
    this.getTempList();
    // this.getDetailsList(200)
  },
  watch: {
    searchVal(val) {
      this.searchKey = val
      this.getCommonJobs(this.searchKey);
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
      width: 200px;
      margin-left: 2px;
    }
    &-btn {
      margin-left: 2px;
    }
  }
}
</style>

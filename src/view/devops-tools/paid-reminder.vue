<template>
  <Card  style="height:100%">
    <div class="search-con search-con-top">
      <Select
        v-model="searchKey"
        class="search-col"
      >
        <Option
          v-for="item in columns"
          v-if="item.key !== 'handle' && item.key !== 'status' && item.key !== ''"
          :value="item.key"
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
      <slot name="new_btn"><Button
          type="primary"
          @click="editModal('', 'post', '新建提醒')"
          class="search-btn"
        >新建提醒</Button></slot>
    </div>
    <Table
      size="small"
      height="680"
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
      <Alert show-icon>记录一些付费提醒事项信息。</Alert>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="85">
        <div v-if="editModalData && editModalData == 'put'">
          <FormItem
            label="提醒名称"
            prop="paid_name"
          >
            <Input
              v-model="formValidate.paid_name"
              disabled
              :maxlength="80"
              placeholder="请输入提醒名称"
            ></Input>
          </FormItem>
        </div>
        <div v-else>
          <FormItem
            label="提醒名称"
            prop="paid_name"
          >
            <Input
              v-model="formValidate.paid_name"
              :maxlength="80"
              placeholder="请输入提醒名称"
            ></Input>
          </FormItem>
        </div>

        <FormItem
          label="付费时间"
          prop="paid_start_time"
        >
            <DatePicker
              v-model="formValidate.paid_start_time"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              show-week-numbers
              editable
              placeholder="上次付费时间"
              style="width: 330px"
            ></DatePicker>
        </FormItem>
        <FormItem
          label="到期时间"
          prop="paid_end_time"
        >
            <DatePicker
              v-model="formValidate.paid_end_time"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              show-week-numbers
              editable
              placeholder="提醒到期时间"
              style="width: 330px"
            ></DatePicker>
        </FormItem>
        <FormItem
          label="提前天数"
          prop="reminder_day"
        >
        <InputNumber
            :max="180" :min="1"
            v-model="formValidate.reminder_day"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            :maxlength="20"
            placeholder="提前多少天进行提醒"
        >
        </InputNumber>
        </FormItem>
        <FormItem
          label="通知人"
          prop="nicknames"
        >
        <Select class="search-input-long" v-model="formValidate.nicknames" filterable multiple placeholder="请选择关联的用户" >
            <Option
              v-for="item in allUser"
              :value="item.nickname"
              :key="item.user_id"
            >{{ item.nickname }}</Option>
          </Select>
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            @click="handleSubmit('formValidate')"
          >提交</Button>
          <Button
            @click="handleReset('formValidate')"
            style="margin-left: 8px"
          >重置</Button>
        </FormItem>
      </Form>
    </Modal>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: left;">
          <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[10,15,25,35,50,100] show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
        </div>
    </div>
  </Card>
</template>

<script>
import FormGroup from "_c/form-group";
import { getPaidManagerList, operationPaidManager } from "@/api/devops-tools";
import { getuserlist } from "@/api/user";

export default {
  data() {
    return {
      formValidate: {
        paid_name: '',
        paid_start_time: "",
        paid_end_time: "",
        reminder_day: 30,
        nicknames: [],
      },
      // optionsDate: {
      //   disabledDate (date) {
      //     return date && date.valueOf() < Date.now() - 86400000
      //   }
      // },
      ruleValidate: {
        paid_name: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur"
          }
        ],
        // nicknames: [
        //   {
        //     required: true,
        //     message: "通知人",
        //     trigger: "blur",
        //   }
        // ],
        },
      columns: [
        {
          title: "提醒名称",
          key: "paid_name",
          align: "center",
          // width: 200,
          sortable: true,
          render: (h, params) => {
            // return h('router-link', {props:{to:'/project/publish/'+params.row.id+ '/'}}, params.row.name)
            return h('a', {
            on: {
                click: () => {
                this.handleDetail(params.index)
                }
            }
            }, params.row.paid_name
            )
          }
        },
        {
          title: "上次付费时间",
          key: "paid_start_time",
          // width: 200,
          align: "center",
          sortable: true
        },
        {
          title: "付费到期时间",
          key: "paid_end_time",
          // width: 200,
          align: "center",
          sortable: true
        },
        {
          title: "提前天数",
          key: "reminder_day",
          width: 120,
          align: "center",
          sortable: true
        },
        {
          title: "通知人",
          key: "nicknames",
          // width: 250,
          align: "center",
          sortable: true,
          render: (h, params) => {
            return h('a', {
              // on: {
              //   click: () => {
              //   }
              // }
            }, params.row.nicknames ? params.row.nicknames.join(',') : '未添加用户，请关联通知用户'
          )}
        },
        {
          title: "操作",
          key: "handle",
          width: 150,
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
      modalMapCorrelation: {
        modalVisible: false,
        modalTitle: "关联用户"
      },
      formList: [],
      editModalData: "",
      pageNum: 1, // 当前页码
      pageTotal: 0, // 数据总数
      pageSize: 15, // 每页条数
      allUser: [], // 所有用户
      existUser: [], // 已存在用户
      searchKey: "paid_name",
      searchValue: ""
    };
  },
  methods: {
    // 获取事件管理信息
    getPaidManagerList (page, limit, key, value) {
        getPaidManagerList(page, limit, key, value).then(res => {
            if (res.data.code === 0) {
            this.pageTotal = res.data.count
            this.tableData = res.data.data
            } else {
            this.$Message.error(`${res.data.msg}`)
            }
        })
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
    handleDetail (index) {
        this.$Modal.info({
            title: '提醒信息',
            content: `<strong>提醒名称</strong>：${this.tableData[index].paid_name}<br><strong>上次付费时间</strong>：${this.tableData[index].paid_start_time}<br><strong>付费到期时间</strong>：${this.tableData[index].paid_end_time}<br><strong>提前通知天数</strong>：${this.tableData[index].reminder_day}<br><strong>通知人员</strong>：${this.tableData[index].nicknames}`
        })
    },
        // 选择类型
    handlerSelectType(val) {
      this.formValidate.publish_type = val;
    },

    // 选择类型
    handlerSelectType1(val) {
      this.formValidate.publish_type1 = val;
    },
    handlerSelectType2(val) {
      this.formValidate.bucket_type = val;
    },
    editModal(paramsRow, meth, mtitle) {
        this.modalMap.modalVisible = true;
        this.modalMap.modalTitle = mtitle;
        this.editModalData = meth;

        if (paramsRow && paramsRow.id) {
          //put
          this.formValidate = {
            paid_name: paramsRow.paid_name,
            paid_start_time: paramsRow.paid_start_time,
            paid_end_time: paramsRow.paid_end_time,
            reminder_day: paramsRow.reminder_day,
            nicknames: paramsRow.nicknames,
          }
        } else {
          // post
          this.formValidate = {
            paid_name: '',
            paid_start_time: "",
            paid_end_time: "",
            reminder_day: 30,
            nicknames: '',
          }
        }
        // if (meth === 'post'){
        //   this.formValidate = {
        //   paid_name: '',
        //   paid_start_time: "",
        //   paid_end_time: "",
        //   reminder_day: 30,
        //   nicknames: '',
        //   }
        // }

        // if (meth === 'put'){
        //     getPaidManagerList(this.pageNum,this.pageSize,"id", ID).then(res => {
        //         if (res.data.code === 0) {
        //             this.formValidate = res.data.data[0];
        //             // this.linkUser == res.data.data[0].nicknames.split(',')

        //         } else {
        //             this.$Message.error(`${res.data.msg}`);
        //         }
        //     });
        // }
    },
    handleSubmit (value) {
        this.$refs[value].validate((valid) => {
                    if (valid) {
                        setTimeout(() => {
                          operationPaidManager(this.formValidate, this.editModalData).then(res => {
                              if (res.data.code === 0) {
                                  this.$Message.success(`${res.data.msg}`)
                                  this.getPaidManagerList(
                                  this.pageNum,
                                  this.pageSize,
                                  this.searchKey,
                                  this.searchValue
                                  )
                                  this.modalMap.modalVisible = false
                              } else {
                                  this.$Message.error(`${res.data.msg}`)
                              }
                          })
                      }, 1000)
                        // this.$Message.success('Success!');
                    } else {
                        this.$Message.error('缺少必要参数');
                    }
                })
            },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    // 删除
    delData (params) {
        if (confirm(`确定要删除 ${params.row.paid_name}`)) {
            operationPaidManager(
            {
                id: params.row.id
            },
            'delete'
            ).then(res => {
            if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
                this.tableData.splice(params.index, 1)
            } else {
                this.$Message.error(`${res.data.msg}`)
            }
            })
        }
        },
    handleClear(e) {
      if (e.target.value === "") this.tableData = this.value;
    },
    handleSearch() {
      this.getPaidManagerList(this.pageNum,this.pageSize,this.searchKey, this.searchValue);
    },
    changePage (value) {

        this.pageNum = value
        this.getPaidManagerList(
            this.pageNum,
            this.pageSize,
            this.searchKey,
            this.searchValue
          )
        },
    // 每页条数
    handlePageSize (value) {
        this.pageSize = value
        this.getPaidManagerList(1, this.pageSize, this.searchKey, this.searchValue)
    }
  },

  mounted() {
    this.getPaidManagerList();
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

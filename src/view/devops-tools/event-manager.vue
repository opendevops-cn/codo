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
          @click="editModal('', 'post', '新建事件')"
          class="search-btn"
        >新建事件</Button></slot>
    </div>
    <Table
      size="small"
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
      <Alert show-icon>记录一些运维过程中的事件信息。</Alert>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="85">
        <div v-if="editModalData && editModalData == 'put'">
          <FormItem
            label="事件名称"
            prop="event_name"
          >
            <Input
              v-model="formValidate.event_name"
              disabled
              :maxlength="45"
              placeholder="请输入事件名称"
            ></Input>
          </FormItem>
        </div>
        <div v-else>
          <FormItem
            label="事件名称"
            prop="event_name"
          >
            <Input
              v-model="formValidate.event_name"
              :maxlength="45"
              placeholder="请输入事件名称"
            ></Input>
          </FormItem>
        </div>
        <FormItem
          label="事件状态"
          prop="event_status"
        >
          <Select
            v-model="formValidate.event_status"
            placeholder="请选择状态"
          >
            <Option value="未开始" >未开始</Option>
            <Option value="处理中" >处理中</Option>
            <Option value="已完成" >已完成</Option>
          </Select>
        </FormItem>
        <FormItem
          label="事件等级"
          prop="event_level"
        >
          <Select
            v-model="formValidate.event_level"
            placeholder="等级程度"
          >
            <Option value="警告" >警告</Option>
            <Option value="严重" >严重</Option>
            <Option value="灾难" >灾难</Option>
          </Select>
        </FormItem>
        <FormItem
          label="开始时间"
          prop="event_start_time"
        >
            <DatePicker
              v-model="formValidate.event_start_time"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              show-week-numbers
              editable
              placeholder="记录你事件的开始时间"
              style="width: 330px"
            ></DatePicker>
        </FormItem>
        <FormItem
          label="结束时间"
          prop="event_end_time"
        >
            <DatePicker
              v-model="formValidate.event_end_time"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              show-week-numbers
              editable
              placeholder="记录你事件的结束时间"
              style="width: 330px"
            ></DatePicker>
        </FormItem>
        <FormItem
          label="处理人员"
          prop="event_processing"
        >
          <Input
            v-model="formValidate.event_processing"
            type="text"
            :autosize="{minRows: 2,maxRows: 5}"
            :maxlength="200"
            placeholder="事件处理人员，接手人，参与人"
          ></Input>
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
import { getEventManagerList, operationEvent } from "@/api/devops-tools";

export default {
  data() {
    return {
      formValidate: {
        event_name: '',
        event_status: "",
        event_level: "",
        event_processing: '',
        event_start_time: '',
        event_end_time: '',
      },
    //   optionsDate: {
    //     disabledDate (date) {
    //       return date && date.valueOf() < Date.now() - 86400000
    //     }
    //   },
      ruleValidate: {
        event_name: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur"
          }
        ],
        event_status: [
          {
            required: true,
            message: "请选择一个事件状态",
            trigger: "blur"
          }
        ],
        event_level: [
          {
            required: true,
            message: "请选择一个事件等级",
            trigger: "blur"
          }
        ],
        event_processing: [
          {
            required: true,
            message: "处理人员，参与人员不可为空",
            trigger: "blur"
          }
        ],
        },
      columns: [
        // {
        //   title: "ID",
        //   key: "id",
        //   width: 100,
        //   align: "center",
        //   sortable: true
        // },
        {
          title: "事件名称",
          key: "event_name",
          align: "center",
        //   width: 200,
          sortable: true,
          render: (h, params) => {
            // return h('router-link', {props:{to:'/project/publish/'+params.row.id+ '/'}}, params.row.name)
            return h('a', {
            on: {
                click: () => {
                this.handleDetail(params.index)
                }
            }
            }, params.row.event_name
            )
          }
        },
        {
          title: "事件状态",
          key: "event_status",
          width: 130,
          align: "center",
          sortable: true
        },
        {
          title: "事件级别",
          key: "event_level",
          width: 130,
          align: "center",
          sortable: true
        },
        {
          title: "处理人员",
          key: "event_processing",
        //   width: 200,
          align: "center",
          sortable: true
        },
        {
          title: "开始时间",
          key: "event_start_time",
        //   width: 200,
          align: "center",
          sortable: true
        },
        {
          title: "结束时间",
          key: "event_end_time",
        //   width: 200,
          align: "center",
          sortable: true
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
                        this.editModal(params.row, "put", "编辑事件");
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
      pageSize: 15, // 每页条数
      //
      searchKey: "event_name",
      searchValue: ""
    };
  },
  methods: {
    // 获取事件管理信息
    getEventManagerList (page, limit, key, value) {
        getEventManagerList(page, limit, key, value).then(res => {
            if (res.data.code === 0) {
            this.pageTotal = res.data.count
            this.tableData = res.data.data
            } else {
            this.$Message.error(`${res.data.msg}`)
            }
        })
    },
    handleDetail (index) {
        this.$Modal.info({
            title: '事件信息',
            content: `事件名称：${this.tableData[index].event_name}<br>事件状态：${this.tableData[index].event_status}<br>事件等级：${this.tableData[index].event_level}<br>处理人员：${this.tableData[index].event_processing}<br>事件开始时间：${this.tableData[index].event_start_time}<br>事件结束时间：${this.tableData[index].event_end_time}`
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
            // put
            this.formValidate = {
                event_name: paramsRow.event_name,
                event_status: paramsRow.event_status,
                event_level: paramsRow.event_level,
                event_processing: paramsRow.event_processing,
                event_start_time: paramsRow.event_start_time,
                event_end_time: paramsRow.event_end_time,
           }
        } else {
            // post
            this.formValidate = {
                event_name: '',
                event_status: "",
                event_level: "",
                event_processing: '',
                event_start_time: '',
                event_end_time: '',
           }
        }
    },
    handleSubmit (value) {
        this.$refs[value].validate((valid) => {
                    if (valid) {
                        setTimeout(() => {
                            operationEvent(this.formValidate, this.editModalData).then(res => {
                                if (res.data.code === 0) {

                                    this.$Message.success(`${res.data.msg}`)
                                    this.getEventManagerList(
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
        if (confirm(`确定要删除 ${params.row.event_name}`)) {
            operationEvent(
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
    // setDefaultSearchKey() {
    //   this.searchKey =
    //     this.columns[0].key && this.columns[0].key !== "handle"
    //       ? this.columns[0].key
    //       : this.columns.length > 1
    //       ? this.columns[1].key
    //       : "";
    // },
    handleClear(e) {
      if (e.target.value === "") this.tableData = this.value;
    },
    handleSearch() {
      this.getEventManagerList(this.pageNum,this.pageSize,this.searchKey, this.searchValue);
    },
    changePage (value) {

        this.pageNum = value
        this.getEventManagerList(
            this.pageNum,
            this.pageSize,
            this.searchKey,
            this.searchValue
          )
        },
    // 每页条数
    handlePageSize (value) {
        this.pageSize = value
        this.getEventManagerList(1, this.pageSize, this.searchKey, this.searchValue)
    }

//   },
//   watch: {
//     searchValue(val) {
//       this.getEventManagerList(this.pageNum,this.pageSize,this.searchKey, val);
//     }
  },

  mounted() {
    this.getEventManagerList();
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

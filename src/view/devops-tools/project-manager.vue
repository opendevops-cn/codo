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
          @click="editModal('', 'post', '新建项目')"
          class="search-btn"
        >新建项目</Button></slot>
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
      <Alert show-icon>记录运维项目信息,如：工作室游戏、公共中心项目等。</Alert>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="85">
        <div v-if="editModalData && editModalData == 'put'">
          <FormItem
            label="项目名称"
            prop="project_name"
          >
            <Input
              v-model="formValidate.project_name"
              disabled
              :maxlength="45"
              placeholder="请输入项目名称"
            ></Input>
          </FormItem>
        </div>
        <div v-else>
          <FormItem
            label="项目名称"
            prop="project_name"
          >
            <Input
              v-model="formValidate.project_name"
              :maxlength="45"
              placeholder="请输入项目名称"
            ></Input>
          </FormItem>
        </div>
        <FormItem
          label="项目状态"
          prop="project_status"
        >
          <Select
            v-model="formValidate.project_status"
            placeholder="请选择状态"
          >
            <Option value="未开始" >未开始</Option>
            <Option value="进行中" >进行中</Option>
            <Option value="关闭" >关闭</Option>
          </Select>
        </FormItem>

        <FormItem
          label="项目需求者"
          prop="project_requester"
        >
          <Input
            v-model="formValidate.project_requester"
            type="text"
            :autosize="{minRows: 2,maxRows: 5}"
            :maxlength="200"
            placeholder="项目需求者、项目组负责人等"
          ></Input>
        </FormItem>


        <FormItem
          label="接手人员"
          prop="project_processing"
        >
          <Input
            v-model="formValidate.project_processing"
            type="text"
            :autosize="{minRows: 2,maxRows: 5}"
            :maxlength="200"
            placeholder="项目处理人员，接手人，参与人"
          ></Input>
        </FormItem>

        <FormItem
          label="开始时间"
          prop="project_start_time"
        >
            <DatePicker
              v-model="formValidate.project_start_time"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              show-week-numbers
              editable
              placeholder="记录你项目的立项/开始时间"
              style="width: 330px"
            ></DatePicker>
        </FormItem>
        <FormItem
          label="结束时间"
          prop="project_end_time"
        >
            <DatePicker
              v-model="formValidate.project_end_time"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              show-week-numbers
              editable
              placeholder="记录你项目的结束/关闭时间"
              style="width: 330px"
            ></DatePicker>
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
import { getProjectManagerList, operationProjectManager } from "@/api/devops-tools";

export default {
  data() {
    return {
      formValidate: {
        project_name: '',
        project_status: "",
        project_requester: "",
        project_processing: "",
        project_start_time: '',
        project_end_time: '',
      },
    //禁用之前时间
    //   optionsDate: {
    //     disabledDate (date) {
    //       return date && date.valueOf() < Date.now() - 86400000
    //     }
    //   },
      ruleValidate: {
        project_name: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur"
          }
        ],
        project_status: [
          {
            required: true,
            message: "请选择一个状态",
            trigger: "blur"
          }
        ],
        project_requester: [
          {
            required: true,
            message: "请输入项目需求者",
            trigger: "blur"
          }
        ],
        project_processing: [
          {
            required: true,
            message: "处理人员，参与人员不可为空",
            trigger: "blur"
          }
        ],
        },
      columns: [
        {
          title: "项目名称",
          key: "project_name",
          align: "center",
        //   width: 200,
          sortable: true,
          render: (h, params) => {
            return h('a', {
            on: {
                click: () => {
                this.handleDetail(params.index)
                }
            }
            }, params.row.project_name
            )
          }
        },
        {
          title: "项目状态",
          key: "project_status",
          width: 130,
          align: "center",
          sortable: true
        },
        {
          title: "项目需求者",
          key: "project_requester",
          width: 130,
          align: "center",
          sortable: true
        },
        {
          title: "接手人员",
          key: "project_processing",
        //   width: 200,
          align: "center",
          sortable: true
        },
        {
          title: "开始时间",
          key: "project_start_time",
        //   width: 200,
          align: "center",
          sortable: true
        },
        {
          title: "结束时间",
          key: "project_end_time",
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
                        this.editModal(params.row, "put", "编辑项目");
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
      searchKey: "project_name",
      searchValue: ""
    };
  },
  methods: {
    // 获取项目管理信息
    getProjectManagerList (page, limit, key, value) {
        getProjectManagerList(page, limit, key, value).then(res => {
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
            title: '项目信息',
            content: `项目名称：${this.tableData[index].project_name}<br>项目状态：${this.tableData[index].project_status}<br>项目需求者：${this.tableData[index].project_requester}<br>接手人员：${this.tableData[index].project_processing}<br>项目开始时间：${this.tableData[index].project_start_time}<br>项目结束时间：${this.tableData[index].project_end_time}`
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
            this.formValidate = {
              project_name: paramsRow.project_name,
              project_status: paramsRow.project_status,
              project_requester: paramsRow.project_requester,
              project_processing: paramsRow.project_processing,
              project_start_time: paramsRow.project_start_time,
              project_end_time: paramsRow.project_end_time,
           }
        } else {
            this.formValidate = {
              project_name: '',
              project_status: "",
              project_requester: "",
              project_processing: '',
              project_start_time: '',
              project_end_time: '',
           }
        }
    },
    handleSubmit (value) {
        this.$refs[value].validate((valid) => {
                    if (valid) {
                        setTimeout(() => {
                            operationProjectManager(this.formValidate, this.editModalData).then(res => {
                                if (res.data.code === 0) {
                                    this.$Message.success(`${res.data.msg}`)
                                    this.getProjectManagerList(
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
        if (confirm(`确定要删除 ${params.row.project_name}`)) {
            operationProjectManager(
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
      this.getProjectManagerList(this.pageNum,this.pageSize,this.searchKey, this.searchValue);
    },
    changePage (value) {

        this.pageNum = value
        this.getProjectManagerList(
            this.pageNum,
            this.pageSize,
            this.searchKey,
            this.searchValue
          )
        },
    // 每页条数
    handlePageSize (value) {
        this.pageSize = value
        this.getProjectManagerList(1, this.pageSize, this.searchKey, this.searchValue)
    }

//   },
//   watch: {
//     searchValue(val) {
//       this.getProjectManagerList(this.pageNum,this.pageSize,this.searchKey, val);
//     }
  },

  mounted() {
    this.getProjectManagerList();
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

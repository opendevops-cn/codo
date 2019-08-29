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
          @click="editModal('', 'post', '新建故障')"
          class="search-btn"
        >新建故障</Button></slot>
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
      <Alert show-icon>记录一些运维过程中的故障信息，附件我们存储在阿里云OSS.</Alert>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="85">
        <div v-if="editModalData && editModalData == 'put'">
          <FormItem
            label="故障名称"
            prop="fault_name"
          >
            <Input
              v-model="formValidate.fault_name"
              disabled
              :maxlength="45"
              placeholder="请输入故障名称"
            ></Input>
          </FormItem>
        </div>
        <div v-else>
          <FormItem
            label="故障名称"
            prop="fault_name"
          >
            <Input
              v-model="formValidate.fault_name"
              :maxlength="45"
              placeholder="请输入故障名称"
            ></Input>
          </FormItem>
        </div>
        <FormItem
          label="故障状态"
          prop="fault_state"
        >
          <Select
            v-model="formValidate.fault_state"
            placeholder="请选择状态"
          >
            <Option value="处理中" >处理中</Option>
            <Option value="已关闭" >已关闭</Option>
          </Select>
        </FormItem>
        <FormItem
          label="故障等级"
          prop="fault_level"
        >
          <Select
            v-model="formValidate.fault_level"
            placeholder="等级程度"
          >
            <Option value="一级故障" >一级故障</Option>
            <Option value="二级故障" >二级故障</Option>
            <Option value="三级故障" >三级故障</Option>
            <Option value="四级故障" >四级故障</Option>
            <Option value="五级故障" >五级故障</Option>
          </Select>
        </FormItem>
        <FormItem
          label="责任人"
          prop="fault_penson"
        >
          <Input
            v-model="formValidate.fault_penson"
            :autosize="{minRows: 2,maxRows: 5}"
            :maxlength="200"
            placeholder="故障责任人"
          ></Input>
        </FormItem>
        <FormItem
          label="处理人员"
          prop="processing_penson"
        >
          <Input
            v-model="formValidate.processing_penson"

            :autosize="{minRows: 2,maxRows: 5}"
            :maxlength="200"
            placeholder="故障处理人员，接手人，参与人"
          ></Input>
        </FormItem>

       <FormItem
        label="上传附件"
       >
       <!-- 自动上传文件 -->
            <Upload
                ref="upload"
                v-model="formValidate.fault_report"
                :before-upload="handleBeforeUpload"
                type="drag"
                :action=UploadUrl
                :max-size="5 * 1024"
                :on-exceeded-size="handleMaxSize"
                :format="['jpg','jpeg','png','md','pptx','ppt','docx','doc','pdf']"
                :on-format-error="handleFormatError"
                :on-success="handleSuccess"

                >
                <div style="padding: 1px 0">
                    <Icon type="ios-cloud-upload" size="50" style="color: #3399ff"></Icon>
                    <p>点击上传故障报告附件，nginx默认限制1M，有需求请自行修改</p>
                </div>

            </Upload>
        <!-- 手动上传 -->
        <!-- <div>
            <Upload
            :before-upload="handleUpload"
            action="'/tools/v1/tools/fault/upload/">

            <Button icon="ios-cloud-upload-outline">选择你要上传的文件</Button>
            </Upload>
            <div v-if="file !== null">Upload file: {{ file.name }} <Button type="text" @click="upload" :loading="loadingStatus">{{ loadingStatus ? 'Uploading' : '点击上传文件' }}</Button></div>
        </div> -->

        </FormItem>


        <FormItem
          label="开始时间"
          prop="fault_start_time"
        >
            <DatePicker
              v-model="formValidate.fault_start_time"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              show-week-numbers
              editable
              placeholder="记录你故障的开始时间"
              style="width: 403px"
            ></DatePicker>
        </FormItem>
        <FormItem
          label="结束时间"
          prop="fault_end_time"
        >
            <DatePicker
              v-model="formValidate.fault_end_time"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              show-week-numbers
              editable
              placeholder="记录你故障的结束时间"
              style="width: 403px"
            ></DatePicker>
        </FormItem>
        <FormItem
          label="故障原因"
          prop="fault_issue"
        >
          <Input
            v-model="formValidate.fault_issue"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 10}"
            :maxlength="2000"
            placeholder="可详细描述故障原因"
          ></Input>
        </FormItem>

        <FormItem
          label="故障总结"
          prop="fault_summary"
        >
          <Input
            v-model="formValidate.fault_summary"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 10}"
            :maxlength="2000"
            placeholder="总结一下本次的故障吧"
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
import { getFaultManagerList, operationFaultManager, GetOSSBucketInfo, UploadUrl } from "@/api/devops-tools";

export default {
  data() {
    return {
      formValidate: {
        fault_name: 'AWS服务器底层重启',
        fault_level: "",
        fault_state: "",
        fault_penson: '',
        fault_report: '',
        fault_start_time: '',
        fault_end_time: '',
        fault_duration: '',
        fault_issue: '',
        fault_summary: '',
      },
      ruleValidate: {
        fault_name: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur"
          }
        ],
        fault_level: [
          {
            required: true,
            message: "请选择一个级别",
            trigger: "blur"
          }
        ],
        fault_state: [
          {
            required: true,
            message: "请选择一个状态",
            trigger: "blur"
          }
        ],
        fault_penson: [
          {
            required: true,
            message: "故障责任人",
            trigger: "blur"
          }
        ],
        },
      columns: [
        {
          title: "故障名称",
          key: "fault_name",
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
            }, params.row.fault_name
            )
          }
        },
        {
          title: "故障状态",
          key: "fault_state",
          width: 130,
          align: "center",
          sortable: true
        },
        {
          title: "故障级别",
          key: "fault_level",
          width: 130,
          align: "center",
          sortable: true
        },
                {
          title: "故障责任人",
          key: "fault_penson",
          width: 130,
          align: "center",
          sortable: true
        },
        // {
        //   title: "处理人员",
        //   key: "processing_penson",
        // //   width: 200,
        //   align: "center",
        //   sortable: true
        // },
        {
          title: "故障报告",
          key: "fault_report",
        //   width: 200,
          align: "center",
          sortable: true,
          render: (h, params) => {
//            let url = 'https://shinezone-opendevops.oss-cn-shanghai.aliyuncs.com/fault/' + params.row.fault_report
           let url = 'https://' + this.OSSBucketName + '.oss' + '-' + this.OSSRegion + '.' + 'aliyuncs.com' + '/fault/' + params.row.fault_report
           return h('a', {
                    attrs: {
                         href: url,
                         target: '_black'
                     }
           }, params.row.fault_report)
           }
        },
        {
          title: "开始时间",
          key: "fault_start_time",
        //   width: 200,
          align: "center",
          sortable: true
        },
        {
          title: "结束时间",
          key: "fault_end_time",
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
                        this.editModal(params.row, "put", "编辑故障");
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
      file: null,
      loadingStatus: false,
      tableData: [],
      uploadList: [],
      OSSRegion: '',
      OSSBucketName: '',
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
      searchKey: "fault_name",
      searchValue: "",
      UploadUrl: "",
    };
  },
  methods: {
    // 获取故障管理信息
    getFaultManagerList (page, limit, key, value) {
        getFaultManagerList(page, limit, key, value).then(res => {
            if (res.data.code === 0) {
            this.pageTotal = res.data.count
            this.tableData = res.data.data
            } else {
            this.$Message.error(`${res.data.msg}`)
            }
        })
    },
    // 获取故障管理所用OSS区域和Bucketname
    GetOSSBucketInfo () {
        GetOSSBucketInfo().then(res => {
            if (res.data.code === 0) {
            // this.$Message.success(`${res.data.msg}`)
            this.OSSRegion = res.data.data.STORAGE_REGION
            this.OSSBucketName = res.data.data.STORAGE_NAME
            } else {
            this.$Message.error(`${res.data.msg}`)
            }
        })
    },
    handleMaxSize (file) {
        this.$Notice.warning({
            title: '文件大小超限',
            desc: '文件  ' + file.name + ' 太大，上传文件大小不能超过5M.'
        });
    },
    handleFormatError (file) {
        this.$Notice.warning({
            title: '文件格式不正确',
            desc: '文件:' + file.name + ' 格式不正确，请选择：jpg,jpeg,png,md,pptx,ppt,docx,doc,pdf等格式类型 '
        });
    },
    // handleUpload(file) {
    //     console.log(this.file)
    //     this.file = file
    //     this.formValidate.fault_report = this.file.name
    //     return true;
    // },
    //上传完成后的钩子
    handleSuccess (res, file) {
        // console.log(res)
        if (res.code === 0 ) {
            this.$Message.success(`${res.msg}`)
        } else {
            this.$Message.error(`${res.msg}`)
        }
    },
    handleBeforeUpload (file) {
        this.file = file
        this.formValidate.fault_report = this.file.name
        const check = this.uploadList.length < 1;
        if (!check) {
            this.$Notice.warning({
                title: '附件只支持上传一个'
            });
        }
        return check;

    },
    handleDetail (index) {
        this.$Modal.info({
            title: '故障信息',
            content: `故障名称：${this.tableData[index].fault_name}<br>故障状态：${this.tableData[index].fault_state}<br>故障等级：${this.tableData[index].fault_level}<br>处理人员：${this.tableData[index].processing_penson}<br>故障开始时间：${this.tableData[index].fault_start_time}<br>故障结束时间：${this.tableData[index].fault_end_time}<br>故障原因：${this.tableData[index].fault_issue}<br>故障总结：${this.tableData[index].fault_summary}`
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
                fault_name: paramsRow.fault_name,
                fault_level: paramsRow.fault_level,
                fault_state: paramsRow.fault_state,
                fault_penson: paramsRow.fault_penson,
                fault_report: paramsRow.fault_report,
                fault_start_time: paramsRow.fault_start_time,
                fault_end_time: paramsRow.fault_end_time,
                fault_issue: paramsRow.fault_issue,
                fault_summary: paramsRow.fault_summary,
        }
        } else {
            // post
            this.formValidate = {
                fault_name: '',
                fault_level: "",
                fault_state: "",
                fault_penson: '',
                fault_report: '',
                fault_start_time: '',
                fault_end_time: '',
                fault_issue: "",
                fault_summary: '',
            }
        }
    },
    handleSubmit (value) {
        this.$refs[value].validate((valid) => {
                    if (valid) {
                        setTimeout(() => {
                            operationFaultManager(this.formValidate, this.editModalData).then(res => {
                                if (res.data.code === 0) {

                                    this.$Message.success(`${res.data.msg}`)
                                    this.getFaultManagerList(
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
        if (confirm(`确定要删除 ${params.row.fault_name}`)) {
            operationFaultManager(
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
      this.getFaultManagerList(this.pageNum,this.pageSize,this.searchKey, this.searchValue);
    },
    changePage (value) {

        this.pageNum = value
        this.getFaultManagerList(
            this.pageNum,
            this.pageSize,
            this.searchKey,
            this.searchValue
          )
        },
    // 每页条数
    handlePageSize (value) {
        this.pageSize = value
        this.getFaultManagerList(1, this.pageSize, this.searchKey, this.searchValue)
    }
//   },
//   watch: {
//     searchValue(val) {
//       this.getFaultManagerList(this.pageNum,this.pageSize,this.searchKey, val);
//     }
  },

  mounted() {
    this.getFaultManagerList();
    this.GetOSSBucketInfo();
    this.UploadUrl = UploadUrl
    this.uploadList = this.$refs.upload.fileList;
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

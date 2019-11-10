<template>
<Card style="height:100%">
    <div class="search-con search-con-top">
      <Input clearable placeholder="输入任务ID搜索" class="search-input" v-model="searchValue"/>
      <Button @click="handleSearch" class="search-btn" type="primary">搜索</Button>
      <slot name="new_btn" ><Button type="primary"  @click="editModal('', 'post', '新建任务')" class="search-btn" >新建</Button></slot>
    </div>
  <Table size="small" ref="selection"  :columns="columns" :data="tableData"></Table>
  <div style="margin: 10px;overflow: hidden">
    <div style="float: left;">
      <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[10,15,25,35,50,100] show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
    </div>
  </div>
  <Modal v-model="modalMap.modalVisible"  :title="modalMap.modalTitle" :loading=true :footer-hide=true>
    <form-group :list="formList"  @on-submit-success="handleSubmit"></form-group>
  </Modal>
</Card>
</template>

<script>
import FormGroup from '_c/form-group'
import { getCronJobslist, operationCron } from '@/api/cron'
export default {
  components: {
    FormGroup
  },
  data () {
    return {
      columns: [
        {
          type: 'selection',
          key: '',
          width: 60,
          align: 'center'
        },
        {
          title: 'job id',
          key: 'job_id',
          minWidth: 80,
          sortable: true
        },
        {
          title: '可执行命令',
          key: 'cmd',
          minWidth: 150,
        },
        {
          title: '定时器（秒 分 时 日 月 周）',
          key: 'cron',
          minWidth: 100,
        },
        {
          title: '下一次执行时间',
          key: 'next_run_time',
          minWidth: 100,
        },
        {
          title: '状态',
          key: 'status',
          width: 80,
          align: 'center',
          render: (h, params, vm) => {
            return h('div', [
              h('i-switch', {
                props: {
                  size: 'large',
                  value: params.row.status === '0' // 控制开关的打开或关闭状态，官网文档属性是value
                },
                style: {
                  marginRight: '5px'
                },
                scopedSlots: {
                  open: () => h('span', '正常'),
                  close: () => h('span', '暂停')
                },
                on: {
                  'on-change': () => {
                    this.onSwitch(params)
                  }
                }
              })
            ])
          }
        },
        {
          title: '操作',
          key: 'handle',
          width: 170,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editModal(params.index, 'put', '编辑任务')
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.delData(params)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      tableData: [],
      pageTotal: 0, // 数据总数
      pageNum: 1, // 当前页码
      pageSize: 15, // 每页条数
      modalMap: {
        modalVisible: false,
        modalTitle: '创建任务'
      },
      formList: [],
      editModalData: '',
      //
      searchValue: ''
    }
  },
  methods: {
    getCronJobsList (value) {
      getCronJobslist(this.pageNum, this.pageSize, value).then(res => {
        if (res.data.code === 0) {
          this.pageTotal = res.data.count
          this.tableData = res.data.data
        } else {
          this.$Message.error(`获取失败，再试一次。`)
          // this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    editModal (index, meth, mtitle) {
      this.modalMap.modalVisible = true
      this.modalMap.modalTitle = mtitle
      this.editModalData = meth
      this.formList = [
        {
          name: 'job_id',
          type: 'i-input',
          value: meth === 'put' ? this.tableData[index].job_id : '',
          label: 'job id',
          placeholder:
            '请输入定时任务ID，建议使用有意义的英文命名，名且不要更改',
          rule: [{ required: true, message: 'job_id不能为空', trigger: 'blur' }]
        },
        {
          name: 'cmd',
          type: 'i-input',
          value: meth === 'put' ? this.tableData[index].cmd : '',
          label: '可执行命令',
          placeholder: '请输入要执行的命令，必须为可执行，注意环境变量',
          rule: [
            { required: true, message: '执行命令不能为空', trigger: 'blur' }
          ]
        },
        {
          name: 'cron',
          type: 'i-input',
          value: meth === 'put' ? this.tableData[index].cron : '',
          label: '任务定时器',
          placeholder:
            '定时器，参考linux crontab，（秒 分 时 日 月 周）',
          rule: [{ required: true, message: '定时器不能为空', trigger: 'blur' }]
        }
      ]
    },
    handleSubmit (value) {
      setTimeout(() => {
        operationCron(value.data, this.editModalData).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.getCronJobsList(this.searchValue)
            this.modalMap.modalVisible = false
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }, 1000)
    },
    // 删除
    delData (params) {
      if (confirm(`确定要删除 ${params.row.job_id}`)) {
        operationCron( { job_id: params.row.job_id}, 'delete' ).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.tableData.splice(params.index, 1)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }
    },
    // 调用开关
    onSwitch (params) {
      operationCron(
        {
          job_id: params.row.job_id
        },
        'patch'
      ).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    changePage (value) {
      this.pageNum = value
      this.getCronJobsList(
        this.searchValue
      )
    },
    // 每页条数
    handlePageSize (value) {
      this.pageSize = value
      this.getCronJobsList( this.searchValue )
    },
    handleSearch () {
      this.getCronJobsList(
        this.searchValue
      )
    }
  },
  mounted () {
    this.getCronJobsList()
  }
}
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
      width: 250px;
      margin-left: 2px;
    }
    &-btn {
      margin-left: 2px;
    }
  }
}
</style>

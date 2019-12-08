<template>
  <Card style="height:100%">
      <div class="search-con search-con-top">
        <Input class="search-input" v-model="searchValue" clearable :maxlength='50' placeholder="输入关键字搜索"/>

        <ButtonGroup class="search-btn">
          <Button @click="handlerExportData()"><Icon type="ios-download-outline"></Icon>导出数据</Button>
          <Button @click="editModal('', 'post', '新建参数')" >新建参数</Button>
        </ButtonGroup>
      </div>
    <Table size="small" ref="selection" :columns="columns" :data="tableData"/>

    <div style="margin: 10px;overflow: hidden">
        <div style="float: left;">
            <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" show-total show-sizer :page-size-opts="[10,15,20,50,500,1000]"
          @on-change="changePage" @on-page-size-change="handlePageSize" />
        </div>
    </div>

    <Modal v-model="modalData.modalVisible"  :title="modalData.modalTitle" :loading=true :footer-hide=true>
      <form-group :list="formList"  @on-submit-success="handleSubmit"></form-group>
    </Modal>
  </Card>
</template>

<script>
import FormGroup from '_c/form-group'
import { getArgslist, operationArgs } from '@/api/scheduler/scheduler-task.js'
export default {
  components: {
    FormGroup
  },
  data () {
    return {
      columns: [
        {
          title: 'ID',
          key: 'args_id',
          width: 80
        },
        {
          title: '参数名称',
          key: 'args_name',
          minWidth: 120,
        },
        {
          title: '参数值',
          key: 'args_self',
          minWidth: 120,
        },
        {
          title: '创建者',
          key: 'creator',
          minWidth: 100,
        },
        {
          title: '更新时间',
          key: 'update_time',
          sortable: true,
          minWidth: 160,
        },
        {
          title: '#',
          key: 'handle',
          width: 150,
          render: (h, params) => {
            return h('div', [
              h(
                'a',
                {
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editModal(params.index, 'put', '编辑参数')
                    }
                  }
                },
                '编辑'
              ),
              h(
                'a',
                {
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
      modalData: {
        modalVisible: false,
        modalTitle: '新建'
      },
      formList: [],
      editModalData: '',
      //
      pageTotal: 0, // 数据总数
      pageNum: 1, // 当前页码
      pageSize: 15, // 每页条数
      searchValue: '',
    }
  },
  methods: {
    getArgsList() {
      getArgslist(this.searchValue).then(res => {
        if (res.data.code === 0) {
          this.pageTotal = res.data.count
          this.tableData = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    editModal (index, meth, mtitle) {
      this.modalData.modalVisible = true
      this.modalData.modalTitle = mtitle
      this.editModalData = meth
      this.formList = [
        {
          name: 'args_id',
          value: meth === 'put' ? this.tableData[index].args_id : ''
        },
        {
          name: 'args_name',
          type: 'i-input',
          value: meth === 'put' ? this.tableData[index].args_name : '',
          label: '参数名称',
          placeholder: '请输入一个有意义的名称，某些场景会显示名称，可修改',
          rule: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
        },
        {
          name: 'args_self',
          type: 'i-input',
          value: meth === 'put' ? this.tableData[index].args_self : '',
          label: '参数值',
          placeholder: '请输入参数值，不强制，主要用于参数对照',
          rule: [
            { required: true, message: '执行命令不能为空', trigger: 'blur' }
          ]
        }
      ]
    },
    handleSubmit (value) {
      setTimeout(() => {
        operationArgs(value.data, this.editModalData).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.getArgsList()
            this.modalData.modalVisible = false
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }, 1000)
    },
    // 删除
    delData (params) {
      if (confirm(`确定要删除 ${params.row.args_name}`)) {
        operationArgs({ args_id: params.row.args_id }, 'delete').then(
          res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
              this.tableData.splice(params.index, 1)
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          }
        )
      }
    },
     // 切换页码
    changePage(value){
      this.pageNum = value
      this.handlerGetServerList()
    },    
    handlePageSize(value){
       this.pageSize = value
       this.handlerGetServerList()
    }, 
     //导出数据
    handlerExportData(){
      let nowTime = Date.parse(new Date())
      this.$refs.selection.exportCsv({
          filename: `参数信息-${nowTime}`,
       });
    }
  },
  watch:{
    searchValue (val) {
      this.getArgsList()
    },
   },
  mounted () {
    this.getArgsList()
  }
}
</script>

<style lang="less" scoped>
  .search-con {
    padding: 5px 0;
    .search {
      &-col {
        display: inline-block;
        width: 200px;
      }
      &-input {
        display: inline-block;
        width: 350px;
        margin-left: 2px;
      }
      &-btn {
        margin-right: 0px;
        float:right;
      }
    }
  }
</style>

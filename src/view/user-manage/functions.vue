<template>
  <div style="height:100%">
    <Card>

      <div class="search-con search-con-top">
        <Select v-model="searchKey" class="search-col">
          <Option v-for="item in columns" v-if="item.key !== 'handle' && item.key !== 'status' && item.key !== ''" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
        </Select>
        <Input @on-change="handleClear" clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
        <Button @click="handleSearch" class="search-btn" type="primary">搜索</Button>
        <slot name="new_btn" ><Button type="primary"  @click="editModal('', 'post', '新建权限')" class="search-btn" >新建</Button></slot>
      </div>

      <Table size="small" ref="selection" border :columns="columns" :data="tableData"></Table>
      
      <div style="margin: 10px;overflow: hidden">
        <div style="float: left;">
          <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[10,15,25,35,50,100] show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
        </div>
      </div>

      <Modal v-model="modalMap.modalVisible"  :title="modalMap.modalTitle" :loading=true :footer-hide=true>
        <form-group :list="formList"  @on-submit-success="handleSubmit"></form-group>
      </Modal>
    </Card>
  </div>
</template>

<script>
import FormGroup from '_c/form-group'
import { getFuncslist, operationFunc } from '@/api/user'
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
          title: '权限名称',
          key: 'func_name',
          align: 'center',
          sortable: true
        },
        {
          title: '请求方法',
          key: 'method_type'
        },
        {
          title: '请求路径',
          key: 'uri'
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
                  // type: "primary",
                  value: params.row.status === '0' // 控制开关的打开或关闭状态，官网文档属性是value
                },
                style: {
                  marginRight: '5px'
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
          title: '更新时间',
          key: 'utime'
        },
        {
          title: '添加时间',
          key: 'ctime'
        },
        {
          title: '操作',
          key: 'handle',
          width: 150,
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
                      this.editModal(params.index, 'put', '编辑权限')
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
        modalTitle: '创建用户'
      },
      formList: [],
      editModalData: '',
      //
      searchKey: '',
      searchValue: ''
    }
  },
  methods: {
    getFuncsList (page, limit, key, value) {
      getFuncslist(page, limit, key, value).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
          this.pageTotal = res.data.count
          this.tableData = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    editModal (index, meth, mtitle) {
      this.modalMap.modalVisible = true
      this.modalMap.modalTitle = mtitle
      this.editModalData = meth
      this.formList = [
        {
          name: 'func_id',
          value: meth === 'put' ? this.tableData[index].func_id : ''
        },
        {
          name: 'func_name',
          type: 'i-input',
          value: meth === 'put' ? this.tableData[index].func_name : '',
          label: '权限名称',
          rule: [
            { required: true, message: '权限名称不能为空', trigger: 'blur' }
          ]
        },
        {
          name: 'method_type',
          type: 'i-select',
          value: meth === 'put' ? this.tableData[index].method_type : '',
          label: '请求方法',
          children: {
            type: 'i-option',
            list: [
              { value: 'GET', title: 'GET' },
              { value: 'POST', title: 'POST' },
              { value: 'PUT', title: 'PUT' },
              { value: 'PATCH', title: 'PATCH' },
              { value: 'DELETE', title: 'DELETE' },
              { value: 'ALL', title: 'ALL' }
            ]
          },
          rule: [
            { required: true, message: '请求方法不能为空', trigger: 'blur' }
          ]
        },
        {
          name: 'uri',
          type: 'i-input',
          maxlength: 100,
          value: meth === 'put' ? this.tableData[index].uri : '',
          label: '请求路径',
          rule: [{ required: true, message: 'URI不能为空', trigger: 'blur' }]
        }
      ]
    },
    handleSubmit (value) {
      setTimeout(() => {
        operationFunc(value.data, this.editModalData).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.getFuncsList(
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
    },
    // 删除
    delData (params) {
      if (confirm(`确定要删除权限 ${params.row.func_name}`)) {
        operationFunc(
          {
            func_id: params.row.func_id
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
    // 调用开关
    onSwitch (params) {
      operationFunc(
        {
          func_id: params.row.func_id
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
      this.getFuncsList(
        this.pageNum,
        this.pageSize,
        this.searchKey,
        this.searchValue
      )
    },
    // 每页条数
    handlePageSize (value) {
      this.pageSize = value
      this.getFuncsList(1, this.pageSize, this.searchKey, this.searchValue)
    },
    handleClear (e) {
      if (e.target.value === '') this.tableData = this.value
    },
    handleSearch () {
      this.pageNum = 1
      this.getFuncsList(
        this.pageNum,
        this.pageSize,
        this.searchKey,
        this.searchValue
      )
    }
  },
  mounted () {
    this.getFuncsList(this.pageNum, this.pageSize)
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
      width: 200px;
      margin-left: 2px;
    }
    &-btn {
      margin-left: 2px;
    }
  }
}
</style>

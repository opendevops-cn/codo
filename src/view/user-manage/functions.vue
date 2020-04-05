<template>
  <div style="height:100%">
    <Card>

      <div class="search-con search-con-top">
        <Select v-model="searchKey" class="search-col">
          <Option v-for="item in columns" v-if="item.key !== 'handle' && item.key !== 'status' && item.key !== ''" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
        </Select>
        <Input @on-change="handleClear" clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
        <Button @click="handleSearch" type="primary">搜索</Button>
        <slot name="new_btn" ><Button  @click="handlerAdd" class="search-btn" >添加权限</Button></slot>
      </div>

      <Table size="small" ref="selection" :columns="columns" :data="tableData"></Table>
      
      <div style="margin: 10px;overflow: hidden">
        <div style="float: left;">
          <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[10,15,25,50,1000] show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
        </div>
      </div>
      
      <template>
         <func-edit :modalEditData="modalEditData" :funcData="funcData" @modal-close="handlerModalClose"></func-edit>
      </template>
   
    </Card>
  </div>
</template>

<script>
import { getFuncslist, operationFunc } from '@/api/user'
import funcEdit from './components/func-edit'
export default {
  components: {
    funcEdit
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
          title: '所在应用',
          key: 'app_code',
          sortable: true
        },
        {
          title: '权限名称',
          key: 'func_name',
          sortable: true
        },
        {
          title: '请求方法',
          key: 'method_type',
            render: (h, params) => {
            let method_type = params.row.method_type
            if (method_type == 'ALL') {
              return h("div", [
                h(
                  "p",
                  {
                    style: {
                      color: "black"
                    }
                  },
                  'GET, POST, PUT, PATCH, DELETE'
                )
              ]);
             } else if (method_type == 'GET') {
              return h("div", [
                h(
                  "p",
                  {
                    style: { color: "#61affe"}
                  },
                  params.row.method_type
                )
              ]);
             } else if (method_type == 'POST') {
              return h("div", [
                h(
                  "p",
                  {
                    style: { color: "#49cc90"}
                  },
                  params.row.method_type
                )
              ]);
            } else if (method_type == 'PUT') {
              return h("div", [
                h(
                  "p",
                  {
                    style: { color: "#fca130"}
                  },
                  params.row.method_type
                )
              ]);
            } else if (method_type == 'PATCH') {
              return h("div", [
                h(
                  "p",
                  {
                    style: { color: "#50e3c2"}
                  },
                  params.row.method_type
                )
              ]);
            } else {
              return h("div", [
                h(
                  "p",
                  {
                    style: { color: "#f93e3e"}
                  },
                  params.row.method_type
                )
              ]);
            }
          }
        },
        {
          title: '请求路径',
          key: 'uri'
        },
        {
          title: '状态',
          key: 'status',
          width: 100,
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
          key: 'utime',
          width: 170,
        },
        // {
        //   title: '添加时间',
        //   key: 'ctime'
        // },
        {
          title: '#',
          key: 'handle',
          width: 150,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.handlerEdit(params.row)
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
      funcData: {},
      modalEditData: {
      },
      //
      searchKey: '',
      searchValue: ''
    }
  },
  methods: {
    handlerGetFuncsList () {
      getFuncslist( this.pageNum,  this.pageSize,  this.searchKey,  this.searchValue).then(res => {
        if (res.data.code === 0) {
          this.pageTotal = res.data.count
          this.tableData = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handlerAdd() {
      this.funcData = {
          func_name: '',
          method_type: '',
          app_code: '',
          uri: '',
          parameters:'暂无',
      },
      this.modalEditData = {
        show: true,
        title: '添加API信息，用来展示后端权限',
        action: 'post'
      }
    },
    handlerEdit(paramsRow) {
      this.funcData = paramsRow
      this.modalEditData = {
        show: true,
        title: '编辑API详细信息',
        action: 'put'
      }
    },
    handlerModalClose() {
      this.handlerGetFuncsList()
    },
    // handleSubmit (value) {
    //   setTimeout(() => {
    //     operationFunc(value.data, this.editModalData).then(res => {
    //       if (res.data.code === 0) {
    //         this.$Message.success(`${res.data.msg}`)
    //         this.handlerGetFuncsList()
    //         this.modalMap.modalVisible = false
    //       } else {
    //         this.$Message.error(`${res.data.msg}`)
    //       }
    //     })
    //   }, 1000)
    // },
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
      operationFunc( {func_id: params.row.func_id}, 'patch').then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    changePage (value) {
      this.pageNum = value
      this.handlerGetFuncsList()
    },
    // 每页条数
    handlePageSize (value) {
      this.pageSize = value
      this.pageNum = 1
      this.handlerGetFuncsList()
    },
    handleClear (e) {
      if (e.target.value === '') this.tableData = this.value
    },
    handleSearch () {
      this.pageNum = 1
      this.handlerGetFuncsList()
    }
  },
  mounted () {
    this.handlerGetFuncsList()
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

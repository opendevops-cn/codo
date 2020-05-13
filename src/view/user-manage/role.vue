<template>
<div style="height:100%">
  <Card>
    <Row>
       <Col :xs="24" :sm="12" :md="12" :lg="12" :xxl="15">
         <tables ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-search-table="handleSearchTable">
              <div slot="new_btn" class="search-con search-col">
              <Button type="info" class="search-btn"  @click="showModal">新建</Button>
              </div>
          </tables>

          <div style="margin: 10px; overflow: hidden">
              <div style="float: left;">
               <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[10,15,50,100] show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
             </div>
           </div>

       </Col>
       <Col :xs="23" :md="11" :lg="11" :xxl="8" offset="1" class="split-pane">
         <Transfer
                    :list-style="listStyle"
                    :titles="tranferTitles"
                    :data="source"
                    :target-keys="targetKeys"
                    filterable
                    :filter-method="filterMethod"
                    @on-change="handleChange">
                  </Transfer>
       </Col>
    </Row>
  </Card>
  <Modal  v-model="modalMap.modalVisible"  :title="modalMap.modalTitle" :loading=true :footer-hide=true>
    <form-group :list="formList"  @on-submit-success="handleSubmit"></form-group>
  </Modal>
</div>
</template>

<script>
import Icons from '_c/icons'
import Tables from '_c/tables'
import FormGroup from '_c/form-group'
import {
  getuserlist,
  getrolelist,
  operationRole,
  getUserByRole,
  operationRoleUser,
  operationRoleComponent,
  operationRoleMenu,
  operationRoleFunc,
  getComponentslist,
  getComponentByRole,
  getMenuslist,
  getMenusByRole,
  getFuncslist,
  getFuncsByRole
} from '@/api/user'
export default {
  components: {
    Icons,
    Tables,
    FormGroup
  },
  data () {
    return {
      // 搜索
      searchKey: '',
      searchValue: '',
      // 分割
      offset: 0.5,
      //
      source: [],
      targetKeys: [],
      listStyle: {
        // width: "250px",
        height: '660px'
      },
      tranferTitles: ['所有列表', '已有列表'],
      role_id: '',
      // 穿梭框里面编辑的内容
      editTransfer: '',
      // 弹出框
      modalMap: {
        modalVisible: false,
        modalTitle: '创建角色'
      },
      // 分页数据
      tableData: [],
      pageTotal: 0, // 数据总数
      pageNum: 1, // 当前页码
      pageSize: 15, // 每页条数
      formList: [
        {
          name: 'role_name',
          type: 'i-input',
          value: 'woshiceshi',
          label: '角色名称',
          rule: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ]
        }
      ],
      columns: [
        // { title: "角色ID", key: "role_id", width: 80, sortable: true },
        { title: '角色', key: 'role_name',  minWidth: 120,  sortable: true },
        {
          title: '状态',
          key: 'status',
          minWidth: 100,
          render: (h, params, vm) => {
            return h('div', [
              h('i-switch', {
                props: {
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
          title: '#',
          key: 'handle',
          minWidth: 250,
          button: [
            (h, params, vm) => {
              return h('ButtonGroup', [
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
                        this.getUserInfoByRole(params.row.role_id)
                      }
                    }
                  },
                  '用户'
                ),
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
                        this.getComponentsInfoByRole(params.row.role_id)
                      }
                    }
                  },
                  '组件'
                ),
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
                        this.getMenusInfoByRole(params.row.role_id)
                      }
                    }
                  },
                  '菜单'
                ),
                h(
                  'Button',
                  {
                    props: {
                      size: 'small'
                    },
                    style: {
                      marginRight: '10px'
                    },
                    on: {
                      click: () => {
                        this.getFuncInfoByRole(params.row.role_id)
                      }
                    }
                  },
                  '权限'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    style: {
                      marginRight: '10px'
                    },
                    on: {
                      click: () => {
                        this.handleDelete(params)
                      }
                    }
                  },
                  '删除'
                )
              ])
            }
          ]
        }
      ]
    }
  },
  methods: {
    // 获取角色列表
    getRoleList (page, limit, key, value) {
      getrolelist(page, limit, key, value).then(res => {
        if (res.data.code === 0) {
          this.pageTotal = res.data.count
          this.tableData = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 删除角色
    handleDelete (params) {
      if (confirm(`确定要删除 ${params.row.role_name}`)) {
        operationRole({ role_id: params.row.role_id }, 'delete')
          .then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
              this.tableData.splice(params.index, 1)
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
          .catch(err => {
            this.$Message.error(err)
          })
      }
    },
    // 添加
    handleSubmit (value) {
      setTimeout(() => {
        operationRole(value.data, 'post').then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.getRoleList(this.pageNum, this.pageSize)
            this.modalMap.modalVisible = false
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }, 1000)
    },
    handleSearchTable (key, val) {
      this.searchKey = key
      this.searchValue = val
      this.getRoleList(
        this.pageNum,
        this.pageSize,
        this.searchKey,
        this.searchValue
      )
    },
    // 弹出对话框
    showModal () {
      this.modalMap.modalVisible = true
    },
    // 调用开关
    onSwitch (editData) {
      const EditData = {
        role_id: editData.row.role_id,
        key: editData.column.key
      }
      operationRole(EditData, 'patch').then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    changePage (value) {
      this.pageNum = value
      this.getRoleList(this.pageNum, this.pageSize)
    },

    // 每页条数
    handlePageSize (value) {
      this.pageSize = value
      this.getRoleList(1, this.pageSize)
    },
    //
    getUserInfoByRole (value) {
      this.role_id = value
      this.tranferTitles = ['所有用户', '已有用户']
      this.editTransfer = 'user'
      let allData = []
      let targetData = []
      getuserlist('1', '20000').then(res => {
        if (res.data.code === 0) {
          res.data.data.forEach(item => {
            allData.push({
              key: item.user_id.toString(),
              label: item.username.toString()
            })
          })
          this.$Message.success(`${res.data.msg}`)
          this.source = allData
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
      getUserByRole(value).then(res => {
        if (res.data.code === 0) {
          res.data.data.forEach(item => {
            targetData.push(item.user_id.toString())
          })
          this.targetKeys = targetData
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 获取组件列表
    getComponentsInfoByRole (value) {
      this.role_id = value
      this.tranferTitles = ['所有组件', '已有组件']
      this.editTransfer = 'component'
      let allData = []
      let targetData = []
      getComponentslist().then(res => {
        if (res.data.code === 0) {
          res.data.data.forEach(item => {
            allData.push({
              key: item.comp_id.toString(),
              label: item.component_name.toString()
            })
          })
          this.source = allData
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
      getComponentByRole(value).then(res => {
        if (res.data.code === 0) {
          res.data.data.forEach(item => {
            targetData.push(item.comp_id.toString())
          })
          this.targetKeys = targetData
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 获取菜单列表
    getMenusInfoByRole (value) {
      this.role_id = value
      this.tranferTitles = ['所有菜单', '已有菜单']
      this.editTransfer = 'menu'
      let allData = []
      let targetData = []
      getMenuslist().then(res => {
        if (res.data.code === 0) {
          res.data.data.forEach(item => {
            allData.push({
              key: item.menu_id.toString(),
              label: item.menu_name.toString()
            })
          })
          this.source = allData
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
      getMenusByRole(value).then(res => {
        if (res.data.code === 0) {
          res.data.data.forEach(item => {
            targetData.push(item.menu_id.toString())
          })
          this.targetKeys = targetData
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 获取后端权限列表
    getFuncInfoByRole (value) {
      this.role_id = value
      this.tranferTitles = ['所有权限', '已有权限']
      this.editTransfer = 'func'
      let allData = []
      let targetData = []
      getFuncslist().then(res => {
        if (res.data.code === 0) {
          res.data.data.forEach(item => {
            allData.push({
              key: item.func_id.toString(),
              label: item.func_name.toString()
            })
          })
          this.source = allData
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
      getFuncsByRole(value).then(res => {
        if (res.data.code === 0) {
          res.data.data.forEach(item => {
            targetData.push(item.func_id.toString())
          })
          this.targetKeys = targetData
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handleChange (newTargetKeys, direction, moveKeys) {
      this.targetKeys = newTargetKeys
      let methodType = "post"
      if (direction === "left") {
          methodType = "delete"
      }
      if (this.editTransfer === 'user') {  
        operationRoleUser( { role_id: this.role_id, user_list: moveKeys }, methodType
          ).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
      } else if (this.editTransfer === 'component') {
        operationRoleComponent( { role_id: this.role_id, comp_list: moveKeys }, methodType
          ).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
      } else if (this.editTransfer === 'menu') {
        operationRoleMenu({ role_id: this.role_id, menu_list: moveKeys}, methodType
        ).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
      } else if (this.editTransfer === 'func') {
        operationRoleFunc( { role_id: this.role_id, func_list: moveKeys }, methodType
          ).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
      } else {
        this.$Message.error('你在修改个锤子呀')
      }
    },
    filterMethod (data, query) {
      return data.label.indexOf(query) > -1
    }
  },
  mounted () {
    this.getRoleList(this.pageNum, this.pageSize)
  }
}
</script>

<style>
.split {
  height: 760px;
  border: 1px solid #dcdee2;
}
.split-pane {
  padding: 10px;
}
</style>

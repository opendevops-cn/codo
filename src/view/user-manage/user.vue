<template>
  <div style="height:100%">
    <Card>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns"
       @on-delete="handleDelete" @on-save-edit="handleInput"
       @on-search-table="handleSearchTable"
       @on-selection-change="handleSelectChange">
        <div slot="new_btn" class="search-con search-col">
          <Button v-if="rules.new_user_btn" type="info" class="search-btn"  @click="showModal">新建用户</Button>
          <Button v-if="rules.reset_pwd_btn" type="error" class="search-btn"  @click="handleResetPWD">重置密码</Button>
          <Button v-if="rules.reset_mfa_btn" type="error" class="search-btn"  @click="handleResetMFA">重置MFA</Button>
          <Button v-if="rules.get_token_btn" type="error" class="search-btn"  @click="handleToken">长期Token</Button>
        </div>
      </tables>
      <div style="margin: 10px; overflow: hidden">
        <div style="float: left;">
            <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[10,15,25,35,50,100] show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
        </div>
    </div>
    </Card>
      <Modal  v-model="modalMap.modalVisible"  :title="modalMap.modalTitle" :loading=true :footer-hide=true>
        <form-group :list="formList"  @on-submit-success="handleSubmit"></form-group>
      </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import FormGroup from '_c/form-group'
import { mapState } from 'vuex'
import {
  getuserlist,
  newuser,
  deluser,
  updateuser,
  patchuser,
  resetMFA,
  resetPassword,
  getToken
} from '@/api/user'
export default {
  components: {
    Tables,
    FormGroup
  },
  data () {
    return {
      // 弹出框
      modalMap: {
        modalVisible: false,
        modalTitle: '创建用户'
      },
      // 渲染form数据
      formList: [
        {
          name: 'username',
          type: 'i-input',
          value: '',
          label: '账户名称',
          rule: [
            { required: true, message: '账户名称不能为空', trigger: 'blur' }
          ]
        },
        {
          name: 'nickname',
          type: 'i-input',
          value: '',
          label: '用户姓名',
          rule: [
            { required: true, message: '用户姓名不能为空', trigger: 'blur' }
          ]
        },
        {
          name: 'department',
          type: 'i-input',
          value: '',
          label: '部门',
          rule: [{ required: true, message: '部门不能为空', trigger: 'blur' }]
        },
        {
          name: 'wechat',
          type: 'i-input',
          value: '',
          label: '微信号码',
          rule: [
            { required: true, message: '微信号码不能为空', trigger: 'blur' }
          ]
        },
        {
          name: 'tel',
          type: 'i-input',
          value: '',
          label: '手机号码',
          rule: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            {
              type: 'string',
              min: 11,
              max: 11,
              message: '必须为手机号码',
              trigger: 'blur'
            }
          ]
        },
        {
          name: 'no',
          type: 'i-input',
          value: '',
          label: '工号',
          rule: [{ required: true, message: '工号不能为空', trigger: 'blur' }]
        },
        {
          name: 'email',
          type: 'i-input',
          value: '',
          label: '邮箱',
          rule: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            {
              type: 'email',
              message: '必须为邮箱格式',
              trigger: 'blur'
            }
          ]
        }
      ],
      columns: [
        { type: 'selection', title: '', key: '', width: 60, align: 'center' },
        { title: '用户名', key: 'username', sortable: true },
        { title: '昵称', key: 'nickname', sortable: true },
        { title: '部门', key: 'department', editable: true },
        { title: '手机', key: 'tel', editable: true },
        { title: '邮箱', key: 'email', editable: true },
        { title: '登录IP', key: 'last_ip' },
        {
          title: '最后登录',
          key: 'last_login',
          align: 'center',
          sortable: true
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
          title: '操作',
          align: 'center',
          width: 80,
          key: 'handle',
          // options: ["delete"],
          button: [
            (h, params, vm) => {
              return h(
                'Poptip',
                {
                  props: {
                    confirm: true,
                    title: '你确定要删除吗?'
                  },
                  on: {
                    'on-ok': () => {
                      vm.$emit('on-delete', params)
                      vm.$emit(
                        'input',
                        params.tableData.filter(
                          (item, index) => index !== params.row.initRowIndex
                        )
                      )
                    }
                  }
                },
                [
                  // h('Button', '自定义删除'),
                  h(
                    'Button',
                    {
                      props: {
                        size: 'small'
                      }
                    },
                    '删除'
                  )
                ]
              )
            }
          ]
        }
      ],
      // 搜索数据
      searchKey: '',
      searchValue: '',
      // 分页数据
      tableData: [],
      pageTotal: 0, // 数据总数
      pageNum: 1, // 当前页码
      pageSize: 15, // 每页条数
      // select
      selectionList: []
    }
  },
  computed: {
    ...mapState({
      rules: state => state.user.rules
    })
  },
  methods: {
    handleDelete (params) {
      deluser({ user_id: params.row.user_id }).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    changePage (value) {
      this.pageNum = value
      this.getUserList(
        this.pageNum,
        this.pageSize,
        this.searchKey,
        this.searchValue
      )
    },
    // 每页条数
    handlePageSize (value) {
      this.pageSize = value
      this.getUserList(1, this.pageSize, this.searchKey, this.searchValue)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    },
    handleSearchTable (key, val) {
      this.pageNum = 1
      this.searchKey = key
      this.searchValue = val
      this.getUserList(
        this.pageNum,
        this.pageSize,
        this.searchKey,
        this.searchValue
      )
    },
    // 获取用户列表
    getUserList (page, limit, key, value) {
      getuserlist(page, limit, key, value).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
          this.pageTotal = res.data.count
          this.tableData = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handleSubmit (value) {
      setTimeout(() => {
        newuser(value.data).then(res=> {
            const data = res.data
            if (res.data.code === 0) {
              this.$Message.info(`${data.msg}`)
              // 重新获取数据
              this.getUserList(this.pageNum, this.pageSize)
            } else {
              this.$Message.error(`${data.msg}`)
            }
          }).catch(err => {
            this.$Message.error(err)
          })
        this.modalMap.modalVisible = false
      }, 1000)
    },
    handleInput (editData) {
      // 行内编辑
      const EditData = {
        user_id: editData.row.user_id,
        key: editData.column.key,
        value: editData.value
      }
      updateuser(EditData).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 弹出对话框
    showModal () {
      this.modalMap.modalVisible = true
    },
    // 调用开关
    onSwitch (editData) {
      const EditData = {
        user_id: editData.row.user_id,
        key: editData.column.key
      }
      patchuser(EditData).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handleSelectChange (val) {
      let userList = []
      val.forEach(item => {
        userList.push(item.user_id)
      })
      this.selectionList = userList
    },
    handleResetPWD () {
      if (!this.selectionList.length) {
        this.$Message.error('你选中了个锤子')
      } else {
        if (confirm(`确定要重置选用户的密码`)) {
          resetPassword({ user_list: this.selectionList }).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        }
      }
    },
    handleResetMFA () {
      if (!this.selectionList.length) {
        this.$Message.error('你选中了个锤子')
      } else {
        if (confirm(`确定要重置选中用户的MFA`)) {
          resetMFA({ user_list: this.selectionList }).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        }
      }
    },
    handleToken () {
      if (!this.selectionList.length) {
        this.$Message.error('必须也只能选择一个用户')
      } else {
        if (confirm(`选中用户的toekn会发送到你邮箱`)) {
          getToken({ user_list: this.selectionList }).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        }
      }
    }
  },
  mounted () {
    this.getUserList(this.pageNum, this.pageSize)
  }
}
</script>

<style lang="less" scoped>
.search-con {
  padding: 10px 0;
  .search {
    &-col {
      display: inline-block;
      width: 400px;
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

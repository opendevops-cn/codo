<template>
  <div style="height:100%; background: #f8f8f9">
    <Card>
      <Alert show-icon>小提示：如果使用代理，则任务会通过代理主机来访问目标主机，例如：在ssh模式下任务系统会ssh到代理主机下执行任务，在salt模式下会查询代理下的salt master信息</Alert>
      <div class="search-con search-con-top">
        <Button type="primary" @click="editModal('post', '添加代理')" class="search-btn">添加代理</Button>
      </div>
      <Table size="small" height="718" :columns="columns" :data="tableData"></Table>
      <Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :loading=true :footer-hide=true>
        <form-group :list="formList" @on-submit-success="handleSubmit"></form-group>
      </Modal>
    </Card>
  </div>
</template>

<script>
import FormGroup from '_c/form-group'
import {getProxylist, operationProxy} from '@/api/task-other'
export default {
  components: {
    FormGroup
  },
  data () {
    return {
      columns: [
        {
          title: '代理主机',
          key: 'proxy_host',
          align: 'center',
          width: 150,
          sortable: true
        },
        {
          title: 'inception',
          key: 'inception',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('a',{
                  on: {
                    click: () => {
                      this.editModal('put', '编辑Inception', params.row.id, params.row.inception, 'inception')
                    }
                  }
                },
                '编辑'
              )
            ])
          }
        },
        {
          title: 'Salt',
          key: 'salt',
          align: 'center',
           render: (h, params) => {
            return h('div', [
              h('a',{
                  on: {
                    click: () => {
                      this.$Message.info('这是个保留字段')
                      // this.editModal('put', '编辑Salt', params.row.id, params.row.salt, 'salt')
                    }
                  }
                },
                '编辑'
              )
            ])
          }
        },
        {
          title: '描述',
          key: 'detail',
          width: 200,
          align: 'center'
        },
        {
          title: '删除',
          key: 'handle',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [
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
      modalMap: {
        modalVisible: false,
        modalTitle: '新建'
      },
      formList: [],
      editModalData: '',
      editID: null,
      editType: '',
    }
  },
  methods: {
    getProxyList() {
      getProxylist().then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    editModal (meth, mtitle, thisID, rowInfo, editType ) {
      this.modalMap.modalVisible = true
      this.modalMap.modalTitle = mtitle
      this.editModalData = meth
      this.editID = thisID
      this.editType = editType
      if (editType === 'inception') {
        let data =  JSON.parse(rowInfo)
        this.formList = [
          {
          name: 'host',
          type: 'i-input',
          value: data ? data.host : '',
          label: 'Inception主机',
          maxlength: 50,
          placeholder: '请输入inception主机地址',
          rule: [{ required: true, message: 'inception主机不能为空', trigger: 'blur' }]
        },{
          name: 'port',
          type: 'i-input',
          value: data ? data.port : '',
          label: 'Inception端口',
          maxlength: 5,
          placeholder: '请输入inception端口',
          rule: [{ required: true, message: 'inception端口不能为空', trigger: 'blur' }]
        }
        // },{
        //   name: 'back_host',
        //   type: 'i-input',
        //   value: data ? data.back_host : '',
        //   label: '备份库主机',
        //   maxlength: 50,
        //   placeholder: '请输入备份库主机地址',
        //   rule: [{ required: true, message: '备份库主机不能为空', trigger: 'blur' }]
        // },{
        //   name: 'back_port',
        //   type: 'i-input',
        //   value: data ? data.back_port : 3306,
        //   label: '备份库端口',
        //   maxlength: 5,
        //   placeholder: '请输入备份库端口',
        //   rule: [{ required: true, message: '备份库端口不能为空', trigger: 'blur' }]
        // },{
        //   name: 'back_user',
        //   type: 'i-input',
        //   value: data ? data.back_user : '',
        //   label: '备份库用户',
        //   maxlength: 10,
        //   placeholder: '请输入备份库用户',
        //   rule: [{ required: true, message: '备份库用户不能为空', trigger: 'blur' }]
        // },{
        //   name: 'back_pwd',
        //   type: 'i-input',
        //   value: data ? data.back_pwd : '',
        //   label: '备份库密码',
        //   maxlength: 25,
        //   placeholder: '请输入备份库密码'
        // }
        ]
      }else{
       this.formList = [
        {
          name: 'proxy_host',
          type: 'i-input',
          value: '',
          label: '代理主机',
          maxlength: 70,
          placeholder: '请输入代理主机的名称',
          rule: [{ required: true, message: '代理主机为空', trigger: 'blur' }]
        },
        {
          name: 'detail',
          type: 'i-input',
          value: '',
          maxlength: 20,
          label: '备注信息',
          placeholder: '请输入备注信息，方便查阅'
        }
      ]
      }
    },
    handleSubmit(value) {
      setTimeout(() => {
        value.data['id'] = this.editID
        value.data['edit_type'] = this.editType
        operationProxy(value.data, this.editModalData).then(
          res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`);
              this.getProxyList();
              this.modalMap.modalVisible = false;
            } else {
              this.$Message.error(`${res.data.msg}`);
            }
          }
        );
      }, 1000);
    },
    // 删除
    delData (params) {
      if (confirm(`确定要删除 ${params.row.proxy_host}`)) {
        operationProxy({ proxy_id: params.row.id }, 'delete').then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.tableData.splice(params.index, 1)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }
    }
  },
  mounted () {
    this.getProxyList()
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

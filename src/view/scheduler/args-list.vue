<template>
<Card style="height:100%">
    <div class="search-con search-con-top">
      <Select v-model="searchKey" class="search-col">
        <Option v-for="item in columns" v-if="item.key !== 'handle' && item.key !== ''" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
      </Select>
      <Input @on-change="handleClear" clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
      <Button @click="handleSearch" class="search-btn" type="primary">搜索</Button>
      <Button type="primary"  @click="editModal('', 'post', '新建参数')" class="search-btn" >新建参数</Button>
    </div>
  <Table size="small" height="720" ref="selection" border :columns="columns" :data="tableData"></Table>
  <Modal v-model="modalMap.modalVisible"  :title="modalMap.modalTitle" :loading=true :footer-hide=true>
    <form-group :list="formList"  @on-submit-success="handleSubmit"></form-group>
  </Modal>
</Card>
</template>

<script>
import FormGroup from '_c/form-group'
import { getArgslist, operationArgs } from '@/api/task'
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
          align: 'center',
          sortable: true,
          width: 80
        },
        {
          title: '参数名称',
          key: 'args_name',
          align: 'center'
        },
        {
          title: '参数值',
          key: 'args_self',
          align: 'center'
        },
        {
          title: '创建者',
          key: 'creator'
        },
        {
          title: '更新时间',
          key: 'update_time',
          sortable: true
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
                      this.editModal(params.index, 'put', '编辑参数')
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
      modalMap: {
        modalVisible: false,
        modalTitle: '新建'
      },
      formList: [],
      editModalData: '',
      //
      searchKey: '',
      searchValue: ''
    }
  },
  methods: {
    getArgsList (key, value) {
      getArgslist(key, value).then(res => {
        if (res.data.code === 0) {
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
            this.getArgsList(this.searchKey, this.searchValue)
            this.modalMap.modalVisible = false
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
    setDefaultSearchKey () {
      this.searchKey = this.columns[0].key && this.columns[0].key !== 'handle' ? this.columns[0].key : (this.columns.length > 1 ? this.columns[1].key : '')
    },
    handleClear (e) {
      if (e.target.value === '') this.tableData = this.value
    },
    handleSearch () {
      this.getArgsList(this.searchKey, this.searchValue)
    }
  },
  watch: {
    searchValue (val) {
      this.getArgsList(this.searchKey, val)
    }
  },
  mounted () {
    this.getArgsList()
    this.setDefaultSearchKey()
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

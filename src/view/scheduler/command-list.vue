<template>
<Card style="height:100%">
    <div class="search-con search-con-top">
      <Select v-model="searchKey" class="search-col">
        <Option v-for="item in columns" v-if="item.key !== 'handle' && item.key !== 'status' && item.key !== ''" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
      </Select>
      <Input @on-change="handleClear" clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
      <Button @click="handleSearch" class="search-btn" type="primary">搜索</Button>
      <slot name="new_btn" ><Button type="primary"  @click="editModal('', 'post', '新建命令')" class="search-btn" >新建命令</Button></slot>
    </div>
  <Table size="small" height="718" ref="selection" border :columns="columns" :data="tableData"></Table>
  <Modal v-model="modalMap.modalVisible"  :title="modalMap.modalTitle" :loading=true :footer-hide=true>
    <form-group :list="formList"  @on-submit-success="handleSubmit"></form-group>
  </Modal>
</Card>
</template>

<script>
import FormGroup from '_c/form-group'
import { getCommandlist, operationCommand } from '@/api/task'
export default {
  components: {
    FormGroup
  },
  data () {
    return {
      columns: [
        {
          title: '名称',
          key: 'command_name',
          align: 'center',
          width: 150,
          sortable: true
        },
        {
          title: '命令',
          key: 'command',
          align: 'center'
        },
        {
          title: '参数',
          key: 'args',
          align: 'center',
          sortable: true
        },
        {
          title: '指定主机',
          key: 'force_host',
          width: 150
        },
        {
          title: '创建者',
          key: 'creator',
          width: 120
        },
        {
          title: '更新时间',
          key: 'update_time',
          width: 150
        },
        {
          title: '操作',
          key: 'handle',
          width: 125,
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
                      this.editModal(params.index, 'put', '编辑命令')
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
    getCommandList (key, value) {
      getCommandlist(key, value).then(res => {
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
          name: 'command_id',
          value: meth === 'put' ? this.tableData[index].command_id : ''
        },
        {
          name: 'command_name',
          type: 'i-input',
          value: meth === 'put' ? this.tableData[index].command_name : '',
          label: '命令名称',
          placeholder: '请输入一个有意义的名称',
          rule: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
        },
        {
          name: 'command',
          type: 'i-input',
          maxlength: 220,
          value: meth === 'put' ? this.tableData[index].command : '',
          label: '执行命令',
          placeholder: '请输入可执行命令，通常为shell命令或者可执行文件脚本。',
          rule: [
            { required: true, message: '执行命令不能为空', trigger: 'blur' }
          ]
        },
        {
          name: 'args',
          type: 'i-input',
          maxlength: 220,
          value: meth === 'put' ? this.tableData[index].args : '',
          label: '命令参数',
          placeholder:
            '请输入参数，系统会自动匹配变量，如果无法匹配则返回自身。'
        },
        {
          name: 'force_host',
          type: 'i-input',
          value: meth === 'put' ? this.tableData[index].force_host : '',
          label: '强制主机',
          placeholder:
            '通常为空，如果存在，则系统在执行到当前命令的时候会强制在这一台主机执行'
        }
      ]
    },
    handleSubmit (value) {
      setTimeout(() => {
        operationCommand(value.data, this.editModalData).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.getCommandList(this.searchKey, this.searchValue)
            this.modalMap.modalVisible = false
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }, 1000)
    },
    // 删除
    delData (params) {
      if (confirm(`确定要删除 ${params.row.command_name}`)) {
        operationCommand({ command_id: params.row.command_id }, 'delete').then(
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
      this.getCommandList(this.searchKey, this.searchValue)
    }
  },
  watch: {
    searchValue (val) {
      this.getCommandList(this.searchKey, val)
    }
  },
  mounted () {
    this.getCommandList()
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

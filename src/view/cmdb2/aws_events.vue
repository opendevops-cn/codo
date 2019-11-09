<template>
<Card>
    <div class="search-con search-con-top">
      <Select v-model="searchKey" class="search-col">
        <Option v-for="item in columns" v-if="item.key !== 'handle' && item.key !== 'status' && item.key !== ''" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
      </Select>
      <Input @on-change="handleClear" clearable placeholder="搜索" class="search-input" v-model="searchValue"/>
      <Button @click="handleSearch" class="search-btn" type="primary">搜索</Button>

    </div>
  <Table size="small" ref="selection" border :columns="columns" :data="tableData"></Table>
  <Modal v-model="modalMap.modalVisible"  :title="modalMap.modalTitle" :loading=true :footer-hide=true>
  </Modal>
</Card>
</template>

<script>
import FormGroup from '_c/form-group'
import { getAwsEventslist, operationAwsEvents } from '@/api/cmdb2/server'
export default {
  components: {
    FormGroup
  },
  data () {
    return {
      loading2: false,
      loading: false,
      columns: [
        // {
        //   type: 'selection',
        //   key: '',
        //   width: 60,
        //   align: 'center'
        // },
        {
          title: 'ID',
          key: 'id',
          align: 'center',
          width: 80,
          sortable: true
        },
        {
          title: '名称',
          key: 'name',
          minWidth: 150,
          align: 'center',
          render: (h, params) => {
            return h('a', {
            on: {
                click: () => {
                this.handleDetail(params.index)
                    }
                }
            }, params.row.name
            )
          }
        },
        {
          title: '区域',
          minWidth: 120,
          key: 'region',
          align: 'center'
        },
        {
          title: '实例ID',
          key: 'instance_id',
          align: 'center',
          minWidth: 180,
        },
        // {
        //   title: '事件ID',
        //   key: 'event_id',
        //   align: 'center'
        // },
        {
          title: '事件状态',
          minWidth: 100,
          key: 'event_status',
          align: 'center'
        },
        {
          title: '事件描述',
          key: 'event_desc',
          align: 'center',
          minWidth: 100,
        },
        {
          title: '开始时间(UTC)',
          minWidth: 180,
          key: 'event_start_time',
          align: 'center'
        },
        {
          title: '状态',
          key: 'record_state',
          width: 100,
          align: 'center',
          render: (h, params) => {
            let state = params.row.record_state
            if (state == '未处理') {
                // return h('div', [
                //     h('Tag', { props: {color: 'blue'}}, '未处理')
                // ])
                return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '4px'
                  },
                  on: {
                    click: () => {
                      this.handleUpdateState(params)
                      this.getAwsEventsList()
                    }
                  }
                },
                '未处理'
              ),
              ])
            } else {
                return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '4px'
                  },
                  on: {
                    click: () => {
                      this.handleUpdateState(params)
                      this.getAwsEventsList()
                    }
                  }
                },
                '已处理'
              ),
              ])
            }
            
          }
        },
        {
          title: '操作',
          key: 'handle',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [
            //   h(
            //     'Button',
            //     {
            //       props: {
            //         type: 'primary',
            //         size: 'small'
            //       },
            //       style: {
            //         marginRight: '5px'
            //       },
            //       on: {
            //         click: () => {
            //           this.editModal(params.row, 'put', '编辑配置')
            //         }
            //       }
            //     },
            //     '编辑'
            //   ),
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
      ruleValidate: {
        // name: [
        //   {
        //     required: true,
        //     message: 'The name cannot be empty',
        //     trigger: 'blur'
        //   }
        // ],
      },
      formValidate: {
        id: null,
        name: '',
        region: '',
        instance_id: '',
        event_id: '',
        event_status: '',
        event_desc:'',
        event_start_time: '',
        record_state: '',
      },
      tableData: [],
      pageTotal: 0, // 数据总数
      pageNum: 1, // 当前页码
      pageSize: 15, // 每页条数
      modalMap: {
        modalVisible: false,
        modalTitle: '新增配置'
      },
      formList: [],
      admUserList: [],
      editModalData: '',
      //
      searchKey: '',
      searchValue: ''
    }
  },
  methods: {
    getAwsEventsList (key, value) {
      getAwsEventslist(key, value).then(res => {
        if (res.data.code === 0) {
          // this.$Message.success(`${res.data.msg}`)
          this.tableData = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },

    handleDetail (index) {
        this.$Modal.info({
            title: 'AWS Events 事件信息',
            content: `名称：${this.tableData[index].name}<br>区域：${this.tableData[index].region}<br>实例ID：${this.tableData[index].instance_id}<br>事件ID：${this.tableData[index].event_id}<br>事件状态：${this.tableData[index].event_status}<br>事件描述：${this.tableData[index].event_desc}<br>事件开始时间：${this.tableData[index].event_start_time}`
        })
    },


    handleUpdateState(params) {
        operationAwsEvents(
          {
            id: params.row.id,
            record_state: params.row.record_state,
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

    // 删除
    delData (params) {
      if (confirm(`确定要删除 ${params.row.name}`)) {
        operationAwsEvents(
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

    changePage (value) {
      this.pageNum = value
      this.getAssetConfigsList(
        this.searchKey,
        this.searchValue
      )
    },
    setDefaultSearchKey () {
      this.searchKey =
        this.columns[0].key && this.columns[0].key !== 'handle'
          ? this.columns[0].key
          : this.columns.length > 1
            ? this.columns[1].key
            : ''
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },

    handleClear (e) {
      if (e.target.value === '') this.tableData = this.value
    },
    handleSearch () {
      this.getAwsEventsList(
        this.searchKey,
        this.searchValue
      )
    }
  },
  mounted () {
    this.getAwsEventsList()
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

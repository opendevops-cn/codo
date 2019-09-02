<template>
  <div style="height:100%; background: #f8f8f9">
    <Card>

      <Row :gutter="15" style="margin-top: 1px;">

        <Col :md="24" :lg="7" >
            <Input v-model="searchVal" placeholder='输入关键字快速查找' style="margin-bottom: 5px;" :maxlength='50'  clearable />

            <Table size="small" border :columns="columns" :data="tableData"></Table>

            <div style="margin: 10px; overflow: hidden">
              <div style="float: left;">
                  <Page  size="small" :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[18,20,25,50,100] 
                    show-sizer @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
              </div>
            </div>
        </Col>

        <Col :md="24" :lg="17" style="margin-bottom: 0px;">
          <div v-if="list_id" ><task-list :list_id="list_id" :task_type="task_type"></task-list></div>
        </Col>
      </Row>

    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import taskList from './components/task-list'
import {getTaskCheckHistorylist} from '@/api/task'
export default {
  components: { Tables, taskList},
  data () {
    return {
      //
      searchVal:'',
      //zone 分页
      pageTotal: 0, // 数据总数
      pageNum: 1, // 当前页码
      pageSize: 18, // 每页条数
      //
      task_type: 'readonly2',
      list_id: '',
      tableData: [],
      columns: [
        {
          title: 'ID',
          key: 'list_id',
          width: 80,
          align: 'center',
          sortable: true
        },
        {
          title: '任务名称',
          key: 'task_name',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'a',
                {
                  on: {
                    click: () => {
                      this.getTaskOrderList()
                      this.list_id = params.row ? params.row.list_id : ''
                    }
                  }
                },
                params.row.task_name + '--' + params.row.task_type
              )
            ])
          }
        },
        {
          title: '状态',
          key: 'handle',
          width: 85,
          align: 'center',
          render: (h, params) => {
            let status = params.row.status
            if (status === '0') {
              return h('div', [
                h('Tag', { props: { color: 'default' } }, '新建')
              ])
            } else if (status === '1') {
              return h('div', [h('Tag', { props: { color: 'cyan' } }, '等待')])
            } else if (status === '2') {
              return h('div', [
                h('Tag', { props: { color: 'green' } }, '运行')
              ])
            } else if (status === '3') {
              return h('div', [
                h('Tag', { props: { color: 'success' } }, '完成')
              ])
            } else if (status === '4') {
              return h('div', [
                h('Tag', { props: { color: 'error' } }, '错误')
              ])
            } else if (params.row.schedule == 'OK') {
              return h('div', [
                h('Tag', { props: { color: 'success' } }, '完成')
              ])
            } else if (status === '5') {
              return h('div', [
                h('Tag', { props: { color: '#FFA2D3' } }, '手动')
              ])
            } else if (status === '6') {
              return h('div', [
                h('Tag', { props: { color: 'magenta' } }, '中止')
              ])
            } else if (status === '7') {
              return h('div', [
                h('Tag', { props: { color: 'geekblue' } }, '定时')
              ])
            } else {
              return h('div', [
                h('Tag', { props: { color: 'error' } }, '失败')
              ])
            }
          }
        }
      ]
    }
  },
  methods: {
    getTaskOrderList() {
      getTaskCheckHistorylist(this.pageNum, this.pageSize, this.searchVal).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data
          this.pageTotal = res.data.count
          if (!this.list_id && res.data.list_id) {
            this.list_id = res.data.list_id
          }
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    changePage (value) {
      this.pageNum = value
      this.getTaskOrderList()
    },
    // 每页条数
    handlePageSize (value) {
      this.pageNum = 1
      this.pageSize = value
      this.getTaskOrderList()
    }
  },
  watch:{
    searchVal: function(){
      this.getTaskOrderList()
    }
  },
  mounted () {
    this.getTaskOrderList()
  }
}
</script>

<style lang="less" scoped>
.search-con {
  padding: 0px 0;
  .search {
    &-col {
      display: inline-block;
      width: 160px;
    }
    &-input {
      display: inline-block;
      width: 160px;
      margin-left: 1px;
      margin-bottom: 10px;
    }
    &-input-long {
      display: inline-block;
      width: 480px;
      margin-left: 1px;
    }
    &-btn {
      margin-left: 2px;
    }
  }
}
</style>

<template>
  <div style="height:100%; background: #f8f8f9">
    <Card>

      <Row :gutter="15" style="margin-top: 1px;">

        <Col :md="24" :lg="7" >
            <Table size="small" border height="800" :columns="columns" :data="tableData"></Table>
        </Col>

        <Col :md="24" :lg="17" style="margin-bottom: 0px;">
          <div v-if="list_id" ><task-list :list_id="list_id" :task_type="task_type" @flushOrderList="handlerFlush($event)"></task-list></div>
        </Col>
      </Row>

    </Card>
  </div>
</template>

<script>
import taskList from './components/task-list'
import Tables from '_c/tables'
import { getTaskOrderlist } from '@/api/task'
export default {
  components: { Tables, taskList },
  data () {
    return {
      task_type: 'normal',
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
      ],
    }
  },
  methods: {
    getTaskOrderList() {
      getTaskOrderlist().then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data
          if (!this.list_id && res.data.list_id) {
            this.list_id = res.data.list_id
          }
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handlerFlush() {
      this.list_id = null
      this.getTaskOrderList()
    }
  },
  mounted () {
    this.getTaskOrderList()
  }
}
</script>

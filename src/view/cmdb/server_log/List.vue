<template>
  <div>
    <Card>
      <tables border ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete"
      @on-search-table="handleSearchTable"
      >
      </tables>
      </br>
      <Page :total="pageTotal" :current="getParams.pageNum" :page-size="getParams.pageSize" :page-size-opts=[10,25,50,100] show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
    </Card>
    <Modal width="650px;" v-model="dialog.show"  :title="dialog.title" @on-cancel="closeModal" :footer-hide=true>
        <TtyLog :dialog="dialog" :ttylog_data="ttylog_data"></TtyLog>
    </Modal>

    <Modal width="750px;" v-model="record_dialog.show"  :title="record_dialog.title" @on-cancel="closeModal2" :footer-hide=true>
        <Record :record_data="record_data" ref="child_record">></Record>
    </Modal>

    <copyRight> </copyRight>
  </div>
</template>

<script>
import {Tag} from 'iview'
import copyRight from '@/components/public/copyright'
import Tables from '_c/tables'
import TtyLog from './TtyLog'
import Record from '@/view/cmdb/webssh/Record'
import { getLogData, getTtyLogData, getRecordData } from '@/api/cmdb/server_log.js'
export default {
  name: 'list',
  components: {
    copyRight,
    Tables,
    Tag,
    TtyLog,
    Record
  },
  data () {
    return {
      // 弹出框
      loading: false,
      dialog: {
        show: false,
        title: ''
      },
      record_dialog: {
        show: false,
        title: ''
      },
      columns: [
        {
          title: 'ID',
          key: 'id',
          sortable: true,
          sortType: 'desc',
          width: 70,
          align: 'center'
        },
        {title: '用户名', key: 'user', align: 'center'},
        {title: '登录主机', key: 'host', align: 'center'},
        {title: '来源IP', key: 'remote_ip', align: 'center'},
        {title: '登录方式', key: 'login_type', align: 'center'},
        {
          title: '命令',
          key: 'handle',
          align: 'center',
          button: [
            (h, params, vm) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                    // this.show(params.index)
                      this.showTtyLog(params.row)
                    // this.handleEdit(params.index,params.row)
                    }
                  }
                }, '统计')
              ])
            }
          ]
        },
        {
          title: '录像',
          key: 'handle',
          align: 'center',
          button: [
            (h, params, vm) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                    // window.open('/record/?id='+params.row.id)
                      this.showRecordLog(params.row)
                    }
                  }
                }, '回放')
              ])
            }
          ]
        },
        {title: '登录时间', key: 'start_time', align: 'center', width: 150},
        {title: '时长', key: 'use_time', align: 'center', width: 150}
      ],
      getParams: {
        pageNum: 1, // 当前页码
        pageSize: 10 // 每页条数
      },
      pageTotal: 0, // 数据总数
      tableData: [],
      ttylog_data: [],
      record_data: {}
    }
  },
  methods: {
    handleDelete (params) {
      console.log(params)
    },
    show (index) {
      this.$Modal.info({
        title: '开始发布',
        content: `项目名称：${this.tableData[index].name}<br>运行时间：${this.tableData[index].time}<br>镜像：${this.tableData[index].iamge}`
      })
    },
    showTtyLog (row) {
      // get tty_data
      getTtyLogData(row.id).then(res => {
        this.ttylog_data = res.data
      })
      this.dialog = {
        show: true,
        title: '命令记录'
      }
    },
    showRecordLog (row) {
      getRecordData(row.id).then(res => {
        const new_data = JSON.parse(res.data.data)
        this.record_data = new_data
      }).catch(error => {
        console.log('error--->', error)
        this.record_data = {}
      })
      this.record_dialog = {
        show: true,
        title: '操作回放'
      }
    },
    // 弹出对话框
    showModal () {
      this.dialog.show = true
    },
    // 新增
    handleAdd () {
      this.dialog = {
        show: true,
        title: '添加管理用户',
        option: 'add'
      }
    },

    changePage (value) {
      // 切换页码时
      this.getParams.pageNum = value
      this.getData()
    },
    // 切换每页显示条数时
    handlePageSize (value) {
      this.getParams.pageSize = value
      this.getData()
    },
    handleSearchTable (k, v) {
      // 子组件table发送过来的搜索条件
      this.getParams = {
        pageNum: 1,
        pageSize: 10
      }
      if (k !== '') {
        // 模糊匹配
        this.getParams[k + '__contains'] = v // contanis包含,﻿startswith开始
      }
      this.getData()
    },

    getData () {
      // 获取数据
      getLogData(this.getParams).then(res => {
        // console.log('tableData==>')
        // console.log(res)
        this.tableData = res.data.data
        this.pageTotal = res.data.count
        // console.log(this.tableData)
      })
    },
    closeModal () {
      // 关闭modal
      this.dialog.show = false
    },
    closeModal2 () {
      // 关闭modal
      this.$refs.child_record.set_close()
      this.record_dialog.show = false
    }
  },
  mounted () {
    /** 获取表格数据 **/
    this.getData()
    // console.log('get user->'+ this.$store.getters.user.id)
  }
}
</script>

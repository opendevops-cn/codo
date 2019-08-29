<template>
<div>
  <Card>
  <Row :gutter="15" class="task-con">
    <Col v-if="task_type !== 'readonly1'" style="padding: 10px; background: #f8f8f9">
        <Card title="任务详情">
            <Row>
              <Col span="12">
                <div class="detail-col">
                  提交时间：<p color="warning"  class="detail-col-1" size ="small">{{checkData.create_time}}</p>
                </div>
              </Col>
              <Col span="12">
                 <div class="detail-col">
                  执行时间：<p type="warning" class="detail-col-1" size ="small">{{checkData.start_time}}</p>
                </div>
              </Col>
              <Col span="12">
                <div class="detail-col">
                  发起人：<p type="warning" class="detail-col-1" size ="small">{{checkData.creator}}</p>
                </div>
              </Col>
              <Col span="12">
                <div class="detail-col">
                  审批人：<p type="warning" class="detail-col-1" size ="small">{{checkData.executor}}</p>
                </div>
              </Col>
              <Col span="24">
                <div class="detail-col">
                  参与人员：<p type="warning" class="detail-col-1" size ="small">{{checkData.associated_user}}</p>
                </div>
              </Col>
              <div v-if="list_id && task_type === 'normal'">
                <div v-if="checkData.schedule === 'new'" >
                  <Col span="24">
                    <div class="detail-col">
                      审批执行：
                      <Button v-if="checkData.schedule === 'new' && checkData.approval_button" type="success" size ="small" class="detail-col-1"
                        @click.native="handlerApproval()">审批</Button>
                    </div>
                  </Col>
                </div>
                <Col span="24">
                  <div class="detail-col">
                    审批干预：
                    <span  slot="extra" v-if="checkData.hand_list" v-for="item, index in checkData.hand_list">
                      <Button type="info" style="marginRight: 10px" size ="small" @click.native="handlerHand(item)">{{item}}</Button>
                    </span>
                    <Button type="error" class="detail-col-1" size="small" @click.native="handlerStop()">终止全部</Button>
                  </div>
                </Col>
              </div>
              <Col v-if="list_id" span="24" style="padding: 10px">
                <div v-if="task_type === 'normal'">
                  <Table v-if="dataArgs.length > 0" height="121" :columns="columnsArgs" :data="dataArgs" :border="false" :show-header=false  size='small'></Table>
                  <Alert v-else > 没有参数，或者参数格式化的时候发生了异常</Alert>
                </div>
                <div  v-if="task_type === 'readonly2'">
                  <Table v-if="dataArgs.length > 0" :columns="columnsArgs" :data="dataArgs" :border="false" :show-header=false  size='small'></Table>
                  <Alert v-else > 没有参数，或者参数格式化的时候发生了异常</Alert>
                </div>
              </Col>
          </Row>
        </Card>
      </Col>
      <Col style="padding: 10px; background: #f8f8f9">
       <Tabs v-model="runGroup" @on-click="handleTabs">
          <TabPane v-for="(item, index) in tabs" :key="`${_uid}_${index}`" :label="item.label" :icon="item.icon" :name="item.name">
            <span style="marginRight: 2px;marginLeft: 2px;" v-for="h in checkData.this_host_list">
            <tag fade v-if="checkData.hosts_status[h] === '0'" color="default" @click.native="handleGetInfo(runGroup,h)">{{h}}</tag>
            <tag fade v-if="checkData.hosts_status[h] === '1'" color="cyan" @click.native="handleGetInfo(runGroup,h)">{{h}}</tag>
            <tag fade v-if="checkData.hosts_status[h] === '2'" color="green" @click.native="handleGetInfo(runGroup,h)">{{h}}</tag>
            <tag fade v-if="checkData.hosts_status[h] === '3'" color="success" @click.native="handleGetInfo(runGroup,h)">{{h}}</tag>
            <tag fade v-if="checkData.hosts_status[h] === '4'" color="error" @click.native="handleGetInfo(runGroup,h)">{{h}}</tag>
            <tag fade v-if="checkData.hosts_status[h] === '5'" color="#FFA2D3" @click.native="handleGetInfo(runGroup,h)">{{h}}</tag>
            <tag fade v-if="checkData.hosts_status[h] === '6'" color="magenta" @click.native="handleGetInfo(runGroup,h)">{{h}}</tag>
            <tag fade v-if="checkData.hosts_status[h] === '7'" color="geekblue" @click.native="handleGetInfo(runGroup,h)">{{h}}</tag>
            </span>
            <Table style="margin-top: 10px; "border size="small":columns="columns1" :data="tableData1"></Table>
          </TabPane>
        </Tabs>
      </Col>
      </Col>
    </Row>
    </Card>
    <Modal v-model="modalMap.modalVisible"  :loading=true :footer-hide=true>
      <div style="padding: 10px; text-align:center;">
        <DatePicker  type="datetime"  :value="valueDate" @on-change="handleChange"
          :options="optionsDate" placeholder="选择执行时间" show-week-numbers confirm style="width: 220px">
        </DatePicker>
        <Button type="success" style="marginRight: 2px; marginLeft: 50px"  @click="handlerApprovalSubmit()">选择定时执行时间</Button>
      </div>
    </Modal>
    <Drawer v-model="logModal" :closable="false"  style="background-color: #f8f8f9" width="820" @on-close="closeModal">
      <h2 style="color: #000000; marginLeft: 10px">任务日志：</h2>
      <div style="padding: 10px">
        <Row  v-for="log in logInfo">
          <Col span="24">
            <p style="color: #000000">{{log}}</p>
          </Col>
        </Row>
      </div>
    </Drawer>
  </div>
</template>

<script>
// 只读详情/只读简单/读写正常
import FormGroup from '_c/form-group'
import Tables from '_c/tables'
import VueWebsocket from 'vue-websocket'
import {
  getTaskOrderlist,
  getTaskChecklist,
  getDetailslist,
  operationOrderlist,
  operationChecklist,
  logWS
} from '@/api/task'
export default {
  components: {
    FormGroup,
    Tables,
    VueWebsocket
  },
  props: {
    list_id: {
       type: [String, Number]
    },
    // 只读简单 readonly1，只读详情 readonly2，读写正常 normal
    task_type: {
       type: String,
       default: 'readonly1'
    }
  },
  data () {
    return {
      runGroup: '1',
      runHost: '',
      tabs: [],
      optionsDate: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      valueDate: '',
      //  this.getTaskCheckList(params.row.list_id)
      columns1: [
        {
          title: '优先级',
          key: 'task_level',
          align: 'center',
          width: 80
        },
        {
          title: '执行主机',
          key: 'exec_ip',
          align: 'center',
          width: 120
        },
        {
          title: '任务名称',
          key: 'task_name',
          align: 'center',
          width: 180
        },
        {
          title: '任务命令',
          key: 'task_cmd',
          align: 'center'
        },
        {
          title: '状态',
          key: 'handle',
          width: 100,
          align: 'center',
          render: (h, params) => {
            let status = params.row.task_status
            if (status === '0') {
              return h('div', [
                h('Tag', { props: { color: 'default' } }, '新建')
              ])
            } else if (status === '1') {
              return h('div', [h('Tag', { props: { color: 'cyan' } }, '等待')])
            } else if (status === '2') {
              return h('div', [
                h('Tag', { props: { color: 'green' } }, '运行中')
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
        },
        {
          title: '操作',
          key: 'handle',
          width: 180,
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
                    marginRight: '4px'
                  },
                  on: {
                    click: () => {
                      this.handlerCheckLog(
                        params.row.list_id,
                        params.row.task_group,
                        params.row.task_level,
                        params.row.exec_ip
                      )
                    }
                  }
                },
                '日志'
              ),
              params.row.task_status === '5' && this.task_type === 'normal' &&
                h(
                  'Button',
                  {
                    props: {
                      size: 'small'
                    },
                    style: {
                      marginRight: '4px'
                    },
                    on: {
                      click: () => {
                        this.handlerHandOne(
                          params.row.list_id,
                          params.row.task_group,
                          params.row.task_level,
                          params.row.exec_ip,
                          params.row.sched_id
                        )
                      }
                    }
                  },
                  '执行'
                ),
              params.row.task_status !== '5' && this.task_type === 'normal' &&
                h(
                  'Button',
                  {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    style: {
                      marginRight: '4px'
                    },
                    on: {
                      click: () => {
                        this.hangdleRestart(
                          params.row.list_id,
                          params.row.task_group,
                          params.row.task_level,
                          params.row.exec_ip
                        )
                      }
                    }
                  },
                  '重做'
                ),
              this.task_type === 'normal' && 
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '0px'
                  },
                  on: {
                    click: () => {
                      this.hangdleStopOne(
                        params.row.list_id,
                        params.row.task_group,
                        params.row.task_level,
                        params.row.exec_ip
                      )
                    }
                  }
                },
                '终止'
              )
            ])
          }
        }
      ],
      columnsArgs: [
          {
              title: '参数',
              key: 'args_key',
              width: 245,
          },
          {
              title: '值',
              key: 'args_value'
          },
      ],
      dataArgs: [],
      tableData: [],
      tableData1: [],
      // formList: [],
      checkData: {},
      checkArgs: {},
      // 弹框
      modalMap: {
        modalVisible: false
      },
      logModal: false,
      logInfo: []
    }
  },
  methods: {
    getTaskCheckList (value, getRunGroup, getRunHost) {
      getTaskChecklist(value, getRunGroup, getRunHost).then(res => {
        if (res.data.code === 0) {
          let newTabs = []
          let resData = res.data.data
          this.checkData = resData
          this.list_id = resData.list_id
          this.checkArgs = resData.new_args
          this.runGroup = resData.run_group
          this.tableData1 = resData.scheduler_list
          this.valueDate = resData.start_time
          this.runHost = resData.this_host
          this.dataArgs =  resData.new_args_list
          if (this.checkData.group_list) {
            this.checkData.group_list.forEach(item => {
              newTabs.push({
                label: `执行组-${item}`,
                icon: 'ios-boat',
                name: `${item}`
              })
              this.tabs = newTabs
            })
          } else {
            this.tabs = []
          }
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 审批执行
    handlerApproval () {
      this.valueDate = this.checkData.start_time
      this.modalMap.modalVisible = true
    },
    // 修改执行时间触发
    handleChange (value) {
      this.valueDate = value
    },
    handlerApprovalSubmit () {
      if (!this.valueDate) {
        this.$Message.error('执行时间不能为空')
      }
      operationOrderlist(
        { list_id: this.list_id, start_time: this.valueDate },
        'patch'
      ).then(res => {
        if (res.data.code === 0) {
          this.getTaskOrderList()
          this.getTaskCheckList(this.list_id)
          this.modalMap.modalVisible = false
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 审批干预
    handlerHand (value) {
      if (confirm(`通过执行《${value}》任务吗??`)) {
        operationChecklist(
          { list_id: this.list_id, hand_task: value },
          'put'
        ).then(res => {
          if (res.data.code === 0) {
            this.getTaskOrderList()
            this.getTaskCheckList(this.list_id, this.runGroup, this.runHost)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }
    },
    // 终止整个任务
    handlerStop () {
      if (confirm('这样会结束掉整个任务，你确定要这样操作吗？')) {
        operationOrderlist({ list_id: this.list_id }, 'put').then(res => {
          if (res.data.code === 0) {
            this.list_id = ''
            this.getTaskOrderList()
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }
    },
    handleGetInfo (val2, val3) {
      this.getTaskCheckList(this.list_id, val2, val3)
    },
    handleTabs (value) {
      this.getTaskCheckList(this.list_id, value)
    },
    hangdleRestart (listID, taskGroup, taskLevel, execIP) {
      if (confirm(`确定从此处开始重做任务吗？？？`)) {
        operationChecklist(
          {
            hand_type: 'restart',
            list_id: listID,
            task_group: taskGroup,
            task_level: taskLevel,
            exec_ip: execIP
          },
          'patch'
        ).then(res => {
          if (res.data.code === 0) {
            this.getTaskOrderList()
            this.handleGetInfo(this.runGroup, this.runHost)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }
    },
    hangdleStopOne (listID, taskGroup, taskLevel, execIP) {
      if (confirm(`确定终止当前组${taskGroup}-${execIP}主机下的所有任务吗`)) {
        operationChecklist(
          {
            hand_type: 'stop_one',
            list_id: listID,
            task_group: taskGroup,
            task_level: taskLevel,
            exec_ip: execIP
          },
          'patch'
        ).then(res => {
          if (res.data.code === 0) {
            this.getTaskOrderList()
            this.handleGetInfo(this.runGroup, this.runHost)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }
    },
    handlerHandOne (listID, taskGroup, taskLevel, execIP, value) {
      if (confirm(`确定执行此任务吗??`)) {
        operationChecklist(
          {
            hand_type: 'execute',
            list_id: listID,
            task_group: taskGroup,
            task_level: taskLevel,
            exec_ip: execIP,
            scheduler_id: value
          },
          'patch'
        ).then(res => {
          if (res.data.code === 0) {
            this.getTaskOrderList()
            this.handleGetInfo(this.runGroup, this.runHost)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }
    },
    websocket (log_key) {
      if (ws) {
        ws.close()
        this.logInfo = []
      }
      // let ws = new WebSocket("ws://172.16.0.223:8900/v2/task/ws_log/");
      // console.log(logWS)
      let ws = new WebSocket(logWS)
      ws.onopen = () => {
        // Web Socket 已连接上，使用 send() 方法发送数据
        ws.send(log_key)
        console.log('获取日志...')
      }
      ws.onmessage = evt => {
        this.logInfo = evt.data.split('----')
        console.log('数据已接收...')
      }
      ws.onclose = function () {
        console.log('连接已关闭...')
      }
      // 组件销毁时调用，中断websocket链接
      this.over = () => {
        ws.close()
        this.logInfo = []
      }
    },
    handlerCheckLog (listID, taskGroup, taskLevel, execIP) {
      this.logModal = true
      let log_key = listID + '_' + taskGroup + '_' + taskLevel + '_' + execIP
      this.websocket(log_key)
    },
    closeModal () {
      this.over()
    }
  },
  watch:{
    list_id: function(){
      this.getTaskCheckList(this.list_id)
    }
  },
  mounted () {
    this.getTaskCheckList(this.list_id)
  }
}
</script>
<style lang="less" scoped>
.task-con {
  padding: 0px 0;
  margin-top: 1px;
  .detail {
    &-col {
      margin-top: 10px; 
      margin-left: 16px; 
      margin-right: 16px;
      &-1 {
        margin-right: 2px;
        float:right
      }
    }
    &-input {
      display: inline-block;
      width: 160px;
      margin-left: 1px;
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

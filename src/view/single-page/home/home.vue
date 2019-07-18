<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" key="infor-1" style="height: 90px;padding-bottom: 10px;">
        <infor-card shadow color="#E46CBB" icon="md-person-add" :icon-size="36">
          <h3><router-link :to="{name:'user'}" class="nav-link">用户管理</router-link></h3>
        </infor-card>
      </i-col>
      <i-col :xs="12" :md="8" :lg="4" key="infor-2" style="height: 90px;padding-bottom: 10px;">
        <infor-card shadow color="#2d8cf0" icon="md-cube" :icon-size="36">
          <h3><router-link :to="{name: 'asset_server'}" class="nav-link">资产管理</router-link></h3>
        </infor-card>
      </i-col>
      <i-col :xs="12" :md="8" :lg="4" key="infor-3" style="height: 90px;padding-bottom: 10px;">
        <infor-card shadow color="#19be6b" icon="ios-hammer" :icon-size="36">
          <h3><router-link :to="{name: 'confd_project'}" class="nav-link">配置中心</router-link></h3>
        </infor-card>
      </i-col>
      <i-col :xs="12" :md="8" :lg="4" key="infor-4" style="height: 90px;padding-bottom: 10px;">
        <infor-card shadow color="#9A66E4" icon="ios-alarm" :icon-size="36">
          <h3><router-link :to="{name: 'cronjobs'}" class="nav-link">定时任务</router-link></h3>
        </infor-card>
      </i-col>
      <i-col :xs="12" :md="8" :lg="4" key="infor-5" style="height: 90px;padding-bottom: 10px;">
        <infor-card shadow color="#ff9900" icon="ios-alarm" :icon-size="36">
          <h3><router-link :to="{name: 'paid_reminder'}" class="nav-link">提醒管理</router-link></h3>
        </infor-card>
      </i-col>
      <i-col :xs="12" :md="8" :lg="4" key="infor-6" style="height: 90px;padding-bottom: 10px;">
        <infor-card shadow color="#ed3f14" icon="md-warning" :icon-size="36">
          <h3><router-link :to="{name: 'prometheus_alert'}" class="nav-link">kubernetes告警</router-link></h3>
        </infor-card>
      </i-col>
    </Row>




    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="14" style="margin-bottom: 10px;">
        <Card shadow>
          <!-- <IssuesInfo :data="IssuesInfoData"></IssuesInfo> -->
          <chart-bar style="height: 340px;" :value="barTaskData" text="告警预留位"/>
        </Card>
      </i-col>

      <i-col :md="24" :lg="10" style="margin-bottom: 10px;">
        <Card shadow>
          <chart-pie ref="childCmdb" style="height: 339px;" :value="pieCmdbData" text="主机分类"></chart-pie>
        </Card>
      </i-col>
    </Row>

    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="14" style="margin-bottom:10px;">
        <Card shadow>
          <chart-pie ref="childTask" style="height: 339px;" :value="pieTaskData" ></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="10" style="margin-bottom: 10px;">
        <Card shadow>
          <TaskInfo :data="taskInfoData"></TaskInfo>
        </Card>
      </i-col>

    </Row>

      <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="24" style="margin-bottom: 10px;">
        <Card shadow>
          <IssuesInfo :data="IssuesInfoData"></IssuesInfo>
          <!-- <chart-bar style="height: 340px;" :value="barTaskData" text="告警预留位"/> -->
        </Card>
      </i-col>
    </Row>

  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
import { getTagList, getTaskOrderlist, getTaskStatementlist } from '@/api/dashboard/home.js'
import { getZabbixLastissues } from "@/api/devops-tools";

import TaskInfo from './taskinfo'
import IssuesInfo from './issuesinfo'

// import { getTaskCheckHistorylist } from '@/api/task'

export default {
  name: 'home',
  components: {
    InforCard,
    ChartPie,
    ChartBar,
    Example,
    TaskInfo,
    IssuesInfo,
  },
  data () {
    return {
      // cardData: {
      //   users: 0,
      //   cmdb: 0,
      //   project: 0,
      //   alarm: 0,
      //   remind: 0,
      //   crontab: 0
      // },
      pieCmdbData: [],
      pieTaskData: [],
      taskInfoData: [
      ],
      // IssuesInfoData: [{
      //   "host": "samonitor",
      //   "issue": "Zabbix agent on us_samonitor is unreachable for 5 minutes",
      //   "last_change": "2019-07-08 13:46:51",
      //   "level": '3',
      // }
      // ],
      IssuesInfoData: [],
      barTaskData: {
        Mon: 9,
        Tue: 2,
        Wed: 45,
        Thu: 32,
        Fri: 5,
        Sat: 30,
        Sun: 7
      }
    }
  },
  methods: {
    // 获取zabbix last issues
    GetZabbixLastissues(){
      getZabbixLastissues().then(res => {
        if (res.data.code === 0) {
          const data = res.data.data
          // const slice_data = data.slice(0,10)
          this.IssuesInfoData = data
        }
      })
    },

    //初始化 历史任务类型饼图数据
    initPieTask () {
      // this.pieTaskData.push({name: '服务器发布', value:20},{name: '资源申请', value:20},{name: 'MySQL审核', value:20},{name: '自定义任务', value:50},)
      getTaskStatementlist().then(res => {
        if (res.data.code === 0) {
            const data = res.data.data
            // 切割下列表，历史任务可能有很多，限制
            const slice_data = data.slice(0,36)
            for (var item in slice_data) {
              this.pieTaskData.push({
                value: data[item].task_len,
                name: data[item].task_type
              })
            }
        } else {
          // this.$Message.error(`${res.data.msg}`)
        }
      })
    },

    // 初始化 CMDB Tag饼图数据
    initPieCmdb () {
      getTagList().then(res => {
        if (res.data.code === 0) {
            const data = res.data.data
            // 切割下列表，历史任务可能有很多，做个限制
            const slice_data = data.slice(0,36)
            for (var item in slice_data) {
              this.pieCmdbData.push({
                value: data[item].server_len,
                name: data[item].tag_name
              })
            }
        } else {
          // this.$Message.error(`${res.data.msg}`)
        }
      })
    },

    // 初始化 [待处理任务订单]
    initTaskInfo () {
      getTaskOrderlist().then(res => {
        const data = res.data.data
        for (var item in data) {
          this.taskInfoData.push({
            id: data[item].list_id,
            name: data[item].task_name + '-' + data[item].task_type,
            creator: data[item].creator,
            status: data[item].status
          })
        }
      })
    },

  },
  mounted () {
    this.initPieCmdb()
    this.initTaskInfo()
    this.initPieTask()
    this.GetZabbixLastissues()
  },
  watch: {
    pieCmdbData: function () {
      this.$refs.childCmdb.initPie()
    },
    pieTaskData: function () {
      this.$refs.childTask.initPie()
    }
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
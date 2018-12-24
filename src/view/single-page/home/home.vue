<template>
  <div>
    <Row :gutter="20">
      <!-- <i-col :xs="12" :md="8" :lg="6" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col> -->
      <i-col :xs="12" :md="8" :lg="6" key="infor-0" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow color="#2d8cf0" icon="md-cube" :icon-size="36">
          <count-to :end="cardData.cmdb" count-class="count-style"/>
          <p>资产总数</p>
        </infor-card>
      </i-col>
      <i-col :xs="12" :md="8" :lg="6" key="infor-1" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow color="#19be6b" icon="logo-usd" :icon-size="36">
          <count-to :end="cardData.money" count-class="count-style"/>
          <p>消费金额</p>
        </infor-card>
      </i-col>
      <i-col :xs="12" :md="8" :lg="6" key="infor-2" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow color="#ed3f14" icon="md-warning" :icon-size="36">
          <count-to :end="cardData.alarm" count-class="count-style"/>
          <p>报警数量</p>
        </infor-card>
      </i-col>
      <i-col :xs="12" :md="8" :lg="6" key="infor-3" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow color="#ff9900" icon="ios-alarm" :icon-size="36">
          <count-to :end="cardData.call" count-class="count-style"/>
          <p>事件提醒</p>
        </infor-card>
      </i-col>
    </Row>

    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="14" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barTaskData" text="任务订单详情"/>
        </Card>
      </i-col>
      <i-col :md="24" :lg="10" style="margin-bottom: 20px;">
        <Card shadow>
          <TaskInfo :data="taskInfoData"></TaskInfo>
        </Card>
      </i-col>
    </Row>

    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="14" style="margin-bottom: 20px;">
        <Card shadow>
          <LoginInfo :data="loginInfoData"></LoginInfo>
        </Card>
      </i-col>
      <i-col :md="24" :lg="10" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie ref="childCmdb" style="height: 300px;" :value="pieCmdbData" text="主机分类"></chart-pie>
        </Card>
      </i-col>
    </Row>


    <!-- <Row>
      <Card shadow>
        <example style="height: 310px;"/>
      </Card>
    </Row> -->
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
import { getTableData,getGroupList } from '@/api/cmdb/server.js'
import { getLogData } from '@/api/cmdb/server_log.js'
import TaskInfo from './taskinfo'
import LoginInfo from './logininfo'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example,
    TaskInfo,
    LoginInfo
  },
  data () {
    return {
      cardData:{
        cmdb: 0,
        money: 0,
        alarm: 0,
        call: 0
      },
      // inforCardData: [],
      pieCmdbData: [],
      loginInfoData: [],
      taskInfoData:[
        {name: 'FT客户端发布', user: '杨铭威'},
        {name: 'FT服务端发布', user: '杨红飞'},
        {name: 'MZ SQL语句审核', user: '杨铭威'},
        {name: 'AWS资源申请', user: '沈硕'},
        {name: 'WD客户端发布', user: '杨铭威'},
        {name: 'WD服务端发布', user: '杨红飞'},
      ],
      barTaskData: {
        Mon: 9,
        Tue: 2,
        Wed: 15,
        Thu: 22,
        Fri: 5,
        Sat: 30,
        Sun: 7
      }
    }
  },
  methods:{
    getCmdbCount(){
      // 获取CMDB资产数量
      const params = {pageNum: 1,pageSize: 10000}
      getTableData(params).then(res => {
        this.cardData.cmdb = res.data.count
      }).catch(error =>{
        console.log('get CMDB count Faild!')
      });
    },

    initLoginInfo(){
      // 初始化 [登录记录]
      const params= {pageNum: 1, pageSize: 5}
      getLogData(params).then(res => {
        console.log(res.data.data)
        this.loginInfoData = res.data.data
      })
    },
    initPieCmdb(){
      // 初始化 [主机分类] 饼状图
      getGroupList().then(res => {
        const data = res.data
        for(var item in data){
          this.pieCmdbData.push({
              value: data[item].server_set.length,
              name: data[item].name
          })
        }
      })
    },
    initCard(){
      // 初始化第1排汇总
      this.getCmdbCount()
      // this.inforCardData = [
      //     { title: '资产总数', icon: 'md-cube', count: this.cmdb_count, color: '#2d8cf0' },
      //     { title: '消费金额', icon: 'logo-usd', count: 232, color: '#19be6b' },
      //     { title: '报警数量', icon: 'md-warning', count: 142, color: '#ed3f14' },
      //     { title: '事件提醒', icon: 'ios-alarm', count: 11, color: '#ff9900' },
      //     // { title: '新增互动', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
      //     // { title: '新增页面', icon: 'md-map', count: 14, color: '#9A66E4' }
      // ]
    }
  },
  mounted () {
    this.initCard()
    this.initPieCmdb()
    this.initLoginInfo()
  },
  watch:{
    pieCmdbData: function(){
      this.$refs.childCmdb.initPie()
    }
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>

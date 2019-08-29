<template>
  <!-- <div> -->
    <Card dis-hover>
      <div class="inner" >
        <Alert show-icon>基本信息</Alert>
        <baseInfo v-if="flag" :row="row"> </baseInfo>
      </div>
      <br>

      <!-- <div class="inner" v-if="is_has_flow(row)"> -->
      <div class="inner" >
        <Alert show-icon>任务流 {{row.status}}</Alert>
        <!-- <Steps :current="stepCurrent" :status="stepCurrentStatus"> -->
        <Steps :current="stepCurrent">  
          <step v-for="(item, index) in stepList" :title="item.title" :content="item.content" :key="index"> </step>
        </Steps><br>
        <Button type="primary" v-on:click='showAction' v-if="row.status==12">审核</Button>
      </div>
      <br><br>

      <div class="inner" >
      <Alert show-icon>发布详情</Alert>
        <Tabs type="card">
          <TabPane label="测试环境">
            <Tabs @on-click="tab_click">
                <TabPane :label="item.name" :name="item.name" v-for="item in row.app_list">
                  <handleResult :row="row" :handleResult="log_result" env_id="1" :app="item"> </handleResult>
                </TabPane>
            </Tabs>
          </TabPane>
          <TabPane label="正式环境" v-if="release_flag">
            <Tabs>
                <TabPane :label="item.name" :name="item.name" v-for="item in row.app_list">
                  <handleResult :row="row" :handleResult="log_result" env_id="3" :app="item"> </handleResult>
                </TabPane>
            </Tabs>
          </TabPane>
        </Tabs>
      </div>


      <Modal
          v-model="modalAction.show"
          width="450"
          title="任务操作"
          @on-ok="handleAction"
          @on-cancel="cancel">
          <div>
            <center> {{modalAction.content}} </center>
          </div>
      </Modal>  
    </Card>


  <!-- </div> -->
</template>

<script>
import { getLog,getPublishDetail,publishAction } from '@/api/k8s/publish'
import handle from './components/handle'
import baseInfo from './components/baseInfo'
import handleResult from './components/handleResult'
export default {
  components: {handle, baseInfo, handleResult},
  props: ['pid'],
  data () {
    return {
      release_flag: false,
      websock: null,
      log_result:['111111','222222','111111','222222','111111','222222','111111','222222'],
      flag:true,
      stepList:[
        {title:'测试环境',content:''},
        {title:'任务审核',content:''},
        {title:'正式环境',content:''},
        {title:'任务完成',content:''},
      ],
      stepCurrent:1,
      row:{
        id:'001',
        name: 'Demo01',
        exe_affected_rows: '1',
        commiter: 'yangmv',
        treater: 'admin',
        env: 'prd',
        is_manual_review: true,
        handleable: false,
        status : -1,
        remark : '测试啊',
        createtime: '2018-10-25 11:43:01'
      },
      sqlContent:[],
      // steps:[],
      // stepsModal:false,
      stepStatusMap:{
        1:'待部署',
        2:'部署中', 
        3:'部署完成',
        '-2':'部署失败'
      },
      // badgeData:{count:'', badgeStatus:''},
      modalAction: 
      {
        show:false,
        id:'',
        action:'',
        content:'',
      },
      descMap:{
        execute: {name: '执行'},
        reject: {name: '放弃'},
        rollback: {name: '回滚'},
        approve: {name: '审批通过'},
        disapprove: {name: '审批驳回'}
      }
    }
  },
  mounted(){
      console.log('page', this.$route.params.project_id)
      console.log('code', this.$route.params.project_name)
    //循环监视状态
    
  },
  watch:{
    pid: function(){
      //pid发送变化,则更新数据
      console.log('pid变化，Detail变化。。。。')
      this.release_flag= false
      this.getHandleResult(this.pid)
    },
    stepCurrent: function(){
      if(this.stepCurrent != 0){
        this.release_flag = true
      }
    }
  },
  // destroyed(){
  //   this.websock.close();
  // },
  computed: {
    showBtn: function () {
      if (this.row.status == -3 || this.row.status == 1 || (this.row.type == 'select' && this.row.status == 0 ) ) {
        return false
      } else {
        return true
      }
    }, 
    showItem: function () {
      // const this_user_id = this.$store.getters.user.id
      const this_user_id = '1' //这里先模拟审核人ID
      // if (row.is_manual_review == true && row.env == 'prd' && row.status != -2 && row.handleable == false) {
      if (this.row.env == 'release' && this.row.review_user_id == this_user_id) {  
        return true
      } else {
        return false
      }
    }
    // labelResult: function () {
    //   if (this.row.type == 'select') {
    //     return '查询结果' 
    //   } else {
    //     return '执行日志'
    //   }
    // }

  },
 
 methods: {
          tab_click(name){
            //console.log(name)
            //console.log('tab click....')
          },
          cancel () {
            this.$Message.info('Clicked cancel');
          },
          getLogResult(){
              //获取jenkins日志
              // console.log(this.row.project)
              // console.log(this.row.job_id)
              getLog(this.row.project,this.row.job_id).then(res => {
                if (res.data.status){
                  //console.log(res.data.data)
                  this.log_result = JSON.parse(res.data.data); 
                }else{
                  console.log(res.data.msg)
                }
              })
          },
          //获取任务流信息
          getStepData(){
            //判断是否需要显示任务流
            this.stepList = [
              {title:'测试环境',content:''},
              {title:'任务审核',content:''},
              {title:'正式环境',content:''},
              {title:'任务完成',content:''},
            ]
            if(this.row.status == 11){
              this.stepCurrent = 0
              this.stepList[0]['content'] = '发布中'
            }else if(this.row.status == 12){
              this.stepCurrent = 0
              this.stepList[0]['content'] = '发布成功'
            }else if(this.row.status == 13){
              this.stepCurrent = 0
              this.stepList[0]['content'] = '发布失败'
            }


            if(this.row.status == 2){
              this.stepCurrent = 1
              this.stepList[0]['content'] = '发布成功'
              this.stepList[1]['content'] = `等待 [${this.row.review_user}] 审核`
            }
            
            if(this.row.status == 32){
              this.stepCurrent = 3
              this.stepList[0]['content'] = '发布成功'
              this.stepList[1]['content'] = `通过 [${this.row.review_user}] 审核`
              this.stepList[2]['content'] = '发布成功'
            }else if(this.row.status == 31){
              this.stepCurrent = 3
              this.stepList[0]['content'] = '发布成功'
              this.stepList[1]['content'] = `通过 [${this.row.review_user}] 审核`
              this.stepList[2]['content'] = '发布中'
            }else if(this.row.status == 33){
              this.stepCurrent = 3
              this.stepList[0]['content'] = '发布成功'
              this.stepList[1]['content'] = `通过 [${this.row.review_user}] 审核`
              this.stepList[2]['content'] = '发布失败'
            }
          },

        // is_has_flow (row) {
        //   //若包含release环境，则需审批
        //   //const is_manual_review = row.is_manual_review //是否开启审核
        //   if (row.env == 'release') {
        //     return true
        //   } else {
        //     return false
        //   }
        // },

        showAction () {
          this.modalAction.id = this.row.id
          this.modalAction.show = true
          this.modalAction.content ='审批此发布工单?'
        },

        getHandleResult(pid){
          //console.log(this.release_flag)
          getPublishDetail(pid).then(res => {
            if (res.data.status){
              this.row = res.data.data
              this.getStepData()
              if(this.stepCurrent != 0){this.release_flag = true}
              // if(! this.websock){
              //   console.log('initWebSocket.....')
              //   this.initWebSocket()
              //   this.checkStatus(this.pid)
              // }
              
            }else{
              console.log(res.data.msg)
            }
          })
        },

        checkStatus(pid){
            console.log('checkStatus.....')
            if(this.row.status == '1' || this.row.status == '2'){
              var cron = setInterval(()=> {
                console.log('cron......')
                this.getHandleResult(pid);
                this.$emit('e-update');
                if(this.row.status != '1' && this.row.status != '2'){
                  clearInterval(cron)
                  console.log('stop cron......')
                }
              },5000);
            }
        },

        handleAction () {
          //对任务审批等操作
          const id = this.modalAction.id
          console.log('id--->',id)
          //const status = this.modalAction.action == 'approve' ? '1' : '-1'
          const status = '2'
          let data = {'status': status}
          publishAction(id,data).then(res => {
            if (res.data.status){
                //提交exec操作
                // job exec
                this.modalAction.show = false
                //this.websock.close()
                //this.websock = null
                this.getHandleResult(this.pid)
                this.$emit('e-update');
                this.$Message.success('Success!')
            }else{
                this.$Message.error(res.data.msg)
            }
          })
        },

        initWebSocket(){ //初始化weosocket
          if(this.websock){
            //console.log('已连接')
            this.websock.close();
            this.log_result = []
          }
          const wsuri = "ws://localhost:8080/ws/terminal";
          this.websock = new WebSocket(wsuri);
          this.websock.onmessage = this.websocketonmessage;
          this.websock.onopen = this.websocketonopen;
          this.websock.onerror = this.websocketonerror;
          this.websock.onclose = this.websocketclose;
        },
        websocketonopen(){ //连接建立之后执行send方法发送数据
          this.websocketsend(this.row.id);
        },
        websocketonerror(){//连接建立失败重连
          this.initWebSocket();
        },
        websocketonmessage(e){ //数据接收
          const redata = e.data;
          //console.log('get msg -->'+redata)
          this.log_result.push(redata);
        },
        websocketsend(Data){//数据发送
          this.websock.send(Data);
        },
        websocketclose(e){  //关闭
          console.log('断开连接',e);
        }
      }


}
</script>

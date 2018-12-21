<style scoped>
    .wrapper {
        background-color:black;
        color:white 
    }
    .inner {
        margin-bottom: 10px;
        margin-left: 10px
    }
    .totalDesc {
       margin-left: 10px;
       color: #7b7b7b
    }
</style>

<template>
    <div>
      <div>
        <Row>
          <!-- <Col span="2">
            <Tag color="blue">Task_id {{data.id}}</Tag>
          </Col> -->
          <Col span="4">
            <p v-if="data.status == 0" > <Tag color="default">部署中</Tag> </p>
            <p v-else if="data.status == 1" > <Tag color="green">成功</Tag> </p>
            <p v-else> <Tag color="red">失败</Tag> </p>
          </Col>
          <!-- <Col span="2">
            <Tag color="blue">访问</Tag>
          </Col> -->
          <Col span="12">
             <p> <a target="_blank" :href="get_domain">{{get_domain}}</a> </p>
          </Col>
          <Col span="4">
            <Button size="small" type="info" class="search-btn"  @click="showConsole">实时Console</Button>
          </Col>
        </Row>  
        <Row>
          <Col span="24">
            <Scroll height=240 id='test001'>
              <div class="wrapper" id='test002'>
                <!-- <div class="inner" v-for="item in msg_list">{{ item }} </div> -->
                <div class="inner" v-for="item in handleResult">{{ item }} </div>
              </div>
            </Scroll>
          </Col>
        </Row>
      </div>

    <Modal width="850px;" v-model="dialog.show"  :title="dialog.title" :footer-hide=true @on-cancel="console_cancel"> 
        <ConsoleHandle :dialog="dialog" :console_data="console_data"></ConsoleHandle>
    </Modal>
    </div>
</template>

<script>
import { getTaskDetail } from '@/api/k8s/task'
import { getLog } from '@/api/k8s/publish'
import ConsoleHandle from './Console'
export default {
  name: 'handleresult',
  components: { ConsoleHandle },
  data () {
    return {
      data: {},
      // msg : '',
      // msg_list : [],
      // websock: null
      handleResult:[],
      websock: null,
      dialog:{
        show: false,
        title: '',
        option: ''
      },
      console_data:[]
    }
  },
  props: ['row','app','env_id'],
  created() {
    //this.initWebSocket();
    this.getDetail()
  },
  destroyed(){
    if(this.websock){
      this.websock.close();
    }
  },
  watch:{
    row: function(){
      console.log('pid变化，console变化')
      this.data = {},
      this.getDetail()
    },
    handleResult: function () {
        this.$nextTick(() => {
          var div = this.$el.querySelector(".ivu-scroll-container");
          div.scrollTop = div.scrollHeight
        })
    },
    // dialog: function(){
    //   console.log(this.dialog.show)
    //   this.console_cancel()
    // }
  },
  methods: {
    console_cancel(){
      //取消
      console.log('stop cancel')
      if(this.websock){
        this.websock.close();
      }
    },
    showConsole(){
      //实时控制台
      console.log('start console')
      console.log('task_id--->',this.data.id)
      console.log('initWebSocket.....')
      this.initWebSocket()
      this.dialog = {
        show: true,
        title: '实时控制台'
      }
    },
    getLogResult(){
      getLog(this.app.name,this.data.job_id).then(res => {
        if (res.data.status){
          //console.log(res.data.data)
          this.handleResult = JSON.parse(res.data.data); 
        }else{
          console.log(res.data.msg)
        }
      })
    },
    getDetail(){
      getTaskDetail(this.row.id, this.app.id, this.env_id).then(res => {
        if (res.data.status){
          //console.log(res.data.data)
          this.data = res.data.data
          this.getLogResult()
        }else{
          console.log(res.data.msg)
        }
      })
    },
    initWebSocket(){ //初始化weosocket
      if(this.websock){
        //console.log('已连接')
        this.websock.close();
        this.console_data = []
      }
      //const wsuri = "ws://localhost:9003/ws/";
      const wsuri = "ws://localhost:8080/ws/";
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen(){ //连接建立之后执行send方法发送数据
      this.websocketsend(this.data.id);
    },
    websocketonerror(){//连接建立失败重连
      this.initWebSocket();
    },
    websocketonmessage(e){ //数据接收
      const redata = e.data;
      //console.log('get msg -->'+redata)
      this.console_data.push(redata);
    },
    websocketsend(Data){//数据发送
      this.websock.send(Data);
    },
    websocketclose(e){  //关闭
      console.log('断开连接',e);
    }
  },
  computed: {
    get_domain: function(){
      let url = null
      if(this.env_id == '1'){
        url = 'http://'+ 'qa-' + this.app.name + '.yangmv.com' +':30080'
      }else{
        url = 'http://'+ this.app.name + '.yangmv.com' + ':30080'
      }
      return url
    }
  }

}
</script>



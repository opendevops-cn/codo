<template>
<div style="height:100%; background: #f8f8f9">
  <Card dis-hover>
    <div style="margin-top: 5px;">
      <span style="marginRight: 2px;marginLeft: 1px;" v-for="item in stepInfoList">
        <tag type="dot" v-if="item.state == '1'" color="default" @click.native="handlerChangeStep(item.name)">{{item.name}}</tag>
        <tag type="dot" v-if="item.state == '2'" color="primary" @click.native="handlerChangeStep(item.name)">{{item.name}}</tag>
        <tag type="dot" v-if="item.state == '3'" color="success" @click.native="handlerChangeStep(item.name)">{{item.name}}</tag>
        <tag type="dot" v-if="item.state == '4'" color="error"   @click.native="handlerChangeStep(item.name)">{{item.name}}</tag>
        <tag type="dot" v-if="item.state == '5'" color="#FFA2D3" @click.native="handlerChangeStep(item.name)">{{item.name}}</tag>
        <Icon v-if="item.name !== '正式环境'" type="ios-arrow-forward" style="marginRight: 8px;marginLeft: 8px;" />
      </span>
      <Button style="float:right; position:relative; top:2px;"  @click="getPublishDetail()">
        <Icon type="ios-refresh"/> 刷新</Button>
      <Divider />

      <div v-if="projectInfo">

        <div v-if="theStep == '项目信息'">
          <baseInfo :projectInfo="projectInfo"></baseInfo>
        </div>

        <div v-if="theStep == '项目开发'">
          <repoInfo :projectInfo="projectInfo" @getListID="handlerGetListID($event)"></repoInfo>
          <div v-if="list_id" ><task-list :list_id="list_id" :task_type="task_type"></task-list></div>
        </div>

        <div v-if="theStep == '测试环境'">
           <QAInfo ></QAInfo>
          <!-- <div v-if="list_id" ><task-list :list_id="list_id" :task_type="task_type"></task-list></div> -->
        </div>

        <div v-if="theStep == '性能环境'">
          <div v-if="list_id" ><task-list :list_id="list_id" :task_type="task_type"></task-list></div>
        </div>

        <div v-if="theStep == '预发布环境'">
          <div v-if="list_id" ><task-list :list_id="list_id" :task_type="task_type"></task-list></div>
        </div>

        <div v-if="theStep == '任务审核'">
          <div v-if="list_id" ><task-list :list_id="list_id" :task_type="task_type"></task-list></div>
        </div>

        <div v-if="theStep == '灰度环境'">
          <div v-if="list_id" ><task-list :list_id="list_id" :task_type="task_type"></task-list></div>
        </div>

        <div v-if="theStep == '正式环境'">
          <div v-if="list_id" ><task-list :list_id="list_id" :task_type="task_type"></task-list></div>
        </div>

      </div>

    </div>
  </Card>
  </div>
</template>

<script>
import { getPublishdetail, operationProjectPublish } from '@/api/task-other'
import { getGittree2, getGitRepotags, getGitHooklog } from '@/api/git-repo'
import { getUsertree } from '@/api/user'
import taskList from '@/view/task-order/components/task-list'
import baseInfo from './components/baseInfo'
import repoInfo from './components/repoInfo'
import QAInfo from './components/QAInfo'
export default {
  components: {baseInfo, taskList, repoInfo, QAInfo},
  props: {
    project_id: {
       type: [String, Number]
    }
  },
  //0:新建,1:等待,2:运行中,3:完成,4:错误,5:手动
  data () {
    return {
      qa_list_id: null,
      //
      task_type: 'readonly1', // 能查看的任务类型
      list_id: null, //订单ID
      //
      //
      run_env: 'dev',
      user_btn_loading: false,
      stepInfoList: [],
      projectInfo: null,
      theStep: '项目信息', //当前查看的流程，可以切换
      runStep: null,   // 正在进行的流程，只从后端获取
      // 环境对应标示
      envObj: {
        "演示环境": 'staging',
        "项目开发": "dev",
        "测试环境": "qa",
        "集成环境": "sit",
        "性能环境": "per",
        "预发布环境": "pre",
        "沙箱环境 ": "sandbox",
        "灰度环境 ": "gray",
        "正式环境 ": "release",
      }
    }
  },
  watch:{
    project_id: function(){
      this.getPublishDetail()
    }
  },
 methods: {
   getPublishDetail(){
      getPublishdetail(this.project_id).then(res => {
        if (res.data.code == 0){
          // console.log(res.data.data)
          this.projectInfo = res.data.data
          this.run_env =  this.projectInfo.run_env
          this.stepInfoList =  eval(res.data.data.step_info)
          this.stepInfoList.forEach(element => {
            if ( element.state in { '2':'', '4':'', '5':'' } ){
              this.theStep = element.name
              this.runStep = element.name
            }
          });
        }else{
          this.$Message.error(res.data.msg);
        }
      })
    },
    // 切换步骤
    handlerChangeStep(val){
      this.theStep = val
      if (this.theStep == '测试环境') {
        // 数据库更新对应的标签为 relative_path/环境名 例如：ops/yanghongfei/qa
        // 1. 应查询测试任务的订单详情。
        // 2. 如果有订单，则查询测试的接口
        // 3. 如果订单完成，才展示通过测试按钮
      }
    },
    // 查询CI的任务ID
    handlerGetListID(val) {
      this.list_id = val
    },
    		
    handlerTest(git_url, relative_path) {
      console.log(git_url, relative_path, this.hookName)
    },

  },
  created() {
  },
  mounted(){
    this.getPublishDetail()
  },


}
</script>

<template>
  <div>
    <Alert show-icon closable style="margin-bottom:25px; margin-top:25px">
      <p>1、本项目的开发人员可以拉取拥有权限的代码和查看持续集成，开发或者测试可以提测。</p>
      <p>2、持续集成 需要联系运维同事在【代码仓库】里配置持续集成的钩子，一般为开发自己的分支或者通用开发分支，也可以使用tag，触发持续集成后，会记录生产任务的ID，通过任务ID来查看相关内容</p>
     </Alert>

      <Row style="margin-bottom:10px" v-if="projectInfo.developers_admin">
        <Col span="24">
          <treeselect v-model="repo_id_list" :load-options="loadOptionRepo" :options="repoOptions" :disable-branch-nodes="true" 
            :auto-load-root-options="false" search-nested :multiple="true" placeholder="根据项目需求选择要开发的应用"/>
        </Col>
      </Row>

      <div v-if="run_env === 'dev'">
        <ButtonGroup style="margin-bottom:15px;  margin-top:15px">
          <Button type="error"   @click="handlerSelectRepo()" >保存选择应用</Button>
          <Button type="info"    @click="handlerCheckCI()" >查看持续集成</Button>
          <Button type="success" @click="handlerCheckSubmitTest()">准备发布测试</Button>
        </ButtonGroup>

        <Divider style="margin-bottom:20px; margin-top:10px"/>
      
          <Row style="margin-bottom:10px" v-if="projectInfo.developers_admin">
            <div v-if="selectCheckCI">
              <div v-for="repo_info in repo_info_list">
              <Row style="margin-bottom:15px" :key="`${_uid}_${repo_info.id}`">
                <Col span="12">
                  <Input type="text" v-model="repo_info.ssh_url_to_repo" readonly placeholder="应用"/>
                </Col>
                <Col span="1" style="text-align: center">-</Col>
                <Col  span="11">
                  <Select v-model="hookName"  @on-change="handlerSelectCI(repo_info.git_url, repo_info.relative_path)" :key="`${_uid}_${repo_info.id}`" placeholder="选择钩子查看">
                    <Option v-for="item in repo_info.hook_list" :value="item" :key="`${_uid}_${item}`">{{ item }} </Option>
                  </Select>
                </Col>
              </Row>
              </div>
            </div>

            <div v-else>
                <Row style="margin-bottom:10px">
                    <Col span="8" ><b>应用地址</b></Col>
                    <Col span="5" offset="1"><b>发布标签</b></Col>
                    <Col span="6" offset="1"><b>数据库更新</b></Col>
                    <Col span="1"  offset="1"><b>优先级</b></Col>
                </Row>

                <div v-for="repo_info in repo_info_list">
                  <Row style="margin-bottom:15px" :key="`${_uid}_${repo_info.id}`">
                    <Col span="8">
                        <Input type="text" v-model="repo_info.ssh_url_to_repo" readonly placeholder="应用"/>
                    </Col>
                    <Col span="1" style="text-align: center">-</Col>
                    <Col  span="5">
                      <Input v-if="!repo_info.project_id"  v-model="repo_info.project_tag" type="text" :key="`${_uid}_${repo_info.id}`" clearable :maxlength="50" placeholder="输入提测标签"/>
                      <Select v-else v-model="repo_info.project_tag" :key="`${_uid}_${repo_info.id}`"
                        @click.native="getCodeRepoTags(repo_info.git_url, repo_info.project_id)" placeholder="选择提测的标签">
                        <Option v-for="item in repo_info.tag_list" :value="item">{{ item }} </Option>
                    </Select>
                    </Col>
                    <Col span="1" style="text-align: center">-</Col>
                    <Col span="6" style="text-align: center"> 
                      <Input type="text" v-model="repo_info.project_sql" :maxlength="80" placeholder="输入数据库语句的地址"/>
                    </Col>
                    <Col span="1" style="text-align: center">-</Col>
                    <Col span="1" style="text-align: center">
                        <InputNumber :max="20" :min="1" v-model="repo_info.project_level" placeholder="优先级，数字越小优先级越高"></InputNumber>
                    </Col>
                    <!-- <Col span="1" style="text-align: center">
                      <Button style="float:right"  @click="handlerShowSql(repo_info.id)" :key="`${_uid}_${repo_info.id}`">
                       <Icon type="ios-create"/>SQL</Button>
                    </Col> -->
                    <!-- <br><br>
                    <Col span="24" v-if="repo_info.sql_true">
                      <editor v-model="repo_info.project_sql" @init="editorInit" :mode_type="mode_type" :read="editor.read" :key="`${_uid}_${repo_info.id}`" ></editor>
                    </Col> -->
                  </Row>                
                </div>

                <Row style="margin-bottom:10px">
                  <Col>
                    <Button type="primary" :loading="user_btn_loading" icon="ios-create" @click="handleSubmitQA()">确定开始提测</Button>
                  </Col>
                </Row>
                
            </div>
          </Row>
        </div>
  </div>
</template>

<script>
import { getGittree2, getGitRepotags, getGitHooklog } from '@/api/git-repo'
import { operationProjectPublish } from '@/api/task-other'
import Treeselect from '@riophae/vue-treeselect'
import { LOAD_ROOT_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import editor from '@/components/public/editor'
export default {
  components: {Treeselect, editor},
  props: {
    projectInfo: {
       type: Object,
       default: null
    }
  },
   data () {
    return {
      //
      mode_type: 'sql',
      editor:{
        title: '编辑',
        read: false,
        color: "primary"
      },
      //
      user_btn_loading: false,
      list_id: null, //订单ID
      hookName:'', //选择查看的钩子
      selectCheckCI : true,
      repo_id_list: [],
      repo_info_list: [],
      repoOptions: null,
      repositoryList:[], //代码仓库
      run_env: 'dev',
    }
  },
  methods:{
    getProjectInfo(dataValue) {
        let data = dataValue
        // this.run_env =  data.run_env
        let repo_info = JSON.parse(data.repo_info)
        //仓库详情
        this.repo_info_list = repo_info.repo_info_list
        ////仓库id
        let new_repo_id_list = []
        this.repo_info_list.forEach(element => {
            new_repo_id_list.push(element.id)
          });
        this.repo_id_list = new_repo_id_list
    },
    // 获取仓库地址
    getCodeRepository() {
      getGittree2().then(res => {
        if (res.data.code === 0) {
          this.repoOptions =res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },
    async loadOptionRepo({ action/*, callback*/ }) {
      if (action === LOAD_ROOT_OPTIONS) {
        this.getCodeRepository()
      }
    },
    // 选择仓库
    handlerSelectRepo(val){
      this.user_btn_loading = true
      setTimeout(() => {
        operationProjectPublish({"project_id": this.project_id, "repo_id_list": this.repo_id_list}, "patch")
        .then(res => {
          if (res.data.code === 0) {
            let repo_info = res.data.data
            this.repo_info_list = repo_info.repo_info_list
            //
            let new_repo_id_list = []
            this.repo_info_list.forEach(element => {
                new_repo_id_list.push(element.id)
            });
            this.repo_id_list = new_repo_id_list     //仓库id

            this.$Message.success(`${res.data.msg}`);
          } else {
            this.$Message.error(`${res.data.msg}`);
          }
        });
        this.user_btn_loading = false
      }, 1000);
    },
    // 查看项目的标签
    getCodeRepoTags(git_url, project_id) {
      if (!project_id) {
        this.$Message.error(`没有项目ID，无法自动获取`);
        return
      }
      getGitRepotags(git_url, project_id).then(res => {
        if (res.data.code === 0) {
          let new_repo_info_list = []
          this.repo_info_list.forEach(element => {
            if (element.project_id == project_id) {
              element.tag_list = res.data.data
            }
            new_repo_info_list.push(element)
          });
          this.repo_info_list = new_repo_info_list
          // this.repo_tag_list =res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },
    handlerCheckSubmitTest() {
      this.selectCheckCI = false
      this.$emit('getListID', null)
    },
    handlerCheckCI(){
      this.selectCheckCI = true
    },

    handlerSelectCI(git_url, relative_path){
      if (!this.hookName) {
        return
      }else{
        this.getGitHookLog(git_url, relative_path)
      }
    },

    getGitHookLog (git_url, relative_path) {
      getGitHooklog(null, git_url, relative_path, this.hookName).then(res => {
        if (res.data.code === 0) {
          this.list_id = res.data.data
          this.$emit('getListID', this.list_id)
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    //SQL
    editorInit: function () {
      require(`brace/mode/${this.mode_type}`)    //language
      require('brace/theme/terminal')
      require('brace/theme/xcode')
    },
    // 展开SQL
    handlerShowSql(val) {
      let new_repo_info_list = []
      this.repo_info_list.forEach(element => {
          if (element.id == val) {
            element.sql_true = !element.sql_true
          }
          new_repo_info_list.push(element)
      });
    },
    //
    handleSubmitQA() {
      this.repo_info_list.forEach(element => {
        if (!element.project_tag) {
          this.$Notice.error({
                    title: element.relative_path,
                    desc: `提测的标签不能为空`
          });
          throw new Error("提测的标签不能为空，故意抛出用来跳出循环");//报错，就跳出循环
        }else if (!element.project_level) {
          this.$Notice.error({
                    title: element.relative_path,
                    desc: `提测的优先级不能为空，数字越小，优先级越高`
          });
          throw new Error("提测的优先级不能为空，数字越小，优先级越高。故意抛出用来跳出循环");//报错，就跳出循环
        }
      });
      // 开始提测
      this.user_btn_loading = true
      setTimeout(() => {
        operationProjectPublish({"project_id": this.project_id, "project_test": this.repo_info_list}, "patch")
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`);
          } else {
            this.$Message.error(`${res.data.msg}`);
          }
        });
        this.user_btn_loading = false
      }, 1000);
      //
    },
  },
  watch:{
    projectInfo: function(){
      this.project_id = this.projectInfo.id
    }
  },
  mounted(){
    this.project_id = this.projectInfo.id
    this.run_env = this.projectInfo.run_env
    this.getProjectInfo(this.projectInfo)
    this.getCodeRepository()
  },
}
</script>



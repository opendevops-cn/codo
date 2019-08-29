<template>
  <div>
    <Row style="margin-top:8px;margin-bottom:10px">
      <Col span="3">
        <p> <b>项目创建时间：</b> </p>
      </Col>
            <Col span="12">
              <p> {{projectInfo.create_time}}</p>
            </Col>
            <Col span="3">
              <p> <b>预计上线时间：</b> </p>
            </Col>
            <Col span="6">
              <p> {{projectInfo.start_time}}</p>
            </Col>
          </Row>
          <Row style="margin-bottom:10px">
            <Col span="3">
              <b>项目名称：</b>
            </Col>
            <Col span="18">
              {{projectInfo.project_name}}
            </Col>
          </Row>
          <Row style="margin-bottom:10px">
            <Col span="3">
              <b>项目描述：</b>
            </Col>
            <Col span="18">
              {{projectInfo.description}} 
            </Col>
          </Row>
          <Row style="margin-bottom:10px">
            <Col span="3">
              <b>项目管理：</b>
            </Col>
            <Col span="18">
              <treeselect v-model="projectInfo.pm" :multiple="true" :disable-branch-nodes="true" 
              :limit="5" search-nested :options="treeData"  placeholder="选择项目的PM，创建者自动加入"/>
            </Col>
            <Col v-if="projectInfo.pm_admin" span="3">
              <Button type="text" :loading="user_btn_loading" style="float:right" icon="ios-create" @click="handlerChangeUser('pm', projectInfo.pm)">保存</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px">
            <Col span="3">
              <b>开发人员：</b>
            </Col>
            <Col span="18">
                <treeselect v-model="projectInfo.developers" :multiple="true" :disable-branch-nodes="true" 
                :limit="8" search-nested :options="treeData"  placeholder="关联开发人员"/>
            </Col>
            <Col span="3" v-if="projectInfo.pm_admin || projectInfo.developers_admin">
              <Button type="text" :loading="user_btn_loading" style="float:right" icon="ios-create" @click="handlerChangeUser('developers', projectInfo.developers)">保存</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px">
            <Col span="3">
              <b>测试人员：</b>
            </Col>
            <Col span="18">
                <treeselect v-model="projectInfo.tester":multiple="true" 
                :disable-branch-nodes="true" 
                :limit="5" search-nested :options="treeData"  placeholder="关联测试人员"/>
            </Col>
            <Col span="3" v-if="projectInfo.pm_admin || projectInfo.developers_admin || projectInfo.tester_admin">
              <Button type="text" :loading="user_btn_loading" style="float:right" icon="ios-create" @click="handlerChangeUser('tester', projectInfo.tester)">保存</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px">
            <Col span="3">
              <b>DBA：</b>
            </Col>
            <Col span="18">
                <treeselect v-model="projectInfo.dba" 
                :multiple="true" :disable-branch-nodes="true" 
                :limit="5" search-nested :options="treeData"  placeholder="关联数据库管理员处理数据库相关事宜"/>
            </Col>
            <Col span="3" v-if="projectInfo.pm_admin || projectInfo.developers_admin" v-model="projectInfo.dba" >
              <Button type="text" :loading="user_btn_loading" style="float:right" icon="ios-create" @click="handlerChangeUser('dba', projectInfo.dba)">保存</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px">
            <Col span="3">
              <b>其他人员：</b>
            </Col>
            <Col span="18">
                <treeselect  v-model="projectInfo.other_user" :multiple="true" :disable-branch-nodes="true" 
                :limit="5" search-nested :options="treeData"  placeholder="其他流程通知人员"/>
            </Col>
            <Col span="3" v-if="projectInfo.pm_admin">
              <Button type="text" :loading="user_btn_loading" style="float:right" icon="ios-create" @click="handlerChangeUser('other_user', projectInfo.other_user)">保存</Button>
            </Col>
          </Row>
        </div>
    </div>
</template>

<script>
import { operationProjectPublish } from '@/api/task-other'
import { getUsertree } from '@/api/user'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: {Treeselect},
  props: {
    projectInfo: {
       type: Object,
       default: null
    }
  },
   data () {
    return {
      user_btn_loading: false,
      treeData: [],
    }
  },
  methods:{
    getUserTree() {
      getUsertree().then(res => {
        if (res.data.code === 0) {
          this.treeData = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handlerChangeUser(user_type, val){
      this.user_btn_loading = true
      setTimeout(() => {
        operationProjectPublish({"project_id": this.projectInfo.id, "user_type":user_type, "user_value": val}, "patch")
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`);
          } else {
            this.$Message.error(`${res.data.msg}`);
          }
        });
        this.user_btn_loading = false
      }, 1000);
    },
  },
  watch:{
    projectInfo: function(){
      console.log(this.project_id)
    }
  },
  mounted(){
    this.getUserTree()
  },
}
</script>



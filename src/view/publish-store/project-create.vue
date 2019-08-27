<template>
  <div style="height:100%">
    <Card>
      <Row style="margin-top:10px;">
        <Col span="22" offset="1">
           <Steps :current="0">
            <Step title="进行中" content="创建项目并且完善项目信息，通知关联的所有人"></Step>
            <Step title="待进行" content="开发人员选择应用，开始开发，通知BA"></Step>
            <Step title="待进行" content="开发中，并根据指定的钩子开始持续集成，代码检查、编译、单元测试"></Step>
            <Step title="待进行" content="通知QA进入测试环节，如果有数据库更新则需要通知DBA"></Step>
            <Step title="待进行" content="DBA、QA通过后检查预发布环境、通过后预发布环境发布"></Step>
            <Step title="待进行" content="通知OPS，发布评估 【资源调整、确认时间】，完成后通知BA"></Step>
           </Steps>
           <br>
        </Col>
        <Col span="22" offset="1">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="85">
          <FormItem label="项目名称" prop="project_name" >
             <Input type="text" v-model="formValidate.project_name"  :maxlength=100 placeholder="请输入项目名称"></Input>
          </FormItem>
          <FormItem label="项目管理">
            <div>
              <treeselect v-model="formValidate.pm" :multiple="true" :disable-branch-nodes="true" :limit="3" search-nested :options="treeData"  placeholder="选择项目的PM，创建者自动加入"/>
            </div>
          </FormItem>
          <FormItem label="开发人员">
              <treeselect v-model="formValidate.developers":multiple="true" :disable-branch-nodes="true" search-nested :options="treeData"  placeholder="选择项目的开发人员"/>
          </FormItem>
          <FormItem label="测试人员">
            <div>
              <treeselect v-model="formValidate.tester":multiple="true" :disable-branch-nodes="true" search-nested :options="treeData"  placeholder="选择项目测试人员"/>
            </div>
          </FormItem>
          <Row>
          <FormItem label="DBA">
            <div>
              <treeselect v-model="formValidate.dba":multiple="true" :disable-branch-nodes="true"  :limit="3" search-nested :options="treeData"  placeholder="选择项目的DBA"/>
            </div>
          </FormItem>
          <FormItem label="其他人员">
            <div>
              <treeselect v-model="formValidate.other_user":multiple="true" :disable-branch-nodes="true"  :limit="3" search-nested :options="treeData"  placeholder="其他流程通知人员"/>
            </div>
          </FormItem>
           </Row>
           <FormItem label="选择流程" prop="env_list">
            <Select v-model="formValidate.env_list" filterable placeholder="选择发布的流程" >
              <Option v-for="item in envList" :value="item" :key="item" >{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem label="项目描述" >
             <Input type="textarea" v-model="formValidate.description"  :maxlength=2000 :autosize="{minRows: 3,maxRows: 10}" placeholder="请输入项目描述"></Input>
          </FormItem>
          <FormItem label="上线时间" prop="start_time">
            <DatePicker  v-model="formValidate.start_time" type="datetime" :options="optionsDate"
              format="yyyy-MM-dd HH:mm:ss"
              show-week-numbers editable
              placeholder="选择一个上线时间，上线之前可以调整"  style="width: 360px"
            ></DatePicker>
          </FormItem>
          <FormItem>
            <Button type="primary" :loading="btn_loading" @click="handleSubmit('formValidate')" >提交</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
          </FormItem>
        </Form>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getUsertree } from '@/api/user'
import { projectPublish } from '@/api/task-other'
export default {
  components: { Treeselect },
  data() {
    return {
      //
      envList: ['项目信息-项目开发-测试环境-预发布环境-任务审核-灰度环境-正式环境','项目信息-项目开发-测试环境-性能环境-预发布环境-沙箱环境-任务审核-灰度环境-正式环境'],
      treeData: [],
      btn_loading: false,
      optionsDate: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      formValidate: {
        project_name: "",
        description: "",
        pm: [],
        developers: [],
        tester: [],
        dba: [],
        other_user:[],
        env_list: '项目信息-项目开发-测试环境-预发布环境-任务审核-灰度环境-正式环境',
        start_time: ""
        // env_list: ['测试环境', '集成测试', '性能环境', '预发环境', '正式环境'],
      },
      ruleValidate: {
        project_name: [ {required: true, message: "项目名不能为空", trigger: "blur"}],
        start_time: [{ required: true, type: 'date', message: '请选择时间', trigger: 'change'}],
        env_list: [{ required: true,  message: '请选择发布的流程，不能为空', trigger: 'blur'}],
      }
    };
  },
  methods: {
    getUserTree () {
      getUsertree().then(res => {
        if (res.data.code === 0) {
          this.treeData = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 获取用户列表
    // getUserList () {
    //   getuserlist(1, 300).then(res => {
    //     if (res.data.code === 0) {
    //       this.allUser = res.data.data
    //     } else {
    //       this.$Message.error(`${res.data.msg}`)
    //     }
    //   })
    // },

    handleSubmit(value) {
      console.log(this.formValidate)
      if (this.formValidate.developers.length === 0) {
        this.$Message.error(`请添加开发人员`);
        return
      }
      if (this.formValidate.tester.length === 0) {
        this.$Message.error(`请添加测试人员`);
        return
      }
      this.btn_loading = true;
      this.$refs[value].validate((valid) => {
        if (valid) {
          setTimeout(() => {
            projectPublish(this.formValidate, "post").then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`);
              } else {
                this.$Message.error(`${res.data.msg}`);
              }
            });
            this.btn_loading = false;
          }, 1000);
        } else {
          this.$Message.error('表单校验错误');
          this.btn_loading = false;
        }
      })
    },
    handleReset(value) {
      this.$refs[value].resetFields();
    }
  },
  mounted() {
    this.getUserTree()
  }
};
</script>

<style scoped>
</style>

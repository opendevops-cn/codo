<template>
  <div style="background:#eee">
    <Card style="height:100%; ">
      <Row style="margin-top:10px;">
        <Col span="22" offset="1">
          <!-- <Alert show-icon>
            <h4 style="color: #ed4014">
              <p>微服务项目上线流程管理</p>
            </h4>
          </Alert> -->
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
        <Col span="20" offset="1">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="70">
          <FormItem label="项目名称" prop="project_name" >
             <Input type="text" v-model="formValidate.project_name"  :maxlength=100 placeholder="请输入项目名称"></Input>
          </FormItem>
          <FormItem label="PM">
            <div>
              <treeselect v-model="formValidate.PM" :multiple="true" :disable-branch-nodes="true" search-nested :options="treeData"  placeholder="选择项目的PM，创建者自动加入PM"/>
            </div>
          </FormItem>
          <FormItem label="BA">
            <div>
              <treeselect v-model="formValidate.BA":multiple="true" :disable-branch-nodes="true" search-nested :options="treeData"  placeholder="选择项目的BA"/>
            </div>
          </FormItem>
          <FormItem label="RD" prop="RD" >
            <div>
              <treeselect v-model="formValidate.RD":multiple="true" :disable-branch-nodes="true" search-nested :options="treeData"  placeholder="选择项目的开发人员"/>
            </div>
          </FormItem>
          <FormItem label="QA" prop="QA" >
            <div>
              <treeselect v-model="formValidate.QA":multiple="true" :disable-branch-nodes="true" search-nested :options="treeData"  placeholder="选择项目测试人员"/>
            </div>
          </FormItem>
          <Row>
          <FormItem label="DBA" >
            <div>
              <treeselect v-model="formValidate.DBA":multiple="true" :disable-branch-nodes="true" search-nested :options="treeData"  placeholder="选择项目的DBA"/>
            </div>
          </FormItem>
           </Row>
           <FormItem label="添加环境">
            <Select v-model="formValidate.env_list" filterable multiple placeholder="请选择关联的标签" >
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
        <Col span="3" offset="1">
        </Col>
        <!-- <Divider>开发选择要开发的代码仓库，并且选择标签或者分支触发规则，如果没有请联系管理员创建钩子规则</Divider>
          <Select v-model="formValidate.env_list" filterable multiple placeholder="请选择关联的标签" >
            <Option v-for="item in envList" :value="item" :key="item" >{{ item }}</Option>
          </Select>
        <Divider>开发完毕 提交测试，包括数据库语句和branch/tag</Divider>
        <Divider>DBA审核语句，发布至测试，通知QA开始测试，并且展示接口</Divider>
        <Divider>测试通过 开始检查预发布环境是否存在并且正在测试</Divider>
        <Divider>预发布环境的发布任务，详情，测试接口</Divider> -->
      </Row>
    </Card>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getUsertree } from '@/api/user'
export default {
   components: { Treeselect },
  data() {
    return {
      //
      envList: ['性能环境', '沙箱环境'],
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
        PM: null,
        BA: null,
        RD: null,
        QA: null,
        DBA: null,
        env_list: [],
        start_time: ""
        // env_list: ['测试环境', '集成测试', '性能环境', '预发环境', '正式环境'],
      },
      ruleValidate: {
        project_name: [ {required: true, message: "项目名不能为空", trigger: "blur"}],
        RD: [ {required: true, message: "项目名不能为空", trigger: "blur"}],
        QA: [ {required: true, message: "项目名不能为空", trigger: "blur"}],
        start_time: [{ required: true, type: 'date', message: 'Please select the date', trigger: 'change'}],
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

    handleSubmit(value) {
      this.btn_loading = true;
      if (this.submitInfo.length === 0 || this.submitInfo.length > 100) {
         this.$Message.error('请选择一个标签，并确保标签下有主机，并且主机不能大于100');
        this.btn_loading = false;
        return
      }
      this.$refs[value].validate((valid) => {
        if (valid) {
          setTimeout(() => {
            this.formValidate['hostnames'] = this.submitInfo
            operationCustomtask(this.formValidate, "post").then(res => {
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

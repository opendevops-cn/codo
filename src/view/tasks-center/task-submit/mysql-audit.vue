<template>
  <div style="height:100%">
    <Card>
      <Row style="margin-top: 0px;">
        <Col span="15">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
          <FormItem label="目标标签" prop="tag" >
            <Select v-model="formValidate.tag" filterable  placeholder="请选择关联的标签"  @on-change="handleSelect(formValidate.tag)">
              <Option v-for="item in allTagList" :value="item.tag_name" :key="item.id" >{{ item.tag_name }}</Option>
            </Select>
          </FormItem>
          <FormItem v-if="submitInfo.length > 0 " label="目标数据库">
            <span v-for="db_code in submitInfo" :key="db_code">
              <tag color="success" closable @on-close="handleClose">{{db_code}}</tag>
            </span>
          </FormItem>
          <FormItem label="SQL语句" prop="sql_data" >
            <editor v-model="formValidate.sql_data" @init="editorInit" :mode_type="mode_type" :read="editor.read"  :editorHeight=520 :key="`${_uid}`" ></editor>
            <!-- <Input v-model="formValidate.sql_data" type="textarea"  :rows="20" :maxlength=63000 
               placeholder="请输入你的数据语句语句，长度不超过63000">
            </Input> -->
          </FormItem>
          <FormItem label="审批人员" prop="approver">
            <Select v-model="formValidate.approver" filterable placeholder="请选择审批的用户">
             <Option v-for="item in allUser" :value="item.nickname" :key="item.id">{{ item.nickname }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" :loading="btn_loading" @click="handleSubmit('formValidate')" >提交</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
          </FormItem>
        </Form>
        </Col>
        <Col span="7" offset="1">
        <Alert show-icon>
          <h4 style="color: #ed4014">
            <p>1.当前页面使用标签关联相关数据库，选取标签下的mysql的写库</p>
            <p>2.本服务多部署在内网，为了适配多云多区域，需要经过代理连接数据库，标签里面应配置代理主机，当前任务会跳转到代理主机执行数据库审核</p>
            <p>3.请使用标准的SQL语句，从语句上选择数据库。</p>
            <p>4.使用内建模板ID：330 主机组为1在没有熟悉模板的使用之前，不要随意更改相关任务模板</p>
          </h4>
        </Alert>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import { getAuthTaglist, getDBlist, getMysqlAudit,operationMysqlAudit} from '@/api/task-other'
import { getuserlist } from '@/api/user'
import editor from '@/components/public/editor'
export default {
  components: {editor},
  data() {
    return {
      //
      mode_type: 'mysql',
      editor:{
        title: '编辑',
        read: false,
        color: "primary"
      },
      //
      allUser: [],
      allTagList: [],
      submitInfo: [],
      btn_loading: false,
      formValidate: {
        tag: "",
        sql_data: "",
        approver: ""
      },
      ruleValidate: {
        tag: [ {required: true, message: "The databases cannot be empty", trigger: "blur"}],
        sql_data: [ {required: true, message: "The sql data cannot be empty", trigger: "blur"},
                    { type: 'string', max: 63000, message: '不能超过63000个字节', trigger: 'blur'}
                  ],
        approver: [ {required: true, message: "The approver cannot be empty", trigger: "blur"}]
      }
    };
  },
  methods: {
    handleSelect(value) {
      getMysqlAudit('tag_name', value).then(res => {
        if (res.data.code === 0) {
          this.submitInfo = res.data.data;
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },
    //
    // 获取用户列表
    getUserList () {
      getuserlist(1, 3000).then(res => {
        if (res.data.code === 0) {
          this.allUser = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 获取标签列表
    getAllTagList () {
      getAuthTaglist().then(res => {
        if (res.data.code === 0) {
          this.allTagList = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handleClose(event, value) {
      this.$Message.error(`一家人要整整齐齐的`);
    },
     //SQL
    editorInit: function () {
      require(`brace/mode/${this.mode_type}`)    //language
      require('brace/theme/terminal')
      require('brace/theme/xcode')
    },
    handleSubmit(value) {
      this.btn_loading = true;
      if (this.submitInfo.length === 0) {
         this.$Message.error('当前标签下没有数据库');
        this.btn_loading = false;
        return
      }
      this.$refs[value].validate((valid) => {
        if (valid) {
          setTimeout(() => {
            operationMysqlAudit(this.formValidate, "post").then(res => {
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
    this.getUserList()
    this.getAllTagList()
  }
};
</script>

<style scoped>
</style>

<template>
  <div style="height:100%">
     <Card>
      <Row>
        <Col span="24">
          <Alert show-icon>
            <h4 style="color: #ed4014">
              <p>1.当前页面使用标签关联相关数据库，选取标签下的mysql, SQL优化使用内建模板ID：331 主机组为1，在没有熟悉模板的使用之前，不要随意更改相关任务模板</p>
              <p>2.本服务多部署在内网，为了适配多云多区域，需要经过代理连接数据库，标签信息里面应配置代理主机，当前任务会跳转到代理主机执行</p>
            </h4>
          </Alert>
           <br>
        </Col>
        <Col span="12">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
          <FormItem label="目标标签" prop="tag" >
            <Select v-model="formValidate.tag" filterable  placeholder="请选择关联的标签"  @on-change="handleSelect(formValidate.tag)">
              <Option v-for="item in allTagList" :value="item.tag_name" :key="item.id" >{{ item.tag_name }}</Option>
            </Select>
          </FormItem>
          <FormItem v-if="submitInfo.length > 0 " label="目标库">
            <span v-for="db_code in submitInfo">
              <tag color="success" closable :key="db_code" :name="db_code" @on-close="handleClose">{{db_code}}</tag>
            </span>
          </FormItem>
          <FormItem label="数据库名" prop="db_name">
            <Input v-model="formValidate.db_name" placeholder="输入数据库名"></Input>
          </FormItem>
          <FormItem label="优化类型" prop="the_type">
            <RadioGroup v-model="formValidate.the_type">
              <Radio label="soar">SOAR</Radio>
              <Radio label="sqladvisor">SQLAdvisor</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="SQL语句" prop="sql_data" >
            <editor v-model="formValidate.sql_data" @init="editorInit" :mode_type="mode_type" :read="editor.read"  :editorHeight=450 :key="`${_uid}`" ></editor>
            <!-- <Input  v-model="formValidate.sql_data" type="textarea"  :rows="18" :maxlength=30000
               placeholder="请输入你的数据语句语句，长度不超过30000">
            </Input> -->
          </FormItem>
          <FormItem  label="操作">
            <div v-if="formValidate.the_type === 'soar'">
              <Button type="primary" :loading="btn_loading" @click="handleSubmit('formValidate','score')" >SQL评分</Button>
              <Button type="primary" style="margin-left: 30px" :loading="btn_loading" @click="handleSubmit('formValidate','fingerprint')" >SQL指纹</Button>
              <Button type="primary" style="margin-left: 30px" :loading="btn_loading" @click="handleSubmit('formValidate', 'prettify')" >SQL美化</Button>
              <Button type="primary" style="margin-left: 30px" :loading="btn_loading" @click="handleSubmit('formValidate','check')" >语法检查</Button>
            </div>
            <div v-if="formValidate.the_type === 'sqladvisor'">
              <Button type="primary" :loading="btn_loading" @click="handleSubmit('formValidate', 'index')" >索引优化</Button>
              <Button @click="handleReset('formValidate')" style="margin-left: 30px">清空</Button>
            </div>
          </FormItem>
        </Form>
        </Col>
        <Col span="11" offset="1">
         <Alert>
           <p>查询结果/SOAR 语法检查</p>
         </Alert>
            <Row v-for="log in logInfo">
              <Col span="23">
                <p style="font-size:12px;">{{log}}</p>
              </Col>
            </Row>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import { getAuthTaglist, getMySQLOpt, operationMySQLOpt} from '@/api/task-other'
import { logWSUrl } from '@/api/task-other'
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
      log_key:"",
      logInfo: [],
      allTagList: [],
      submitInfo: [],
      btn_loading: false,
      formValidate: {
        tag: "",
        sql_data: "",
        db_name:"",
        the_type: "soar"
      },
      ruleValidate: {
        tag: [ {required: true, message: "The databases cannot be empty", trigger: "blur"}],
        sql_data: [ {required: true, message: "The sql data cannot be empty", trigger: "blur"},
                    { type: 'string', max: 30000, message: '不能超过30000个字节', trigger: 'blur'}
                  ],
        db_name: [ {required: true, message: "数据库名不能为空", trigger: "blur"}],
        the_type: [ {required: true, message: "优化类型不能为空", trigger: "blur"}]
      }
    };
  },
  methods: {
    handleSelect(value) {
      getMySQLOpt('tag_name', value).then(res => {
        if (res.data.code === 0) {
          this.submitInfo = res.data.data;
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
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
    handleClose(event, name) {
      const index = this.submitInfo.indexOf(name);
      this.submitInfo.splice(index, 1);
    },
    handleSubmit(value, theWay) {
      this.btn_loading = true;
      if (this.submitInfo.length !== 1) {
        this.$Message.error('请选择一个数据库，并且只能选择一个数据库');
        this.btn_loading = false;
        return
      }
      this.$refs[value].validate((valid) => {
        if (valid) {
          setTimeout(() => {
            this.formValidate['db_code'] = this.submitInfo[0]
            this.formValidate['the_way'] = theWay
            operationMySQLOpt(this.formValidate, "post").then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`);
                const resData= res.data.data
                this.handlerCheckLog (resData.list_id, resData.task_group, resData.task_level, resData.exec_ip)
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
    },
    handlerCheckLog (listID, taskGroup, taskLevel, execIP) {
      this.log_key = listID + '_' + taskGroup + '_' + taskLevel + '_' + execIP
      this.websocket(this.log_key )
    },
     //SQL
    editorInit: function () {
      require(`brace/mode/${this.mode_type}`)    //language
      require('brace/theme/terminal')
      require('brace/theme/xcode')
    },
    websocket (log_key) {
      if (ws) {
        ws.close()
        this.logInfo = []
      }
      let ws = new WebSocket(logWSUrl)
      ws.onopen = () => {
        // Web Socket 已连接上，使用 send() 方法发送数据
        ws.send(log_key)
        console.log('获取日志...')
      }
      ws.onmessage = evt => {
        this.logInfo = evt.data.split('----')
        console.log('数据已接收...')
      }
      ws.onclose = function () {
        console.log('连接已关闭...')
      }
       console.log('20S后关闭websocket')
      setTimeout(() => {
        ws.close()
      }, 20000);
      // 组件销毁时调用，中断websocket链接
      this.over = () => {
        ws.close()
        this.logInfo = []
      }
    },
  },
  mounted() {
    this.getAllTagList()
  }
};
</script>

<style scoped>
</style>

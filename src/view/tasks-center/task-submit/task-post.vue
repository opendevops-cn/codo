<template>
  <div style="height:100%">
    <Card>
      <Row style="margin-top:10px;">
        <Col span="14">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
          <FormItem label="POST JSON" prop="post_data" >
            <Input v-model="formValidate.post_data" type="textarea"  :rows="23" :maxlength=6000
               placeholder="请输入你的数据，参考上面的示例，你也可以二次开发对接自己的CMDB获取主机, 时间字段从下面获取，方便处理">
            </Input>
          </FormItem>
          <FormItem label="执行时间" prop="start_time">
            <DatePicker  v-model="formValidate.start_time" type="datetime" :options="optionsDate"
              format="yyyy-MM-dd HH:mm:ss"
              show-week-numbers editable
              placeholder="选择一个执行时间，用来触发模板中的定时触发器"  style="width: 360px"
            ></DatePicker>
          </FormItem>
          <FormItem>
            <Button type="primary" :loading="btn_loading" @click="handleSubmit('formValidate')" >提交</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
          </FormItem>
        </Form>
        </Col>
        <Col span="8" offset="1">
          <Alert show-icon>
            <h4 style="color: #ed4014">
              <p>{
                "task_name":"任务名称",
                "submitter":"提交人",
                "temp_id": "1",
                "schedule":"ready",
                "exec_time":"2018-11-27 14:09:50",
                "associated_user": "{'group-1': ['杨红飞']}",
                "args": "{'VERSION':'eeee', 'arg02': 'xxxx'}",
                "details":"这里是备注",
                "hosts": "{1: '127.0.0.1'}"
                }
              </p><br/>
              <p>1. task_name: 任务名字</p>
              <p>2. submitter: 提交人</p>
              <p>3. temp_id： 模板ID，就是你上面创建模板时候生成的那个ID</p>
              <p>4. schedule： 这是状态，常用的有ready和new   ready：表示不通过人工审核，只要到了执行时间直接执行任务 new： 表示需要任何审核，管理员审核，选择执行时间，到时间后开始执行</p>
              <p>5. exec_time： 任务执行时间，状态为ready的情况下，到这个时间会进行执行</p>
              <p>6. args：这里是一个字典，里面的参数可以自行定义，如上，你模板参数里面用到了哪些你都可以在这里定义出来，当你的POST到这个接口时候，我们会自动接受此参数，并帮你运行脚本 解析你要传入的参数。</p>
              <p>7. details： 描述，备注信息</p>
              <p>8. hosts： 这个是执行主机，字典形式，
                1表示第一组主机，也就是上面模板里面的组1，任务支持多组。
                主机IP，这个是执行主机，这个废话多一点，比如我以上模板的脚本在172.16.0.101这台主机上，我就想平台登陆我这个主机，来帮我执行这些脚本，至于怎么登陆，那么就是我最开始在平台里面配置了一个执行用户，我将我这个主机的私钥放到了平台上，公钥在我服务器上，这样子CODO平台就可以ssh -i xxxx.pem @{ip_address}远程到我的主机上帮我执行命令。
              </p>
            </h4>
          </Alert>
          <br>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import {operationPosttask} from '@/api/task-other'
export default {
  data() {
    return {
      btn_loading: false,
      optionsDate: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      formValidate: {
        post_data: "",
        start_time:"",
      },
      ruleValidate: {
        post_data: [ {required: true, message: "提交的数据必须为JSON格式，请严格按照说明提交", trigger: "blur"}],
        start_time: [{ required: true, type: 'date', message: 'Please select the date', trigger: 'change'}],
      }
    };
  },
  methods: {
    handleSubmit(value) {
      this.btn_loading = true;
      this.$refs[value].validate((valid) => {
        if (valid) {
          setTimeout(() => {
            operationPosttask(this.formValidate, "post").then(res => {
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
  }
};
</script>

<style scoped>
</style>

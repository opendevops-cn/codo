<template>
  <div style="height:100%">
    <Card>
      <Row style="margin-top:10px;">
        <Col span="22" offset="1">
          <Alert show-icon>
            <h4 style="color: #ed4014">
              <p>1.当前页面使用标签关联相关主机，选取标签下的主机, 系统直连主机并发执行选择模板的任务，为了减轻任务压力，限制并发100以内</p>
            </h4>
          </Alert>
           <br>
        </Col>
        <Col span="19" offset="1">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="180">
          <FormItem label="目标标签" prop="tag" >
            <Select v-model="formValidate.tag" filterable  placeholder="请选择关联的标签"  @on-change="handleSelect(formValidate.tag)">
              <Option v-for="item in allTagList" :value="item.tag_name" :key="item.id" >{{ item.tag_name }}</Option>
            </Select>
          </FormItem>
          <FormItem v-if="submitInfo.length > 0 " label="目标主机">
            <span v-for="item in submitInfo">
              <tag color="success" closable :key="item" :name="item" @on-close="handleClose">{{item}}</tag>
            </span>
          </FormItem>
           <FormItem label="选择模板" prop="temp_id">
            <Select v-model="formValidate.temp_id" filterable @on-change="handlerSelectTemp(formValidate.temp_id)" placeholder="请选择关联的模板" >
              <Option v-for="item in tempList" :value="item.temp_id" :key="item.temp_id" >{{ item.temp_name }}</Option>
            </Select>
          </FormItem>
          <FormItem v-for="(item, index) in formValidate.args_items" v-if="item.status" :key="index" :label="item.label">
              <Input type="text" v-model="item.value" clearable :maxlength=120 :placeholder="`请输入参数${item.key}的值`"></Input>
          </FormItem>
          <!-- <FormItem>
          <Row>
            <Col span="24">
              <Button type="dashed" long  @click="handleAdd" icon="md-add">添加参数</Button>
            </Col>
          </Row>
          </FormItem> -->
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
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import { getAuthTaglist, getCustomtask, operationCustomtask} from '@/api/task-other'
import { getTemplist, getTempargs } from "@/api/task";
import { getuserlist } from '@/api/user'
export default {
  data() {
    return {
      index: 1,
      allTagList: [],
      submitInfo: [],
      tempList: [],
      btn_loading: false,
      optionsDate: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      formValidate: {
        tag: "",
        temp_id: "",
        args_items: [
          // {
          //     key: '',
          //     value: '',
          //     index: 1,
          //     status: 1
          // }
        ]
      },
      ruleValidate: {
        tag: [ {required: true, message: "The databases cannot be empty", trigger: "blur"}],
        temp_id: [ {required: true, type: 'number', message: "必须选择一个执行模板", trigger: "blur"}],
        start_time: [{ required: true, type: 'date', message: 'Please select the date', trigger: 'change'}],
      }
    };
  },
  methods: {
    handleSelect(value) {
      getCustomtask('tag_name', value).then(res => {
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
    getTempList() {
      getTemplist().then(res => {
        if (res.data.code === 0) {
          this.tempList =  res.data.data
          // this.sqlTempList = res.data.data.filter(
          //   res => res.temp_name.search("SQL审核") === 0
          // );
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },
    handleClose(event, name) {
      const index = this.submitInfo.indexOf(name);
      this.submitInfo.splice(index, 1);
    },
    handlerSelectTemp(temp_id){
      getTempargs(temp_id).then(res => {
        if (res.data.code === 0) {
          this.index = 0
          this.formValidate.args_items= []
          //
          res.data.data.forEach(element => {
            this.index++;
            this.formValidate.args_items.push({
              label: res.data.args_dict[element] ? res.data.args_dict[element] : element ,
              key: element,
              value: '',
              index: this.index,
              status: 1
            });
          });
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
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
    },
    // handleAdd () {
    //     this.index++;
    //     if (this.index > 10) {
    //       this.$Message.error('参数超过最大限制')
    //       return
    //     }
    //     this.formValidate.args_items.push({
    //         key: '',
    //         value: '',
    //         index: this.index,
    //         status: 1
    //     });
    // },
    // handleRemove (index) {
    //     this.formValidate.args_items[index].status = 0;
    // }
  },
  mounted() {
    this.getAllTagList()
    this.getTempList()
  }
};
</script>

<style scoped>
</style>

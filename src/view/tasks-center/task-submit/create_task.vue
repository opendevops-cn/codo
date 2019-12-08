<template>
  <div style="height:100%">
    <Card>
      <Row style="margin-top:10px;">
        <Col span="22" offset="1">
          <!-- <Alert show-icon>
            自定义任务系统触发入口，可保存到常用任务，可将当前状态保存下来，方便下次直接通过常用任务直接执行
            <Icon type="ios-bulb-outline" slot="icon"></Icon>
            <template slot="desc"></template>
          </Alert>
          <br /> -->
           <Steps :current="-1">
                <Step title="作业命名" content="这里是给作业起名，方便查询"></Step>
                <Step title="选择作业执行的节点" content="标签会关联主机/数据库等的实例信息"></Step>
                <Step title="选择模板" content="作业任务会根据模板定义的流程执行"></Step>
                <Step title="输入参数" content="把参数传递给模板定义的任务"></Step>
                <Step title="选择时间" content="当模板定义了时间触发的时候，就会获取定义的时间来定时执行"></Step>
                <Step title="提交/保存" content="提交作业开始执行/或者把作业保存到常用作业"></Step>
            </Steps><br /><br />
        </Col>
        <Col span="22" offset="1">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
            <FormItem label="作业名称" prop="task_name">
              <Input v-model="formValidate.task_name" :maxlength="120" placeholder="请输入作业任务的名称"></Input>
            </FormItem>
            <FormItem label="目标标签" prop="tag">
              <Select
                v-model="formValidate.tag"
                filterable
                placeholder="请选择关联的标签"
                @on-change="handleSelect(formValidate.tag)"
              >
                <Option
                  v-for="item in allTagList"
                  :value="item.tag_name"
                  :key="item.id"
                >{{ item.tag_name }}</Option>
              </Select>
            </FormItem>
            <FormItem v-if="submitInfo.length > 0 " label="目标主机">
              <span v-for="item in submitInfo">
                <tag
                  color="success"
                  closable
                  :key="item"
                  :name="item"
                  @on-close="handleClose"
                >{{item}}</tag>
              </span>
            </FormItem>
            <FormItem label="选择模板" prop="temp_id">
              <Select
                v-model="formValidate.temp_id"
                filterable
                @on-change="handlerSelectTemp(formValidate.temp_id)"
                placeholder="请选择关联的模板"
              >
                <Option
                  v-for="item in tempList"
                  :value="item.temp_id"
                  :key="item.temp_id"
                >{{ item.temp_name }}</Option>
              </Select>
            </FormItem>
            <FormItem  v-for="(item, index) in formValidate.args_items" v-if="item.status" :key="index" :label="item.label">
              <Input type="text" v-model="item.value" clearable :maxlength="120" :placeholder="`请输入参数${item.key}的值`" ></Input>
            </FormItem>
            <!-- <FormItem>
          <Row>
            <Col span="24">
              <Button type="dashed" long  @click="handleAdd" icon="md-add">添加参数</Button>
            </Col>
          </Row>
            </FormItem>-->
            <FormItem label="执行时间" prop="start_time">
              <DatePicker
                v-model="formValidate.start_time"
                type="datetime"
                :options="optionsDate"
                format="yyyy-MM-dd HH:mm:ss"
                show-week-numbers
                editable
                placeholder="选择一个执行时间，用来触发模板中的定时触发器"
                style="width: 400px"
              ></DatePicker>
            </FormItem>
            <FormItem label="详情备注" label-position="top" prop="detail">
              <Input
                type="textarea"
                v-model="formValidate.detail"
                :rows="6"
                placeholder="please enter the description"
              />
            </FormItem>
            <FormItem>
              <Button type="primary" :loading="btn_loading" @click="handleSubmit('formValidate')">提交</Button>
              <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
              <Button type="success" :loading="btn_loading" style="margin-left: 8px" @click="handleSaveCommonJobs('formValidate')">保存到常用作业</Button>
              <Button type="success" :loading="btn_loading" style="margin-left: 8px" @click="handleSaveCronJobs('formValidate')">保存到定时作业</Button>
            </FormItem>
          </Form>
        </Col>
        <Col span="8" offset="1"></Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import {
  getAuthTaglist,
  getCustomtask,
  operationCustomtask,
  operationCommonjobs
} from '@/api/task-other'
import { getTemplist, getTempargs } from '@/api/task'
import { getuserlist } from '@/api/user'
export default {
  data () {
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
        task_name: '',
        tag: '',
        temp_id: '',
        detail: '',
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
        task_name: [{ required: true, message: '名称不能为空，且需唯一', trigger: 'blur' }],
        tag: [{ required: true, message: '标签不能为空', trigger: 'blur' } ],
        temp_id: [{ required: true, type: 'number', message: '必须选择一个执行模板', trigger: 'blur' }],
        start_time: [ { required: true, type: 'date', message: 'Please select the date', trigger: 'change'}]
      }
    }
  },
  methods: {
    handleSelect (value) {
      getCustomtask('tag_name', value).then(res => {
        if (res.data.code === 0) {
          this.submitInfo = res.data.data
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
    getTempList () {
      getTemplist().then(res => {
        if (res.data.code === 0) {
          this.tempList = res.data.data
          // this.sqlTempList = res.data.data.filter(
          //   res => res.temp_name.search("SQL审核") === 0
          // );
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },

    handleClose (event, name) {
      const index = this.submitInfo.indexOf(name)
      this.submitInfo.splice(index, 1)
    },
    handlerSelectTemp (temp_id) {
      // console.log('temp_id--->',temp_id)
      getTempargs(temp_id).then(res => {
        if (res.data.code === 0) {
          this.index = 0
          this.formValidate.args_items = []
          //
          // console.log('res.data.data',res.data.data)
          res.data.data.forEach(element => {
            this.index++
            this.formValidate.args_items.push({
              label: res.data.args_dict[element]
                ? res.data.args_dict[element]
                : element,
              key: element,
              value: '',
              index: this.index,
              status: 1
            })
          })
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handleSubmit (value) {
      this.btn_loading = true
      if (this.submitInfo.length === 0 || this.submitInfo.length > 100) {
        this.$Message.error(
          '请选择一个标签，并确保标签下有主机，并且主机不能大于100'
        )
        this.btn_loading = false
        return
      }
      this.$refs[value].validate(valid => {
        if (valid) {
          setTimeout(() => {
            this.formValidate['hostnames'] = this.submitInfo
            operationCustomtask(this.formValidate, 'post').then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
            })
            this.btn_loading = false
          }, 1000)
        } else {
          this.$Message.error('表单校验错误')
          this.btn_loading = false
        }
      })
    },

    // save to common jobs
    handleSaveCommonJobs (value) {
      this.btn_loading = true
      if (this.submitInfo.length === 0 || this.submitInfo.length > 100) {
        this.$Message.error(
          '请选择一个标签，并确保标签下有主机，并且主机不能大于100'
        )
        this.btn_loading = false
        return
      }
      this.$refs[value].validate(valid => {
        if (valid) {
          setTimeout(() => {
            this.formValidate['hostnames'] = this.submitInfo
            operationCommonjobs(this.formValidate, 'post').then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
            })
            this.btn_loading = false
          }, 1000)
        } else {
          this.$Message.error('表单校验错误')
          this.btn_loading = false
        }
      })
    },
    handleSaveCronJobs() {
      this.$Message.info('下个版本的内容')
    },
    handleReset (value) {
      this.$refs[value].resetFields()
    }
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
  mounted () {
    this.getAllTagList()
    this.getTempList()
  }
}
</script>

<style scoped>
</style>

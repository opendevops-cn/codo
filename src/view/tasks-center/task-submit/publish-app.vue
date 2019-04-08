<template>
  <div style="height:100%; background:#eee">
    <Card style="height:100%; ">
      <Row style="margin-top:30px;">
        <Col
          span="12"
          offset="1"
        >
        <Form
          ref="formValidate"
          :model="formValidate"
          :rules="ruleValidate"
          :label-width="80"
        >
          <FormItem
            label="选择应用"
            prop="publish_name"
          >
            <Select
              v-model="formValidate.publish_name"
              @on-change="handleSelect(formValidate.publish_name)"
              placeholder="${publish_name} Select your publish app name"
            >
              <Option
                v-for="(name, index) in publishAppList"
                :value="name"
                :key="`${_uid}_${index}`"
              >{{name}}</Option>
            </Select>
          </FormItem>
          <FormItem
            v-if="publishInfo.all_host_info"
            label="目标主机"
          >
            <span
              v-for="(item, host) in publishInfo.all_host_info"
              :key="host"
            >
              <tag
                color="success"
                closable
                @on-close="handleClose"
              >{{host}}</tag>
            </span>
          </FormItem>
          <FormItem
            label="标签版本"
            prop="publish_tag"
          >
            <Input
              v-model="formValidate.publish_tag"
              :maxlength=40
              placeholder="${publish_tag} 输入你的TAG"
            ></Input>
          </FormItem>
          <FormItem
            label="开始时间"
            prop="start_time"
          >
            <DatePicker
              v-model="formValidate.start_time"
              type="datetime" :options="optionsDate"
              format="yyyy-MM-dd HH:mm:ss"
              show-week-numbers
              editable
              placeholder="选择一个执行时间，用来触发模板中的定时触发器"
              style="width: 330px"
            ></DatePicker>
          </FormItem>
          <FormItem
            label="备注详情"
            prop="desc"
          >
            <Input
              v-model="formValidate.desc"
              type="textarea"
              :maxlength=50
              :autosize="{minRows: 3,maxRows: 5}"
              value="Enter something.................."
              disabled
              placeholder="Enter something..."
            ></Input>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              :loading="btn_loading"
              @click="handleSubmit('formValidate')"
            >提交</Button>
            <Button
              @click="handleReset('formValidate')"
              style="margin-left: 8px"
            >重置</Button>
          </FormItem>
        </Form>
        </Col>
        <Col
          span="8"
          offset="1"
        >
        <Alert show-icon>
          <h4 style="color: #ed4014">请确保执行主机可以从仓库拉取代码。</h4>
          <br />
          <span v-if="publishInfo.repository">
            <p>代码仓库：{{publishInfo.repository}}</p>
          </span>
          <br />
          <span v-if="publishInfo.build_host">
            <p>执行主机： {{publishInfo.build_host}}</p>
          </span>
          <br />
        </Alert>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import { getPublishApplist, operationPublishApplist } from '@/api/task-other'
export default {
  name: '',
  data () {
    return {
      btn_loading: false,
      publishAppList: [],
      publishInfo: {},
      formValidate: {
        publish_name: '',
        publish_tag: '',
        start_time: '',
        desc: ''
      },
      optionsDate: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      ruleValidate: {
        publish_name: [
          {
            required: true,
            message: 'The name cannot be empty',
            trigger: 'change'
          }
        ],
        publish_tag: [
          {
            required: true,
            message: 'tag cannot be empty',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 10,
            message: '不能小于10个字节',
            trigger: 'blur'
          }
        ],
        start_time: [
          {
            required: true,
            type: 'date',
            message: 'Please select the date',
            trigger: 'change'
          }
        ],
        desc: [
          {
            required: true,
            message: 'Please enter a personal introduction',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 10,
            message: '不能小于10个字节',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 获取当前用户发布配置信息
    getPublishAppList () {
      getPublishApplist().then(res => {
        if (res.data.code === 0) {
          this.publishAppList = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handleSelect (value) {
      getPublishApplist(value).then(res => {
        if (res.data.code === 0) {
          this.publishInfo = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handleClose (event, value) {
      this.$Message.error(`暂不提供删除功能`)
    },
    handleSubmit (value) {
      this.btn_loading = true
      setTimeout(() => {
        operationPublishApplist(this.formValidate, 'post').then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
        this.btn_loading = false
      }, 1000)
    },
    handleReset(value) {
      this.$refs[value].resetFields();
    }
  },
  mounted () {
    this.getPublishAppList()
  }
}
</script>

<style scoped>
</style>

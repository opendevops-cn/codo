<template>
  <Card>
    <div class="search-con search-con-top">
        <Affix :offset-top="80">
          <Input autofocus="autofocus" v-model="searchVal" style="padding:6px;" placeholder="请输入作业名称进行模糊搜素" />
        </Affix>
    </div>

    <Table size="small" height="660" ref="selection"  :columns="columns" :data="tableData"/>

    <div style="margin: 10px; overflow: hidden">
      <div style="float: left;">
        <Page  :total="pageTotal"  :current="pageNum" :page-size="pageSize" :page-size-opts="[15,35,50,100]" show-sizer
          show-total @on-change="changePage" @on-page-size-change="handlePageSize"
        ></Page>
      </div>
    </div>

    <Drawer v-model="viewDrawer" :closable="false" :draggable="true" width="999" >
      <alert>作业中心执行步骤</alert>
        <Table size="small" height="660" ref="selection" border :columns="viewStepcolumns" :data="temp_step_list"></Table>
    </Drawer>

    <Drawer  v-model="execDrawer" :closable="false" :draggable="true"  style="background-color: #f8f8f9"  width="950" >
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="95">
        <Alert show-icon>
          任务详情
          <Icon type="ios-bulb-outline" slot="icon"></Icon>
          <template slot="desc">你可以在提交任务前确定参数是否正确，点击提交任务后可在订单中心中查看详情.</template>
        </Alert>
        <FormItem label="作业名称：" prop="task_name">
          {{formValidate.task_name}}
        </FormItem>

        <FormItem label="模板名称：">
          <Input v-model="tempname" disabled :maxlength="200" placeholder="请输入任务名称"></Input>
        </FormItem>

        <FormItem label="已选标签：" prop="tag">
          <Input v-model="formValidate.tag" disabled :maxlength="200" placeholder="请输入任务名称"></Input>
        </FormItem>

        <FormItem v-if="submitInfo.length > 0 " label="目标主机：">
          <span v-for="item in submitInfo">
            <tag color="success" :key="item" :name="item" @on-close="handleClose">{{item}}</tag>
          </span>
        </FormItem>

        <FormItem  v-for="(item, index) in formValidate.args_items" :key="index" :label="item.label">
          <Input type="text" v-model="item.value" clearable :maxlength="120" :placeholder="`请输入参数${item.key}的值`"/>
        </FormItem>

        <FormItem label="执行时间" prop="start_time">
          <DatePicker
            v-model="formValidate.start_time"
            type="datetime"
            :options="optionsDate"
            format="yyyy-MM-dd HH:mm:ss"
            show-week-numbers
            editable
            placeholder="选择一个执行时间，用来触发模板中的定时触发器"
            style="width: 360px"
          ></DatePicker>
        </FormItem>
        <FormItem label="备注详情" label-position="top" prop="detail">
          <Input type="textarea" v-model="formValidate.detail" :rows="6" placeholder="please enter the description"/>
        </FormItem>
        <FormItem>
            <Button type="primary" :loading=btn_loading  @click="handleSubmitJob('formValidate')">提交任务</Button>
        </FormItem>
      </Form>
    </Drawer>

    <!-- 编辑按钮 -->
    <Drawer title="编辑作业" v-model="editDrawer"  width="850" :draggable="true"  :mask-closable="false" :styles="styles" >
      <alert>你可以调整任务的参数和执行的主机，任务名称唯一字段不可修改。</alert>
        <Form :model="formValidate2" :label-width="110">
          <FormItem label="任务名称：" label-position="top">
             {{formValidate.task_name}}
          </FormItem>

          <FormItem label="模板名称：">
            {{tempname}}
          </FormItem>

          <FormItem label="选择标签：" prop="tag">
            <Select v-model="formValidate2.tag" filterable placeholder="请选择关联的标签" @on-change="">
                <Option
                  v-for="item in allTagList"
                  :value="item.tag_name"
                  :key="item.id"
                >{{ item.tag_name }}</Option>
              </Select>
          </FormItem>

          <FormItem
            v-for="(item, index) in formValidate2.args_items" v-if="item.status" :key="index" :label="item.label + '：'">
            <Input
              type="text"
              v-model="item.value"
              clearable
              :maxlength="120"
              :placeholder="`请输入参数${item.key}的值`"
            ></Input>
          </FormItem>

          <FormItem label="详情备注" label-position="top">
            <Input type="textarea" v-model="formValidate2.detail" :rows="6" placeholder="please enter the description"/>
          </FormItem>
          <FormItem>
            <Button  type="primary" style="margin-right: 8px"  :loading=btn_loading @click="handleSubmitJobEdit('formValidate2')">提交保存</Button>
          </FormItem>
        </Form>
    </Drawer>
    <!-- 编辑按钮 -->

    <!-- 授权用户按钮 -->
    <div>
      <Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :loading="true" :footer-hide="true">
        <Select class="search-input-long" v-model="existUser" filterable multiple placeholder="请选择需要授权的用户">
          <Option v-for="item in allUser" :value="item.nickname" :key="item.user_id" >{{ item.nickname }}</Option>
        </Select>
        <Button type="success" style="margin-top: 10px;" @click="handlerSubmitUser" long>确定授权</Button>
      </Modal>
    </div>
    <!-- 授权用户按钮 -->
  </Card>
</template>

<script>
import { getAuthTaglist, getCustomtask, operationCustomtask, getCommonjobs, operationCommonjobs, handSubmittask } from '@/api/task-other'
import { getTemplist, getTempargs, getDetailslist } from '@/api/task'
import { getuserlist } from '@/api/user'
export default {
  components: {},
  data () {
    return {
      columns: [
        {
          title: '作业名称',
          key: 'task_name',
          minWidth: 250,
          sortable: true,
          render: (h, params) => {
            return h(
              'a',
              {
                on: {
                  click: () => {
                    this.$Message.info('任务执行按钮在最右边！')
                  }
                }
              },
              params.row.task_name
            )
          }
        },
        {
          title: '执行主机',
          key: 'hosts_name',
          minWidth: 150,
        },
        {
          title: '模板ID',
          key: 'temp_id',
          minWidth: 90,
        },
        {
          title: '创建者',
          key: 'creator',
          align: 'center',
          minWidth: 120
        },
        // {
        //   title: '创建时间',
        //   key: 'create_time',
        //   width: 160
        // },
        {
          title: '更新时间',
          key: 'update_time',
          width: 160,
          sortable: true
        },
        {
          title: '#',
          key: 'handle',
          minWidth: 350,
          render: (h, params) => {
            return h('ButtonGroup', [
              h(
                'Button',
                {
                  props: {
                    // type: "success",
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.handleSubmitExecJob(params.row, 'put', '执行作业')
                    }
                  }
                },
                '立即执行'
              ),
              h(
                'Button',
                {
                  props: {
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.viewStep(params.row.temp_id)
                    }
                  }
                },
                '查看步骤'
              ),
              h(
                'Button',
                {
                  props: {
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.editTheJob(params.row, 'put', '编辑作业')
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    size: 'small'
                  },
                  style: {
                    marginRight: '10px'
                  },
                  on: {
                    click: () => {
                      this.relevanceUser(params.row)
                    }
                  }
                },
                '授权'
              ),
              h(
                'Button',
                {
                  props: {
                    // type: "error",
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.delData(params)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      tableData: [],
      //
      viewStepcolumns: [
         {
          title: '执行组',
          key: 'group',
          align: 'center',
          width: 100,
          sortable: true
        },
        {
          title: '优先级',
          key: 'level',
          align: 'center',
          width: 100,
          sortable: true
        },
        {
          title: '脚本名称',
          key: 'command_name',
          minWidth: 250,
          sortable: true
        },
        {
          title: '脚本命令',
          key: 'command',
          sortable: true
        },
        {
          title: '触发器',
          key: 'trigger',
          width: 90,
          align: 'center',
          render: (h, params) => {
            let status = params.row.trigger
            if (status === 'order') {
              return h('div', [ h('Tag', { props: { color: 'default' } }, '默认')])
            } else if (status === 'hand') {
              return h('div', [h('Tag', { props: { color: 'cyan' } }, '手动')])
            } else if (status === 'timed') {
              return h('div', [
                h('Tag', { props: { color: 'geekblue' } }, '定时')
              ])
            }
          }
        }
      ],
      temp_step_list: [],
      //
      formValidate: {
        task_name: '',
        tag: '',
        temp_id: '',
        nickname: '',
        hostnames: '',
        args_items: []
      },
      formValidate2: {
        task_name: '',
        tag: '',
        temp_id: '',
        nickname: '',
        hostnames: '',
        args_items: []
      },
      ruleValidate: {
        tag: [
          {
            required: true,
            message: 'The tag cannot be empty',
            trigger: 'blur'
          }
        ],
        temp_id: [
          {
            required: true,
            type: 'number',
            message: '必须选择一个执行模板',
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
        ]
      },
      // 用户授权 弹框
      modalMap: {
        modalVisible: false,
        modalTitle: '创建'
        // modalVisible1: false,
        // modalTitle1: "创建"
      },
      selectTaskname: '',
      existUser: [],
      allUser: [],
      ///
      editDrawer: false, // 编辑弹框
      viewDrawer: false,
      execDrawer: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      // 提交相关
      submitInfo: [],
      optionsDate: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      //
      searchVal: '', // 查询
      // 分页
      pageNum: 1, // 当前页码
      pageTotal: 0, // 数据总数
      pageSize: 15, // 每页条数
      //
      allTagList: [], // 所有标签
      tempinfo: null,
      tempname: '',
      btn_loading: false

    }
  },
  methods: {
    // 获取常用作业List
    getCommonJobs () {
      getCommonjobs(this.pageNum, this.pageSize, this.searchVal)
        .then(res => {
          if (res.data.code === 0) {
            this.pageTotal = res.data.count
            this.tableData = res.data.data
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(error => {
          this.$Message.error({
            content: JSON.stringify(error.response.data),
            duration: 10
          })
        })
    },

    // 提交任务
    // 触发立即执行按钮，弹出二次确认信息
    handleSubmitExecJob (paramsRow, meth, mtitle) {
      this.execDrawer = true
      this.formValidate = {
        id: paramsRow.id,
        task_name: paramsRow.task_name,
        tag: paramsRow.tag,
        temp_id: paramsRow.temp_id,
        nickname: paramsRow.nickname,
        hostnames: paramsRow.hostnames,
        args_items: JSON.parse(paramsRow.args_items),
        detail: paramsRow.detail
      }
      // 获取模板名称
      let temp_id = paramsRow.temp_id
      this.getTempName(temp_id)

      // 获取此任务的目标主机
      let tag = paramsRow.tag
      getCustomtask('tag', tag).then(res => {
        if (res.data.code === 0) {
          this.submitInfo = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
      // // 获取当前时间
      // formValidate.start_time = this.computedDateTime(new Date().toLocaleDateString())
    },

    // Step02:触发执行任务
    handleSubmitJob (value) {
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

    // 任务模板进行编辑
    editTheJob (paramsRow, meth, mtitle) {
      let temp_id = paramsRow.temp_id
      this.getTempName(temp_id)

      this.editDrawer = true // 弹框

      this.formValidate2 = {
        id: paramsRow.id,
        task_name: paramsRow.task_name,
        tag: paramsRow.tag,
        temp_id: paramsRow.temp_id,
        nickname: paramsRow.nickname,
        hostnames: paramsRow.hostnames,
        args_items: JSON.parse(paramsRow.args_items),
        detail: paramsRow.detail
      }
    },

    handleSubmitJobEdit (value) {
      // 这里就不验证了
      this.btn_loading = true
      setTimeout(() => {
        operationCommonjobs(this.formValidate2, 'put').then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
        this.btn_loading = false
      }, 1000)
    },
    //
    handleClose (event, name) {
      const index = this.submitInfo.indexOf(name)
      this.submitInfo.splice(index, 1)
    },
    // 删除任务
    delData (params) {
      if (confirm(`确定要删除 ${params.row.task_name}`)) {
        operationCommonjobs({ id: params.row.id }, 'delete').then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.tableData.splice(params.index, 1)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }
    },
    // 获取模板名称
    getTempName (val) {
      getTemplist('temp_id', val).then(res => {
        if (res.data.code === 0) {
          this.tempinfo = res.data.data
          this.tempname = res.data.data[0].temp_name
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
    // 查看步骤 抽屉
    viewStep (temp_id) {
      this.viewDrawer = true
      this.getDetailsList(temp_id)
    },
    // 获取模板步骤详情
    getDetailsList (temp_id) {
      getDetailslist(temp_id).then(res => {
        if (res.data.code === 0) {
          this.temp_step_list = res.data.data.temp_list
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 获取用户列表
    getUserList () {
      getuserlist(1, 888).then(res => {
        if (res.data.code === 0) {
          this.allUser = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 授权用户
    relevanceUser (paramsRow) {
      this.modalMap.modalVisible = true
      this.modalMap.modalTitle = '授权分享'
      this.getUserList()
      this.selectTaskname = paramsRow.task_name
      this.existUser = paramsRow.authorized_user.split(',')
    },

    // 提交, 更新授权用户
    handlerSubmitUser () {
      operationCommonjobs(
        { authorized_user: this.existUser, task_name: this.selectTaskname },
        'patch'
      ).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
          this.modalMap.modalVisible = false
          this.getCommonJobs()
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 翻页
    changePage (value) {
      this.pageNum = value
      this.getCommonJobs()
    },
    // 切换每页多少数量
    handlePageSize (value) {
      this.pageSize = value
      this.pageNum = 1
      this.getCommonJobs()
    }
  },
  mounted () {
    this.getCommonJobs()
    this.getAllTagList()
  },
  watch: {
    searchVal (val) {
      this.getCommonJobs()
    }
  }
}
</script>

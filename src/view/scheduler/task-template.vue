<template>
<div>
  <Row :gutter="15">
    <i-col :md="24" :lg="6">
      <Card style="height:100%">
        <div class="search-con">
          <Input @on-change="handleClear" clearable placeholder="输入模板名称搜索" class="search-input" v-model="searchValue"/>
          <Button class="search-btn" @click="editModal('post', '新建模板')">新建</Button>
        </div>
          <Table size="small" height="710" :columns="columns" :data="tableData"></Table>
      </Card>
    </i-col>
    <i-col :md="24" :lg="18">
      <Card shadow>
        <Alert v-if="!editIng1" banner closable type="warning">
          <h3> 使用说明:</h3>
          <br/>
          <p>此处为对执行任务进行编排的模板</p>
          <p>组： 对任务进行分组，组执行为串行，组内主机位并发执行，互不干涉。组任务必须要等待上一组执行完毕，
            才会触发执行下一组任务。一般任务建议只使用一个组</p>
          <p>优先级： 组内部执行主机的执行顺序，默认为按照优先级顺序执行，遇到任务错误，会停止，等待介入处理，重做</p>
          <p>任务名称、执行命令、参数：  则从命令列表中选取，通过分组，分级 添加触发器 等等操作进行编排</p>
          <p>执行用户：  任务通过ssh连接远程主机，连接的时候会用执行用户来进行连接，必须保持可连接，你可以在执行用户页面添加</p>
          <p>触发器：  当模板中的任务需要人工干预、或者定时执行，则需要使用触发器，优先级大于上边优先级</p>
          <p>指定主机：任务会从执行主机强制跳转到指定主机执行任务，如果使用127.0.0.01则本机执行</p>
        </Alert>
        <div class="search-con">
          <Select class="search-input-long" v-model="formSend" filterable multiple>
            <Option v-for="item in selectData" :value="item.command_id" :key="item.command_id">{{ item.command_id }}、{{ item.command_name }}</Option>
          </Select>
          <Button type="warning" class="search-btn" @click="handlerSubmit" ghost>提交选择</Button>
          <Button type="warning" class="search-btn" @click="handlerSubmitEdit" ghost >保存编辑</Button>
        </div>
        <tables ref="tables" editable size="small"  search-place="top" v-model="tableData2" :columns="columns2"  @on-delete="handleDelete"/>
        </Card>
      </i-col>
    </Row>
   <Modal v-model="modalMap.modalVisible"  :title="modalMap.modalTitle" :loading=true :footer-hide=true>
    <form-group :list="formList"  @on-submit-success="handleSubmitCreateTemp"></form-group>
  </Modal>
  <Modal v-model="modalMap.modalVisible1"  :title="modalMap.modalTitle1" :loading=true :footer-hide=true>
    <Select class="search-input-long" v-model="existUser" filterable multiple placeholder="请选择关联的用户">
      <Option v-for="item in allUser" :value="item.user_id + ',,,' + item.nickname"  :key="item.user_id">{{ item.nickname }}</Option>
    </Select>
    <Button type="success" style="margin-top: 10px;"  @click="handlerSubmitUser" long>确定关联</Button>
  </Modal>
</div>
</template>

<script>
import FormGroup from '_c/form-group'
import Tables from '_c/tables'
import {
  getTemplist,
  deleteTemp,
  operationTemp,
  getCommandlist,
  getDetailslist,
  operationDetails,
  getExecUserlist
} from '@/api/task'
import { getuserlist } from '@/api/user'
export default {
  components: {
    FormGroup,
    Tables
  },
  data () {
    return {
      offset: 0.25,
      offset1: 0.389,
      columns: [
        {
          title: 'ID',
          key: 'temp_id',
          width: 70,
          sortable: true
        },
        {
          title: '模板名称',
          key: 'temp_name',
          tooltip: true,
          minWidth: 140,
          render: (h, params) => {
            return h('div', [
              h(
                'a',
                {
                  on: {
                    click: () => {
                      this.getDetailsList(params.row.temp_id)
                    }
                  }
                },
                params.row.temp_name
              )
            ])
          }
        },
        {
          title: '操作',
          key: 'handle',
          width: 90,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'a',
                {
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.relevanceUser(params.row.temp_id)
                      this.getDetailsList(params.row.temp_id)
                    }
                  }
                },
                '授权'
              ),
              h(
                'a',
                {
                  on: {
                    click: () => {
                      this.deleteTemplate(params)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      columns2: [
        {
          title: '组',
          key: 'group',
          align: 'center',
          width: 80,
          sortable: true,
          editable: true
        },
        {
          title: '优先级',
          key: 'level',
          align: 'center',
          width: 100,
          sortable: true,
          editable: true
        },
        { title: '任务名称', key: 'command_name', minWidth: 150 },
        { title: '执行命令', key: 'command', minWidth: 200 },
        { title: '参数', key: 'args', minWidth: 120, editable: true },
        {
          title: '执行用户',
          key: 'exec_user',
          align: 'center',
          width: 150,
          render: (h, params) => {
            return h(
              'Select',
              {
                props: {
                  value: this.tableData2[params.index].exec_user,
                  size: 'small',
                  transfer: true
                },
                on: {
                  'on-change': event => {
                    this.editIng = `修改了模板${this.selectTemp}执行用户`
                    this.tableData2[params.index].exec_user = event
                  }
                }
              },
              this.execUser.map(item => {
                return h('Option', {
                  props: {
                    value: item,
                    label: item
                  }
                })
              })
            )
          }
        },
        {
          title: '触发器',
          key: 'trigger',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            return h(
              'Select',
              {
                props: {
                  value: this.tableData2[params.index].trigger,
                  size: 'small',
                  transfer: true
                },
                style: 'width:70px',
                on: {
                  'on-change': event => {
                    this.editIng = `修改了模板${this.selectTemp}触发器`
                    this.tableData2[params.index].trigger = event
                  }
                }
              },
              [
                h(
                  'Option',
                  {
                    props: {
                      value: 'order'
                    }
                  },
                  '默认'
                ),
                h(
                  'Option',
                  {
                    props: {
                      value: 'hand'
                    }
                  },
                  '干预'
                ),
                h(
                  'Option',
                  {
                    props: {
                      value: 'timed'
                    }
                  },
                  '定时'
                )
              ]
            )
          }
        },
        { title: '指定主机', key: 'force_host', width: 120, editable: true },
        {
          title: '删除',
          align: 'center',
          width: 80,
          key: 'handle',
          button: [
            (h, params, vm) => {
              return h(
                'Poptip',
                {
                  props: {
                    confirm: true,
                    title: '你确定要删除吗?'
                  },
                  on: {
                    'on-ok': () => {
                      this.editIng = `删除的了模板${this.selectTemp}的某些任务`
                      vm.$emit(
                        'input',
                        params.tableData.filter(
                          (item, index) => index !== params.row.initRowIndex
                        )
                      )
                    }
                  }
                },
                [
                  h(
                    'a',
                    {
                      props: {
                        type: 'error',
                        size: 'small'
                      }
                    },
                    '删除'
                  )
                ]
              )
            }
          ]
        }
      ],
      tableData: [],
      selectData: [],
      tableData2: [],
      formSend: [],
      // 弹框
      modalMap: {
        modalVisible: false,
        modalTitle: '创建',
        modalVisible1: false,
        modalTitle1: '创建'
      },
      // 表单
      formList: [],
      //
      // 关联用户
      existUser: [],
      allUser: [],
      searchKey: 'temp_name',
      searchValue: '',
      changeCommandList: [],
      selectTemp: '',
      editIng: '',
      editIng1: false,
      // 执行用户
      execUser: []
    }
  },
  methods: {
    getTempList (key, value) {
      getTemplist(key, value).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    getCommandList (key, value) {
      getCommandlist(key, value).then(res => {
        if (res.data.code === 0) {
          this.selectData = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 获取用户列表
    getUserList () {
      getuserlist(1, 1000).then(res => {
        if (res.data.code === 0) {
          this.allUser = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    getExecUserlist () {
      getExecUserlist().then(res => {
        if (res.data.code === 0) {
          res.data.data.forEach(item => {
            this.execUser.push(item.alias_user)
          })
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    getDetailsList (value) {
      this.editIng1 = true
      if (this.editIng) {
        if (confirm(`${this.editIng} 还没有保存！点击确定则访问下一个模板`)) {
          // 如果确定不保存
          this.selectTemp = value
          this.editIng = ''
          getDetailslist(value).then(res => {
            if (res.data.code === 0) {
              this.tableData2 = res.data.data.temp_list
              this.existUser = res.data.data.temp_user
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        }
      } else {
        this.selectTemp = value
        getDetailslist(value).then(res => {
          if (res.data.code === 0) {
            this.tableData2 = res.data.data.temp_list
            this.existUser = res.data.data.temp_user
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }
    },
    relevanceUser (tempId) {
      this.modalMap.modalVisible1 = true
      this.modalMap.modalTitle1 = '关联用户'
      this.selectTemp = tempId
    },
    editModal (meth, mtitle) {
      this.modalMap.modalVisible = true
      this.modalMap.modalTitle = mtitle
      this.formList = [
        {
          name: 'temp_name',
          type: 'i-input',
          value: '',
          label: '模板名称',
          maxlength: 25,
          placeholder: '请输入一个有意义的名称，并且不可修改',
          rule: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
        }
      ]
    },
    // 处理选中数据
    handlerOnChange (val) {
      let newCommandList = []
      val.forEach(item => {
        item['group'] = 1
        item['level'] = 88
        item['exec_user'] = 'root'
        item['trigger'] = 'hand'
        newCommandList.push(item)
      })
      this.changeCommandList = newCommandList
    },

    handlerSubmit () {
      let commandList = this.selectData.filter(item => {
        return this.formSend.includes(item.command_id)
      })
      //
      this.handlerOnChange(commandList)

      if (!this.selectTemp || this.changeCommandList.length < 1) {
        this.$Message.warning('童鞋！ 必须要选则一个模板和至少一个命令')
      } else {
        this.tableData2 = this.tableData2.concat(this.changeCommandList)
        this.editIng = `你对模板${this.selectTemp}添加了任务`
      }
    },
    handlerSubmitUser () {
      operationDetails(
        { new_user_info: this.existUser, temp_id: this.selectTemp },
        'patch'
      ).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
          this.modalMap.modalVisible1 = false
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
      // 关联
    },
    handlerSubmitEdit () {
      if (this.tableData2.length < 1) {
        this.$Message.warning('童鞋！ 你提交了空数据')
        return
      }
      if (!this.selectTemp) {
        this.$Message.warning('童鞋！ 必须要选则一个模板')
      } else {
        operationDetails(
          { new_temp_data: this.tableData2, temp_id: this.selectTemp },
          'put'
        ).then(res => {
          // 标记已经保存编辑
          this.editIng = ''
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.getDetailsList(this.selectTemp)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }
    },
    handleSubmitCreateTemp (value) {
      setTimeout(() => {
        operationTemp(value.data).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.getTempList(this.searchKey, this.searchValue)
            this.modalMap.modalVisible = false
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }, 1000)
    },
    handleDelete (params) {},
    // 删除
    deleteTemplate (params) {
      if (confirm(`确定要删除模板 ${params.row.temp_name}`)) {
        deleteTemp({ temp_id: params.row.temp_id }, 'delete').then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.tableData.splice(params.index, 1)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }
    },
    handleClear (e) {
      if (e.target.value === '') this.tableData = this.value
    },
    handleSearch () {
      this.getTempList(this.searchKey, this.searchValue)
    }
  },
  watch: {
    searchValue(val) {
      this.handleSearch()
    }
  },
  mounted () {
    this.getTempList()
    this.getCommandList()
    this.getUserList()
    this.getExecUserlist()
  },
  beforeRouteLeave (to, from, next) {
    if (this.editIng) {
      if (confirm(`${this.editIng} 还没有保存，确定要离开吗？`)) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  }
}
</script>

<style lang="less" scoped>
.search-con {
  padding: 10px 0;
  .search {
    &-col {
      display: inline-block;
      width: 160px;
    }
    &-input {
      display: inline-block;
      width: 220px;
      margin-left: 1px;
    }
    &-input-long {
      display: inline-block;
      width: 480px;
      margin-left: 1px;
    }
    &-btn {
      margin-left: 3px;
    }
  }
}
</style>

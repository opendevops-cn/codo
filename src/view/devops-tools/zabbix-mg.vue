<template>
  <div>
  <Row :gutter="20">
    <i-col :md="24" :lg="6" style="margin-bottom: 15px;">
      <Card>
        <Tree ref="tree" :data="tagTreeData"  @on-select-change="handlerTreeChange" getSelectedNodes  height='720'></Tree>
      </Card>
    </i-col>
    <i-col :md="24" :lg="18" style="margin-bottom: 15px;">
      <Card shadow>
        <Alert type="success" show-icon closable>
            温馨提示：
            <p>1. 如果你有多个ZABBIX， 请先点击ZABBIX配置</p>
            <p>2. 点击刷新地址会将你ZABBIX主机组/主机获取到平台</p>
            <p>3. 如果你想要用到钩子功能，那么请你务必先进行权限配置</p>
        </Alert>
        <div class="search-con">
          <Input class="search-input" v-model="searchVal" style="padding:6px;" placeholder="输入关键字搜索"/>
          <Button type="primary"  @click="handlerSetConf()" class="search-btn" >ZABBIX配置</Button>
          <Button type="primary"  @click="handlerSetTaskAuth('post', '权限配置')" class="search-btn" >权限配置</Button>
          <Button type="warning" :loading="updateLoading" @click="handlerRefresh()" class="search-btn">刷新地址</Button>
          <Button type="success"  @click="handerTestZabbixHook('', 'post', '测试钩子')" class="search-btn" >测试钩子</Button>
          <!-- <Button type="error" class="search-btn"  @click="handlerDelete">批量删除</Button> -->
          <Button class="search-btn"  @click="handlerHookslog()">钩子日志</Button>
          <Button class="search-btn"  to="//docs.opendevops.cn/zh/guide/used/#%E7%9B%91%E6%8E%A7%E5%91%8A%E8%AD%A6" target="_blank">跳转文档</Button>
        </div>
          <Form  v-if="setZabbix" ref="formZabbixConf" :model="formZabbixConf" :rules="ruleInline" inline>
            <FormItem prop="zabbix_name">
              <Input type="text" v-model="formZabbixConf.zabbix_name" placeholder="名称"  style="width: 200px" :maxlength='200'  clearable>
              </Input>
            </FormItem>
            <FormItem prop="zabbix_url">
              <Input type="text" v-model="formZabbixConf.zabbix_url" placeholder="zabbix_url"  style="width: 350px" :maxlength='350'  clearable>
              </Input>
            </FormItem>
            <FormItem prop="zabbix_username">
              <Input type="text" v-model="formZabbixConf.zabbix_username" placeholder="ZABBIX用户名"  style="width: 200px" :maxlength='200'>
              </Input>
            </FormItem>
            <FormItem prop="zabbix_password">
              <Input type="text" v-model="formZabbixConf.zabbix_password" placeholder="ZABBIX密码"  style="width: 200px" :maxlength='200'  clearable>
              </Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleSubmitFormZabbixConf('formZabbixConf')">测试保存</Button>
            </FormItem>
          </Form>

          <Form  v-if="setTaskAuth" ref="formSubmitTaskConf" :model="formSubmitTaskConf" :rules="SubmitTaskConfrule" inline>
            <alert>提醒：权限配置用于向平台提交任务的权限，需要用户输入对应的API接口和Auth_key 若不配置将不能使用Hooks功能,配置只支持一条，更新请删除重新添加</alert>
            <FormItem prop="task_url">
              <Input type="text" v-model="formSubmitTaskConf.task_url" placeholder="任务系统URL"  style="width: 450px" :maxlength='300'  clearable>
              </Input>
            </FormItem>
            <FormItem prop="auth_key">
              <Input type="text" v-model="formSubmitTaskConf.auth_key" placeholder="AuthKey"  style="width: 400px" :maxlength='500'  clearable>
              </Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleSZabbixSubmitTaskConf('formSubmitTaskConf')">测试保存</Button>
            </FormItem>
          </Form>
          <Table v-if="setTaskAuth" size="small" :columns="TaskConfcolumns" :data="TaskconfData"></Table>
          <Table v-else-if="setZabbix" size="small" :columns="columns" :data="confData"></Table>
          <Table v-else size="small"  :columns="repoColumns" :data="tableData" @on-selection-change="handleSelectChange" height='720'></Table>

    </Modal>
      </Card>
    </i-col>
  </Row>
    <Drawer v-model="projectDrawer" :closable="false"  style="background-color: #f8f8f9" width="900" @on-close="handlerCloseProjectDrawer()">
      <div style="margin-top:10px; margin-bottom:10px; marginLeft: 15px;">
        <Divider orientation="left">主机详情</Divider>
        <Row style="marginLeft: 5px;">
          <Col span="4"><p> <b>ZABBIX地址:</b> </p></Col>
          <Col span="20"><p> {{hostInfo.zabbix_url}}</p></Col>
          <Col span="4"><p> <b>组名:</b> </p></Col>
          <Col span="20"><p> {{hostInfo.group_name}}</p></Col>
          <Col span="4"><p> <b>主机:</b> </p></Col>
          <Col span="20"><p> {{hostInfo.host_name}}</p></Col>
          <Col span="4"><p  v-if="hostInfo.host_id"> <b>主机ID:</b> </p></Col>
          <Col span="20"><p v-if="hostInfo.host_id"> {{hostInfo.host_id}}</p></Col>
        </Row>
        <Divider orientation="left">钩子设置--->可以通过钩子配置故障自愈/自定义任务等操作</Divider>
        <Button type="primary"  style="margin-bottom:5px;" @click="handeraddZabbixHook()">添加钩子</Button> 
        <Table style="margin-bottom:20px;" size="small" :columns="hookColumns" :data="hooktableData"></Table>
          <Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :loading=true :footer-hide=true width=760>
          <form-group :list="formList" @on-submit-success="handlerZabbixHookTest"></form-group>
          </Modal>
        <Form v-if="addHookForm" ref="formZabbixHostsHook" :model="formZabbixHostsHook" :rules="ruleZabbixHostHook" :label-width="90">
          <FormItem label="告警标题" prop="alert_title">
            <Alert type="success">
              <p>【解释】：ZABBIX WebHooks告警传来的告警标题，如：Zabbix agent on Zabbix server is unreachable for 5 minutes。匹配标题触发钩子</p>
            </Alert>
            <Input v-model="formZabbixHostsHook.alert_title"></Input>
          </FormItem>
          <FormItem label="审批/自动">
            <RadioGroup v-model="formZabbixHostsHook.schedule">
                <Radio label="ready">自动执行</Radio>
                <Radio label="new"> 审批执行</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem label="关连模板" prop="temp_id">
            <Alert type="success">
              <p>【解释】：触发后执行当前模板的任务流</p>
            </Alert>
            <Select v-model="formZabbixHostsHook.temp_id" placeholder="关联一个模板，用来执行发布任务">
              <Option v-for="item in templateList" :value="item.temp_id" :key="`${_uid}_${item.temp_id}`">{{item.temp_name}}</Option>
            </Select>
          </FormItem>

          <FormItem label="执行主机">
            <Alert type="success">
              <p>【解释】：任务在那台主机上执行，默认为第一组，主机：127.0.0.1</p>
            </Alert>
            <Input v-model="formZabbixHostsHook.exec_host" :maxlength=50 type="text" placeholder="任务会在执行主机上执行"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="addZabbixHostHookSubmit('formZabbixHostsHook')">保存</Button>
          </FormItem>
        </Form>
      </div>
    </Drawer>
    <Drawer v-model="logDrawer" :closable="false"  style="background-color: #f8f8f9" width="900">
      <Table size="small" :columns="logColumns" :data="hookLogData"></Table>
    </Drawer>
  </div>
</template>
<script>
  import FormGroup from '_c/form-group'
  import { 
    ZabbixSync,
    getZabbixConfiglist, 
    operationZabbixConfig, 
    getZabbixTagtree, 
    getZabbixHostlist, 
    getZabbixHooklog, 
    operationZabbixHosts, 
    operationZabbixHooks,
    getZabbixSubmitTaskConflist,
    operationZabbixSubmitTaskConf 
    } from "@/api/devops-tools";
  import { getTemplist } from "@/api/task";
  export default {
    components: {
      FormGroup
    },
    data () {
      return {
        formList: [],
        TestHookModalData: '',
        editModalZabbixConfData: '',
        hooktableData: [],
        addHookForm: false,
        testHookForm: false,
        hostInfo : {},
        projectDrawer: false, //项目信息抽屉
        groupInfo: {},
        groupDrawer: false, //组信息抽屉
        tableSelectIdList: [],
        setZabbix: false,
        setTaskAuth: false,
        searchVal:'',
        selectGroup: '',
        selectUrl: '',
        tagTreeData:[],
        tableData: [],
        confData: [],
        TaskconfData: [],
        allUser: [],
        templateList: [],  //模板列表
        updateLoading: false, //同步 loading
        logDrawer: false,
        hookLogData: [],
        modalMap: {
          modalVisible: false,
          modalTitle: '添加'
        },
         formZabbixHostsHook: {
          alert_title: '',
          exec_host: '127.0.0.1',
          schedule: 'ready',
          temp_id: '',
        },
         ruleZabbixHostHook: {
          alert_title: [{ required: true, message: '匹配到ZABBIX的标题报警信息触发执行对应的任务', trigger: 'blur' }],
          temp_id: [{ required: true, message: '触发后执行当前模板的任务流', trigger: 'blur' }],
        },
        formZabbixConf: {
          id: null,
          zabbix_name: '',
          zabbix_url: '',
          zabbix_username: '',
          zabbix_password: ''
        },
        ruleInline: {
            zabbix_name: [
                { required: true, message: '简单描述下名称吧', trigger: 'blur' }
            ],
            zabbix_url: [
                { required: true, message: '请输入ZABBIX的地址', trigger: 'blur' },
            ],
            zabbix_username: [
                { required: true, message: 'ZABBIX管理员用户', trigger: 'blur' },
            ],
            zabbix_password: [
                { required: true, message: 'ZABBIX管理员密码', trigger: 'blur' },
            ]
        },

        // formHookTestValidate: {
        //   zabbix_url: 'http://xxxx/zabbix',
        //   messages: "Zabbix server___127.0.0.1___Zabbix agent on Zabbix server is unreachable for 5 minutes___PROBLEM___Average",
        // },

        // HookTestrule: {
        //     zabbix_url: [
        //         { required: true, message: 'ZABBIX地址，请一定确保和配置一样', trigger: 'blur' }
        //     ],
        //     messages: [
        //         { required: true, message: '告警消息,强规范：{HOSTNAME}___{HOST.IP}___{TRIGGER.NAME}___{TRIGGER.STATUS}___{TRIGGER.SEVERITY}', trigger: 'blur' },
        //     ],
        // },

        formSubmitTaskConf: {
          id: null,
          task_url: 'https://codo-v1.domain.com/api/task/v2/task/accept/',
          auth_key: '',
        },

        SubmitTaskConfrule: {
            task_url: [
                { required: true, message: '请输入任务系统的接口URL', trigger: 'blur' }
            ],
            auth_key: [
                { required: true, message: 'AuthKey认证，管理员可选择一个用户进行生成长期Token', trigger: 'blur' },
            ],
        },
        //
        logColumns: [
          {
            title: 'ZABBIX地址',
            key: 'zabbix_url',
            align: 'center',
          },
          {
            title: '告警内容',
            key: 'logs_info',
            align: 'center',
          },
          {
            title: '时间',
            key: 'create_time',
            align: 'center',
            width: 150,
          },
        ],
        //
        hookColumns: [
          {
            title: '告警标题',
            key: 'alert_title',
            align: 'center',
              render: (h, params) => {
              return h('div', [
                h('a',{
                    on: {
                      click: () => {
                        this.addHookForm = true
                        const ZabbixHooks = JSON.parse(this.hostInfo.zabbix_hooks)
                        this.formZabbixHostsHook = ZabbixHooks[params.row.alert_title]
                        this.formZabbixHostsHook['alert_title'] = params.row.alert_title
                        // this.formZabbixHostsHook['exec_host'] = JSON.stringify(this.formZabbixHostsHook['exec_host']) 
                      }
                    }
                  },
                  params.row.alert_title
                )
              ])
            } 
          },
          {
            title: '模板ID',
            key: 'temp_id',
            align: 'center',
          },
          {
            title: '执行',
            key: 'schedule',
            align: 'center',
          },
          { title: '', key: '', align: 'center',
            render: (h, params) => {
              return h('div', [
                // h(
                //   'Button',
                //   {
                //     props: {
                //       type: 'success',
                //       size: 'small'
                //     },
                //     style: {
                //       marginRight: '2px'
                //     },
                //     on: {
                //       click: () => {
                //         this.handlerGitHookTest(params.row)
                //       }
                //     }
                //   },
                //   '测试'
                // ),
                 h(
                  'Button',
                  {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.handlerZabbixHookDelete(params.row)
                    }
                  }
                },'删除')
              ])
            }
          }
        ],


      TaskConfcolumns:[
          {
          title: '任务系统URL',
          key: 'task_url',
          align: 'center'
        },
        {
          title: 'auth_key',
          key: 'auth_key',
          align: 'center'
        },
        {
          title: '操作',
          key: 'handle',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.delSubmitTaskConfData(params)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      columns: [
        // {
        //   title: 'ID',
        //   key: 'id',
        //   align: 'center',
        //   width: 80,
        //   sortable: true
        // },
        {
          title: 'Zabbix名称',
          key: 'zabbix_name',
          align: 'center'
        },
        {
          title: 'Zabbix地址',
          key: 'zabbix_url',
          align: 'center'
        },
        {
          title: 'Zabbix用户',
          key: 'zabbix_username',
          align: 'center'
        },
        {
          title: 'Zabbix密码',
          key: 'zabbix_password',
          align: 'center'
        },
        {
          title: '操作',
          key: 'handle',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editZabbixConfModal(params.row, 'put', '编辑配置')
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.delZabbixConfData(params)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
        repoColumns: [
        { type: 'selection', key: 'id', width: 100, align: 'center'},
        {
          title: 'ZABBIX地址',
          key: 'zabbix_url',
          width: 350,
          align: 'center',
        },
        { title: '组名称', key: 'group_name', align: 'center',
          // render: (h, params) => {
          //   return h('div', [
          //     h('a',{
          //         on: {
          //           click: () => {
          //             // this.groupDrawer = true
          //             this.$Message.info(`暂不开放`)
          //           }
          //         }
          //       },
          //       params.row.group_name
          //     )
          //   ])
          // } 
        },
        { title: '主机HostName', key: 'host_name', align: 'center' },
        { title: '操作', key: 'handle', width: 120, align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.handlerEditHost(params.row)
                    }
                  }
                },
                'Hooks'
              )
            ])
          }
        }
      ],
     }
      },
      methods: {
         //获取zabbix配置信息
        getZabbixConfigList (key, value) {
          getZabbixConfiglist(key, value).then(res => {
            if (res.data.code === 0) {
              // this.$Message.success(`${res.data.msg}`)
              this.confData = res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },

        //获取zabbix submit task认证配置信息
        getZabbixSubmitTaskConfList (key, value) {
          getZabbixSubmitTaskConflist(key, value).then(res => {
            if (res.data.code === 0) {
              // this.$Message.success(`${res.data.msg}`)
              this.TaskconfData = res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },
        
        // 编辑ZABBIX配置信息
        editZabbixConfModal(paramsRow, meth, mtitle) {
          this.modalMap.modalVisible = true;
          this.modalMap.modalTitle = mtitle;
          this.editModalZabbixConfData = meth;
          if (paramsRow && paramsRow.id) {
              // put
              this.formZabbixConf = {
                  id: paramsRow.id,
                  zabbix_name: paramsRow.zabbix_name,
                  zabbix_url: paramsRow.zabbix_url,
                  zabbix_username: paramsRow.zabbix_username,
                  zabbix_password: paramsRow.zabbix_password,
              }
          } else {
              // post
                this.formZabbixConf = {
                  zabbix_name: '',
                  zabbix_url: "",
                  zabbix_username: "",
                  zabbix_password: "",
                }
                
              }
          },
        // 删除
        delZabbixConfData (params) {
          if (confirm(`确定要删除 ${params.row.zabbix_url} 删除后主机/主机配置的钩子/故障自愈等都会清空`)) {
            operationZabbixConfig(
              {
                id: params.row.id,
                zabbix_url: params.row.zabbix_url
              },
              'delete'
            ).then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
                this.confData.splice(params.index, 1)
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
            })
          }
        },

        
        delSubmitTaskConfData (params) {
          if (confirm(`确定要删除 ${params.row.task_url} 删除后钩子将无法像平台提交任务`)) {
            operationZabbixSubmitTaskConf(
              {
                id: params.row.id,
              },
              'delete'
            ).then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
                this.TaskconfData.splice(params.index, 1)
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
            })
          }
        },
        //添加ZABBIX配置测试
        handleSubmitFormZabbixConf(name) {
          this.$refs[name].validate((valid) => {
            if (valid) {
              operationZabbixConfig(this.formZabbixConf, 'post').then(res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.getZabbixConfigList()
                } else {
                  this.$Message.error(`${res.data.msg}`)
                }
              })
            } else {
                this.$Message.error('验证失败');
            }
         })
        },
        //添加ZABBIX向任务平台提交task配置信息
        handleSZabbixSubmitTaskConf(name) {
          this.$refs[name].validate((valid) => {
            if (valid) {
              operationZabbixSubmitTaskConf(this.formSubmitTaskConf, 'post').then(res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.getZabbixSubmitTaskConfList()
                } else {
                  this.$Message.error(`${res.data.msg}`)
                }
              })
            } else {
                this.$Message.error('验证失败');
            }
         })
        },
        
        // 获取ZABBIX Tag tree
        getZabbixTagTree() {
          getZabbixTagtree().then(res => {
            if (res.data.code === 0) {
              this.tagTreeData = res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },

        //获取ZABBIX主机列表
        getZabbixHostList () {
          getZabbixHostlist(this.selectUrl, this.selectGroup, this.searchVal).then(res => {
            if (res.data.code === 0) {
              this.tableData = res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },
        handlerSetConf() {
          this.setTaskAuth = false
          this.setZabbix = !this.setZabbix
          this.getZabbixConfigList()
        },
        handlerSetTaskAuth() {
          this.setZabbix = false
          this.setTaskAuth = !this.setTaskAuth
          this.getZabbixSubmitTaskConfList()
        },

        handerTestZabbixHook(index, meth, mtitle) {
          this.modalMap.modalVisible = true;
          this.modalMap.modalTitle = mtitle;
          this.TestHookModalData = meth;
          this.formList = [
            {
              name: "zabbix_url",
              type: "i-input",
              value: "http://domain.com/zabbix",
              label: "ZABBIX地址",
              placeholder: "ZABBIX地址，请一定确保和配置一样",
              rule: [{ required: true, message: "ZABBIX地址不能为空", trigger: "blur" }]
            },
            // {
            //   name: "messages",
            //   type: "i-input",
            //   value: "Zabbix server___127.0.0.1___Zabbix agent on Zabbix server is unreachable for 5 minutes___PROBLEM___Average",
            //   label: "告警消息",
            //   placeholder: "告警消息,强规范：{HOSTNAME}___{HOST.IP}___{TRIGGER.NAME}___{TRIGGER.STATUS}___{TRIGGER.SEVERITY}', trigger: 'blur' }",
            //   rule: [
            //     {
            //       required: true,
            //       message: "告警消息不能为空",
            //       trigger: "blur"
            //     }
            //   ]
            // },
            {
              name: "messages",
              type: "i-input",
              type1:'textarea',
              maxlength: 8000,
              value: "Zabbix server___127.0.0.1___Zabbix agent on Zabbix server is unreachable for 5 minutes___PROBLEM___Average",
              label: "告警消息",
              placeholder: "告警消息,强规范：{HOSTNAME}___{HOST.IP}___{TRIGGER.NAME}___{TRIGGER.STATUS}___{TRIGGER.SEVERITY}', trigger: 'blur' }",
              rule: [
                {
                  required: true,
                  message: "告警消息不能为空",
                  trigger: "blur"
                }
              ]
            }
          ];
        },
        handlerDelete(){
          if (this.tableSelectIdList.length > 0) {
            if (confirm(`确定要批量删除选中的项目，删除后会导致钩子丢失`)) {
              operationZabbixHosts({ 'id_list': this.tableSelectIdList }, 'delete').then(
                res => {
                  if (res.data.code === 0) {
                    this.$Message.success(`${res.data.msg}`)
                    this.getZabbixTagTree()
                    this.getZabbixHostList()
                  } else {
                    this.$Message.error(`${res.data.msg}`)
                  }
                })
            }
          }else {
            this.$Message.info(`你总要选中点什么吧`)
          }
        },

        handlerEditHost (paramsRow) {
          this.projectDrawer = true
          this.hostInfo = paramsRow
          this.hooktableData =this.hostInfo.hook_list
          this.getTempList()
        },
        handeraddZabbixHook() {
          this.addHookForm = !this.addHookForm
        },
        
        addZabbixHostHookSubmit() {
          this.formZabbixHostsHook['the_id'] = this.hostInfo.id
          operationZabbixHosts(this.formZabbixHostsHook, 'put').then(
              res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.projectDrawer = false
                  this.getZabbixHostList()
                } else {
                  this.$Message.error(`${res.data.msg}`)
                }
            })
        },
        handlerZabbixHookTest(value) {
          operationZabbixHooks(value.data, 'post').then(
            res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
                this.modalMap.modalVisible = false;
                this.getZabbixHostList()
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
          })
        },

        handlerZabbixHookDelete(paramsRow) {
          operationZabbixHooks({"the_id": this.hostInfo.id, "alert_title": paramsRow.alert_title}, 'delete').then(
            res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
                this.projectDrawer = false
                this.getZabbixHostList()
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
          })
        },
        handlerCloseProjectDrawer() {
            this.addHookForm = false
            this.formZabbixHostsHook = {
            alert_title: '',
            exec_host: '127.0.0.1',
            schedule: 'ready',
            temp_id: '',
          }
        },
        //ZABBIX告警日志
        getZabbixHookLog () {
          getZabbixHooklog().then(res => {
            if (res.data.code === 0) {
              this.hookLogData = res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },
        handlerHookslog() {
          this.logDrawer = true
          this.getZabbixHookLog()
        },

        // 获取模板
        getTempList() {
          getTemplist().then(res => {
            if (res.data.code === 0) {
              this.templateList = res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`);
            }
          });
        },
        handlerRefresh() {
          this.updateLoading =true
          setTimeout(() => {
            ZabbixSync().then( res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
                this.getZabbixTagTree()
                this.getZabbixHostList()
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
              this.updateLoading = false
            })
          }, 2000);
        },
        // table 选中的ID
        handleSelectChange (val) {
          let SelectIdList = []
          val.forEach(item => {
            SelectIdList.push(item.id)
          })
          this.tableSelectIdList = SelectIdList
        },
        // 点击节点
        handlerTreeChange(obj) {
          if(obj.length !==0 ){
            const data = obj[0]
            this.searchVal = ''
            this.selectUrl = data.zabbix_url
            this.setZabbix = false
            this.setTaskAuth = false
            if(data.data_type === 'group_name'){
              this.selectGroup = data.title
              this.getZabbixHostList()
            }else {
              this.getZabbixHostList()
            }
          }
        },
    },
    watch:{
      searchVal (val) {
        this.searchVal = val
        this.getZabbixHostList()
      }
    },
    mounted(){
      this.getZabbixTagTree()
      this.getZabbixConfigList()
      this.getZabbixHostList()
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
        width: 280px;
        margin-left: 1px;
      }
      &-input-long {
        display: inline-block;
        width: 480px;
        margin-left: 1px;
      }
      &-btn {
        margin-left: 2px;
      }
    }
  }
</style>
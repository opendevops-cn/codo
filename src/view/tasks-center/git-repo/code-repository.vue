<template>
  <div style="height:100%; background: #f8f8f9">
  <Row :gutter="20">
    <i-col :md="24" :lg="6">
      <Card style="height:100%">
        <Tree ref="tree" :data="tagTreeData"  @on-select-change="handlerTreeChange" getSelectedNodes/>
      </Card>
    </i-col>
    <i-col :md="24" :lg="18">
      <Card shadow style="height:100%">
        <div class="search-con search-con-top">
          <Input class="search-input" clearable v-model="searchVal" :maxlength='50' placeholder="输入关键字搜索"/>

          <ButtonGroup class="search-btn">
            <Button  @click="handlerSetConf()">GIT配置</Button>
            <Button  @click="handlerAddGitRepo('post', '添加仓库')" class="search-btn" >单个添加</Button>
            <Button  :loading="updateLoading" @click="handlerRefresh()" class="search-btn">刷新地址</Button>
            <template v-if="tableSelectIdList.length > 0">
              <Button  @click="handlerDelete">批量删除</Button>
            </template>
            <template v-else>
              <Button  @click="handlerDelete" disabled>批量删除</Button>
            </template>
            <Button  @click="handlerHookslog()">钩子日志</Button>
            <Button  to="//docs.opendevops.cn/zh/guide/used/#%E4%BB%A3%E7%A0%81%E4%BB%93%E5%BA%93" target="_blank">跳转文档</Button>
          </ButtonGroup>
      </div>

        <!-- <div class="search-con">
          <Input class="search-input" clearable v-model="searchVal" style="padding:6px;" placeholder="输入关键字搜索"/>
          <Button type="primary"  @click="handlerSetConf()" class="search-btn" >GIT配置</Button>
          <Button type="primary"  @click="handlerAddGitRepo('post', '添加仓库')" class="search-btn" >单个添加</Button>
          <Button type="warning" :loading="updateLoading" @click="handlerRefresh()" class="search-btn">刷新地址</Button>
          <Button type="error" class="search-btn"  @click="handlerDelete">批量删除</Button>
          <Button class="search-btn"  @click="handlerHookslog()">钩子日志</Button>
          <Button class="search-btn"  to="/docs.opendevops.cn/zh/guide/used/#%E4%BB%A3%E7%A0%81%E4%BB%93%E5%BA%93" target="_blank">跳转文档</Button>
        </div> -->
          <Form  v-if="setRepo" ref="formRepo" :model="formRepo" :rules="ruleInline" inline>
            <FormItem prop="git_url">
              <Input type="text" v-model="formRepo.git_url" placeholder="GitLab 地址"  style="width: 250px" :maxlength='250'  clearable>
              </Input>
            </FormItem>
            <FormItem prop="private_token">
              <Input type="text" v-model="formRepo.private_token" placeholder="private_token"  style="width: 220px" :maxlength='120'  clearable>
              </Input>
            </FormItem>
            <FormItem prop="api_version">
              <Input type="text" v-model="formRepo.api_version" placeholder="API版本"  style="width: 30px" :readonly=true :maxlength='10'>
              </Input>
            </FormItem>
            <FormItem prop="deploy_key">
              <Input type="text" v-model="formRepo.deploy_key" placeholder="deploy key"  style="width: 200px" :maxlength='800'  clearable>
              </Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleSubmitFormRepo('formRepo')">测试保存</Button>
            </FormItem>
          </Form>
          <Table v-if="setRepo" size="small" :columns="columns" :data="confData"></Table>
          <Table v-else size="small"  :columns="repoColumns" :data="tableData" @on-selection-change="handleSelectChange" max-height='705'></Table>
      </Card>
    </i-col>
  </Row>
    <Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :loading=true :footer-hide=true :mask-closable=false>
      <Form ref="formGitRepo" :model="formGitRepo" :rules="ruleGitRepo" :label-width="90">
        <FormItem label="域名" prop="git_url">
          <Input v-model="formGitRepo.git_url" :maxlength=100 ></Input>
        </FormItem>
         <FormItem label="组名" prop="group_name">
          <Input v-model="formGitRepo.group_name" :maxlength=80 ></Input>
        </FormItem>
        <FormItem label="项目名" prop="project_name">
          <Input v-model="formGitRepo.project_name" :maxlength=120></Input>
        </FormItem>
        <FormItem label="相对路径" prop="relative_path">
          <Input v-model="formGitRepo.relative_path" :maxlength=200 placeholder="group/project"></Input>
        </FormItem>
        <FormItem label="SSH地址" prop="ssh_url_to_repo">
          <Input v-model="formGitRepo.ssh_url_to_repo" :maxlength=250 ></Input>
        </FormItem>
        <FormItem label="http地址" prop="http_url_to_repo">
          <Input v-model="formGitRepo.http_url_to_repo" :maxlength=250></Input>
        </FormItem>
        <FormItem label="关连用户" prop="tag_list">
           <Select class="search-input-long" v-model="formGitRepo.existUser" filterable multiple placeholder="默认通过邮箱来关联GIT的用户">
            <Option v-for="item in allUser" :value="item.email" :key="item.user_id" >{{ item.email }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="addGitRepoSubmit('formGitRepo')">保存</Button>
        </FormItem>
      </Form>
     </Modal>
     <Drawer v-model="groupDrawer" :closable="false"  style="background-color: #f8f8f9" width="950">
      <h2 style="color: #000000; marginLeft: 10px">此处应是组信息和组用户信息：</h2>
    </Drawer>
    <Drawer v-model="projectDrawer" :closable="false"  style="background-color: #f8f8f9" width="950" @on-close="handlerCloseProjectDrawer()">
      <div style="margin-top:10px; margin-bottom:10px; marginLeft: 15px;">
        <Divider orientation="left">项目详情</Divider>
        <Row style="marginLeft: 5px;">
          <Col span="4"><p  v-if="projectInfo.project_id"> <b>项目ID:</b> </p></Col>
          <Col span="20"><p v-if="projectInfo.project_id"> {{projectInfo.project_id}}</p></Col>
          <Col span="4"><p> <b>组名:</b> </p></Col>
          <Col span="20"><p> {{projectInfo.group_name}}</p></Col>
          <Col span="4"><p> <b>项目:</b> </p></Col>
          <Col span="20"><p> {{projectInfo.project_name}}</p></Col>
          <Col span="4"><p> <b>http:</b> </p></Col>
          <Col span="20"><p> {{projectInfo.http_url_to_repo}}</p></Col>
          <Col span="4"><p> <b>ssh:</b> </p></Col>
          <Col span="20"><p> {{projectInfo.ssh_url_to_repo}}</p></Col>
          <Col span="4"><p> <b>relative path:</b> </p></Col>
          <Col span="20"><p> {{projectInfo.relative_path}}</p></Col>
        </Row>
        <Divider orientation="left">用户信息</Divider>
          <span v-for="mail in projectInfo.user_info" :key="mail">
            <tag v-if="mail" color="success">{{mail}}</tag>
          </span>
        <!-- <Select class="search-input-long" v-model="projectInfo.user_info" filterable multiple placeholder="默认通过邮箱来关联GIT的用户">
          <Option v-for="item in allUser" :value="item.email" :key="item.user_id" >{{ item.nickname}}</Option>
        </Select> -->
        <Divider orientation="left">钩子设置</Divider>
        <Button type="primary"  style="margin-bottom:5px;" @click="handeraddGitHook()">添加钩子</Button>
        <Table style="margin-bottom:20px;" size="small" :columns="hookColumns" :data="hooktableData"></Table>
        <Form v-if="addHookForm" ref="formGitRepoHook" :model="formGitRepoHook" :rules="ruleGitRepoHook" :label-width="90">
          <FormItem label="Branch/Tag" prop="hook_tag">
            <Alert type="success">
              <p>【解释】：当系统从gitlab接受到钩子信息，必填参数（域名，相对路径，Branch/Tag）的时候会调用以Branch/Tag开头钩子配置的内容，
                且匹配到多个的时候只会有一个生效。例如： master release-v qa</p>
            </Alert>
            <Input v-model="formGitRepoHook.hook_tag" :maxlength=30></Input>
          </FormItem>
          <FormItem label="审批/自动">
            <Alert type="success">
              <p>【解释】：自动执行：不需要审批和定时，直接执行。审批执行则需要有模板权限的人来审批或者设置定时执行</p>
            </Alert>
            <RadioGroup v-model="formGitRepoHook.schedule">
                <Radio label="ready">自动执行</Radio>
                <Radio label="new"> 审批执行</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="参数字典">
            <Alert type="success">
              <p>【解释】：任务命令中使用的参数，必须json格式的。例如： {"hosts_dict": {"1":"127.0.0.1","2":"192.168.1.2", "MAILTO": "191715030@qq.com"}}
                hosts_dict 指每组任务在那些主机上执行。默认 {"hosts_dict": {"1": "127.0.0.1"}}
              </p>
            </Alert>
            <Input v-model="formGitRepoHook.hook_args" :maxlength=255 type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="字典格式的参数信息"></Input>
          </FormItem>
          <FormItem label="关连模板" prop="temp_id">
            <Alert type="success">
              <p>【解释】：触发后执行当前模板的任务流</p>
            </Alert>
            <Select v-model="formGitRepoHook.temp_id" placeholder="关联一个模板，用来执行发布任务">
              <Option v-for="item in templateList" :value="item.temp_id" :key="`${_uid}_${item.temp_id}`">{{item.temp_name}}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="addGitRepoHookSubmit('formGitRepoHook')">保存</Button>
          </FormItem>
        </Form>
      </div>
    </Drawer>
    <Drawer v-model="logDrawer" :closable="false"  style="background-color: #f8f8f9" width="950">
      <div class="search-con">
          <Input class="search-input" clearable v-model="searchHookLogVal" style="padding:6px;" placeholder="输入关键字搜索。"/>
          <Button type="error" class="search-btn"  @click="handlerDeleteLog('30')">删除30天前的日志</Button>
        </div>
      <Table size="small" :columns="logColumns" :data="hookLogData"></Table>
    </Drawer>
  </div>
</template>
<script>
  import {getGittree, getGitrepo,optGitrepo, getGituser, getGitConflist, optGitconf, Gitsync, getGitHooklog, optGitHooklog, optGithooks} from '@/api/git-repo'
  import { getuserlist } from '@/api/user'
  import { getTemplist } from "@/api/task";
  export default {
    data () {
      return {
        searchHookLogVal:'',
        hooktableData: [],
        addHookForm: false,
        projectInfo : {},
        projectDrawer: false, //项目信息抽屉
        groupInfo: {},
        groupDrawer: false, //组信息抽屉
        tableSelectIdList: [],
        setRepo: false,
        searchVal:'',
        selectGroup: '',
        selectUrl: '',
        tagTreeData:[],
        tableData: [],
        confData: [],
        allUser: [],
        templateList: [],  //模板列表
        updateLoading: false, //同步 loading
        logDrawer: false,
        hookLogData: [],
        modalMap: {
          modalVisible: false,
          modalTitle: '添加'
        },
         formGitRepoHook: {
          hook_tag: '',
          hook_args: '',
          schedule: 'ready',
          temp_id: '',
        },
         ruleGitRepoHook: {
          hook_tag: [{ required: true, message: '当代码仓库的分支或者标签以当前值开头的时候触发当前钩子', trigger: 'blur' }],
          temp_id: [{ required: true, message: '触发后执行当前模板的任务流', trigger: 'blur' }],
        },
        formGitRepo: {
          git_url: '',
          group_name: '',
          project_name: '',
          relative_path: '',
          ssh_url_to_repo: '',
          http_url_to_repo: '',
          existUser:'',
        },
        ruleGitRepo: {
          git_url: [{ required: true, message: '请输入GitLab的地址', trigger: 'blur' }],
          group_name: [{ required: true, message: '请输入 Group Name', trigger: 'blur' }],
          project_name: [{ required: true, message: '请输入Project Name', trigger: 'blur' }],
          relative_path: [{ required: true, message: '相对路径', trigger: 'blur' }],
          ssh_url_to_repo: [{ required: true, message: 'Clone and Deploy with SSH', trigger: 'blur' }],
          http_url_to_repo: [{ required: true, message: 'Clone and Deploy with HTTP/HTTPS', trigger: 'blur' }],
        },
        formRepo: {
          git_url: '',
          private_token: '',
          api_version: '4',
          deploy_key: ''
        },
        ruleInline: {
            git_url: [
                { required: true, message: '请输入GitLab的地址', trigger: 'blur' }
            ],
            private_token: [
                { required: true, message: '请输入 private token', trigger: 'blur' },
            ]
        },
        //
        logColumns: [
          {
            title: '组/项目',
            key: 'relative_path',
            align: 'center',
          },
          {
            title: '信息',
            key: 'logs_info',
            align: 'center',
          },
          {
            title: '时间',
            key: 'create_time',
            width: 150,
            align: 'center',
          },
          // {
          //   title: '域名',
          //   key: 'git_url',
          //   align: 'center',
          // },
        ],
        //
        hookColumns: [
          {
            title: 'Branch/Tag',
            key: 'tag',
            align: 'center',
              render: (h, params) => {
              return h('div', [
                h('a',{
                    on: {
                      click: () => {
                        this.addHookForm = true
                        const GITHooks = JSON.parse(this.projectInfo.git_hooks)
                        this.formGitRepoHook = GITHooks[params.row.tag]
                        this.formGitRepoHook['hook_tag'] = params.row.tag
                        this.formGitRepoHook['hook_args'] = JSON.stringify(this.formGitRepoHook['hook_args']) 
                      }
                    }
                  },
                  params.row.tag
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
              return h('ButtonGroup', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'success',
                      size: 'small'
                    },
                    style: {
                      marginRight: '2px'
                    },
                    on: {
                      click: () => {
                        this.handlerGitHookTest(params.row)
                      }
                    }
                  },
                  '测试'
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
                      this.handlerGitHookDelete(params.row)
                    }
                  }
                },'删除')
              ])
            }
          }
        ],
        columns: [
          {
            title: '域名地址',
            key: 'git_url'
          },
          { title: '操作', key: 'handle', minWidth: 120,
            render: (h, params) => {
              return h('div', [
                h( 'a',
                  {
                    props: {
                      type: 'success',
                      size: 'small'
                    },
                    style: {
                      marginRight: '2px'
                    },
                    on: {
                      click: () => {
                        this.handlerGitUrl(params.row)
                      }
                    }
                  },'编辑'
                ),
                h(
                  'a',
                  {
                    on: {
                      click: () => {
                        this.handlerDeleteGit(params.row.git_url)
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
        { type: 'selection', key: 'id', width: 80},
        {
          title: '域名地址',
          key: 'git_url',
          minWidth: 250,
          align: 'center',
        },
        { title: '组名称', key: 'group_name', minWidth: 150,
          render: (h, params) => {
            return h('div', [
              h('a',{
                  on: {
                    click: () => {
                      // this.groupDrawer = true
                      this.$Message.info(`暂不开放`)
                    }
                  }
                },
                params.row.group_name
              )
            ])
          } 
        },
        { title: '项目名称', key: 'project_name', minWidth: 150,},
        { title: '#', key: 'handle', width: 130,
          render: (h, params) => {
            return h('div', [
              h( 'a',
                {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.handlerEditRepo(params.row)
                    }
                  }
                },'编辑'
              ),
              h(
                'a',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.handlerDeleteRepo(params.row)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
     }
      },
      methods: {
        getGitTree() {
          getGittree().then(res => {
            if (res.data.code === 0) {
              this.tagTreeData = res.data.data
            } else {
              // this.$Message.error(`${res.data.msg}`)
            }
          })
        },
        getRepoList () {
          getGitrepo(this.selectUrl, this.selectGroup, this.searchVal).then(res => {
            if (res.data.code === 0) {
              this.tableData = res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },
        getGitConfList () {
          getGitConflist().then(res => {
            if (res.data.code === 0) {
              this.confData = res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },
        handlerSetConf() {
          this.setRepo = !this.setRepo
          this.getGitConfList()
        },
        handlerGitUrl(paramsRow) {
          this.formRepo = paramsRow
        },
        handlerDeleteGit(rowGitUrl) {
          if (confirm(`删除 ${rowGitUrl}, 确定后会删除相关组、用户，但项目信息保留`)) {
            optGitconf({'git_url': rowGitUrl}, 'delete').then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
                this.getGitConfList()
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
            })
          }
        },
        handleSubmitFormRepo(name) {
          this.$refs[name].validate((valid) => {
            if (valid) {
              optGitconf(this.formRepo, 'post').then(res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.getGitConfList()
                } else {
                  this.$Message.error(`${res.data.msg}`)
                }
              })
            } else {
                this.$Message.error('验证失败');
            }
         })
        },
        
        handlerAddGitRepo() {
          this.modalMap.modalVisible = true
          this.modalMap.modalTitle = '【添加仓库】 如果当前GIT配置关联的域名生效，则会被更新'
        },
        addGitRepoSubmit(name) {
          this.$refs[name].validate((valid) => {
            if (valid) {
              optGitrepo(this.formGitRepo, 'post').then(res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.getGitTree()
                  this.getRepoList()
                  this.modalMap.modalVisible = false
                } else {
                  this.$Message.error(`${res.data.msg}`)
                }
              })
            } else {
                this.$Message.error('验证失败');
            }
         })
        },
        handlerDelete(){
          if (this.tableSelectIdList.length > 0) {
            if (confirm(`确定要批量删除选中的项目，删除后会导致钩子丢失`)) {
              optGitrepo({ 'id_list': this.tableSelectIdList }, 'delete').then(
                res => {
                  if (res.data.code === 0) {
                    this.$Message.success(`${res.data.msg}`)
                    this.getGitTree()
                    this.getRepoList()
                  } else {
                    this.$Message.error(`${res.data.msg}`)
                  }
                })
            }
          }else {
            this.$Message.info(`你总要选中点什么吧`)
          }
        },
        handlerDeleteRepo (paramsRow) {
          if (confirm(`确定要删除的项目【${paramsRow.project_name}】，删除后会导致钩子丢失`)) {
            optGitrepo({ 'the_id': paramsRow.id }, 'delete').then(
              res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.getGitTree()
                  this.getRepoList()
                } else {
                  this.$Message.error(`${res.data.msg}`)
                }
            })
          }
        },
        handlerEditRepo (paramsRow) {
          this.projectDrawer = true
          this.projectInfo = paramsRow
          this.hooktableData =this.projectInfo.hook_list
          this.getTempList()
        },
        handeraddGitHook() {
          this.addHookForm = !this.addHookForm
        },
        addGitRepoHookSubmit() {
          this.formGitRepoHook['the_id'] = this.projectInfo.id
          optGitrepo(this.formGitRepoHook, 'put').then(
              res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.projectDrawer = false
                  this.getRepoList()
                } else {
                  this.$Message.error(`${res.data.msg}`)
                }
            })
        },
        handlerGitHookTest(paramsRow) {
          let testData = {"git_url": this.projectInfo.git_url, "tag_name":paramsRow.tag, 'relative_path': this.projectInfo.relative_path}
          optGithooks(testData, 'post').then( res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
          })
        },
        handlerGitHookDelete(paramsRow) {
          optGithooks({"the_id": this.projectInfo.id, "tag_index": paramsRow.tag}, 'delete').then(
            res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
                this.projectDrawer = false
                this.getRepoList()
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
          })
        },
        handlerCloseProjectDrawer() {
            this.addHookForm = false
            this.formGitRepoHook = {
            hook_tag: '',
            hook_args: '',
            schedule: 'ready',
            temp_id: '',
          }
        },
        //GIT日志
        getGitHookLog () {
          getGitHooklog(this.searchHookLogVal).then(res => {
            if (res.data.code === 0) {
              this.hookLogData = res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },
        handlerHookslog() {
          this.logDrawer = true
          this.getGitHookLog()
        },
        //optGitHooklog
        handlerDeleteLog(value) {
          optGitHooklog({"day_ago": value}).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          });
        },
        // 获取用户列表
        getUserList () {
          getuserlist(1, 300).then(res => {
            if (res.data.code === 0) {
              this.allUser = res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
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
            Gitsync().then( res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
                this.getGitTree()
                this.getRepoList()
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
            this.selectUrl = data.git_url
            this.setRepo = false
            if(data.data_type === 'group_name'){
              this.selectGroup = data.title
              this.getRepoList()
            }else {
              this.getRepoList()
            }
          }
        },
    },
    watch:{
      searchVal (val) {
        this.searchVal = val
        this.getRepoList()
      },
      searchHookLogVal(val) {
        if (val.length > 2) {
          this.searchHookLogVal = val
          this.getGitHookLog() 
        }
      }

    },
    mounted(){
      this.getGitTree()
      this.getRepoList()
      this.getUserList()
    }
  }
</script>
<style lang="less" scoped>
  .search-con {
    padding: 6px 0;
    .search {
      &-col {
        display: inline-block;
        width: 160px;
      }
      &-input {
        display: inline-block;
        width: 300px;
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

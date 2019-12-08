<template>
  <div style="height:100%; background: #f8f8f9">
  <Row :gutter="20">
    <i-col :md="24" :lg="5" style="margin-bottom: 15px;">
      <Card>
        <Tree ref="tree" :data="tagTreeData"  @on-select-change="handlerTreeChange" getSelectedNodes></Tree>
      </Card>
    </i-col>
    <i-col :md="24" :lg="19" style="margin-bottom: 15px;">
      <Card shadow>
        <div class="search-con search-con-top">
        <Input class="search-input" v-model="searchVal" clearable :maxlength='50' placeholder="输入关键字搜索"/>

        <ButtonGroup class="search-btn">
          <Button v-if="selectTwo === 'server'"  @click="handlerServer(null, 'post', '添加主机')">添加主机</Button>
          <Button v-else-if="selectTwo === 'DB'" @click="handlerDB(null, 'post', '添加数据库')" >添加数据库</Button>
          <Button v-else @click="handlerTag(null, 'post', '新建标签')" >新建标签</Button>
          <template v-if="tableSelectIdList.length > 0">
              <Button  @click="handlerDelete">批量删除</Button>
            </template>
            <template v-else>
              <Button  @click="handlerDelete" disabled>批量删除</Button>
            </template>
        </ButtonGroup>
      </div>
         <Table v-if="selectTwo === 'DB'" size="small"  ref="selection" :columns="columns" :data="tableDataDB"  @on-selection-change="handleSelectChange"></Table>
         <Table v-else-if="selectTwo === 'server'" size="small"  ref="selection"  :columns="columns1"
         :data="tableDataServer" @on-selection-change="handleSelectChange"></Table>
         <Table v-else size="small"  :columns="columns2" :data="tableData" @on-selection-change="handleSelectChange"></Table>
        <div style="margin: 10px; overflow: hidden">
          <div style="float: left;">
              <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[15,16,18,35,50,100] show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize">
              </Page>
          </div>
        </div>
      </Card>
    </i-col>
  </Row>
     <Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :loading=true :footer-hide=true :mask-closable=false>
      <Form ref="formValidateServer" :model="formValidateServer" :rules="ruleValidateServer" :label-width="85">
        <FormItem label="主机名称" prop="hostname">
          <div  v-if="formValidateServer.id">
            <Input v-model="formValidateServer.hostname" :maxlength=40 disabled placeholder='请输入主机名称，可以当关键字'></Input>
          </div>
          <div v-else>
           <Input v-model="formValidateServer.hostname" :maxlength=40 placeholder='请输入主机名称，可以当关键字'></Input>
          </div>
        </FormItem>
        <FormItem label="IP地址" prop="ip">
          <Input v-model="formValidateServer.ip" :maxlength=20 placeholder='请输入IP地址'></Input>
        </FormItem>
        <FormItem label="IDC" prop="idc">
          <Input v-model="formValidateServer.idc" :maxlength=25 placeholder='请输入idc地址'></Input>
        </FormItem>
        <FormItem label="区域" prop="region">
          <Input v-model="formValidateServer.region" :maxlength=25 placeholder='请输入region地址'></Input>
        </FormItem>
        <FormItem label="标签" prop="tag_list">
          <Select class="search-input-long" v-model="formValidateServer.tag_list" filterable multiple placeholder="请选择关联的标签">
            <Option v-for="item in allTagList" :value="item.tag_name" :key="item.id" >{{ item.tag_name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="备注" prop="detail">
          <Input v-model="formValidateServer.detail" :maxlength=18 placeholder='请输入备注'></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmitServer('formValidateServer')">提交</Button>
          <Button @click="handleReset('formValidateServer')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
     </Modal>
     <Modal v-model="modalMap1.modalVisible" :title="modalMap1.modalTitle" :loading=true :footer-hide=true :mask-closable=false>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="85">
        <FormItem label="数据库名称" prop="db_code">
          <div  v-if="editModalData && editModalData ==='put'">
            <Input v-model="formValidate.db_code" :maxlength="30" disabled placeholder='请输入数据库名称，可以当关键字'></Input>
          </div>
          <div v-else>
            <Input v-model="formValidate.db_code" :maxlength="30" placeholder='请输入数据库名称，可以当关键字'></Input>
          </div>
        </FormItem>
        <FormItem label="数据库地址" prop="db_host">
          <Input v-model="formValidate.db_host" :maxlength="80" placeholder='请输入数据库地址'></Input>
        </FormItem>
        <FormItem label="数据库端口" prop="db_port">
          <Input v-model="formValidate.db_port" :maxlength=5></Input>
        </FormItem>
        <FormItem label="用户" prop="db_user">
          <Input v-model="formValidate.db_user" :maxlength=15 placeholder='请输入数据库用户'></Input>
        </FormItem>
        <FormItem label="密码" prop="db_pwd">
          <Input v-model="formValidate.db_pwd" :maxlength=30 placeholder='请输入密码'></Input>
        </FormItem>
        <FormItem label="环境" prop="db_env">
          <Select v-model="formValidate.db_env">
            <Option v-for="item in envList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="代理" prop="proxy_host">
          <Select v-model="formValidate.proxy_host"  placeholder='请选择代理主机，通过代理主机访问数据库'>
            <Option v-for="item in allProxyList" :value="item.proxy_host" :key="item.id">{{ item.proxy_host }}</Option>
          </Select>
        </FormItem>
        <FormItem label="类型" prop="db_type">
          <Select v-model="formValidate.db_type" placeholder='请选择数据库类型'>
            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="标记" prop="db_mark">
          <Select v-model="formValidate.db_mark"  placeholder='请选择读写备'>
            <Option v-for="item in markList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="标签" prop="tag_list">
          <Select class="search-input-long" v-model="formValidate.tag_list" filterable multiple placeholder="请选择关联的标签">
            <Option v-for="item in allTagList" :value="item.tag_name" :key="item.id" >{{ item.tag_name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="备注" prop="db_detail">
          <Input v-model="formValidate.db_detail" :maxlength=20 placeholder='请输入备注'></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="modalMap2.modalVisible"  :title="modalMap2.modalTitle" :loading=true :footer-hide=true width="540" :mask-closable=false>
      <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate2" :label-width="85">
        <FormItem label="标签名称" prop="tag_name">
          <div  v-if="formValidate2.id">
            <Input v-model="formValidate2.tag_name" :maxlength="20" disabled placeholder='请输入标签名称'></Input>
          </div>
          <div v-else>
            <Input v-model="formValidate2.tag_name" :maxlength="20" placeholder='请输入标签名称'></Input>
          </div>
        </FormItem>
        <FormItem label="主机" prop="servers">
          <Select class="search-input-long" v-model="formValidate2.servers" filterable multiple placeholder="请选择关联的主机">
            <Option v-for="item in allServerList" :value="item.id" :key="item.hostname" >{{ item.hostname }}</Option>
          </Select>
        </FormItem>
        <FormItem label="数据库" prop="dbs">
          <Select class="search-input-long" v-model="formValidate2.dbs" filterable multiple placeholder="请选择关联的数据库">
            <Option v-for="item in allDBList" :value="item.id" :key="item.id" >{{ item.db_code }}</Option>
          </Select>
        </FormItem>
        <FormItem label="代理" prop="proxy_host">
          <Select v-model="formValidate2.proxy_host"  placeholder='请选择代理主机，通过代理主机访问数据库'>
            <Option v-for="item in allProxyList" :value="item.proxy_host" :key="item.id">{{ item.proxy_host }}</Option>
          </Select>
        </FormItem>
        <FormItem label="授权用户" prop="users">
          <Select class="search-input-long" v-model="formValidate2.users" filterable multiple placeholder="请选择关联的用户">
            <Option v-for="item in allUser" :value="item.nickname" :key="item.user_id" >{{ item.nickname }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmitTag('formValidate2')">提交</Button>
          <Button @click="handleReset('formValidate2')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
  import {getTagtree, getTaglist, operationTag, getDBlist, operationDB, getServerlist, operationServer, getProxylist} from '@/api/task-other'
  import { getuserlist } from '@/api/user'
  export default {
    data () {
      return {
        // 分页
        pageTotal: 0, // 数据总数
        pageNum: 1, // 当前页码
        pageSize: 15, // 每页条数
        selectTwo: 'tag',
        selectTag: null,
        tagTreeData:[],
        searchVal:'',
        modalMap: {
          modalVisible: false,
          modalTitle: '添加主机'
        },
        modalMap1: {
          modalVisible: false,
          modalTitle: '添加数据库'
        },
        modalMap2: {
          modalVisible: false,
          modalTitle: '新建标签',
        },
        editModalData: null,
        tableData: [],
        tableDataServer: [],
        tableDataDB: [],
        //
        allServerList: [],
        allDBList: [],
        allUser:[],
        allTagList: [],
        allProxyList: [],
        tableSelectIdList: [],
        formValidate: {
          id: null,
          db_code:'',
          db_host:'',
          db_port:'3306',
          db_user: 'root',
          db_pwd:'',
          db_env:'dev',
          proxy_host:'',
          db_type:'mysql',
          db_mark:'写',
          tag_list: [],
          db_detail:'介绍一下吧',
        },
        formValidate2: {
          id: null,
          tag_name: '',
          dbs: [],
          servers: [],
          users:'',
          proxy_host:'',
        },
        formValidateServer: {
          id: null,
          hostname: '',
          ip: '',
          idc: '',
          region:'',
          detail:'介绍一下吧',
          tag_list: [],
        },
        serverTitle: ['可关联主机', '已关联'],
        dbTitle: ['可关联DB', '已关联'],
        envList: [
          { value: 'dev',label: 'dev'},
          { value: 'qa', label: 'qa'},
          { value: 'staging', label: 'staging'},
          { value: 'sandbox', label: 'sandbox'},
          { value: 'release', label: 'release'},
          { value: 'hidden', label: 'hidden'}
        ],
        typeList: [
          { value: 'mysql', label: 'mysql'},
          { value: 'redis', label: 'redis'},
          { value: 'mongodb', label: 'mongodb'},
          { value: 'other', label: 'other'},
        ],
        markList: [
          { value: '写', label: '写'},
          { value: '读', label: '读'},
          { value: '备', label: '备'},
        ],
        ruleValidate: {
          db_code: [{ required: true, message: "The db_code cannot be empty", trigger: "blur"}],
          db_host: [{ required: true, message: "The db_host cannot be empty", trigger: "blur"}],
          db_port: [{ required: true, message: "The db_port cannot be empty", trigger: "blur"}],
          db_user: [{ required: true, message: "The db_user cannot be empty", trigger: "blur"}],
          db_pwd: [{ required: true, message: "The db_pwd cannot be empty", trigger: "blur"}],
          db_env: [{ required: true, message: "请选择一个环境", trigger: "change"}],
          proxy_host: [{ required: true, message: "请选择代理主机", trigger: "change"}],
          db_type: [{ required: true, message: "请选择数据库类型", trigger: "change"}],
          db_mark: [{ required: true, message: "请选择标记", trigger: "change"}],
        },
        ruleValidate2: {
          tag_name: [{ required: true, message: "标签名不能为空", trigger: "blur"}],
        },
        ruleValidateServer: {
          hostname: [{ required: true, message: "主机名不能为空", trigger: "blur"}],
          ip: [{ required: true, message: "IP地址不能为空", trigger: "blur"}],
        },
        columns2: [
        { type: 'selection', key: 'id', width: 80, align: 'center'},
        {
          title: '标签名称',
          key: 'tag_name',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('a',{
                  on: {
                    click: () => {
                      this.$Message.error(`待完善`)
                    }
                  }
                },
                params.row.tag_name
              )
            ])
          }
        },
        { title: '主机', key: 'server_len', minWidth:100, align: 'center' },
        { title: '数据库', key: 'db_len',  minWidth:100, align: 'center' },
        { title: '#', key: 'handle', width: 150,
          render: (h, params) => {
            return h('div', [
              h( 'Button',
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
                      this.handlerTag(params.row, 'put', '更新标签')
                    }
                  }
                },'更新'
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
                      this.handlerDeleteTag(params)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      columns1: [
        { type: 'selection', key: 'id', width: 80, align: 'center'},
        {
          title: '主机名称',
          key: 'hostname',
          minWidth: 220,
          render: (h, params) => {
            return h('div', [
              h('a',{
                  on: {
                    click: () => {
                      this.$Message.error(`待完善`)
                    }
                  }
                },
                params.row.hostname
              )
            ])
          }
        },
        { title: 'IP', key: 'ip',  minWidth: 200, },
        // { title: 'IDC', key: 'idc', align: 'center', minWidth: 120},
        { title: '区域', key: 'region', align: 'center', minWidth: 120},
        { title: '状态', key: 'state', minWidth: 100, align: 'center'},
        { title: '#', key: 'handle', width: 150,
          render: (h, params) => {
            return h('div', [
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
                      this.handlerServer(params.row, 'put', '更新主机')
                    }
                  }
                },
                '更新'
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
                      this.handlerDeleteServer(params)
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
        {
          type: 'selection',
          key: 'id',
          width: 60,
          align: 'center'
        },
        {
          title: 'DB名称',
          key: 'db_code',
          minWidth: 180,
          render: (h, params) => {
            return h('div', [
              h(
                'a',
                {
                  on: {
                    click: () => {
                      this.showDBinfo(params.index)
                    }
                  }
                },
                params.row.db_code
              )
            ])
          }
        },
        { title: 'DB地址',  key: 'db_host',  minWidth: 300, sortable: true },
        { title: '环境',  key: 'db_env',  minWidth:80, align: 'center', sortable: true },
        { title: '类型',  key: 'db_type',  minWidth:80, align: 'center', sortable: true},
        { title: '代理', key: 'proxy_host', minWidth:80, align: 'center', sortable: true},
        { title: '状态', key: 'state', minWidth: 110, align: 'center', sortable: true},
        { title: '#', key: 'handle', width: 150,
          render: (h, params) => {
            return h('div', [
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
                      this.handlerDB(params.row, 'put', '更新数据库')
                    }
                  }
                },
                '更新'
              ),
              h('Button',
                {
                  props: { type: 'error', size: 'small'},
                  on: { click: () => { this.handlerDeleteDB(params)}}
                },
                '删除'
              )
            ])
          }
        }
      ]}
      },
      methods: {
        getTagTree (key) {
          getTagtree(key).then(res => {
            if (res.data.code === 0) {
              this.tagTreeData = res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },
        getTagList (key, value) {
          getTaglist( this.pageNum, this.pageSize, key, value).then(res => {
            if (res.data.code === 0) {
              this.tableData = res.data.data
               this.pageTotal = res.data.count
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },
        getAllTagList () {
          getTaglist(1, 888).then(res => {
            if (res.data.code === 0) {
              this.allTagList = res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },
        getServerList(key, value) {
          getServerlist( this.pageNum, this.pageSize, key, value).then(res => {
            if (res.data.code === 0) {
              this.pageTotal = res.data.count
              this.tableDataServer =  res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },
        getAllServerList() {
          getServerlist(1, 888).then(res => {
            if (res.data.code === 0) {
              this.allServerList =  res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },
        // 获取数据库
        getDBList(key, value) {
          getDBlist( this.pageNum, this.pageSize, key, value).then(res => {
            if (res.data.code === 0) {
              this.pageTotal = res.data.count
              this.tableDataDB = res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },
        geALLDBList() {
          getDBlist(1, 888).then(res => {
            if (res.data.code === 0) {
              this.allDBList = res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },
        // 获取用户列表
        getUserList () {
          getuserlist(1, 2000).then(res => {
            if (res.data.code === 0) {
              this.allUser = res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },
        getProxyList() {
          getProxylist().then(res => {
            if (res.data.code === 0) {
              this.allProxyList = res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },
        // 添加标签
        handlerTag(paramsRow, meth, mtitle){
          this.modalMap2.modalVisible = true
          this.modalMap2.modalTitle = mtitle
          this.editModalData = meth
          //
          this.geALLDBList()
          this.getAllServerList()
          this.getUserList()
          this.getProxyList()
          if (paramsRow && paramsRow.id) {
            this.formValidate2 = {
              id: paramsRow.id,
              tag_name: paramsRow.tag_name,
              dbs: paramsRow.dbs,
              servers: paramsRow.servers,
              users: paramsRow.users,
              proxy_host: paramsRow.proxy_host,
            }
          }else{
            this.formValidate2 = {
              id: null,
              tag_name: '',
              dbs: [],
              servers: [],
              users:'',
              proxy_host:'',
            }
          }
        },
        closeTagModal () {
          // 关闭modal
          this.modalMap2.modalVisible = false
        },
        handlerServer(paramsRow, meth, mtitle){
          this.modalMap.modalVisible = true
          this.modalMap.modalTitle = mtitle
          this.editModalData = meth
          //
          this.getAllTagList()
          if (paramsRow && paramsRow.id) {
              this.formValidateServer = {
              id: paramsRow.id,
              hostname: paramsRow.hostname,
              ip: paramsRow.ip,
              idc: paramsRow.idc,
              region: paramsRow.region,
              tag_list: paramsRow.tag_list,
            }
          }else{
            this.formValidateServer = {
              id: null,
              hostname: '',
              idc: '',
              ip: '',
              region:'',
              tag_list: [],
            }
          }
        },
        handlerDB(paramsRow, meth, mtitle){
          this.modalMap1.modalVisible = true
          this.modalMap1.modalTitle = mtitle
          this.editModalData = meth
          //
          this.getProxyList()
          this.getAllTagList()
          if (paramsRow && paramsRow.id) {
            this.formValidate = {
            id: paramsRow.id,
            db_code: paramsRow.db_code,
            db_host:paramsRow.db_host,
            db_port:paramsRow.db_port,
            db_user: paramsRow.db_user,
            db_pwd: paramsRow.db_pwd,
            db_env: paramsRow.db_env,
            proxy_host: paramsRow.proxy_host,
            db_type: paramsRow.db_type,
            db_mark: paramsRow.db_mark,
            tag_list: paramsRow.tag_list,
            db_detail: paramsRow.db_detail,
          }
          }else {
            this.formValidate = {
            id: null,
            db_code: '',
            db_host:'',
            db_port:'3306',
            db_user: 'root',
            db_pwd:'',
            db_env:'dev',
            proxy_host:'',
            db_type:'mysql',
            db_mark:'写',
            tag_list:[],
            db_detail:'介绍一下吧',
          }
          }
        },
        handlerDelete(){
          if (this.tableSelectIdList.length > 0) {
            if(this.selectTwo === 'tag'){
              if (confirm(`确定要批量删除选中的标签`)) {
                operationTag({ 'id_list': this.tableSelectIdList }, 'delete').then(
                  res => {
                    if (res.data.code === 0) {
                      this.$Message.success(`${res.data.msg}`)
                      this.getTagList("tag_name", this.searchVal)
                    } else {
                      this.$Message.error(`${res.data.msg}`)
                    }
                  })
              }
            }else if(this.selectTwo === 'DB'){
              if (confirm(`确定要批量删除选中数据库 `)) {
                operationDB({ 'id_list':this. tableSelectIdList }, 'delete').then(
                  res => {
                    if (res.data.code === 0) {
                      this.$Message.success(`${res.data.msg}`)
                      this.getDBList(this.searchVal)
                    } else {
                      this.$Message.error(`${res.data.msg}`)
                    }
                  })
              }
            }else if(this.selectTwo === 'server'){
              if (confirm(`确定要批量删除选中主机 `)) {
                operationServer({ 'id_list':this. tableSelectIdList }, 'delete').then(
                  res => {
                    if (res.data.code === 0) {
                      this.$Message.success(`${res.data.msg}`)
                      this.getServerList(this.searchVal)
                    } else {
                      this.$Message.error(`${res.data.msg}`)
                    }
                  })
              }
            this.getTagTree()
            }
          }else {
            this.$Message.info(`你总要选中点什么吧`)
          }
        },
        handleSubmit(value) {
          this.$refs[value].validate((valid) => {
            if (valid) {
              setTimeout(() => {
                operationDB(this.formValidate, this.editModalData).then(
                  res => {
                    if (res.data.code === 0) {
                      this.$Message.success(`${res.data.msg}`);
                      this.getDBList(this.searchVal);
                      this.geALLDBList()
                      this.getTagTree()
                      this.modalMap1.modalVisible = false;
                    } else {
                      this.$Message.error(`${res.data.msg}`);
                    }
                  }
                );
              }, 1000);
            } else {
                this.$Message.error('表单校验错误');
            }
          })
        },
        //
        handleSubmitTag(value) {
          this.$refs[value].validate((valid) => {
            if (valid) {
              setTimeout(() => {
                operationTag(this.formValidate2, this.editModalData).then(
                  res => {
                    if (res.data.code === 0) {
                      this.$Message.success(`${res.data.msg}`);
                      this.getTagList('tag_name', this.searchVal);
                      this.getTagTree()
                      this.modalMap2.modalVisible = false;
                    } else {
                      this.$Message.error(`${res.data.msg}`);
                    }
                  }
                );
              }, 1000);
            } else {
              this.$Message.error('表单校验错误');
            }
          })
        },
        handleSubmitServer(value) {
          this.$refs[value].validate((valid) => {
            if (valid) {
              setTimeout(() => {
                operationServer(this.formValidateServer, this.editModalData).then(
                  res => {
                    if (res.data.code === 0) {
                      this.$Message.success(`${res.data.msg}`);
                      this.getAllServerList();
                      this.getServerList(this.searchVal)
                      this.getTagTree()
                      this.modalMap.modalVisible = false;
                    } else {
                      this.$Message.error(`${res.data.msg}`);
                    }
                  }
                );
              }, 1000);
            } else {
              this.$Message.error('表单校验错误');
            }
          })
        },
        handlerDeleteTag(params) {
          if (confirm(`确定要删除标签 ${params.row.tag_name}`)) {
            operationTag({ tag_id: params.row.id }, 'delete').then(
              res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.getTagList("tag_name", this.searchVal)
                } else {
                  this.$Message.error(`${res.data.msg}`)
                }
              })
          }
        },
        handlerDeleteDB(params) {
          if (confirm(`确定要删除数据库 ${params.row.db_code}`)) {
            operationDB({ db_id: params.row.id }, 'delete').then(
              res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.getDBList("tag_name",this.selectTag)
                } else {
                  this.$Message.error(`${res.data.msg}`)
                }
              })
          }
        },
        handlerDeleteServer(params) {
          if (confirm(`确定要删除主机 ${params.row.hostname}`)) {
            operationServer({ server_id: params.row.id }, 'delete').then(
              res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.getServerList("tag_name",this.selectTag)
                } else {
                  this.$Message.error(`${res.data.msg}`)
                }
              })
          }
        },
        showDBinfo (index) {
          this.$Modal.info({
            title: '数据库详情',
            content: `ID：${this.allDBList[index].id}<br>名称：${this.allDBList[index].db_code}<br>标签：${this.allDBList[index].tag_list}`
          })
        },
        handleReset(name) {
          this.$refs[name].resetFields();
        },

        handlerCheck(val){
          const route = {
            name: 'statisticalImage',
            meta: {
              title: `Web终端`
            }
          }
          this.$router.push(route)
        },
        // 翻页
        changePage (value) {
          this.pageNum = value
          if(this.selectTwo === 'tag'){
             if (this.searchValue) {
              this.getTagList("tag_name", this.searchValue)
            }else{
              this.getTagList()
            }
          }else if(this.selectTwo === 'DB'){
            if (this.searchValue) {
              this.getDBList(this.searchValue)
            } else if (this.selectTag) {
              this.getDBList("tag_name",this.selectTag)
            }else{
              this.getDBList()
            }
          }else if(this.selectTwo === 'server'){
            if (this.searchValue) {
              this.getServerList(this.searchValue)
            } else if (this.selectTag) {
              this.getServerList("tag_name",this.selectTag)
            }else{
              this.getServerList()
            }
          }
        },
        // 切换分页
        handlePageSize(value){
          this.pageSize = value
          this.pageNum = 1
          if(this.selectTwo === 'tag'){
            if (this.searchValue) {
              this.getTagList("tag_name", this.searchValue)
            }else{
              this.getTagList()
            }
          }else if(this.selectTwo === 'DB'){
            if (this.searchValue) {
              this.getDBList(this.searchValue)
            } else if (this.selectTag) {
              this.getDBList("tag_name",this.tag_name)
            }else{
              this.getDBList()
            }
          }else if(this.selectTwo === 'server'){
            if (this.searchValue) {
              this.getServerList(this.searchValue)
            } else if (this.selectTag) {
              this.getServerList("tag_name",this.tag_name)
            }else{
              this.getServerList()
            }
          }
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
            this.searchVal = null
             this.pageNum = 1
            if(data.title === 'root'){
              this.selectTag = null
              this.selectTwo = 'tag'
              this.getTagList()
            }else if (data.tag_name && data.node ==='DB'){
              this.selectTwo = data.node
              this.selectTag = data.tag_name
              this.getDBList("tag_name", data.tag_name)
            }else if (data.tag_name && data.node ==='server'){
              this.selectTwo = data.node
              this.selectTag = data.tag_name
              this.getServerList("tag_name", data.tag_name)
            }else if(data.title === 'DB' && !data.node){
              this.selectTag = null
              this.selectTwo = data.title
              this.getDBList()
            }else if(data.title === 'server' && !data.node){
              this.selectTag = null
              this.selectTwo = data.title
              this.getServerList()
            }
          }
        },
    },
    watch:{
      searchVal (val) {
        this.searchVal = val
        if(this.selectTwo === 'tag'){
          this.getTagList("tag_name", this.searchVal)
        }else if(this.selectTwo === 'DB'){
          this.getDBList(this.searchVal)
        }else if(this.selectTwo === 'server'){
          this.getServerList(this.searchVal)
        }
      }
    },
    mounted(){
      this.getTagTree()
      this.getTagList()
      // this.getAllTagList()
      // this.getDBList()
      // this.geALLDBList()
      // this.getAllServerList()
      // this.getUserList()
      // this.getProxyList()
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
        width: 250px;
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

<template>
<div>
  <Row :gutter="20">
  <!-- <Card>
        <i-col :md="24" :lg="5" style="margin-bottom: 20px;">
      <Card>
        <Tree ref="tree" :data="tagTreeData"  @on-select-change="handlerTreeChange" getSelectedNodes></Tree>
      </Card>
    </i-col> -->
    <alert>DB管理目前只是记录，后续会支持自动获取DB信息</alert>
    <div class="search-con search-con-top">
      <Input class="search-input" v-model="searchVal" style="padding:6px;" placeholder="输入关键字搜索"/>
      <slot name="new_btn">
        <Button type="primary" @click="handlerDB('', 'post', '添加数据库')" class="search-btn">添加数据库</Button></slot>
        <Button type="error" class="search-btn"  @click="handlerDelete">批量删除</Button>
        <Detail :dialog="dialog2" :formData="formValidate" @e-close="closeModal"></Detail>
    </div>
    <Table size="small" ref="selection" border :columns="columns" :data="tableData" @on-selection-change="handleSelectChange"></Table>
    <div style="margin: 10px; overflow: hidden">
      <div style="float: left;">
      <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[18,35,50,100] show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
      </div>
    </div>
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
        <!-- <FormItem label="代理" prop="proxy_host">
          <Select v-model="formValidate.proxy_host"  placeholder='请选择代理主机，通过代理主机访问数据库'>
            <Option v-for="item in allProxyList" :value="item.proxy_host" :key="item.id">{{ item.proxy_host }}</Option>
          </Select>
        </FormItem> -->
        <FormItem label="类型" prop="db_type">
          <Select v-model="formValidate.db_type" placeholder='请选择数据库类型'>
            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="版本" prop="db_version">
          <Input v-model="formValidate.db_version" :maxlength=30 placeholder='请输入版本'></Input>
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
  <!-- </Card> -->
  </Row>
  </div>
</template>

<script>

import Detail from './db_detail'
import { getDBlist, getDBDetail, operationDB } from '@/api/cmdb2/db.js'
import { getTagList } from '@/api/cmdb2/tag.js'
import { getProxylist } from '@/api/task-other'
import { getuserlist } from '@/api/user'


export default {
  components: {
      Detail,
  },
  data() {
    return {
        DBDetail: Object,
        dialog2: {
          show: false,
          title: 'DB详情'
        },
        // 分页
        pageTotal: 0, // 数据总数
        pageNum: 1, // 当前页码
        pageSize: 18, // 每页条数
        searchKey: "",
        searchValue: "",
        selectTwo: 'tag',
        selectTag: null,
        tagTreeData:[],
        searchVal:'',
        modalMap1: {
          modalVisible: false,
          modalTitle: '添加数据库'
        },
        editModalData: null,
        tableData: [],
        tableDataServer: [],
        // tableDataDB: [],
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
          db_version: '',
          db_mark:'写',
          tag_list: [],
          db_detail:'介绍一下吧',
        },
        envList: [
          { value: 'dev',label: 'dev'},
          { value: 'qa', label: 'qa'},
          { value: 'staging', label: 'staging'},
          { value: 'sandbox', label: 'sandbox'},
          { value: 'release', label: 'release'},
          { value: 'hidden', label: 'hidden'}
        ],
        typeList: [
          { value: 'MySQL', label: 'MySQL'},
          { value: 'Redis', label: 'Redis'},
          { value: 'MongoDB', label: 'MongoDB'},
          { value: 'Other', label: 'Other'},
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
          // proxy_host: [{ required: true, message: "请选择代理主机", trigger: "change"}],
          db_type: [{ required: true, message: "请选择数据库类型", trigger: "change"}],
          db_mark: [{ required: true, message: "请选择标记", trigger: "change"}],
        },

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
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'a',
                {
                  on: {
                    click: () => {
                      this.handleDetail(params.row)
                    }
                  }
                },
                params.row.db_code
              )
            ])
          }
        },
        { title: 'DB地址',  key: 'db_host', align: 'center', sortable: true },
        { title: '端口',  key: 'db_port', align: 'center', sortable: true },
        { title: '用户',  key: 'db_user', align: 'center', sortable: true },
        { title: '环境',  key: 'db_env', align: 'center', sortable: true },
        { title: '角色',  key: 'db_mark', align: 'center', sortable: true },
        { title: '类型',  key: 'db_type', align: 'center', sortable: true},
        { title: '版本',  key: 'db_version', align: 'center', sortable: true},
        // { title: '代理', key: 'proxy_host', align: 'center', sortable: true},
        { title: '状态', key: 'state', width: 120, align: 'center', sortable: true},
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
      ],
    };
  },
  methods: {
    // 获取数据库
    getDBList(key, value) {
        getDBlist(this.pageNum, this.pageSize, key, value).then(res => {
            if (res.data.code === 0) {
                this.pageTotal = res.data.count
                this.tableData = res.data.data
            } else {
                this.$Message.error(`${res.data.msg}`)
            }
        })
    },
        // 获取主机详情
    getDBDetailList(key, value) {
      // console.log('key, vlaue', key,value)
      getDBDetail(key, value).then(res => {
        if (res.data.code === 0) {
          this.DBDetail = res.data.data[0]  
        } else {
          this.DBDetail = {
            id: null,
            db_code:'',
            db_host:'',
            db_port:'',
            db_user: '',
            db_pwd:'',
            db_env:'',
            proxy_host:'',
            db_type:'',
            db_version: '',
            db_mark:'',
            tag_list: [],
            db_detail:'',
          }
          // this.$Message.error(`${res.data.msg}`)
        }
      })
    },


    //获取所有数据库信息
    getALLDBList() {
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
    // 获取代理主机
    getProxyList() {
        getProxylist().then(res => {
        if (res.data.code === 0) {
            this.allProxyList = res.data.data
        } else {
            this.$Message.error(`${res.data.msg}`)
        }
        })
    },

    //获取Tag列表
    getTagList () {
        getTagList().then(res => {
            if (res.data.code === 0) {
            // this.$Message.success(`${res.data.msg}`)
            this.allTagList = res.data.data
            console.log(this.allTagList)
            }
        })
    },

    handlerDelete(){
        console.log(this.tableSelectIdList.length)
        if (this.tableSelectIdList.length > 0) {
            if (confirm(`确定要批量删除选中数据库 `)) {
                operationDB({ 'id_list':this. tableSelectIdList }, 'delete').then(
                    res => {
                        if (res.data.code === 0) {
                            this.$Message.success(`${res.data.msg}`)
                            this.getDBList(this.searchVal)
                        }else {
                            this.$Message.error(`${res.data.msg}`)
                            }
                        })
                    }
        }else {
        this.$Message.info(`你总要选中点什么吧`)
        }
    },

    handleDetail (paramsRow) {
      this.dialog2.show = true
      // this.serverDetail = {}
      this.DBDetail = {
            id: null,
            db_code:'',
            db_host:'',
            db_port:'',
            db_user: '',
            db_pwd:'',
            db_env:'',
            proxy_host:'',
            db_type:'',
            db_version: '',
            db_mark:'',
            tag_list: [],
            db_detail:'',
          }
      this.getDBDetailList('ip', paramsRow.ip)
      setTimeout(() => {
        this.formValidate = {
            id: paramsRow.id,
            db_code: paramsRow.db_code,
            db_host: paramsRow.db_host,
            db_port: paramsRow.db_port,
            db_user: paramsRow.db_user,
            db_pwd: paramsRow.db_pwd,
            db_env: paramsRow.db_env,
            db_version: paramsRow.db_version,
            proxy_host: paramsRow.proxy_host,
            db_type: paramsRow.db_type,
            db_mark: paramsRow.db_mark,
            db_detail: paramsRow.db_detail,
            state: paramsRow.state,
            db_tag: paramsRow.tag_list
        }
      }, 500)
    },
    // handleDetail (index) {
    //     this.$Modal.info({
    //         title: '待完善',
    //         //content: `项目名称：${this.tableData[index].project_name}<br>项目状态：${this.tableData[index].project_status}<br>项目需求者：${this.tableData[index].project_requester}<br>接手人员：${this.tableData[index].project_processing}<br>项目开始时间：${this.tableData[index].project_start_time}<br>项目结束时间：${this.tableData[index].project_end_time}`
    //     })
    // },
    closeModal () {
      this.over()
    },
    // table 选中的ID
    handleSelectChange (val) {
        let SelectIdList = []
        val.forEach(item => {
        SelectIdList.push(item.id)
        })
        this.tableSelectIdList = SelectIdList
    },
    tagHandleChange (newTargetKeys) {
      console.log(this.formData.tag)
      this.formData.tag = newTargetKeys
    },
    tagFilter (data, query) {
      return data.label.indexOf(query) > -1
    },
    handlerDB(paramsRow, meth, mtitle){
          this.modalMap1.modalVisible = true
          this.modalMap1.modalTitle = mtitle
          this.editModalData = meth
          //
          this.getProxyList()
          this.getTagList()
          console.log(paramsRow)
          if (paramsRow && paramsRow.id) {
            this.formValidate = {
            id: paramsRow.id,
            db_code: paramsRow.db_code,
            db_host:paramsRow.db_host,
            db_port:paramsRow.db_port,
            db_user: paramsRow.db_user,
            db_pwd: paramsRow.db_pwd,
            db_env: paramsRow.db_env,
            // proxy_host: paramsRow.proxy_host,
            db_type: paramsRow.db_type,
            db_version: paramsRow.db_version,
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
            // proxy_host:'',
            db_type:'mysql',
            db_version: '',
            db_mark:'写',
            tag_list:[],
            db_detail:'介绍一下吧',
          }
          }
        },
    handleSubmit (value) {
        this.$refs[value].validate((valid) => {
                    if (valid) {
                        setTimeout(() => {
                            operationDB(this.formValidate, this.editModalData).then(res => {
                                if (res.data.code === 0) {
                                    this.$Message.success(`${res.data.msg}`)
                                    this.getDBList(
                                    // this.pageNum,
                                    // this.pageSize,
                                    this.searchKey,
                                    this.searchValue
                                    )
                                    this.modalMap1.modalVisible = false
                                } else {
                                    this.$Message.error(`${res.data.msg}`)
                                }
                            })
                        }, 1000)
                        // this.$Message.success('Success!');
                    } else {
                        this.$Message.error('缺少必要参数');
                    }
                })
            },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    //删除DB
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
    // 删除
    delData (params) {
        if (confirm(`确定要删除 ${params.row.db_code}`)) {
            operationDB(
            {
                id: params.row.id
            },
            'delete'
            ).then(res => {
            if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
                this.tableData.splice(params.index, 1)
            } else {
                this.$Message.error(`${res.data.msg}`)
            }
            })
        }
        },
    // setDefaultSearchKey() {
    //   this.searchKey =
    //     this.columns[0].key && this.columns[0].key !== "handle"
    //       ? this.columns[0].key
    //       : this.columns.length > 1
    //       ? this.columns[1].key
    //       : "";
    // },
    handleClear(e) {
      if (e.target.value === "") this.tableData = this.value;
    },
    handleSearch() {
      this.getDBList(this.pageNum,this.pageSize,this.searchKey, this.searchValue);
    },
    changePage (value) {
        if (this.searchValue) {
              this.getDBList(this.searchValue)
            } else if (this.selectTag) {
              this.getDBList("tag_name",this.selectTag)
            }else{
              this.getDBList()
            }
        // this.pageNum = value
        // this.getDBList(
        //     this.pageNum,
        //     this.pageSize,
        //     this.searchKey,
        //     this.searchValue
        //   )
        },
    // 每页条数
    handlePageSize (value) {
        if (this.searchValue) {

          this.getDBList(this.searchValue)
          } else if (this.selectTag) {
            this.getDBList("tag_name",this.tag_name)
          }else{
            this.getDBList()
          }
        // this.pageSize = value
        // this.operationDB(1, this.pageSize, this.searchKey, this.searchValue)
      }
    },
    watch:{
      searchVal (val) {
        this.searchVal = val
        this.getDBList(this.searchVal)
        // if(this.selectTwo === 'tag'){
        //   this.getTagList("tag_name", this.searchVal)
        // }else if(this.selectTwo === 'DB'){
        //   this.getDBList(this.searchVal)
        // }else if(this.selectTwo === 'server'){
        //   this.getServerList(this.searchVal)
        // }
      }
    },
  
  mounted() {
      this.getDBList()
    }
};
</script>

<style lang="less" scoped>
.search-con {
  padding: 10px 0;
  .search {
    &-col {
      display: inline-block;
      width: 200px;
    }
    &-input {
      display: inline-block;
      width: 200px;
      margin-left: 2px;
    }
    &-btn {
      margin-left: 2px;
    }
  }
}
</style>

<template>
<div>
    <Row :gutter="10">
    <i-col :md="24" :lg="5">
      <Card>
        <Tree ref="tree" :data="tagTreeData"  @on-select-change="handlerTreeChange" getSelectedNodes></Tree>
      </Card>
    </i-col>
    <i-col :md="24" :lg="19">
  <Card>
    <Alert banner closable >同步Tag树：默认情况下部署CMDB时候settings里面配置了任务系统的数据库信息，主机资产会每天定时同步到Tag树，也可点击手动同步，无需选中主机，同步所有，注意请不要多次点击。</Alert>
    <div class="search-con search-con-top">
      <Input class="search-input" v-model="searchVal" style="padding:5px;" placeholder="输入关键字全局搜索"/>
      <slot name="new_btn">
        <Button type="primary" @click="editModal('', 'post', '添加主机')" class="search-btn">添加主机</Button></slot>
        <Button type="error" class="search-btn"  @click="handlerDelete">批量删除</Button>
        <Detail :dialog="dialog2" :formData="formValidate" @e-close="closeModal"></Detail>
        <!-- <Button type="info" v-if="rules.asset_error_log" class="search-btn" @click="handlerCheckErrorLog">任务日志 -->

        <!-- </Button>
        <Button v-if="rules.web_ssh_btn" class="search-btn">
          <router-link tag="a" target="_blank" :to="{name: 'web_ssh'}">Web终端</router-link>
        </Button> -->

        <!-- <Button type="info" class="search-btn"  @click="handlerRsyncKey">推送密钥</Button> -->
        <Button type="success" class="search-btn"  @click="handlerAssetUpdate">资产更新</Button>
        <Button type="info" class="search-btn" :loading="loading" @click="handleSyncTagTree">同步标签树</Button>

    </div>
    <Table size="small" ref="selection" border :columns="columns":data="tableData"@on-selection-change="handleSelectChange"></Table>
      <div style="margin: 10px; overflow: hidden">
        <div style="float: left;">
            <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[15,35,50,100] show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize">
            </Page>
        </div>
      </div>
    <Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :loading=true :footer-hide=true :mask-closable=false>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="85">
        <Alert closable>管理用户：用来登陆你的主机获取资产信息，请务必配置！</Alert>
        <div v-if="editModalData && editModalData == 'put'">
          <FormItem
            label="主机名称"
            prop="hostname"
          >
            <Input
              v-model="formValidate.hostname"
              :maxlength="45"
              placeholder="请输入主机名"
            ></Input>
          </FormItem>
        </div>
        <div v-else>
          <FormItem
            label="主机名"
            prop="hostname"
          >
            <Input
              v-model="formValidate.hostname"
              :maxlength="45"
              placeholder="请输入主机名"
            ></Input>
          </FormItem>
        </div>
        <FormItem label="IP" prop="ip">
            <Input
                v-model="formValidate.ip"
                :maxlength="45"
                placeholder="请输入IP地址"
            ></Input>
        </FormItem>
        <FormItem label="公网IP" prop="public_ip">
            <Input
                v-model="formValidate.public_ip"
                :maxlength="45"
                placeholder="公网IP"
            ></Input>
        </FormItem>
        <FormItem label="端口">
            <!-- <InputNumber :max="65535" :min="1" v-model="formValidate.port"></InputNumber> -->
            <Input v-model="formValidate.port" :maxlength="5" placeholder="端口"></Input>
        </FormItem>
        <!-- <div v-if="editModalData && editModalData == 'put'">
          <FormItem label="CPU(Core)" prop="cpu">
            <Input v-model="formValidate.cpu" :maxlength="45" placeholder="CPU"></Input>
          </FormItem>
          <FormItem label="内存" prop="memory">
            <Input v-model="formValidate.memory" :maxlength="45" placeholder="内存"></Input>
          </FormItem>

          <FormItem label="磁盘总共 / 使用率" prop="disk">
            <Input v-model="formValidate.disk" :maxlength="45" placeholder="磁盘"></Input>
          </FormItem>
        </div> -->
        <FormItem label="IDC" prop="idc">
          <Select v-model="formValidate.idc" placeholder="选择IDC机房">
            <Option value="AWS" >AWS</Option>
            <Option value="阿里云" >阿里云</Option>
            <Option value="腾讯云" >腾讯云</Option>
            <Option value="华为云" >华为云</Option>
            <Option value="内网" >内网</Option>
            <Option value="其他" >其他</Option>
          </Select>
        </FormItem>

        <FormItem label="区域" prop="region">
            <Input v-model="formValidate.region" :maxlength="45" placeholder="Region区域，如：cn-shanghai, us-east-1"></Input>
        </FormItem>

        <FormItem label="管理用户" prop="admin_user">
            <Select v-model="formValidate.admin_user" placeholder="请选择一个管理用户" filterable>
              <Option v-for="item in admUserList" :value="item.admin_user">{{item.admin_user}}</Option>
            </Select>
        </FormItem>
        <FormItem label="标签" prop="tag_list">
          <Select class="search-input-long" v-model="formValidate.tag_list" filterable multiple placeholder="请选择关联的标签">
            <Option v-for="item in allTagList" :value="item.tag_name" :key="item.id" >{{ item.tag_name }}</Option>
          </Select>
        </FormItem>
        <FormItem
          label="备注"
          prop="detail"
        >
          <Input
            v-model="formValidate.detail"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 10}"
            :maxlength="50"
            placeholder="简单描述下吧"
          ></Input>
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            @click="handleSubmit('formValidate')"
          >提交</Button>
          <Button
            @click="handleReset('formValidate')"
            style="margin-left: 8px"
          >重置</Button>
        </FormItem>
      </Form>
    </Modal>
  </Card>
    </i-col>
  </Row>
    <Drawer v-model="logModal" :closable="false"  style="background-color: #f8f8f9" width="820">
      <h2 style="color: #000000; marginLeft: 10px">错误日志：</h2>
      <div style="padding: 10px">
        <Row  v-for="log in logInfo">
          <Col span="24">
            <p style="color: #000000">{{log.create_time}} ：{{log.error_log}}</p>
          </Col>
        </Row>
      </div>
    </Drawer>
  </div>
</template>

<script>
import Detail from './server_detail'
import { getServerList,getServerDetailList, operationServer, assetServerUpdate, getTagtree, getErrorLog, syncServerToTagTree} from '@/api/cmdb2/server.js'
import { getAdminUserList } from "@/api/cmdb2/admin_user";
import { getTagList } from '@/api/cmdb2/tag.js'
import { mapState } from 'vuex'
export default {
    components: {
      Detail,
  },
  data() {
    return {
      loading: false,
      logModal: false,
      logInfo: [],
      tagTreeData:[],
      serverDetail: Object,
      dialog2: {
        show: false,
        title: '主机详情'
      },
      formValidate: {
        hostname: "",
        ip: "",
        public_ip:'',
        port: "22",
        region: "",
        admin_user: "",
        tag_list: [],
        detail: "",
      },
      searchVal: "",
      single: false,
      loadingStatus: false,
      tableData: [],
      admUserList: [],
      allTagList:[],
      tableSelectIdList: [],
      modalMap: {
        modalVisible: false,
        modalTitle: "新建"
      },
      formList: [],
      editModalData: "",
      pageNum: 1, // 当前页码
      pageTotal: 0, // 数据总数
      pageSize: 15, // 每页条数
      //
      searchKey: "",
      searchValue: "",

      ruleValidate: {
        admin_user: [{ required: true, message: "请选择管理用户", trigger: "change"}],
        hostname: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur"
          }
        ],
        ip: [
          {
            required: true,
            message: "请输入IP",
            trigger: "blur"
          }
        ],
        port: [
          {
            required: true,
            message: "请输入端口",
            trigger: "blur"
          }
        ],
        admin_user: [
          {
            required: true,
            message: "请选择管理用户",
            trigger: "blur"
          }
        ]
        },
      columns: [
        {
          type: 'selection',
          key: 'id',
          width: 60,
          align: 'center'
        },
        {
          title: "主机名",
          key: "hostname",
          // width: 240,
          align: "center",
          sortable: true,
          render: (h, params) => {
            return h('a', {
            on: {
                click: () => {
                this.handleDetail(params.row)
                }
            }
            }, params.row.hostname
            )
          }
        },
        {
          title: "IP",
          key: "ip",
          // width: 200,
          align: "center",
          sortable: true
        },

        // {
        //   title: "CPU",
        //   key: "cpu",
        //   width: 150,
        //   align: "center",
        //   sortable: true
        // },
        // {
        //   title: "内存",
        //   key: "memory",
        //   width: 150,
        //   align: "center",
        //   sortable: true
        // },
        // {
        //   title: "硬盘",
        //   key: "disk",
        //   width: 150,
        //   align: "center",
        //   sortable: true,
        // },
        {
          title: "IDC",
          key: "idc",
          width: 150,
          align: "center",
          sortable: true
        },
        {
          title: "区域",
          key: "region",
          width: 150,
          align: "center",
          sortable: true
        },
        {
          title: "管理用户",
          key: "admin_user",
          width: 150,
          align: "center",
          sortable: true
        },
        {
          title: '状态',
          key: 'handle',
          width: 100,
          align: 'center',
          render: (h, params) => {
            let state = params.row.state
            if (state === 'new') {
              return h('div', [
                h('Tag', { props: { color: 'default' } }, 'New')
              ])
            } else if (state === 'true') {
              return h('div',[h('Tag', { props: { color: 'success' }}, 'True')])
            } else if (state === 'auto') {
              return h('div',[h('Tag', { props: { color: 'blue' }}, 'Auto')])
            }
            else {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '4px'
                  },
                  on: {
                    click: () => {
                      this.handleErrorLog(params.row.ip)
                    }
                  }
                },
                'false'
              ),
              ])
            }
          }
        },

        {
          title: "操作",
          key: "handle",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                        this.editModal(params.row, "put", "更新主机");
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.delData(params);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
    };
  },
  methods: {
    handleErrorLog(value){
      this.logModal = true
      getErrorLog('ip', value).then(res =>{
        if (res.data.code === 0){
          this.logInfo = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handlerCheckErrorLog(){
      this.logModal = true
      getErrorLog().then(res =>{
        if (res.data.code === 0){
          this.logInfo = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    closeModal () {
      this.over()
    },
    // 获取TagTree
    getTagTree (key) {
      getTagtree(key).then(res => {
        if (res.data.code === 0) {
          this.tagTreeData = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 获取主机信息
    getServerList(key, value) {
      getServerList( this.pageNum, this.pageSize, key, value).then(res => {
        if (res.data.code === 0) {
          // console.log('count-->',res.data.count)
          this.pageTotal = res.data.count
          this.tableData =  res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
        // 获取主机详情
    getServerDetailList(key, value) {
      // console.log('key, vlaue', key,value)
      getServerDetailList(key, value).then(res => {
        if (res.data.code === 0) {
          this.serverDetail = res.data.data[0]
        } else {
          this.serverDetail = {
            cpu: "",
            disk: "",
            disk_utilization: "",
            id: "",
            // instance_id: null
            // instance_type: null
            ip: "",
            memory: "",
            os_distribution: "",
            os_version: "",
            sn: ""
          }
          // this.$Message.error(`${res.data.msg}`)
        }
      })
    },

    // 获取管理用户列表
    getAdminUserList (page, limit, key, value) {
        getAdminUserList(page, limit, key, value).then(res => {
            if (res.data.code === 0) {
            // this.$Message.success(`${res.data.msg}`)
            this.admUserList = res.data.data
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
            // console.log(this.allTagList)
            }
        })
    },
    // table 选中的ID
    handleSelectChange (val) {
        let SelectIdList = []
        val.forEach(item => {
        SelectIdList.push(item.id)
        })
        this.tableSelectIdList = SelectIdList
    },
    handleDetail (paramsRow) {
      this.dialog2.show = true
      // this.getTagList()
      // this.getAdminUserList()
      this.serverDetail = {
            cpu: "",
            cpu_count: "",
            cpu_cores: "",
            disk: "",
            disk_utilization: "",
            id: "",
            // instance_id: null
            // instance_type: null
            ip: "",
            memory: "",
            sysinfo: "",
            os_kernel: "",
            sn: ""
      }
      this.getServerDetailList('ip', paramsRow.ip)

      setTimeout(() => {
        //const tag_list = paramsRow.tag_list.join(',')
        // if (tag_list) {tag_list.join(' ')}
        this.formValidate = {
            id: paramsRow.id,
            hostname: paramsRow.hostname,
            ip: paramsRow.ip,
            public_ip: paramsRow.public_ip,
            port: paramsRow.port,
            idc: paramsRow.idc,
            region: paramsRow.region,
            admin_user: paramsRow.admin_user,
            tag_list: paramsRow.tag_list,
            detail: paramsRow.detail,
            instance_id: this.serverDetail.instance_id,
            instance_type: this.serverDetail.instance_type,
            instance_state: this.serverDetail.instance_state,
            cpu: this.serverDetail.cpu,
            // cpu_count: this.serverDetail.cpu_count,
            cpu_cores: this.serverDetail.cpu_cores,
            memory: this.serverDetail.memory,
            disk: this.serverDetail.disk,
            os_type: this.serverDetail.os_type,
            os_kernel: this.serverDetail.os_kernel,
            sn: this.serverDetail.sn,
            update_time: this.serverDetail.update_time,
        }
      }, 500)
    },
    closeModal () {
      this.dialog.show = false

    },
    tagHandleChange (newTargetKeys) {
      this.formData.tag = newTargetKeys
    },
    tagFilter (data, query) {
      return data.label.indexOf(query) > -1
    },
    editModal(paramsRow, meth, mtitle) {
        this.modalMap.modalVisible = true;
        this.modalMap.modalTitle = mtitle;
        this.editModalData = meth;
        if (paramsRow && paramsRow.id) {
            // put
            this.getTagList()
            this.getAdminUserList()
            this.formValidate = {
                id: paramsRow.id,
                hostname: paramsRow.hostname,
                ip: paramsRow.ip,
                public_ip: paramsRow.public_ip,
                port: paramsRow.port,
                idc: paramsRow.idc,
                region: paramsRow.region,
                admin_user: paramsRow.admin_user,
                tag_list: paramsRow.tag_list,
                detail: paramsRow.detail,
            }
        } else {
            // post
            this.getAdminUserList()
            this.getTagList()
            if (this.selectTag) {
                this.formValidate = {
                  hostname: '',
                  ip: "",
                  port: "22",
                  admin_user: "",
                  idc: "",
                  region: "",
                  tag_list: [this.selectTag],
                  detail: "",
                  state: 'new',
              }
            } else{
                this.formValidate = {
                  hostname: '',
                  ip: "",
                  port: "22",
                  admin_user: "",
                  idc: "",
                  region: "",
                  tag_list: [],
                  detail: "",
                  state: 'new',
            }
        }}
    },
    handleSubmit (value) {
        this.$refs[value].validate((valid) => {
                    if (valid) {
                        setTimeout(() => {
                            operationServer(this.formValidate, this.editModalData).then(res => {
                                if (res.data.code === 0) {
                                    this.$Message.success(`${res.data.msg}`)
                                    this.getServerList(
                                    // this.pageNum,
                                    // this.pageSize,
                                    // this.searchKey,
                                    // this.searchValue
                                    )
                                    // this.getTagtree()
                                    this.modalMap.modalVisible = false
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

    handlerAssetUpdate(){
      // console.log(this.tableSelectIdList.length)
      if (this.tableSelectIdList.length > 6) {
         this.$Message.error(`手动更新请不要超过5个，默认添加的机器都会自动推送更新`)
         return
      }
      if (this.tableSelectIdList.length > 0) {
        this.$Spin.show({
            render: (h) => {
              return h('div', [
                h('Icon', {
                  'class': 'demo-spin-icon-load',
                  props: {
                    type: 'ios-loading',
                    size: 18
                  }
                }),
                h('div', '资产更新中....')
              ])
            }
          })
          assetServerUpdate({ 'id_list':this. tableSelectIdList }, 'post').then(
            res => {
              this.$Spin.hide()
                if (res.data.code === 0) {
                    this.$Message.config({
                      top: 24,
                      duration: 5 //停留时间
                    });
                    this.$Message.info(`${res.data.msg}`)
                    this.getServerList(this.searchVal)
                  } else {
                    this.$Message.config({
                      top: 24,
                      duration: 5 //停留时间
                    });
                    this.$Message.error(`${res.data.msg}`)
                  }
                })
      }else {
      this.$Message.info(`你总要选中点什么吧`)
      }
    },

    handleSyncTagTree(){
      this.loading = true
       this.$Modal.confirm({
          title: '提醒',
          content: '<p>向【作业配置】--【Tag树】进行同步资产任务</p>',
          loading: true,
          onOk: () => {
            setTimeout(() => {
              this.$Modal.remove();
                syncServerToTagTree().then( res => {
                  if (res.data.code === 0) {
                      this.$Message.success(`${res.data.msg}`)
                    } else {
                      this.$Message.error(`${res.data.msg}`)
                    }
                  this.loading = false
                  })
            }, 2000);
          },
          onCancel: () => {
            this.loading = false
            this.$Message.info('Clicked cancel');
          }
        });
    },


    handlerDelete(){
      //console.log(this.tableSelectIdList.length)
      if (this.tableSelectIdList.length > 0) {
          if (confirm(`确定要批量删除选中主机 `)) {
              operationServer({ 'id_list':this. tableSelectIdList }, 'delete').then(
                  res => {
                      if (res.data.code === 0) {
                          this.$Message.success(`${res.data.msg}`)
                          this.getServerList(this.searchVal)
                      }else {
                          this.$Message.error(`${res.data.msg}`)
                          }
                      })
                  }
      }else {
      this.$Message.info(`你总要选中点什么吧`)
      }
    },
    // 删除
    delData (params) {
        if (confirm(`确定要删除 ${params.row.hostname}`)) {
          // console.log(params.row.id)
            operationServer(
            {
                'server_id': params.row.id
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
    handleClear(e) {
      if (e.target.value === "") this.tableData = this.value;
    },
    handleSearch() {
      this.getServerList(this.pageNum,this.pageSize,this.searchKey, this.searchValue);
    },
    // 点击节点
    handlerTreeChange(obj) {
      if(obj.length !==0 ){
        const data = obj[0]
        // this.searchVal = null
          this.pageNum = 1
        if(data.title === 'root'){
          this.selectTag = null
          // this.selectTwo = 'tag'
          this.getTagList()
          this.getServerList()
        }else if (data.tag_name){
          this.selectTwo = data.node
          this.selectTag = data.tag_name
          this.getServerList("tag_name", data.tag_name)
        }else if(data.title === 'root' && !data.node){
          this.selectTag = null
          this.selectTwo = data.title
          this.getServerList()
        }
      }
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
      }else if (this.selectTag) {
          this.getServerList("tag_name",this.selectTag)
      }else{
          this.getServerList()
        }
    },
    // 切换分页
    handlePageSize (value) {
      this.pageSize = value
      this.pageNum = 1
      if (this.searchValue) {
        this.getServerList(this.searchValue)
        } else if (this.selectTag) {
          this.getServerList("tag_name",this.tag_name)
        }else{
          this.getServerList()
        }
      }
    },
  computed: {
    ...mapState({
      rules: state => state.user.rules
    })
  },
  watch: {
    searchVal(val) {
      this.searchVal = val
      this.getServerList(this.searchVal)
    }
  },

  mounted() {
    this.getServerList()
    this.getTagList()
    this.getAdminUserList()
    this.getTagTree()
    }
};
</script>

<style lang="less" scoped>
.search-con {
  padding: 3px 0;
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

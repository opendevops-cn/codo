<template>
<Card>
      <Alert type="success" show-icon closable>
        自动获取指定云厂商主机信息
        <span slot="desc">若此处配置了，系统会自动调用请求云厂商主机详情脚本(只要有查询实例的权限即可)，将指定区域的配置自动拉取并写入CMDB中,另外AWS测试可能需要5~10s不等，因为请求接口都在国外</span>
        <br />
        <span>0. 只有状态按钮为开启状态，系统才会去你配置的区域里面去拉取主机信息</span>
        <br />
        <span>1. 请确保你填写的AccessID/AccessKey/Region区域信息的准确性，可点击测试按钮进行测试权限</span>
        <br />
        <span>2. 最好能够确保你机器的Hostname是唯一值，CMDB设计中Hostname是不允许重复的，自动必然要有一些规范</span>
        <br />
        <span>3. 默认管理用户：此用户是可以登陆机器的，若此处填写了默认管理用户，会自动给机器关联上此用户，用于后续资产更新连接使用，一般情况下管理用户一个账户里面OPS都是1-2个，毕竟太多OPS自己维护起来也很麻烦</span>
        <br />
        <span>4. 自动获取来的机器状态都是Auto状态，若不配置管理用户，默认资产详情信息都是从云平台获取的一些基本信息，若配置了管理用户并更新了资产，资产信息来源基于系统本身获取到的</span>
        <br />
        <span>5. 考虑到了每个云厂商的区域不同，整理了下各厂商的区域/可用区文档链接。 &nbsp&nbsp<a href="https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/using-regions-availability-zones.html" target="_blank">AWS区域链接</a>&nbsp&nbsp  <a href="https://help.aliyun.com/document_detail/40654.html" target="_blank">阿里云区域链接</a>&nbsp&nbsp   <a href="https://cloud.tencent.com/document/product/213/6091" target="_blank">腾讯云区域链接</a> </span>
        <br />
        <span>6. 拉取资产按钮：手动触发云厂商主机更新到主机列表，默认情况下6小时会自动更新一次，请不要频繁点击，可能会产生调用接口费用(AWS)</span>
    </Alert>
    <div class="search-con search-con-top">
      <Select v-model="searchKey" class="search-col">
        <Option v-for="item in columns" v-if="item.key !== 'handle' && item.key !== 'status' && item.key !== ''" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
      </Select>
      <Input @on-change="handleClear" clearable placeholder="搜索" class="search-input" v-model="searchValue"/>
      <Button @click="handleSearch" class="search-btn" type="primary">搜索</Button>
      <slot name="new_btn" ><Button type="primary"  @click="editModal('', 'post', '新增配置')" class="search-btn" >新增配置</Button></slot>
      <slot name="new_btn1" ><Button type="success" :loading="loading2" @click="handleUpdateServer()" class="search-btn" >拉取Server</Button></slot>
      <Button type="warning" :loading="loading2" @click="handleUpdateRDS()" class="search-btn" >拉取RDS</Button>
      <Button type="info" :loading="loading2" @click="handleUpdateREDIS()" class="search-btn" >拉取Redis</Button>

    </div>
  <Table size="small" ref="selection" border :columns="columns" :data="tableData"></Table>
  <Modal v-model="modalMap.modalVisible"  :title="modalMap.modalTitle" :loading=true :footer-hide=true width="650">
    <form-group :list="formList"  @on-submit-success="handleSubmit"></form-group>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="名称" prop="name">
          <div  v-if="formValidate.id">
            <Input v-model="formValidate.name" :maxlength="20" disabled placeholder='请输入名称,不可重复'></Input>
          </div>
          <div v-else>
            <Input v-model="formValidate.name" :maxlength="20" placeholder='请输入名称,不可重复'></Input>
          </div>
        </FormItem>

        <FormItem label="云厂商" prop="account">
          <Select v-model="formValidate.account" placeholder="选择云厂商">
            <Option value="AWS" >AWS</Option>
            <Option value="阿里云" >阿里云</Option>
            <Option value="腾讯云" >腾讯云</Option>
            <Option value="华为云" >华为云</Option>
            <Option value="UCloud" >UCloud</Option>
          </Select>
        </FormItem>

        <div v-if="formValidate.account === '华为云'">
          <FormItem label="Cloud" prop="huawei_cloud">
          <div  v-if="formValidate.id">
            <Input v-model="formValidate.huawei_cloud" :maxlength="100" disabled placeholder='默认：myhuaweicloud.com # cdn use: cloud = "myhwclouds.com"'></Input>
          </div>
          <div v-else>
            <Input v-model="formValidate.huawei_cloud" :maxlength="100" placeholder='默认：myhuaweicloud.com # cdn use: cloud = "myhwclouds.com"'></Input>
          </div>
        </FormItem>
          <FormItem label="项目ID" prop="project_id">
          <div  v-if="formValidate.id">
            <Input v-model="formValidate.project_id" :maxlength="100" disabled placeholder='项目ID，其实就是华为云，我的凭证--项目ID，每个区域都有一个'></Input>
          </div>
          <div v-else>
            <Input v-model="formValidate.project_id" :maxlength="100" placeholder='项目ID，其实就是华为云，我的凭证--项目ID，每个区域都有一个'></Input>
          </div>
          </FormItem>
        </FormItem>
          <FormItem label="实例ID" prop="huawei_instance_id">
          <div  v-if="formValidate.id">
            <Input v-model="formValidate.huawei_instance_id" :maxlength="100" disabled placeholder='华为云实例ID，用于测试'></Input>
          </div>
          <div v-else>
            <Input v-model="formValidate.huawei_instance_id" :maxlength="100" placeholder='华为云实例ID，使用测试，如：c2a3e1f3-6674-43f7-881f-71fc0a934e89'></Input>
          </div>
        </FormItem>
       </div>
       <div v-if="formValidate.account === 'UCloud'">
          <FormItem label="项目ID" prop="project_id">
            <div  v-if="formValidate.id">
              <Input v-model="formValidate.project_id" :maxlength="100" disabled placeholder='UCloud 项目ID'></Input>
            </div>
            <div v-else>
              <Input v-model="formValidate.project_id" :maxlength="100" placeholder='UCloud 项目ID'></Input>
            </div>
          </FormItem>
       </div>
        <FormItem label="区域" prop="region">
          <div  v-if="formValidate.id">
            <Input v-model="formValidate.region" :maxlength="50" disabled placeholder='region， 如:cn-hangzhou'></Input>
          </div>
          <div v-else>
            <Input v-model="formValidate.region" :maxlength="50" placeholder='region， 如:cn-hangzhou'></Input>
          </div>
        </FormItem>

        <FormItem label="AccessID" prop="access_id">
          <Input v-model="formValidate.access_id" :maxlength="200"  placeholder='IAM SecretID/AccessID'></Input>
        </FormItem>
        <FormItem label="AccessKey" prop="access_key">
          <Input v-model="formValidate.access_key" :maxlength="200"  placeholder='IAM SecretKey/AccessKey'></Input>
        </FormItem>

        <FormItem label="默认管理用户" prop="default_admin_user">
            <Select v-model="formValidate.default_admin_user" placeholder="请选择一个管理用户" filterable>
              <Option v-for="item in admUserList" :value="item.admin_user">{{item.admin_user}}</Option>
            </Select>
        </FormItem>

        <FormItem label="备注" prop="remarks">
          <Input v-model="formValidate.remarks" type="textarea" :autosize="{minRows: 2,maxRows: 10}" :maxlength="50" placeholder="简单描述下吧"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button@click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
  </Modal>
</Card>
</template>

<script>
import FormGroup from '_c/form-group'
import { getAssetConfigsList, operationAssetConfigs, apiPermission, handleUpdateserver, handleUpdaterds, handleUpdateredis } from '@/api/cmdb2/asset_config'
import { getAdminUserList } from '@/api/cmdb2/admin_user'
export default {
  components: {
    FormGroup
  },
  data () {
    return {
      loading2: false,
      loading: false,
      columns: [
        // {
        //   type: 'selection',
        //   key: '',
        //   width: 60,
        //   align: 'center'
        // },
        {
          title: 'ID',
          key: 'id',
          align: 'center',
          width: 80,
          sortable: true
        },
        {
          title: '名称',
          key: 'name',
          align: 'center',
          minWidth: 120,
        },
        {
          title: '云厂商',
          key: 'account',
          align: 'center',
          minWidth: 100,
        },
        {
          title: '区域',
          key: 'region',
          align: 'center',
          minWidth: 100,
        },
        // {
        //   title: '默认管理用户',
        //   key: 'default_admin_user',
        //   align: 'center'
        // },
        {
          title: '状态',
          key: 'state',
          width: 100,
          align: 'center',
          render: (h, params, vm) => {
            return h('div', [
              h('i-switch', {
                props: {
                  // type: "primary",
                  value: params.row.state === 'true' // 控制开关的打开或关闭状态，官网文档属性是value
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  'on-change': () => {
                    this.onSwitch(params)
                  }
                }
              })
            ])
          }
        },
        {
          title: '权限测试',
          key: 'handle',
          width: 240,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small',
                    loading: this.loading
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.ApiPermission(params, 'server')
                    }
                  }
                },
                'Server'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'warning',
                    size: 'small',
                    loading: this.loading
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.ApiPermission(params,'rds')
                    }
                  }
                },
                'RDS'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'info',
                    size: 'small',
                    loading: this.loading
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.ApiPermission(params, 'redis')
                    }
                  }
                },
                'Redis'
              )
            ])
          }
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
                      this.editModal(params.row, 'put', '编辑配置')
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
      ruleValidate: {
        name: [
          {
            required: true,
            message: 'The name cannot be empty',
            trigger: 'blur'
          }
        ],
        account: [
          {
            required: true,
            message: '选择云厂商',
            trigger: 'blur'
          }
        ],
        region: [
          {
            required: true,
            message: '云厂商的region',
            trigger: 'blur'
          }
        ],
        access_id: [
          {
            required: true,
            message: 'IAM角色 AccessID,需要有权限访问云主机',
            trigger: 'blur'
          }
        ],
        access_key: [
          {
            required: true,
            message: 'IAM角色 AccessKey,需要有权限访问云主机',
            trigger: 'blur'
          }
        ],
        project_id: [
          {
            required: true,
            message: '华为云每个区域对应的都有一个项目ID',
            trigger: 'blur'
          }
        ],
        huawei_cloud: [
          {
            required: true,
            message: '华为云的Cloud地址，默认：myhuaweicloud.com',
            trigger: 'blur'
          }
        ],
        huawei_instance_id: [
          {
            required: true,
            message: '华为云的实例ID，用来测试，如：c2a3e1f3-6674-43f7-881f-71fc0a934e89',
            trigger: 'blur'
          }
        ]
      },
      formValidate: {
        id: null,
        name: '',
        account: '',
        region: '',
        access_id: '',
        access_key: '',
        default_admin_user: '',
        // state:'',
        remarks: '',
        huawei_cloud: 'myhuaweicloud.com',
        project_id: ''
      },
      tableData: [],
      pageTotal: 0, // 数据总数
      pageNum: 1, // 当前页码
      pageSize: 15, // 每页条数
      modalMap: {
        modalVisible: false,
        modalTitle: '新增配置'
      },
      formList: [],
      admUserList: [],
      editModalData: '',
      //
      searchKey: '',
      searchValue: ''
    }
  },
  methods: {
    getAssetConfigsList (key, value) {
      getAssetConfigsList(key, value).then(res => {
        if (res.data.code === 0) {
          // this.$Message.success(`${res.data.msg}`)
          this.tableData = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
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

    // 测试用户填写的信息是否正确
    ApiPermission (params, api_type) {
      this.loading = true
      const data = {
        'api_type': api_type,
        'account': params.row.account,
        'access_id': params.row.access_id,
        'access_key': params.row.access_key,
        'region': params.row.region,
        'project_id': params.row.project_id,
        'huawei_cloud': params.row.huawei_cloud,
        'huawei_instance_id': params.row.huawei_instance_id
      }
      apiPermission(data).then(res => {
        this.$Message.config({
          top: 50,
          duration: 5 // 停留时间
        })
        
        if (res.data.code === 0) {
          this.loading = false
          this.$Message.success(`${res.data.msg}`)
        } else {
          this.loading = false
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },


    // // 测试用户填写的信息是否正确(ECS)
    // EcsAuth (params) {
    //   this.loading = true
    //   const data = {
    //     'account': params.row.account,
    //     'access_id': params.row.access_id,
    //     'access_key': params.row.access_key,
    //     'region': params.row.region,
    //     'project_id': params.row.project_id,
    //     'huawei_cloud': params.row.huawei_cloud,
    //     'huawei_instance_id': params.row.huawei_instance_id
    //   }
    //   ecsAuth(data).then(res => {
    //     this.$Message.config({
    //       top: 50,
    //       duration: 5 // 停留时间
    //     })
    //     if (res.data.code === 0) {
    //       this.loading = false
    //       this.$Message.success(`${res.data.msg}`)
    //     } else {
    //       this.loading = false
    //       this.$Message.error(`${res.data.msg}`)
    //     }
    //   })
    // },

    // 测试用户填写的信息是否正确(RDS)
    // RdsAuth (params, api_type) {
    //   this.loading = true
    //   console.log('type--->', type)
    //   const data = {
    //     'account': params.row.account,
    //     'access_id': params.row.access_id,
    //     'access_key': params.row.access_key,
    //     'region': params.row.region,
    //     'api_type': api_type
    //   }
    //   rdsAuth(data).then(res => {
    //     this.$Message.config({
    //       top: 50,
    //       duration: 5 // 停留时间
    //     })
    //     if (res.data.code === 0) {
    //       this.loading = false
    //       this.$Message.success(`${res.data.msg}`)
    //     } else {
    //       this.loading = false
    //       this.$Message.error(`${res.data.msg}`)
    //     }
    //   })
    // },


    // // 测试用户填写的信息是否正确(Redis)
    // RedisAuth (params) {
    //   this.loading = true
    //   const data = {
    //     'account': params.row.account,
    //     'access_id': params.row.access_id,
    //     'access_key': params.row.access_key,
    //     'region': params.row.region
    //   }
    //   redisAuth(data).then(res => {
    //     this.$Message.config({
    //       top: 50,
    //       duration: 5 // 停留时间
    //     })
    //     if (res.data.code === 0) {
    //       this.loading = false
    //       this.$Message.success(`${res.data.msg}`)
    //     } else {
    //       this.loading = false
    //       this.$Message.error(`${res.data.msg}`)
    //     }
    //   })
    // },

    handleUpdateServer () {
      this.loading2 = true
      this.$Modal.confirm({
        title: 'ECS录入',
        content: '<p>获取开启状态中EC2服务器信息录入CMDB，详细信息可看后端日志</p>',
        loading: true,
        onOk: () => {
          setTimeout(() => {
            this.$Modal.remove()
            handleUpdateserver().then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
              this.loading2 = false
            })
          }, 3000)
        },
        onCancel: () => {
          this.loading2 = false
          this.$Message.info('Clicked cancel')
        }
      })
    },


    handleUpdateRDS () {
      this.loading2 = true
      this.$Modal.confirm({
        title: 'RDS录入',
        content: '<p><p>获取开启状态中RDS数据库信息录入CMDB，详细信息可看后端日志</p>',
        loading: true,
        onOk: () => {
          setTimeout(() => {
            this.$Modal.remove()
            handleUpdaterds().then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
              this.loading2 = false
            })
          }, 3000)
        },
        onCancel: () => {
          this.loading2 = false
          this.$Message.info('Clicked cancel')
        }
      })
    },

    handleUpdateREDIS () {
      this.loading2 = true
      this.$Modal.confirm({
        title: 'Redis录入',
        content: '<p><p>获取开启状态中Redis/缓存/数据库信息录入CMDB，详细信息可看后端日志</p>',
        loading: true,
        onOk: () => {
          setTimeout(() => {
            this.$Modal.remove()
            handleUpdateredis().then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
              this.loading2 = false
            })
          }, 3000)
        },
        onCancel: () => {
          this.loading2 = false
          this.$Message.info('Clicked cancel')
        }
      })
    },

    // handleUpdateServer(){
    //   this.loading2 = true
    //   handleUpdateserver().then(res => {
    //     if (res.data.code ===0){
    //       this.$Message.success(`${res.data.msg}`)
    //     } else{
    //       this.$Message.error(`${res.data.msg}`)
    //     }
    //     this.loading2 = false
    //   })
    // },

    editModal (paramsRow, meth, mtitle) {
      this.modalMap.modalVisible = true
      this.modalMap.modalTitle = mtitle
      this.editModalData = meth
      if (paramsRow && paramsRow.id) {
        // put
        this.getAdminUserList()
        this.formValidate = {
          id: paramsRow.id,
          name: paramsRow.name,
          account: paramsRow.account,
          region: paramsRow.region,
          access_id: paramsRow.access_id,
          access_key: paramsRow.access_key,
          default_admin_user: paramsRow.default_admin_user,
          state: paramsRow.state,
          remarks: paramsRow.remarks,
          project_id: paramsRow.project_id,
          huawei_cloud: paramsRow.huawei_cloud,
          huawei_instance_id: paramsRow.huawei_instance_id
        }
      } else {
        // post
        this.formValidate = {
          name: '',
          account: '',
          region: '',
          access_id: '',
          access_key: '',
          default_admin_user: '',
          state: 'false',
          remarks: '',
          project_id: '',
          huawei_cloud: 'myhuaweicloud.com',
          huawei_instance_id: ''
        }
      }
    },
    handleSubmit (value) {
      this.$refs[value].validate((valid) => {
        if (valid) {
          setTimeout(() => {
            operationAssetConfigs(this.formValidate, this.editModalData).then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
                this.getAssetConfigsList(
                  // this.pageNum,
                  // this.pageSize,
                  // this.searchKey,
                  // this.searchValue
                )
                this.modalMap.modalVisible = false
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
            })
          }, 1000)
          // this.$Message.success('Success!');
        } else {
          this.$Message.error('缺少必要参数')
        }
      })
    },
    // 删除
    delData (params) {
      if (confirm(`确定要删除 ${params.row.name}`)) {
        operationAssetConfigs(
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
    // 调用开关
    onSwitch (params) {
      operationAssetConfigs(
        {
          id: params.row.id
        },
        'patch'
      ).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    changePage (value) {
      this.pageNum = value
      this.getAssetConfigsList(
        this.searchKey,
        this.searchValue
      )
    },
    setDefaultSearchKey () {
      this.searchKey =
        this.columns[0].key && this.columns[0].key !== 'handle'
          ? this.columns[0].key
          : this.columns.length > 1
            ? this.columns[1].key
            : ''
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    // 每页条数
    // handlePageSize (value) {
    //   this.pageSize = value
    //   this.getAssetConfigsList(page, this.pageSize, this.searchKey, this.searchValue)
    // },
    handleClear (e) {
      if (e.target.value === '') this.tableData = this.value
    },
    handleSearch () {
      console.log(this.searchKey,this.searchValue)
      this.getAssetConfigsList(
        this.searchKey,
        this.searchValue
      )
    }
  },
  mounted () {
    this.getAssetConfigsList()
    this.getAdminUserList()
    this.setDefaultSearchKey()
  }
}
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

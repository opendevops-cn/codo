<template>
  <div>
    <Card>
       <Alert type="success" show-icon>支持云厂商为：阿里云、腾讯云、DNSPod、GoDaddy，一个厂商可以使用多个账号。后台会定时同步厂商数据到CODO</Alert>
        <div class="search-con search-con-top">
          <ButtonGroup class="search-btn">
            <Button  @click="editModal('post', '新增配置', '')" class="search-btn" >新增配置</Button>
          </ButtonGroup>
        </div>
      <Table size="small" ref="selection" :columns="tableColumns" :data="tableData"/>

      <Modal v-model="modalMap.modalVisible"  :title="modalMap.modalTitle" :loading=true :footer-hide=true>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
            <FormItem label="名称简介" prop="alias_name">
              <template  v-if="formValidate.id">
                <Input v-model="formValidate.alias_name" :maxlength="20" disabled placeholder='请输入名称，不可重复'/>
              </template>
              <template v-else>
                <Input v-model="formValidate.alias_name" :maxlength="20" placeholder='请输入名称，不可重复'/>
              </template>
            </FormItem>
            
            <FormItem label="云厂商" prop="cloud_name">
              <Select v-model="formValidate.cloud_name" placeholder="选择云厂商">
                <template v-for="(cloud_code, cloud_name) in cloudDict">
                  <Option :value="cloud_name" :label="cloud_name"></Option>
                </template>
              </Select>
            </FormItem>

            <FormItem label="AccessID" prop="access_id">
              <Input v-model="formValidate.access_id" :maxlength="80"  placeholder='IAM SecretID/AccessID'></Input>
            </FormItem>

            <FormItem label="AccessKey" prop="access_key">
              <Input v-model="formValidate.access_key" :maxlength="100"  placeholder='IAM SecretKey/AccessKey'>*****************</Input>
            </FormItem>

            <FormItem>
              <Button type="primary" :loading="btnLoading" @click="handleSubmit('formValidate')">提交</Button>
              <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </FormItem>
          </Form>
      </Modal>
    </Card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getAccountlist,deleteAccount, operationAccount } from '@/api/domain/domain.js'
export default {
  data () {
    return {
      tableColumns: [
        {
          title: '名称简介',
          key: 'alias_name',
          minWidth: 100
        },
        {
          title: '云厂商',
          key: 'cloud_name',
          align: 'center',
          minWidth: 100
        },
        {
          title: '密钥ID',
          key: 'access_id',
          minWidth: 200
        },
        {
          title: '状态',
          key: 'state',
          minWidth: 100,
          render: (h, params, vm) => {
            return h('div', [
              h('i-switch', {
                props: {
                  'true-color': "#19be6b",
                  value: params.row.state === true // 控制开关的打开或关闭状态，官网文档属性是value
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  'on-change': () => {
                    this.onSwitch(params.row)
                  }
                }
              })
            ])
          }
        },
        {
          title: '#',
          key: 'handle',
          minWidth: 180,
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
                      this.editModal('put', '编辑配置', params.row)
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
        alias_name: [ { required: true, message: "名称简介不能为空", trigger: "blur"}],
        cloud_name: [ { required: true, message: "选择云厂商", trigger: "blur"}],
        access_id:  [ { required: true, message: "IAM角色 AccessID，需要有权限访问云解析", trigger: "blur"}],
        access_key: [ { required: true, message: "IAM角色 AccessKey，需要有权限访问云解析", trigger: "blur"}]
      },
      formValidate: {
          id: '',
          alias_name:'',
          cloud_name:'',
          access_id: '',
          access_key:''
      },
      tableData: [],
      loading: false, //
      loading2: false,
      modalMap: {
        modalVisible: false,
        modalTitle: '新增配置'
      },
      btnLoading: false,
      modalMethod:'',
      // cloudDict: {'DNSPod':'dnspod'},
      cloudDict: {'阿里云':'aliyun', '腾讯云':'qcloud', 'DNSPod':'dnspod', 'GoDaddy':'godaddy'},
    }
  },
  methods: {
    getAccountList () {
      getAccountlist().then(res => {
        if (res.data.code == 0) {
          this.tableData = res.data.data
        } else {
          this.$Message.error(`${res.data.messages}`)
        }
      })
    },
    editModal(meth, mtitle, paramsRow) {
      this.modalMap.modalVisible = true;
      this.modalMap.modalTitle = mtitle;
      this.modalMethod = meth;
      if (meth == 'put' && paramsRow && paramsRow.id) {
        // put
        this.formValidate = paramsRow
      } else {
        // post
        this.formValidate= this.$options.data().formValidate
          
        }
    },
    handleSubmit (value) {
        this.$refs[value].validate((valid) => {
          if (valid) {
            this.btnLoading = true
              setTimeout(() => {
                  this.formValidate['cloud_code'] = this.cloudDict[this.formValidate['cloud_name']]
                  operationAccount(this.formValidate, this.modalMethod).then(res => {
                      if (res.data.code == 0) {
                          this.$Message.success(`${res.data.msg}`)
                          this.getAccountList()
                          this.modalMap.modalVisible = false
                           this.btnLoading = false
                      } else {
                          this.$Message.error(res.data.msg)
                      }
                  })
                  this.btnLoading = false
              }, 2000)
              
          } else {
              this.$Message.error('缺少必要参数');
          }
      })
    },
    // 删除
    delData (params) {
      if (confirm(`确定要删除 ${params.row.alias_name}`)) {
        operationAccount( {del_id: params.row.id}, 'delete').then(res => {
          if (res.data.code == 0) {
            this.$Message.success(`${res.data.msg}`)
            this.tableData.splice(params.index, 1)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      }
    },
    // 调用开关
    onSwitch (paramsRow) {
      let state = paramsRow.state
      operationAccount({id: paramsRow.id, state: !state}, 'patch').then(res => {
         if (res.data.code == 0) {
              this.$Message.success(`${res.data.msg}`)
          } else {
              this.$Message.error(res.data.msg)
          }
      })
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
  },
  computed: {
    ...mapState({
        rules: state => state.user.rules
    }) 
  },
  mounted () {
    this.getAccountList()
  }
}
</script>

<style lang="less" scoped>
  .search-con {
    padding: 5px 0;
    .search {
      &-input {
        display: inline-block;
        width: 350px;
        margin-left: 2px;
      }
      &-btn {
        margin-right: 0px;
      }
    }
  }
</style>

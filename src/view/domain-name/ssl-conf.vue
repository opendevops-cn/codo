<template>
  <div>
    <div class="search-con search-con-top">
      <Input class="search-input" v-model="searchValue" clearable :maxlength='50' placeholder="输入关键字搜索"/>

      <ButtonGroup class="search-btn">
       <Button @click="handlerShowCreate()"><Icon type="ios-add"></Icon>新建配置</Button>
       <Button @click="handlerExportData()"><Icon type="ios-download-outline"></Icon>导出配置</Button>
      </ButtonGroup>
    </div>

    <Table :columns="tableColumns" :data="tableData" size="small" stripe ref="businessTable"></Table>

    <div class="tz-page-layout">
      <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" show-total show-sizer :page-size-opts="[15,20,50,100,500,1000]"
        @on-change="changePage" @on-page-size-change="handlePageSize" />
    </div>
    
    <div>
      <Modal width="600px;" v-model="modalData.show" :title="modalData.title" :loading=true :footer-hide=true @on-cancel="handleCancel" >
        
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">

            <FormItem label="根域名" prop="domain_name">
                <Select v-model="formValidate.domain_name"   filterable  clearable placeholder="请选择域名" @on-change="getRecordbyDomain">
                    <template v-for="item in DomainsList">
                        <Option :value="item.domain_name" >{{item.domain_name}} </Option>
                    </template>
                </Select>
            </FormItem>

            <FormItem label="主机记录" prop="domain_rr">
                <Select v-model="formValidate.domain_rr"   filterable  placeholder="请选择解析">
                    <template v-for="item in recordsList">
                        <Option :value="item.domain_rr" >{{item.domain_rr}}</Option>
                    </template>
                </Select>
            </FormItem>
            <FormItem label="端口" prop="port">
                <Input v-model="formValidate.port" :maxlength="30"  placeholder='请输入端口,多个端口以英文逗号","隔开,不填则默认20000以内端口'></Input>
            </FormItem>

            <FormItem label="是否启用" prop="is_valid" >
              <i-switch v-model="switchStatus" size="large" @on-change="changeSwitchStatus">
                  <span slot="open">On</span>
                  <span slot="close">Off</span>
              </i-switch>
            </FormItem>

            <FormItem>
                <Button type="primary" :loading="btnLoading" @click="handleSubmit('formValidate')">提交</Button>
                <Button@click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </FormItem>

            

        </Form>
      </Modal>
    </div>
  </div>

</template>

<script>
import { getConfList, delConf, operationConf} from '@/api/domain/SSL.js'
import {getDomain, getDomainRecords} from '@/api/domain/domain.js'
export default {
  data () {
    let regVali = (rule, value, callback) => {
      if (value) {
        var isnum = /^[0-9\,]*$/ .test(value)
        if (!isnum) {
          callback(new Error('请输入数字或者英文逗号'))
        } else {
          callback()
        }
      } else {
        callback()
      }
      };

    return {
      switchStatus: true,
      seletedDomain: '',
      searchRecord: '',
      DomainsList: [],
      recordsList: [],
      tableColumns: [
        {
            title: '根域名',
            key: 'domain_name',
            minWidth: 150
        },
        {
            title: '记录',
            key: 'record',
            minWidth: 300
        },
        {
            title: '端口',
            key: 'port',
            minWidth:200,
        },
        {
            title: '更新人',
            key: 'update_by',
            minWidth: 150,
        },
        {
            title: '更新时间',
            key: 'update_time',
            width: 170,
        },
        {
            title: '是否启用',
            key: 'is_valid',
            minWidth: 120,
            render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  'true-color': "#19be6b",
                  value: params.row.is_valid === true // 控制开关的打开或关闭状态，官网文档属性是value
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  'on-change': () => {
                    this.changeSwitch(params.row)
                  }
                }
              })
            ])
          }
        },

        { title: '#', key: 'handle', width: 110,
            render: (h, params) => {
              return h('div', [
                 h(
                  'a',
                  {
                    style: {
                            marginRight: '8px'
                            },
                    on: {
                      click: () => {
                         this.handlerShowEdit(params.row)                        
                      }
                    }
                  },
                  '编辑'
                ),
                h(
                  'a',
                  {
                    on: {
                      click: () => {
                         this.handlerDelConf(params.row)
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
      pageTotal: 0, // 数据总数
      pageNum: 1, // 当前页码
      pageSize: 15, // 每页条数，设置为15是为了方便一般情况下，显示出所有的业务
      searchValue: '',
      // 弹出框
      modalData: {
        show: false,
        title: '添加配置'
      },
      formData: {},
      BKData: [],

      formValidate:{

      },
      btnLoading: false,
      ruleValidate: {
        domain_name: [
          { required: true, message: '根域名不能为空', trigger: 'blur' },
          { type: 'string', max: 28, message: '超出最大长度', trigger: 'change' }
        ],
        domain_rr: [
          { required: true, message: '二级域名不能为空', trigger: 'blur' },
          { type: 'string', max: 28, message: '超出最大长度', trigger: 'change' }
        ],
        port: [
          { required: false, message: '端口为空', trigger: 'blur' },
          { type: 'string', max: 200, message: '超出最大长度', trigger: 'change' },
          { validator: regVali, message: '请输入数字或英文逗号', trigger: 'blur' }
        ],
      }

    }
  },
   methods: {
    
    changeSwitchStatus (val) {
      this.formValidate.is_valid = val
    },


    changeSwitch (paramsRow) {
      let is_valid = paramsRow.is_valid
      operationConf({id: paramsRow.id, is_valid: !is_valid}, 'put').then(res => {
         if (res.data.result) {
              this.$Message.success(`${res.data.messages}`)
              this.handlergetConfList()
          } else {
              this.$Message.error({
                content: JSON.stringify(res.data.messages),
                duration: 3
              })
          }
      })
    },

    getRecordbyDomain (val) {
        this.recordsList = ''
        getDomainRecords(1, 2000,val).then(res => {
        if (res.data.result) {
            this.recordsList = res.data.data.data
        } else {
               this.$Message.error({
              content: JSON.stringify('not found any records'),
              duration: 3
          })
        }
      })
    },

    handlergetConfList() {
      getConfList(this.pageNum, this.pageSize, this.searchValue).then(res => {
        if (res.data.result) {
          this.pageTotal = res.data.data.count
          this.tableData = res.data.data.data
          for(var i = 0, len = this.tableData.length; i < len; i++){
            if (this.tableData[i].domain_rr == '@') {
              this.tableData[i].record = 'www.' + this.tableData[i].domain_name
            } else {
                this.tableData[i].record = this.tableData[i].domain_rr + '.' + this.tableData[i].domain_name
            }
          }
        } else {
          this.tableData = this.$options.tableData
          this.$Message.error({
              content: JSON.stringify(res.data.messages),
              duration: 3
          })
        }
      })
    },

    getDomains() {
        getDomain().then(res => {
        if (res.data.result) {
            this.DomainsList = res.data.data.data
        } else {
          this.$Message.error({
              content: JSON.stringify(res.data.messages),
              duration: 3
          })
        }
      })
    },

    handlerDelConf(paramsRow){
      this.$Modal.confirm({
          title: '删除确认',
          content: `<p>删除该配置将不可恢复</p><span>${paramsRow.record}</span> <span>：${paramsRow.port} </span>  <p>是否继续删除？</p>`,
          onOk: () => {
              delConf(paramsRow.id).then(res => {
                if (res.data.result) {
                    this.$Message.success({
                        content: res.data.messages,
                        duration: 3
                    })
                    this.handlergetConfList()
                } else {
                    this.$Message.error({
                        content: JSON.stringify(res.data.messages),
                        duration: 3
                    })
                }
            }).catch(error => {
                this.$Message.error({
                    content: JSON.stringify(error.response.data),
                    duration: 10
                })
            })
          },
          onCancel: () => {
              this.$Message.info('回头是岸');
          }
      });
    },
    handlerShowCreate(){
      this.formData = this.$options.data().formData
      this.modalData.title = "新建配置"
      this.switchStatus = true
      this.DomainsList = this.getDomains()
      this.modalData.show = true
      console.log('---111')
      console.log(this.formValidate)
    },
    handlerShowEdit(value){
      this.formData = value
      this.modalData.title = "编辑配置"
      this.switchStatus = value.is_valid
      this.DomainsList = this.getDomains()
      this.recordsList = []
      this.recordsList = this.getRecordbyDomain(value.domain_name)
      this.modalData.show = true
    },

    // 切换页码
    changePage(value){
      this.pageNum = value
      this.handlergetConfList()
    },    
    handlePageSize(value){
       this.pageSize = value
       this.handlergetConfList()
    },
     //导出数据
    handlerExportData(){
      let nowTime = Date.parse(new Date())
      this.$refs.businessTable.exportCsv({
          filename: `配置列表-${nowTime}`,
       });
    },

   handleCancel () {
      this.modalData.show = false
      this.handlergetConfList()
    },
    // 提交

    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid && this.formValidate.domain_name) {
          let theMethod = this.formValidate.id ? 'put' : 'post'
          this.btnLoading=true
          setTimeout(() => {
            this.formValidate.is_valid = this.switchStatus
            if (!this.formValidate.port) {
              this.formValidate.port = 'ALL'
            }
            operationConf(this.formValidate, theMethod).then(res => {
                if (res.data.result) {
                    this.$Message.success({
                        content: res.data.messages,
                        duration: 3
                    })
                    this.handleCancel()
                } else {
                    this.$Message.error({
                        content: JSON.stringify(res.data.messages),
                        duration: 3
                    })
                }
            }).catch(error => {
                this.$Message.error({
                    content: JSON.stringify(error.response.data),
                    duration: 10
                })
            })
            this.btnLoading=false
          }, 2000)
        } else {
          this.$Message.error({
            content: '请检查输入',
            duration: 3
          })
        }
      })
    },
    // 重置
    handleReset (name) {
      this.$refs[name].resetFields()
    },
   },
   watch:{
    formData (val) {
       this.formValidate = this.formData
    },

    searchValue (val) {
      if (this.searchValue.length > 2) {
        this.$Message.info('搜索未完成哟');
        this.handlergetConfList()
      }
    },
   },
   mounted () {
     this.handlergetConfList()
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
        float:right;
      }
    }
  }
</style>
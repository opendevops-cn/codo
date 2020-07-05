<template>
  <div>
    <div>

      <div style="padding: 10px 0 15px 0;" >
        <h2>
          <b><Icon style="cursor: pointer" type="ios-undo"  @click="handlerGoDomain"></Icon> {{selectedDomain}}</b>
        </h2>
      </div>

      <Alert type="success" show-icon>修改域名解析属于高危操作，一定要谨慎行事！</Alert>

      <div class="search-con search-con-top">

        <Input class="search-input" v-model="searchRecord" clearable :maxlength='50' placeholder="输入关键字搜索"/>
          <ButtonGroup class="search-btn-right">
            <Button type="success"  @click="handlerAddRecord" :loading="btnLoading">添加记录</Button>
            <Button @click="handlerDomainLog" :loading="btnLoading">日志</Button>
            <Button :loading="btnLoading" @click="handlerExportData()" >批量导出</Button>
          </ButtonGroup>

      </div>
      
      <Table size="small" ref="selection"  :columns="columnsRecord" :data="tableDataRecord"  @on-selection-change="handleSelectRecord"/>
       <div style="margin: 10px; overflow: hidden">

         <div  style="float: left;"> 
           <ButtonGroup class="search-btn">
              <Button :loading="btnLoading" :disabled="btnDisabled" @click="handlerDomainPause">禁用</Button>
              <Button :loading="btnLoading" :disabled="btnDisabled" @click="handlerDomainEnable">启用</Button>
              <Button :loading="btnLoading" :disabled="btnDisabled" @click="handlerDomainDel">删除</Button>
              <!-- <Button :loading="btnLoading" :disabled="btnDisabled" @click="handlerShowChangeBiz">更换业务</Button> -->
           </ButtonGroup>
         </div>
          <div style="float: right;">
            <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" show-total show-sizer :page-size-opts="[10,20,50,100,2000]"
              @on-change="handlerChangePage" @on-page-size-change="handlePageSize" />
          </div>
       </div>
    </div>

    <Modal width="680px;" v-model="modalData.show" :title="modalData.title" :footer-hide=true  @on-cancel="handleClose">
      <Form ref="formInline" :model="formInline" :rules="formRule" :label-width="100" :label-colon=true>
          <FormItem  label="记录类型" prop="domain_type">
            <Row>
              <Col span='22'>
                <Select v-model="formInline.domain_type" placeholder="记录类型">
                  <Option v-for="item, index in typeList" :value="item.value" :key="item.value" >{{ item.lable }}</Option>
                </Select>
              </Col>
            </Row>
          </FormItem>

          <FormItem label="主机记录"  prop="domain_rr">
            <Row>
              <Col span='16'>
                <Input type="text" v-model="formInline.domain_rr" :maxlength='80' placeholder="目前不支持二级泛域名证书，请勿使用三级域名"/>
              </Col>
              <Col span='6'>
                .{{selectedDomain}}
              </Col>

              <Col span='1' offset ='1'>
                  <Poptip trigger="hover" width="300" placement="left">
                    <div slot="content" style="white-space: normal;">
                      <p>主机记录就是域名前缀，常见用法有：</p>
                      <p><font size="2"><b>www：</b>解析后的域名为www.a.com。</font> </p>
                      <p><font size="2"><b>@： </b>直接解析主域名 a.com。</font></p> 
                      <p><font size="2"><b>*： </b>泛解析，匹配其他所有域名 *.a.com。</font> </p>
                      <p><font size="2"><b>二级域名：</b>如：abc.a.com，填写abc。</font></p>
                      <p><font size="2"><b>手机网站：</b>如：m.a.com，填写m。</font></p>
                    </div>
                    <Icon type="ios-help-circle" />
                  </Poptip>
                </Col>
            </Row>
          </FormItem>

            <FormItem label="解析线路" prop="line"> 
              <Row>
                <Col span='22'>
                  <Select v-model="formInline.line">
                    <Option v-for="value, key  in lineList" :value="value" :key="value">{{ key }}</Option>
                  </Select>
                </Col>
                
                <Col span='1' offset ='1'>
                  <Poptip trigger="hover" width="450" placement="left">
                    <div slot="content" style="white-space: normal;">
                      <p>如果只有一个IP地址或CNAME域名，请务必选择【默认】</p>
                      <p><font size="2"><b>默认：</b>必填！未匹配到智能解析线路时，返回【默认】线路设置。</font></p> 
                      <p><font size="2"><b>境外：</b>向除中国大陆以外的其他国家和地区，返回设置的记录值。</font> </p>
                      <p><font size="2"><b>搜索引擎：</b>向搜索引擎爬虫的DNS，返回设置的记录值</font></p>
                      <p><font size="2"><b>其他线路：</b>一般用来做智能解析</font></p>
                    </div>
                    <Icon type="ios-help-circle" />
                  </Poptip>
                </Col>
              </Row>
            </FormItem>
       
            <FormItem label="记录值" prop="domain_value">
              <Row>
                <Col span='22'>
                  <Input type="text" v-model="formInline.domain_value" :maxlength='125' placeholder="记录值" ></Input>
                </Col>
              </Row>
            </FormItem>
      

            <FormItem label="MX优先级" prop="domain_mx" v-if="formInline.domain_type === 'MX'">
              <Row>
                <Col span='22' >
                  <Input type="text" v-model="formInline.domain_mx" :maxlength='2' placeholder="MX"  ></Input>         
                </Col>
              </Row>
            </FormItem>

            <FormItem label="TTL" prop="domain_ttl">
              <Row>
                <Col span='22'>
                  <Select v-model="formInline.domain_ttl" placeholder="记录类型">
                    <Option v-for="item, index in TTLList" :value="item.value" :key="item.value" >{{ item.lable }}</Option>
                  </Select>
                </Col>
              </Row>
            </FormItem>
            
            <!-- <FormItem label="所属业务" prop="the_business"  v-if="modalData.action === 'post'">
              <Row>
                <Col span='22'>
                  <Select v-model="formInline.the_business" filterable clearable placeholder="请选择所属业务">
                    <template v-for="item in businessList">
                        <Option :value="item.id" >{{item.resources_name}}</Option>
                    </template>
                </Select>
                </Col>
              </Row>
            </FormItem> -->
      
            <FormItem>
              <template v-if="modalData.action === 'put'">
                <Button type="primary" @click="handlerSubmitRecordEdit('formInline')" :loading="btnLoading">提交</Button>
              </template>
              <template v-else>
                <Button type="primary" @click="handlerSubmitRecord('formInline')" :loading="btnLoading">提交</Button>
              </template>
                <Button style="margin-left: 8px" @click="handlerReset('formInline')">重置</Button>
            </FormItem>
          </Row>
        </Form>
    </Modal>

    <!-- <Modal v-model="modalbiz.show"  :title="modalbiz.title" :footer-hide=true>
      <Select v-model="selectBusinessId" filterable clearable placeholder="请选择所属业务">
         <Option v-for="item in businessList" :value="item.id"  :key="item.id">{{ item.resources_name }}</Option>
      </Select>
      <Button type="success" style="margin-top: 10px;" :loading="btnLoading"  @click="handlerChangeBiz" long>确定更换</Button>
    </Modal> -->

    <Modal  width="650px;" v-model="modalRemark.show"  :title="modalRemark.title" :footer-hide=true  @on-cancel="handleClose">
       <Input type="text" v-model="modalRemark.remark" :maxlength='50' placeholder="请输入需要记录的备注信息" ></Input>
       <Button type="success" style="margin-top: 10px;" :loading="btnLoading" @click="handlerChangeRemark" long>确定修改</Button>
    </Modal>

    <Drawer v-model="logModal" :closable="false"  style="background-color: #f8f8f9" width="800">
       <div class="search-con search-con-top">
        <Input class="search-input" v-model="searchLog" clearable :maxlength='250' placeholder="输入关键字搜索"/>
       </div>
        <Table size="small" :columns="columnsRecordLog" :data="tableDataLog"/>
        <div style="margin: 10px; overflow: hidden">
          <div style="float: left;">
            <Page :total="logPageTotal" :current="logPageNum" :page-size="logPageSize" show-total show-sizer :page-size-opts="[10,15,50,100]"
              @on-change="handlerChangePage1" @on-page-size-change="handlePageSize1" />
          </div>
        </div>
    </Drawer>
    
    <Modal v-model="modalDel" width="400"  @on-cancel="handlerDelCancel">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="ios-information-circle"></Icon>
            <span>删除选中的域名解析记录</span>
        </p>
        <div style="text-align:center">
            <p>此删除会导致选中无法解析，请谨慎操作！</p>
            <p>当真要删除吗！</p>
        </div>

        <div style="padding: 10px 0 0 0;" >
          <Input class="search-input" v-model="delRecordCheckValue" clearable :maxlength='250' placeholder="输入当前的根域名校验一下"/>
        </div>
        <div slot="footer">
            <Button type="error" size="large" long :loading="btnLoading" @click="handlerDelRecord">删除</Button>
        </div>
    </Modal>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getDomainRecords, optDomainRecords,  recordsChangeRemark,getDomainLog } from '@/api/domain/domain.js'
export default {
  name: 'domainRecords',
  props: {
    selectedDomain: {
        type :String,
        default: ''
    }
  },
 data() {
  //  const validateIsNotCn = (rule, value, callback) => {
  //     let regex = /\p{Unified_Ideograph}/u
  //     if (regex.test(value)) {
  //         return callback(new Error('主机记录不能包含汉字'))
  //     } else {
  //         callback()
  //     }
  //  };
   return {
    delRecordCheckValue: '',
    modalDel: false,
    modalRemark: {
      show: false,
      title: '修改备注',
      remark: '',
      select_id: null
    },
    modalbiz: {
      show: false,
      title: '更换业务',
    },
    modalData: {
      show: false,
      action: 'post',
      title: '添加解析记录',
    },
    //
    logModal: false,
    //
    btnLoading: false,
    //
    formInline: {
      domain_rr: '',
      line: 'default',
      domain_type: 'A',
      domain_ttl: 600,
      domain_mx: 1,
      domain_value: '',
      the_business: null,
      remark: ""
    },
    formRule: {
      domain_type: [{ required: true, message: '记录类型不能为空', trigger: 'change' }],
      domain_rr: [{ required: true, message: '主机记录不能为空', trigger: 'blur' }],
      line: [{ required: true, message: '线路不能为空', trigger: 'change' }],
      domain_mx: [{ required: true, message: '不能为空', trigger: 'blur' }],
      domain_value: [{ required: true, message: '记录值不能为空', trigger: 'blur' }],
      // domain_ttl: [{ required: true,  message: 'TTL值不能为空', trigger: 'blur' }],
      // the_business: [{ required: true,  type: 'number', message: '业务不能为空', trigger: 'blur' }],
    },
    typeList: [
      {"lable": "A- 将域名指向一个IPv4地址（如：8.8.8.8）", "value": "A"},
      {"lable": "CNAME- 将域名指向另外一个域名", "value": "CNAME"},
      {"lable": "AAAA- 将域名指向一个IPv6地址", "value": "AAAA"},
      {"lable": "NS- 将子域名指向其他DNS服务器解析", "value": "NS"},
      {"lable": "MX- 将域名指向邮件服务器地址", "value": "MX"},
      {"lable": "TXT- 通常做SPF记录（反垃圾邮件）", "value": "TXT"},
      {"lable": "SRV- 记录特定的服务的服务器", "value": "SRV"},
      {"lable": "CAA- CA证书机构颁发授权校验", "value": "CAA"},
      {"lable": "显性URL- 将域名重定向到另外一个地址", "value": "REDIRECT_URL"},
      {"lable": "隐性URL- 与显性URL相似，但会隐藏真实目标地址", "value": "FORWARD_URL"},
    ],
    TTLList : [
      {"lable": "10分钟（600）", "value": 600},
      {"lable": "30分钟（1800）", "value": 1800},
      {"lable": "1分钟（60），企业版支持", "value": 60},
      {"lable": "2分钟（120），企业版支持", "value": 120},
      {"lable": "1小时（3600）", "value": 3600},
      {"lable": "12小时（43200）", "value": 43200},
      {"lable": "1天（86400）", "value": 86400},
    ],
    lineList: {'默认': 'default', '境外':'oversea', 'qcloud-默认': '默认'},
    //
    selectBusinessId: null,
    btnDisabled: true ,
    selectList: [],
    searchRecord: '',
    searchLog: '',

    tableDataRecord: [],
    tableDataLog: [],
    // 分页
    logPageTotal: 0, // 数据总数
    logPageNum: 1, // 当前页码
    logPageSize: 10, // 每页条数
    // 分页
    pageTotal: 0, // 数据总数
    pageNum: 1, // 当前页码
    pageSize: 10, // 每页条数
    columnsRecord: [
      {
        type: 'selection',
        key: '',
        width: 65,
        align: 'center'
      },
      {
        title: '主机记录',
        key: 'domain_rr',
        minWidth: 110
      },
      {
        title: '记录类型',
        key: 'domain_type',
        align: 'center',
        width: 110
      },
      {
        title: '线路',
        width: 100,
        key: 'line',
        align: 'center',
        render: (h, params) => {
            let line = params.row.line
            if (line === 'default') {
              return h('span', {}, '默认')
            } else if (line === 'oversea') {
              return h('span', {}, '海外')
            }else{ return h('span',{}, line)}
        }  
      },
      {
        title: '记录值',
        key: 'domain_value',
        minWidth: 150,
          render: (h, params) => {
            let domain_mx = params.row.domain_mx
            if (params.row.domain_type === 'MX') {
              return h('span', {}, params.row.domain_value + ' | '+ domain_mx)
            }else{ return h('span',{}, params.row.domain_value)}
        }  
      },
      {
        title: 'TTL',
        key: 'domain_ttl',
        align: 'center',
        width: 100,
      },
      {
        title: '状态',
        key: 'state',
        width: 100,
        sortable: true,
        align: 'center',
        render: (h, params) => {
            let state = params.row.state
            if (state == 'ENABLE'|| state == 'enable' || state == 'enabled' ) {
              return h('div', [
                h('Tag', { props: { color: 'green' } }, '正常')
              ])
            } else if (state == 'default' ) {
              return h('div', [
                h('Tag', { props: { color: 'blue' } }, '默认')
            ])
            } else if (state == 'DISABLE' || state == 'disable' ) {
              return h('div', [
                h('Tag', { props: { color: 'blue' } }, '暂停')
            ])
            } else { return h('div', [ h('Tag', { props: { color: 'error' } }, state)]) }
          }
      },
      {
      title: '备注',
      key: 'remark',
      width: 60,
        render: (h, params) => {
          return h('Tooltip', {
            props: { placement: 'top' }
            }, [
             h('icon', { 
                props: { type: 'ios-help-circle',
                    // size: 'small'
                  },
                style: {
                  marginRight: '1px'
                }
              }),
            h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.remark)
          ])
        }
      },
      {
        title: '',
        key: '',
        align: 'center',
        width: 110,
        render: (h, params) => {
          return h('div', [
            h('a',{
              style: {
                  marginRight: '5px'
              },
              on: {
                click: () => {
                    this.handlerRecordEdit(params.row)
                  }
                }
              },'修改'
            ),
            h('a',{
              on: {
                click: () => {
                    this.handlerShowChangeRemark(params.row)
                  }
                }
              },'备注'
            )
          ])
        }
      },
    ],
     columnsRecordLog: [
      {
        title: '操作时间',
        width: 150,
        key: 'update_time',
      },
      {
        title: '用户',
        key: 'username',
        align: 'center',
        width: 100,
      },
       {
        title: '行为',
        key: 'action',
        align: 'center',
        width: 100,
      },
      {
        title: '记录',
        key: 'record',
        minWidth: 110,
      }
    ]
    //
   }
  },
  methods: {
     handlerGetDomainRecords() {
      getDomainRecords(this.pageNum, this.pageSize, this.selectedDomain, this.searchRecord).then(res => {
        if (res.data.code == 0) {
          this.pageTotal = res.data.count
          this.tableDataRecord = res.data.data
        } else {
          this.$Message.error( res.data.msg)
          this.tableDataRecord = []
        }
      })
    },
    //
    handlerGetDomainLog() {
      getDomainLog(this.logPageNum, this.logPageSize, this.selectedDomain, this.searchLog).then(res => {
        if (res.data.code == 0) {
          this.logPageTotal = res.data.count
          this.tableDataLog = res.data.data
        }else{
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 返回
    handlerGoDomain(){
      this.$emit('domain-show')
    },
    //
    handleSelectRecord(val) {
      let SelectIdList = []
          val.forEach(item => {
            SelectIdList.push(item.id.toString())
          })
      this.selectList = SelectIdList
    },
    // 添加记录
    handlerAddRecord() {
      this.modalData.show = true
      this.modalData.action  = 'post'
      this.formInline = this.$options.data().formInline
    },
    //禁用
    handlerDomainPause() {
       if ( this.selectList.length > 5) {
        this.$Message.error(`一次禁用不能超过五个`)
        return
      } 
      //
      this.$Modal.confirm({
      title: '提醒',
      content: '<p>禁用相关的域名解析记录，禁用会导致选中无法解析，请谨慎操作！</p>',
      onOk: () => {
          setTimeout(() => {
            optDomainRecords( { select_list: this.selectList, action: 'disable', domain_name: this.selectedDomain}, 'patch' ).then( res => {
              if (res.data.code == 0) {
                this.$Message.success(res.data.msg)
                this.handlerGetDomainRecords()
                this.selectList = []
              } else {
                this.$Message.error( res.data.msg)
              }
            }).catch(error => {
              this.$Message.error({
                content: JSON.stringify(error.response),
                duration: 10
              })
            })             
          }, 1000);
        },
        onCancel: () => {
          this.$Message.info('回头是岸~');
        }                       
      });
      //
 
    },
    handlerDomainEnable() {
      if ( this.selectList.length > 5) {
        this.$Message.error(`一次启用不能超过五个`)
        return
      } 
      //
      this.$Modal.confirm({
      title: '提醒',
      content: '<p>启用相关的域名解析记录，会导致禁用的域名可以解析，请谨慎操作！</p>',
      onOk: () => {
          setTimeout(() => {
            optDomainRecords( { select_list: this.selectList, action: 'enable', domain_name: this.selectedDomain}, 'patch' ).then( res => {
              if (res.data.code == 0) {
                this.$Message.success(res.data.msg)
                this.handlerGetDomainRecords()
                this.selectList = []
              } else {
                this.$Message.error({
                  content: JSON.stringify(res.data.msg),
                  duration: 5
                })
              }
            }).catch(error => {
              this.$Message.error({
                content: JSON.stringify(error.response),
                duration: 10
              })
            })             
          }, 1000);
        },
        onCancel: () => {
          this.$Message.info('回头是岸~');
        }                       
      });
      //
    },
    handlerDelCancel() {
       this.$Message.info('回头是岸~');
    },
    handlerDelRecord() {
      if ( this.delRecordCheckValue !== this.selectedDomain) {
        this.$Message.error(`请输入正确的根域名，谢谢！`)
        return
      } 
      this.btnLoading = true
      setTimeout(() => {
        optDomainRecords( { select_list: this.selectList, domain_name: this.selectedDomain}, 'delete').then( res => {
          if (res.data.code == 0) {
            this.$Message.success(res.data.msg)
            this.handlerGetDomainRecords()
            this.selectList = []
            this.btnLoading = false
            this.modalDel = false
          } else {
            this.btnLoading = false
            this.$Message.error({
              content: res.data.msg,
              duration: 5
            })
          }
        }).catch(error => {
          this.btnLoading = false
          this.$Message.error({
            content: JSON.stringify(error.response),
            duration: 10
          })
        })
        this.btnLoading = false  
        this.modalDel = false        
      }, 1000);
    },
    handlerDomainDel() {
      if ( this.selectList.length > 5) {
        this.$Message.error(`一次删除不能超过五个`)
        return
      } 
      this.modalDel = true
    },
    handlerShowChangeBiz() {
      this.modalbiz.show = true
      this.selectBusinessId = null
    },
    handlerChangeBiz() {
      if (!this.selectBusinessId) {
        this.$Message.info('请选择一个业务吧');
        return
      }
      let theData = { select_list: this.selectList, business_id: this.selectBusinessId, domain_name: this.selectedDomain }
      this.btnLoading = true
      setTimeout(() => {
          optDomainRecords( theData ).then( res => {
            if (res.data.code == 0) {
              this.$Message.success(res.data.msg)
              this.handlerGetDomainRecords()
              this.selectList = []
              this.modalbiz.show = false
              this.btnLoading = false
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(error => {
            this.btnLoading = false
            this.$Message.error({
              content: JSON.stringify(error.response.data),
              duration: 10
            })
          }) 
          this.btnLoading = false            
        }, 1000);
      //
    },
     handlerShowChangeRemark(paramsRow) {
      this.modalRemark = {
        show: true,
        title: '修改备注',
        select_id: paramsRow.id,
        remark: paramsRow.remark
      }
    },
    handlerChangeRemark() {
      this.btnLoading = true
      setTimeout(() => {
          let theData = { id: this.modalRemark.select_id, remark:this.modalRemark.remark}
          recordsChangeRemark( theData ).then( res => {
            if (res.data.code == 0) {
              this.$Message.success(res.data.msg)
              this.handlerGetDomainRecords()
              this.modalRemark = this.$options.data().modalRemark
              this.btnLoading = false
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(error => {
            this.btnLoading = false
            this.$Message.error({
              content: JSON.stringify(error.response),
              duration: 10
            })
          }) 
          this.btnLoading = false            
        }, 1000);
    },
    handlerDomainLog() {
      this.logModal = true
      this.handlerGetDomainLog()
    },
    //
    SubmitRecord(){
      setTimeout(() => {
        optDomainRecords(this.formInline, 'post').then(res => {
          if (res.data.code == 0) {
            this.modalData = this.$options.data().modalData
            this.$Message.success(res.data.msg)
            this.handlerGetDomainRecords()
          } else {
            this.$Message.error(res.data.msg)
          }
          this.btnLoading = false
          })
          .catch(error => {
            this.btnLoading = false
            this.$Message.error({
                content: '请求数据出错',
                duration: 10
            })
        })
       }, 2000)
    },
    handlerSubmitRecord(name) {
      this.btnLoading = true
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.formInline['domain_name'] = this.selectedDomain
          if (this.formInline.domain_rr.indexOf(".") !== -1 ) {
              this.$Modal.confirm({
              title: '提醒',
              content: '<p>请注意你使用了三级以上的域名，证书可能不支持</p>',
                onOk: () => {
                    this.SubmitRecord()
                  },
                onCancel: () => {
                  this.btnLoading = false
                  this.$Message.info('回头是岸~');
                }                       
              });
            }else{
              this.SubmitRecord()
          }
        } else {
            this.btnLoading = false
            this.$Message.error('表单校验不通过!');
        }
      })
    },

    handlerRecordEdit(paramsRow) {
      this.formInline = paramsRow
      this.modalData = {
        show: true,
        action: 'put',
        title: `修改 ${this.selectedDomain} 解析记录，有API的域名会生效，请谨慎操作！`,
      }
    },
    recordEdit(){
      setTimeout(() => {
        this.formInline['domain_name'] = this.selectedDomain
        optDomainRecords(this.formInline, 'put').then(res => {
          if (res.data.code ==0) {
            this.modalData = this.$options.data().modalData
            this.handlerGetDomainRecords()
          } else {
            this.$Message.error(res.data.msg)
          }
          this.btnLoading = false
        })
        .catch(error => {
           this.btnLoading = false
            this.$Message.error({
              content: '请求数据出错',
              duration: 10
          })
        })
       }, 2000)
    },
    handlerSubmitRecordEdit(name) {
      this.btnLoading = true
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.formInline['domain_name'] = this.selectedDomain
          if (this.formInline.domain_rr.indexOf(".") !== -1 ) {
              this.$Modal.confirm({
              title: '提醒',
              content: '<p>请注意你使用了三级以上的域名，证书可能不支持</p>',
                onOk: () => {
                    this.recordEdit()
                  },
                onCancel: () => {
                  this.btnLoading = false
                  this.$Message.info('回头是岸~');
                }                       
              });
            }else{
              this.recordEdit()
          }
        } else {
            this.btnLoading = false
            this.$Message.error('表单校验不通过!');
        }
      })
    },
    handleClose(){
      console.info('---')
      this.handlerGetDomainRecords()
    },
    handlerReset() {
      this.btnLoading = false
      this.formInline = this.$options.data().formInline
    },
    handlerExportData(){
      let nowTime = Date.parse(new Date())
      let tableDataTemp = this.tableDataRecord.filter((data, index) => {
        data['show_account'] = data.show_account['value']
        data['show_cloud'] = data.show_cloud['value']
        data['show_business'] = data.show_business['value']
      })
      this.$refs.selection.exportCsv({
          filename: `DNS信息-${nowTime}`,
          data: tableDataTemp,
          column:this.columnsRecord
       });
      this.handlerGetDomainRecords()
    },
    handlerChangePage (value) {
      this.pageNum = value
      this.handlerGetDomainRecords()
    },
    handlePageSize (value) {
      this.pageNum = 1
      this.pageSize = value
      this.handlerGetDomainRecords()
    },
    handlerChangePage1 (value) {
      this.logPageNum = value
      this.handlerGetDomainLog()
    },
    handlePageSize1 (value) {
      this.logPageNum = 1
      this.logPpageSize = value
      this.handlerGetDomainLog()
    }
  },
  watch: {
    selectList (val) {
      if (this.selectList.length > 0) {
        this.btnDisabled = false
      } else {
        this.btnDisabled = true
      }
    },
    searchRecord (val) {
        this.pageNum = 1
        this.handlerGetDomainRecords()
    },
    searchLog (val) {
        this.logPageNum = 1
        this.handlerGetDomainLog()
    },
  },
   computed: {
      ...mapState({
          rules: state => state.user.rules,
      }) 
  },
  mounted() {
    this.handlerGetDomainRecords()
  }
  
}
</script>

<style lang="less" scoped>
   .top,.bottom{
        text-align: center;
    }
    .center{
        width: 300px;
        margin: 10px auto;
        overflow: hidden;
    }
    .center-left{
        float: left;
    }
    .center-right{
        float: right;
    }

  .search-con {
    padding: 5px 0;
    .search {
      &-col {
        display: inline-block;
        width: 200px;
      }
      &-input {
        display: inline-block;
        width: 350px;
        margin-left: 2px;
      }
      &-btn {
        margin-right: 0px;
        // float: right;
      }
      &-btn-right {
        margin-right: 0px;
        float: right;
      }
    }
  }
</style>

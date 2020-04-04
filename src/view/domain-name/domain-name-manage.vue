<template>
  <Card style="height:100%; padding: 0px;background: #f8f8f9">
    <Row>
      <i-col span='4'>
        <Row>
          <i-col span='23'>
            <Input v-model="domainName" placeholder='快速查找' class="search-input" :maxlength='255'  clearable />
          </i-col>
          <i-col span='23'>
            <CellGroup @on-click="handlerCheck">
              <div v-if="isSelected === 'domain'">
                <Cell title="全部域名" name='domain' selected/>
              </div>
               <div v-else>
                 <Cell title="全部域名" name='domain'/>
               </div>
               <div v-if="isSelected === 'config'">
                 <Cell title="全局配置" name='config' selected/>
               </div>
               <div v-else>
                 <Cell title="全局配置" name='config'/>
               </div>
            </CellGroup>
          </i-col>
        </Row>
      </i-col>
      <i-col span='1'>
        <div style="border-left: solid 1px #ccc; margin-bottom: 100px; width: 1px; height: 650px;"></div>
      </i-col>
      <i-col span='15' v-if="!isSelectedDomain" >
        <Row  style="width: 900px" v-if="isSelected === 'domain'">
          <i-col span='24'>
            <Alert type="success">
              <h3>【重要通知】：</h3>
            </Alert>
          </i-col>
          <i-col span='24'>
            <div class="search-con search-con-top">
              <Button type="success" @click="handlerAddDomain">添加域名</Button>
              <Button class="search-btn" @click="handlerDomainPause">暂停</Button>
              <Button class="search-btn" @click="handlerDomainEnable">启用</Button>
              <Button class="search-btn" @click="handlerDomainDel">删除</Button>
            </div>
             <div v-if="isAddDomain" class="search-con search-con-top">
               <Input v-model="newDomain" placeholder='请输入你要解析的域名' class="search-input" clearable :maxlength=25 />
               <Button class="search-btn" type="primary" :loading="addBtnloading"  @click="handlerAdd">添加</Button>
               <Button class="search-btn"  @click="handlerAddReset" >取消</Button>
             </div>
            <Table size="small" ref="selection"  :columns="columns" :data="tableData"  @on-selection-change="handleSelectChange"></Table>
          </i-col>
        </Row>
      </i-col>
       <i-col span='15'  v-if="isSelected === 'config'">
        <Row  style="width: 900px">
          <i-col span='24'>
            <h4>默认配置</h4>
            <!-- <editor v-model="defautConf" @init="editorInit" :mode_type="mode_type" :read="editor.read"  :editorHeight=650 :key="`${_uid}`" ></editor> -->
            <Input v-model="defautConf"  type="textarea" :autosize="{minRows: 30, maxRows: 40}" />
          </i-col>
        </Row>
      </i-col>
      <i-col span='15' v-if="isSelectedDomain"  >
        <Row style="width: 900px" v-if="isSelected !== 'config'">
          <i-col span='24'>
            <Alert type="success">
              <h3><Icon type="ios-globe" />  {{isSelectedDomain}}</h3>
            </Alert>
          </i-col>
            <div class="search-con search-con-top">
              <Button type="success" class="search-add-btn" @click="handlerAddDomain">添加记录</Button>
              <ButtonGroup>
                <Button @click="handlerZoneListMg1">暂停</Button>
                <Button @click="handlerZoneListMg2">启用</Button>
                <!-- <Button @click="handlerZoneDelete('list')">删除</Button> -->
                <Button @click="handlerZoneConf">设置</Button>
                <Button @click="handlerDomainZoneLog">日志</Button>
            </ButtonGroup>
            <Input  v-model="zoneName" placeholder='请输入关键字' class="search-input" :maxlength='255' clearable />
            </div>
             <div v-if="isAddDomain" class="search-con search-con-top">
              <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
                <FormItem>
                  <!-- <Poptip trigger="hover"  placement="bottom-start" :content=contentHost word-wrap width="850"></Poptip> -->
                  <Input type="text" v-model="formInline.host" :maxlength='50' placeholder="域名记录" style="width: 160px"
                  @mouseenter.native="handerMouseenter('HOST')"/>
                </FormItem>
                <FormItem>
                  <Select v-model="formInline.type" placeholder="记录类型"  style="width: 90px" @mouseenter.native="handerMouseenter('TYPE')">
                    <Option v-for="item in typeList" :value="item" :key="item" >{{ item }}</Option>
                  </Select>
                </FormItem>
                <FormItem>
                  <Poptip trigger="hover"  placement="top-start" content='用于智能解析'>
                  <Select v-model="formInline.region" placeholder="区域" style="width: 60px" >
                    <Option v-for="value, key  in regionList" :value="key" :key="value" >{{ key }}</Option>
                  </Select>
                  </Poptip>
                </FormItem>
                <FormItem>
                  <Input type="text" @mouseenter.native="handerMouseenter('DATA')" v-model="formInline.data" :maxlength='100'
                   placeholder="记录值" style="width: 220px"></Input>
                </FormItem>
                <FormItem v-if="formInline.type === 'MX'">
                  <Input type="text" v-model="formInline.mx" :maxlength='3' placeholder="MX" style="width: 50px" @mouseenter.native="handerMouseenter('MX')"></Input>
                </FormItem>
                <FormItem v-else>
                  <Input type="text" v-model="formInline.mx" :maxlength='3' style="width: 50px" disabled></Input>
                </FormItem>
                <FormItem>
                  <Input type="text" @mouseenter.native="handerMouseenter('TTL')" v-model="formInline.ttl" :maxlength='10' placeholder="TTL" style="width: 70px"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" style="width: 60px" @click="handlerAddZone()">保存</Button>
                    <Button style="width: 60px"  @click="handlerAddZoneReset()">取消</Button>
                </FormItem>
              </Form>
              <Alert v-if="contentAlert === 'HOST'">
                <Row  style="width:900px">
                  <i-col offset='1'><h3>提示您：要解析 www.shenshuo.me，请填写 www</h3><br></i-col>
                  <i-col offset='1'> <p>主机记录就是域名前缀，常见用法有：</p></i-col>
                  <i-col span='2' offset='1'  style="text-align: center;">
                     <Tooltip placement="top" content='点击自动填入'><a @click="handlerFilling('www')">www</a></Tooltip>
                  </i-col>
                  <i-col span='20'><p>：解析后的域名为 www.{{isSelectedDomain}}</p></i-col>
                  <i-col span='2' offset='1'  style="text-align: center;">
                    <Tooltip placement="top" content='点击自动填入'><a @click="handlerFilling('@')">@</a></Tooltip>
                  </i-col>
                  <i-col span='20'><p>：直接解析主域名 {{isSelectedDomain}}</p></i-col>
                  <i-col span='2' offset='1'  style="text-align: center;">
                    <Tooltip placement="top" content='点击自动填入'><a @click="handlerFilling('*')">*</a></Tooltip>
                  </i-col>
                  <i-col span='20'><p>：泛解析，匹配其他所有域名 *.{{isSelectedDomain}}</p></i-col>
                </Row>
              </Alert>
              <Alert v-if="contentAlert === 'TYPE'">
                <Row  style="width:900px">
                  <i-col offset='1'><h3>提示您：要指向空间商提供的 IP 地址，选择「类型 A」，要指向一个域名，选择「类型 CNAME」</h3><br></i-col>
                  <i-col span='2' offset='1'  style="text-align: center;">
                     <Tooltip placement="top" content='点击自动填入'><a @click="handlerFilling1('A')">A记录</a></Tooltip>
                  </i-col>
                  <i-col span='20'><p>：地址记录，用来指定域名的IPv4地址（如：8.8.8.8），如果需要将域名指向一个IP地址，就需要添加A记录。</p></i-col>
                  <i-col span='2' offset='1'  style="text-align: center;">
                    <Tooltip placement="top" content='点击自动填入'><a @click="handlerFilling1('CNAME')">CNAME</a></Tooltip>
                  </i-col>
                  <i-col span='20'><p>： 如果需要将域名指向另一个域名，再由另一个域名提供ip地址，就需要添加CNAME记录。</p></i-col>
                  <i-col span='2' offset='1'  style="text-align: center;">
                    <Tooltip placement="top" content='点击自动填入'><a @click="handlerFilling1('TXT')">TXT</a></Tooltip>
                  </i-col>
                  <i-col span='20'><p>：在这里可以填写任何东西，长度限制255。绝大多数的TXT记录是用来做SPF记录（反垃圾邮件）。</p></i-col>
                  <i-col span='2' offset='1'  style="text-align: center;">
                    <Tooltip placement="top" content='点击自动填入'><a @click="handlerFilling1('NS')">NS</a></Tooltip>
                  </i-col>
                  <i-col span='20'><p>：域名服务器记录，如果需要把子域名交给其他DNS服务商解析，就需要添加NS记录。</p></i-col>
                  <i-col span='2' offset='1'  style="text-align: center;">
                    <Tooltip placement="top" content='点击自动填入'><a @click="handlerFilling1('AAAA')">AAAA</a></Tooltip>
                  </i-col>
                  <i-col span='20'><p>：用来指定主机名（或域名）对应的IPv6地址（例如：ff06:0:0:0:0:0:0:c3）记录。</p></i-col>
                  <i-col span='2' offset='1'  style="text-align: center;">
                    <Tooltip placement="top" content='点击自动填入'><a @click="handlerFilling1('MX')">MX</a></Tooltip>
                  </i-col>
                  <i-col span='20'><p>：如果需要设置邮箱，让邮箱能收到邮件，就需要添加MX记录。</p></i-col>
                </Row>
              </Alert>
              <Alert v-if="contentAlert === 'DATA'">
                <Row  style="width:900px">
                  <i-col offset='1'><h3>提示您：最常见的是将空间商提供的「IP地址」填写在这里</h3><br></i-col>
                  <i-col offset='1' span='24'><h4>各类型的记录值一般是这样的：</h4><br></i-col>
                  <i-col  offset='1' span='24'><p>A记录：填写您服务器 IP，如果您不知道，请咨询您的空间商</p></i-col>
                  <i-col  offset='1' span='24'><p>CNAME记录：填写空间商给您提供的域名，例如：shenshuo.me</p></i-col>
                  <i-col  offset='1' span='24'><p>MX记录：填写您邮件服务器的IP地址或企业邮局给您提供的域名，如果您不知道，请咨询您的邮件服务提供商</p></i-col>
                  <i-col  offset='1' span='24'><p>TXT记录：一般用于 163、 Google、QQ等企业邮箱的反垃圾邮件设置</p></i-col>
                  <i-col  offset='1' span='24'><p>AAAA：不常用。解析到 IPv6 的地址。</p></i-col>
                  <i-col  offset='1' span='24'><p>NS记录：NS向下授权，填写dns域名，例如：f1g1ns1.dnspod.net</p></i-col>
                </Row>
              </Alert>
              <Alert v-if="contentAlert === 'MX'">
                <Row  style="width:900px">
                  <i-col  offset='1' span='24'><p>MX优先级，用来指定邮件服务器接收邮件的先后顺序（1-50），一般默认设置为5、10、15等</p></i-col>
                </Row>
              </Alert>
              <Alert v-if="contentAlert === 'TTL'">
                <Row  style="width:900px">
                  <i-col offset='1'><h3>提示您：我们默认的 3600 秒是最常用的，不用修改</h3><br></i-col>
                  <i-col  offset='1' span='24'><p>即 Time To Live，缓存的生存时间。指地方dns缓存您域名记录信息的时间，缓存失效后会再次到DNS获取记录值。</p><br></i-col>
                  <i-col span='3' offset='1'>
                    <p>600（10分钟）</p>
                  </i-col>
                  <i-col span='20'><p>建议正常情况下使用 600。</p></i-col>
                  <i-col span='3' offset='1'>
                    <p>60（1分钟）</p>
                  </i-col>
                  <i-col span='20'><p>如果您经常修改IP，修改记录一分钟即可生效。长期使用 60，解析速度会略受影响。</p></i-col>
                  <i-col span='3' offset='1'>
                    <p>3600（1小时）</p>
                  </i-col>
                  <i-col span='20'><p>如果您IP较少变动，建议选择 3600，解析速度快。推荐使用</p></i-col>
                  <i-col span='3' offset='1'>
                    <p>86400（1天）</p>
                  </i-col>
                  <i-col span='20'><p>如果您IP极少变动，建议选择 86400，解析速度快。</p></i-col>
                </Row>
              </Alert>
            </div>
            <Table size="small" ref="selection"  :columns="columnsZone" :data="tableDataZone"  @on-selection-change="handleSelectChangeZone"></Table>
            <div style="margin: 10px; overflow: hidden">
              <div style="float: left;">
                  <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[10,15,25,35,50,100] show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
              </div>
            </div>
          <i-col span='23'></i-col>
        </Row>
      </i-col>
    </Row>
    <Drawer v-model="logModal" :closable="false"  style="background-color: #f8f8f9" width="820" @on-close="closeModal">
      <h2 style="color: #000000; marginLeft: 10px">日志记录：</h2>
      <div style="padding: 10px">
        <Row  v-for="item, index in logInfo">
          <Col span="24">
            <p style="color: #000000">{{item.update_time}}：{{item.log_data}}</p>
          </Col>
        </Row>
      </div>
    </Drawer>
  </Card>
</template>

<script>
import editor from '@/components/public/editor'
import  DomainParser  from './checkDomain.js'
import { getDomainname, operationDomainname, getDomainzone, operationDomainzone, getLoglist, getDomainconf} from '@/api/domain/dns'
export default {
  components: {editor},
  data() {
   return {
    mode_type: 'ini', 
    editor:{
      title: '默认',
      read: true,
      color: "primary"
    },
    //
    //日志
    logInfo: [],
    logModal: false,
    zoneMethod: 'post',
    contentAlert: 'HOST',
    formInline: {
      zone: '',
      host: '',
      region: '默认',
      type: '',
      ttl: 600,
      mx: '',
      data: '',
    },
    ruleInline: {
    },
     //
    typeList: ['A','CNAME','TXT','AAAA','MX','NS'],
    defautConf: '',
    regionList: {},
    isSelectedDomain: '',
    tableSelectIdList: [],
    tableSelectZoneIdList: [],
    newDomain: '',
    addBtnloading : false,
    isAddDomain: false,
    isSelected: 'domain',
    zoneName: '',
    domainName:'',
    tableData: [],
    tableDataZone: [],
    //zone 分页
    pageTotal: 0, // 数据总数
    pageNum: 1, // 当前页码
    pageSize: 15, // 每页条数
    columnsZone: [
      {
        type: 'selection',
        key: '',
        width: 70,
        align: 'center'
      },
      {
        title: '主机记录',
        key: 'host',
        align: 'center',
        sortable: true,
        width: 110,
        render: (h, params) => {
          return h('div', [
            h('a',{
              on: {
                click: () => {
                    this.handlerEditZone(params.row)
                  }
                }
              },params.row.host
            )
          ])
        }
      },
      {
        title: '记录类型',
        width: 110,
        key: 'type',
        align: 'center',
        sortable: true,
      },
      {
        title: '区域',
        width: 80,
        key: 'region',
        align: 'center',
        sortable: true,
      },
      {
        title: '记录值',
        key: 'data',
        align: 'center',
        sortable: true,
        render: (h, params) => {
          return h('div', [
            h('a',{
              on: {
                click: () => {
                    this.handlerEditZone(params.row)
                  }
                }
              },params.row.data
            )
          ])
        }
      },
      {
        title: 'MX',
        key: 'mx',
        align: 'center',
        width: 80,
        sortable: true,
      },
      {
        title: 'TTL',
        key: 'ttl',
        align: 'center',
        width: 100,
        sortable: true,
      },
      {
        title: '#',
        align: 'center',
        width: 130,
        key: '',
　　    render: (h, params) => {
            let status = params.row.state
            if (status === 'running') {
              return h('ButtonGroup', [
              h('Button', {
                  props: {type: 'text', size: 'small'},
                },[
                h('Poptip', {
                    props: {
                      confirm: true,
                      transfer: true,
                      title: '确定要暂停吗！',
                      type: 'error',
                      size: 'small',
                    },
                    on: {
                      'on-ok': ()=>{
                          this.handlerZoneDisable(params.row)
                      },
                    }
                }, '暂停')
              ]),
              h('Button', {
                  props: {type: 'text', size: 'small'},
                },[
                h('Poptip', {
                    props: {
                      confirm: true,
                      transfer: true,
                      title: '确定要删除吗！',
                      type: 'error',
                      size: 'small',
                    },
                    on: {
                      'on-ok':  ()=>{
                        this.handlerZoneDelete(params.row.zone_id)
                      },
                    }
                }, '删除')
              ]),
            ]);
            }else {
              return h('ButtonGroup', [
              h('Button', {
                  props: {type: 'text', size: 'small'},
                },[
                h('Poptip', {
                    props: {
                      confirm: true,
                      transfer: true,
                      title: '确定要启用吗！',
                      type: 'error',
                      size: 'small',
                    },
                    on: {
                      'on-ok': ()=>{
                          this.handlerZoneDisable(params.row)
                      },
                    }
                }, '启用')
              ]),
              h('Button', {
                  props: {type: 'text', size: 'small'},
                },[
                h('Poptip', {
                    props: {
                      confirm: true,
                      transfer: true,
                      title: '确定要删除吗！',
                      type: 'error',
                      size: 'small',
                    },
                    on: {
                      'on-ok':  ()=>{
                        this.handlerZoneDelete(params.row.zone_id)
                      },
                    }
                }, '删除')
              ]),
          ]);
        }}
      },
    ],
    columns: [
      {
        type: 'selection',
        key: '',
        width: 60,
        align: 'center'
      },
      {
        title: '域名',
        key: 'domain_name',
        sortable: true,
        render: (h, params) => {
          return h('div', [
            h('a',{
              on: {
                click: () => {
                    this. handlerCheckDomain(params.row.domain_name)
                  }
                }
              },params.row.domain_name
            )
          ])
        }
      },
      {
        key: '',
        width: 120,
        align: 'center',
        render: (h, params) => {
            let state = params.row.domain_state
            if (state !== 'running') {
              return h('div', [
                h('Tag', { props: { color: 'gold' } }, '禁用')
              ])
            }
          }
      },
    ]
   }
  },
  methods: {
    getDomainName() {
      getDomainname(this.domainName).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handlerCheck(name) {
      if (name === 'domain') {
        this.isSelectedDomain = ''
        this.isSelected = 'domain'
        this.domainName = ''
        this.pageNum = 1
        this.getDomainName()
        this.isAddDomain = false
      } else if (name === 'config' ) {
        this.isSelected = 'config'
      }else {
        this.isSelected = ''
      }
    },
    // 选中域名
    handlerCheckDomain (name) {
      this.isSelectedDomain = name
      this.formInline.zone = name
      this.zoneMethod ='post'
      this.getDomainZone()
    },
    // 获取配置
    getDomainConf() {
      getDomainconf().then(res => {
        if (res.data.code === 0) {
          const data = res.data.data
          this.regionList = JSON.parse(data.region_init)
          this.defautConf = data.conf_init
          // this.tableDataZone = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // zone list
    getDomainZone() {
      getDomainzone( this.pageNum, this.pageSize, this.isSelectedDomain, this.zoneName).then(res => {
        if (res.data.code === 0) {
          this.tableDataZone = res.data.data
          this.pageTotal = res.data.count
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handlerAddDomain() {
      this.isAddDomain =true
      this.zoneMethod = 'post'
    },
    handlerAdd(){
      // var domain ="sojson.comxxxx";
      var parser = new DomainParser(this.newDomain);
      //解析
      parser.parse();
      //判断是否正常
      if (parser.hasError()) {
          //错误信息
          const msg = parser.getMessage();
          this.$Message.error(msg)
          return;
      }
      //获取域名
      this.newDomain = encodeURI(parser.getModifyName());
      //
      this.addBtnloading = true
      setTimeout(() => {
        operationDomainname({domain_name: this.newDomain}, 'post').then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.domainName = ''
            this.getDomainName()
            this.isAddDomain = false
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
        this.addBtnloading = false
      }, 1000)
    },
    handlerAddReset() {
      this.isAddDomain = false
    },
    // table 选中的ID
    handleSelectChange (val) {
      let SelectIdList = []
      val.forEach(item => {
        SelectIdList.push(item.domain_id)
      })
      this.tableSelectIdList = SelectIdList
    },
    handleSelectChangeZone(val) {
      let SelectIdList = []
      val.forEach(item => {
        SelectIdList.push(item.zone_id)
      })
      this.tableSelectZoneIdList = SelectIdList
    },
    handlerDomainPause(){
      if (this.tableSelectIdList.length === 0) {
        this.$Message.error('需要选中点什么')
        return
      }
      if (this.tableSelectIdList.length !== 1) {
        this.$Message.info('只能选择一个')
        return
      }
       operationDomainname({ 'domain_id': this.tableSelectIdList[0], 'domain_state': 'stop'}, 'patch').then(res => {
        if (res.data.code === 0) {
          this.getDomainName()
          this.tableSelectIdList = []
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
      // this.$Message.info(`暂停域名解析${this.tableSelectIdList}`)
    },
    handlerDomainEnable(){
      if (this.tableSelectIdList.length === 0) {
        this.$Message.error('需要选中点什么')
        return
      }
      if (this.tableSelectIdList.length !== 1) {
        this.$Message.info('只能选择一个')
        return
      }
       operationDomainname({ 'domain_id': this.tableSelectIdList[0], 'domain_state': 'running'}, 'patch').then(res => {
        if (res.data.code === 0) {
          this.getDomainName()
          this.tableSelectIdList = []
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handlerDomainDel(){
      if (this.tableSelectIdList.length === 0) {
        this.$Message.error('需要选中点什么')
        return
      }
      if (this.tableSelectIdList.length !== 1) {
        this.$Message.info('只能选择一个')
        return
      }
      if (confirm(`确定要删除选择的域名吗`)) {
        operationDomainname({ 'domain_id': this.tableSelectIdList[0]}, 'delete').then(res => {
          if (res.data.code === 0) {
            this.getDomainName()
            this.tableSelectIdList = []
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }
    },
    // 自动填入域名记录
    handlerFilling (value) {
      this.formInline.host = value
    },
    // 自动填入类型
    handlerFilling1 (value) {
      this.formInline.type = value
    },
    // 悬浮触发
    handerMouseenter(index) {
       this.contentAlert = index
    },
    // 添加记录
    handlerAddZone() {
      operationDomainzone(this.formInline, this.zoneMethod).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
          this.getDomainZone()
          this.handlerAddZoneReset()
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 修改记录
    handlerEditZone(paramsRow) {
      this.zoneMethod ='put'
      this.isAddDomain= true
      this.formInline = paramsRow
    },
    // 取消
    handlerAddZoneReset() {
      this.isAddDomain = false
      this.formInline = {
            zone: this.isSelectedDomain,
            host: '',
            region: '默认',
            type: '',
            ttl: 600,
            mx: '',
            data: '',
      }
    },
    // 暂停 启用 删除 设置  日志
    // 表内 暂停/启用
    handlerZoneDisable(paramsRow) {
      operationDomainzone({ 'zone_id': paramsRow.zone_id, 'state': paramsRow.state}, 'patch').then(res => {
        if (res.data.code === 0) {
          this.getDomainZone()
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    //多选禁用
    handlerZoneListMg1() {
      if (this.tableSelectZoneIdList.length === 0) {
        this.$Message.error('需要选中点什么')
        return
      }
      operationDomainzone( {'state': 'running', 'id_list': this.tableSelectZoneIdList }, 'patch').then(res => {
        if (res.data.code === 0) {
          this.getDomainZone()
          this.tableSelectZoneIdList = []
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 启用
    handlerZoneListMg2() {
      if (this.tableSelectZoneIdList.length === 0) {
        this.$Message.error('需要选中点什么')
        return
      }
      operationDomainzone( {'state': 'stop', 'id_list': this.tableSelectZoneIdList }, 'patch').then(res => {
        if (res.data.code === 0) {
          this.getDomainZone()
          this.tableSelectZoneIdList = []
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handlerZoneDelete(zone_id) {
      let deleteData = {}
      if (zone_id !== 'list') {
        deleteData = { 'zone_id': zone_id }
      } else {
        if (this.tableSelectZoneIdList.length === 0) {
          this.$Message.error('需要选中点什么')
          return
        }
        deleteData = {'id_list': this.tableSelectZoneIdList  }
      }
      operationDomainzone(deleteData, 'delete').then(res => {
        if (res.data.code === 0) {
          this.getDomainZone()
          this.tableSelectZoneIdList = []
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handlerZoneConf() {
      this.$Message.info(`暂无`)
    },
    handlerDomainZoneLog() {
      this.logModal = true
      this.getLogList()
    },
    getLogList() {
      getLoglist(this.isSelectedDomain).then(res => {
        if (res.data.code === 0) {
          this.logInfo = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    //
    editorInit: function () {
      require(`brace/mode/${this.mode_type}`)    //language
      require('brace/theme/terminal')
      require('brace/theme/xcode')
    },
    closeModal () {
      // this.over()
    },
    changePage (value) {
      this.pageNum = value
      this.getDomainZone()
    },
    // 每页条数
    handlePageSize (value) {
      this.pageNum = 1
      this.pageSize = value
      this.getDomainZone()
    }
  },
  watch: {
    domainName (val) {
      this.getDomainName()
    },
    zoneName (val){
      this.getDomainZone()
    }
  },
  //
  mounted() {
    this.getDomainConf()
    this.getDomainName()
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
      width: 300px;
      margin-left: 0px;
    }
    &-btn {
      margin-left: 10px;
    }
    &-add-btn {
      margin-right: 10px;
    }
  }
}
</style>

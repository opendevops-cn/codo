<template>
  <Card style="height:100%;">
    <p slot="title">系统参数配置</p>
    <Tabs @on-click="handleTabs">
      <TabPane
        v-for="(item, index) in tabs"
        :key="`${_uid}_${index}`"
        :label="item.label"
        :icon="item.icon"
        :name="item.name"
        :disabled='item.disabled ? item.disabled : false'
      >
        <Row>
          <Col span="12">
          <form-group :list="formList" @on-submit-success="handleSubmit"  :label-width="130">
            <slot slot="left-btn">
              <Button v-if="theTabName === 'EMAIL'" type="success" style="margin-left: 8px" :loading="btn_loading" @click="handlerCheckTest(theTabName)">测试邮件</Button>
              <Button v-if="theTabName === 'SMS'"   type="success" style="margin-left: 8px" :loading="btn_loading" @click="handlerCheckTest(theTabName)">测试短信</Button>
              <Button v-if="theTabName === 'LDAP'"  type="success" style="margin-left: 8px" :loading="btn_loading" @click="handlerCheckTest(theTabName)">测试LDAP</Button>
            </slot>
            </form-group>
          </Col>
          <Col span="10"  offset='1'>
            <Alert  v-if="theTabName === 'WEBSITE'">
              <h4>建议正式环境使用SSL证书</h4><br>
              <h5>API地址：默认为：gw.opendevops.cn/api/ 根据实际情况自己调整</h5><br>
              <h5>默认邮箱：系统内默认发送邮件的地址</h5><br>
              <h5>登录超时时间：默认为一天，可以设置，单位为小时，前端暂定不能超过24小时，后续可能会更改</h5><br>
              <h5>二次认证：默认开启二次认证，且正式环境非常不建议关闭全局的二次认证</h5>
            </Alert>
            <Alert  v-if="theTabName === 'EMAIL'">
              <a href="https://docs.opendevops.cn/zh/guide/more/faq/" target="_blank">参考文档</a>
            </Alert>
            <Alert  v-if="theTabName === 'SMS'">
              <h5>这块主要配置短信接口信息，短信接口只支持阿里云阿里大鱼，后续平台所涉及到发短信会调用此接口</h5><br>
              <p>短信区域： cn-hangzhou 目前阿里官方给出必须是这个</p><br>
              <p>API名称： Dysmsapi 目前官方给出一般都是这个名称</p><br>
              <p>API域名：dysmsapi.aliyuncs.com 目前官方给出必须是这个地址</p><br>
              <p>KEY_ID： 你的IAM访问控制密钥ID</p><br>
              <p>KEY_SECRET： 你的access_secret密钥，备注：这里需要必须有SMS的权限</p><br>
              <p>点击测试端口系统会向阿里大鱼进行发送查询接口，如果配置验证不通过则提示报错信息</p><br>
            </Alert>
            <Alert  v-if="theTabName === 'LDAP'">
            <h5>LDAP地址  serverurl</h5><br>
            <h5>LDAP端口  默认389   开启SSL 要使用 636</h5><br>
            <h5> 绑定DN  cn=Manager,DC=opendevops,DC=cn</h5>
            <p>这里是设置认证用户的信息, 系统会使用这个用户去校验ldap的信息是否正确</p><br>
            <h5>密码   # 上面认证用户的密码</h5><br>

            <h5>用户OU  ou=opendevops,dc=opendevops,dc=cn</h5>
            <p>这里是设置用来登录codo的组织单元, 比如我要用某个ou的用户来登录codo</p><br>

            <h5>用户过滤器  cn</h5>
            <p>这里是设置认证用户的信息, 系统会使用这个用户去校验ldap的信息是否正确 一般使用cn 或者 sAMAccountName</p><br>

            <h5> LADP属性映射  {"username": "cn", "email": "mail"}或者{"username": "cn", "email": "email"}</h5>
            <p> 系统用户名 usernmae 映射LDAP的cn。 系统用户邮箱映射LDAP的email或者mail属性，取存在的，强制关联，如果缺失报错</p>
            <p> 这里的意思是, 把ldap用户的属性映射到系统上，如果都不存在的 认证无法通过，系统用户的email是必填项</p><br>

            <h5> 启动LDAP认证</h5>
            <p> 如果需要使用LDAP登录 codo, 则必选</p>
            </Alert>
              <Alert  v-if="theTabName === 'EMAILLOGIN'">
              <h5>这块主要是支持第三方邮箱登陆，当你想要使用邮箱登陆此平台时，你可以在此进行配置 比如我们企业邮箱是腾讯的,域名就是opendevops.cn，
                SMTP就是腾讯的stmp.exmail.qq.com,这样配置完成后我就可以使用我yanghongfei@opendevops.cn邮箱+密码登陆此平台了。</h5><br>
              <h5>邮箱SMTP： 这里输入你邮箱服务商的SMTP地址</h5><br>
              <h5>邮箱域名：这里是你的邮箱后缀名字，系统会根据这个后缀来判断你是否在用邮箱登录</h5><br>
            </Alert>
            <Alert  v-if="theTabName === 'STORAGE'">
              <h5>这块主要是配置Bucket信息，目前只支持阿里云的OSS，这里目前主要用于将跳板日志审计的内容存放到OSS目录里面，若不配置此项则存本地数据库（可能会很大，建议配置OSS)</h5><br>
              <h5>区域Region：阿里云的可用区域，如：cn-hangzhou</h5><br>
              <h5>存储桶名称: Bucket名称</h5><br>
              <h5>SecretID: 密钥ID，需要有OSS权限</h5><br>
              <h5>Secret Key： 密钥Key，需要有OSS权限</h5><br>
            </Alert>
          </Col>
        </Row>
      </TabPane>
    </Tabs>
  </Card>
</template>

<script>
import { getSysconfig, operationSysconfig, CheckSysconfig } from '@/api/app'
import FormGroup from '_c/form-group'
export default {
  components: {
    FormGroup
  },
  data () {
    return {
      btn_loading: false,
      theTabName: '',
      tabs: [
        { label: '系统设置', icon: 'logo-tux', name: 'WEBSITE' },
        { label: '邮件设置', icon: 'ios-mail', name: 'EMAIL' },
        { label: '短信接口', icon: 'ios-notifications', name: 'SMS' },
        { label: 'LDAP设置', icon: 'ios-flag', name: 'LDAP', disabled: false},
        { label: '邮箱登录', icon: 'md-mail', name: 'EMAILLOGIN' },
        { label: '存储配置', icon: 'md-folder', name: 'STORAGE' },
        {
          label: '核心设置',
          icon: 'ios-settings',
          name: 'centerSetting',
          disabled: true
        }
      ],
      formList: [],
      CONFIG_DATA: {
        WEBSITE_API_GW_URL: 'gw.opendevops.cn/api/', // 默认API 地址
        WEBSITE_DEFAULT_MAIL: '', //站内默认邮件接收人
        //
        TOKEN_EXP_TIME: 24,  //令牌超时时间
        MFA_GLOBAL: false,  // 全局二次认证

        EMAILLOGIN_DOMAIN: '', // 邮箱登录
        EMAILLOGIN_SERVER: '', // 邮箱服务地址
        //
        EMAIL_SUBJECT_PREFIX: '',
        EMAIL_HOST: '',
        EMAIL_PORT: '',
        EMAIL_HOST_USER: '',
        EMAIL_HOST_PASSWORD: '',
        EMAIL_USE_SSL: false,
        EMAIL_USE_TLS: false,
        //
        SMS_REGION: '',
        SMS_PRODUCT_NAME: '',
        SMS_DOMAIN: '',
        SMS_ACCESS_KEY_ID: '',
        SMS_ACCESS_KEY_SECRET: '',
        // 存储
        STORAGE_REGION: '',
        STORAGE_NAME: '',
        STORAGE_PATH: '',
        STORAGE_KEY_ID: '',
        STORAGE_KEY_SECRET: '',
        //LDAP
        LDAP_SERVER_HOST: 'ldap.example.org',
        LDAP_SERVER_PORT: '389',
        LDAP_ADMIN_DN: "",
        LDAP_ADMIN_PASSWORD:'',
        LDAP_SEARCH_BASE: '',        //相当于你要在那个组织查询你的登录用户
        LDAP_SEARCH_FILTER: '',      //用户过滤器
        LDAP_ATTRIBUTES: '',         //属性映射
        LDAP_USE_SSL: false,         // 是否启用SSL
        LDAP_ENABLE: false,          //是否启用

      }
    }
  },
  methods: {
    getSttings (value) {
      getSysconfig(value).then(res => {
        if (res.data.code === 0) {
          this.CONFIG_DATA = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handleTabs (name) {
      this.btn_loading =false
      this.theTabName = name
      switch (name) {
        case 'WEBSITE':
          this.formList = [
            {
              name: 'WEBSITE_API_GW_URL',
              type: 'i-input',
              value: this.CONFIG_DATA.WEBSITE_API_GW_URL,
              label: 'API 地址',
              maxlength: 50,
              placeholder: '${WEBSITE_API_GW_URL} 请输入后端域名地址',
              rule: [
                {
                  required: true,
                  message: '内容不能为空',
                  trigger: 'blur'
                },
                { type: 'url', message: '格式应为URL ', trigger: 'blur' }
              ]
            },
            {
              name: 'WEBSITE_DEFAULT_MAIL',
              type: 'i-input',
              value: this.CONFIG_DATA.WEBSITE_DEFAULT_MAIL,
              label: '默认邮箱',
              maxlength: 50,
              placeholder: '${WEBSITE_DEFAULT_MAIL} 系统内默认邮件地址'
            },
            {
              name: 'TOKEN_EXP_TIME',
              type: 'i-input',
              value: this.CONFIG_DATA.TOKEN_EXP_TIME,
              label: '登录超时时间',
              maxlength: 2, //限制不能超过两位
              placeholder: '${TOKEN_EXP_TIME} 系统默认登录超时时间，默认一天',
              rule: [
                { type: 'string', message: '格式应为int类型', trigger: 'blur' },
                { type: 'string',  min: 1,   message: '不能小于1小时，不然体验太差了',   trigger: 'blur' }
              ]
            },
            {
              name: 'MFA_GLOBAL',
              type: 'i-switch',
              value: this.CONFIG_DATA.MFA_GLOBAL === '1',
              label: '禁用二次认证'
            }
          ]
          break
        case 'EMAIL':
          this.formList = [
            {
              name: 'EMAIL_SUBJECT_PREFIX',
              type: 'i-input',
              value: this.CONFIG_DATA.EMAIL_SUBJECT_PREFIX,
              label: 'SMTP主题',
              maxlength: 20,
              placeholder: '${EMAIL_SUBJECT_PREFIX} 请输入邮件主题',
              rule: [
                { required: true, message: '邮件主题不能为空', trigger: 'blur' }
              ]
            },
            {
              name: 'EMAIL_HOST',
              type: 'i-input',
              value: this.CONFIG_DATA.EMAIL_HOST,
              label: 'SMTP主机',
              maxlength: 25,
              placeholder: '${EMAIL_HOST} 请输入SMTP主机',
              rule: [
                { required: true, message: 'SMTP主机不能为空', trigger: 'blur' }
              ]
            },
            {
              name: 'EMAIL_PORT',
              type: 'i-input',
              value: this.CONFIG_DATA.EMAIL_PORT,
              label: 'SMTP端口',
              placeholder:
                '${EMAIL_PORT} 请输入SMTP端口,如果SMTP端口使465，通常需要启用SSL,如果SMTP端口使587，通常需要启用TLS ',
              maxlength: 5,
              rule: [
                {
                  required: true,
                  message: 'SMTP端口不能为空',
                  trigger: 'blur'
                },
                { type: 'string', message: '端口类型错误', trigger: 'blur' }
              ]
            },
            {
              name: 'EMAIL_HOST_USER',
              type: 'i-input',
              value: this.CONFIG_DATA.EMAIL_HOST_USER,
              label: 'SMTP账户',
              maxlength: 35,
              placeholder: '${EMAIL_HOST_USER} 请输入SMTP用户账户',
              rule: [
                { required: true, message: 'SMTP账户不能为空', trigger: 'blur' }
              ]
            },
            {
              name: 'EMAIL_HOST_PASSWORD',
              type: 'i-input',
              type1: 'password',
              value: this.CONFIG_DATA.EMAIL_HOST_PASSWORD,
              maxlength: 35,
              label: 'SMTP密码',
              placeholder: '${EMAIL_HOST_PASSWORD} 请输入SMTP用户密码',
              rule: [
                { required: true, message: 'SMTP密码不能为空', trigger: 'blur' }
              ]
            },
            {
              name: 'EMAIL_USE_SSL',
              type: 'i-switch',
              value: this.CONFIG_DATA.EMAIL_USE_SSL === '1',
              label: '启用SSL'
            },
            {
              name: 'EMAIL_USE_TLS',
              type: 'i-switch',
              value: this.CONFIG_DATA.EMAIL_USE_TLS === '1',
              label: '启用TLS'
            }
          ]
          break
        case 'SMS':
          this.formList = [
            {
              name: 'SMS_REGION',
              type: 'i-input',
              maxlength: 15,
              value: this.CONFIG_DATA.SMS_REGION,
              placeholder:
                '${SMS_REGION}，本配置只支持阿里大鱼 ，区域一般为 cn-hangzhou',
              label: '短信区域',
              rule: [
                { required: true, message: 'REGION不能为空', trigger: 'blur' }
              ]
            },
            {
              name: 'SMS_PRODUCT_NAME',
              type: 'i-input',
              maxlength: 15,
              value: this.CONFIG_DATA.SMS_PRODUCT_NAME,
              placeholder: '${SMS_PRODUCT_NAME} 一般为 Dysmsapi',
              label: 'API 名称',
              rule: [
                {
                  required: true,
                  message: 'SMS_PRODUCT_NAME不能为空',
                  trigger: 'blur'
                }
              ]
            },
            {
              name: 'SMS_DOMAIN',
              type: 'i-input',
              maxlength: 25,
              value: this.CONFIG_DATA.SMS_DOMAIN,
              placeholder: '${SMS_DOMAIN}, 一般为 dysmsapi.aliyuncs.com',
              label: 'API 域名',
              rule: [
                {
                  required: true,
                  message: 'SMS_DOMAIN不能为空',
                  trigger: 'blur'
                }
              ]
            },
            {
              name: 'SMS_ACCESS_KEY_ID',
              type: 'i-input',
              maxlength: 30,
              value: this.CONFIG_DATA.SMS_ACCESS_KEY_ID,
              placeholder: '${SMS_ACCESS_KEY_ID}  ',
              label: '密钥ID',
              rule: [
                {
                  required: true,
                  message: 'SMS_ACCESS_KEY_ID不能为空',
                  trigger: 'blur'
                }
              ]
            },
            {
              name: 'SMS_ACCESS_KEY_SECRET',
              type: 'i-input',
              type1: 'password',
              maxlength: 60,
              value: this.CONFIG_DATA.SMS_ACCESS_KEY_SECRET,
              placeholder: '${SMS_ACCESS_KEY_SECRET} 不能为空',
              label: '密钥KEY',
              rule: [
                {
                  required: true,
                  message: 'SMS_ACCESS_KEY_SECRET不能为空',
                  trigger: 'blur'
                }
              ]
            }
          ]
          break
        case 'LDAP':
          this.formList = [
            {
              name: 'LDAP_SERVER_HOST',
              type: 'i-input',
              maxlength: 35,
              value: this.CONFIG_DATA.LDAP_SERVER_HOST,
              placeholder: '${LDAP_SERVER_HOST}，LDAP的服务器地址 例如：ldap.example.org',
              label: 'LDAP地址',
              rule: [
                { required: true, message: 'LDAP地址不能为空', trigger: 'blur' }
              ]
            },
            {
              name: 'LDAP_SERVER_PORT',
              type: 'i-input',
              maxlength: 5,
              value: this.CONFIG_DATA.LDAP_SERVER_PORT,
              placeholder: '${LDAP_SERVER_PORT}，LDAP的服务器端口 默认389',
              label: 'LDAP端口',
              rule: [
                { required: true, message: 'LDAP端口不能为空', trigger: 'blur' }
              ]
            },
            {
              name: 'LDAP_ADMIN_DN',
              type: 'i-input',
              maxlength: 40,
              value: this.CONFIG_DATA.LDAP_ADMIN_DN,
              placeholder: '${LDAP_ADMIN_DN}  这里是设置认证用户的信息, 系统会使用这个用户去校验ldap的信息是否正确',
              label: '绑定DN',
              rule: [{required: true, message: '认证用户绑定DN不能为空', trigger: 'blur'}]
            },
            {
              name: 'LDAP_ADMIN_PASSWORD',
              type: 'i-input',
              type1: 'password',
              maxlength: 35,
              value: this.CONFIG_DATA.LDAP_ADMIN_PASSWORD,
              placeholder: '${LDAP_ADMIN_PASSWORD} 上面认证用户的密码',
              label: '认证密码',
              rule: [ { required: true, message: '认证用户的密码不能为空', trigger: 'blur' }]
            },
            {
              name: 'LDAP_SEARCH_BASE',
              type: 'i-input',
              maxlength: 60,
              value: this.CONFIG_DATA.LDAP_SEARCH_BASE,
              placeholder: '${LDAP_SEARCH_BASE} 这里是设置用来登录codo的组织单元, 比如我要用某个ou的用户来登录',
              label: '用户OU',
              rule: [
                {
                  required: true,
                  message: '这里是设置用来登录codo的组织单元，不能为空',
                  trigger: 'blur'
                }
              ]
            },
            {
              name: 'LDAP_SEARCH_FILTER',
              type: 'i-input',
              maxlength: 15,
              value: this.CONFIG_DATA.LDAP_SEARCH_FILTER,
              placeholder: '${LDAP_SEARCH_FILTER} 不能为空',
              label: '用户过滤器',
              rule: [
                {
                  required: true,
                  message: '用户过滤不能为空，系统需要知道你需要认证的用户是那个字段',
                  trigger: 'blur'
                }
              ]
            },
            {
              name: 'LDAP_ATTRIBUTES',
              type: 'i-input',
              maxlength: 60,
              disabled: true,
              value: this.CONFIG_DATA.LDAP_ATTRIBUTES,
              placeholder: '${LDAP_ATTRIBUTES} 不能为空',
              label: 'LDAP属性映射',
              rule: [ { required: true, message: 'LDAP 属性映射不能为空，并且一定要映射出邮箱地址', trigger: 'blur'}]
            },
            {
              name: 'LDAP_USE_SSL',
              type: 'i-switch',
              value: this.CONFIG_DATA.LDAP_USE_SSL === '1',
              label: '启用SSL认证'
            },
             {
              name: 'LDAP_ENABLE',
              type: 'i-switch',
              value: this.CONFIG_DATA.LDAP_ENABLE === '1',
              label: '启用LDAP认证'
            },
          ]
          break
        case 'STORAGE':
          this.formList = [
            {
              name: 'STORAGE_REGION',
              type: 'i-input',
              maxlength: 35,
              value: this.CONFIG_DATA.STORAGE_REGION,
              placeholder: '${STORAGE_REGION}，本配置目前只支持阿里云OSS',
              label: '区域region',
              rule: [
                { required: true, message: 'REGION不能为空', trigger: 'blur' }
              ]
            },
            {
              name: 'STORAGE_NAME',
              type: 'i-input',
              maxlength: 60,
              value: this.CONFIG_DATA.STORAGE_NAME,
              placeholder: '${STORAGE_NAME} 请输入存储桶的名称',
              label: '存储桶名称',
              rule: [
                {
                  required: true,
                  message: '存储桶名称不能为空',
                  trigger: 'blur'
                }
              ]
            },
            {
              name: 'STORAGE_KEY_ID',
              type: 'i-input',
              maxlength: 40,
              value: this.CONFIG_DATA.STORAGE_KEY_ID,
              placeholder: '${STORAGE_KEY_ID}  密钥ID',
              label: 'Secret ID',
              rule: [
                {
                  required: true,
                  message: 'STORAGE_KEY_ID不能为空',
                  trigger: 'blur'
                }
              ]
            },
            {
              name: 'STORAGE_KEY_SECRET',
              type: 'i-input',
              type1: 'password',
              maxlength: 60,
              value: this.CONFIG_DATA.STORAGE_KEY_SECRET,
              placeholder: '${STORAGE_KEY_SECRET} 不能为空',
              label: 'Secret Key',
              rule: [
                {
                  required: true,
                  message: 'STORAGE_KEY_SECRET不能为空',
                  trigger: 'blur'
                }
              ]
            }
          ]
          break
        case 'EMAILLOGIN':
          this.formList = [
            {
              name: 'EMAILLOGIN_SERVER',
              type: 'i-input',
              value: this.CONFIG_DATA.EMAILLOGIN_SERVER,
              label: '邮箱SMTP',
              maxlength: 80,
              placeholder:
                '${EMAILLOGIN_SERVER} 请输入所用邮箱的SMTP地址，我们使用此地址来验证邮箱例如：smtp.exmail.qq.com',
              rule: [
                {
                  required: true,
                  message: '内容不能为空',
                  trigger: 'blur'
                }
              ]
            },
            {
              name: 'EMAILLOGIN_DOMAIN',
              type: 'i-input',
              value: this.CONFIG_DATA.EMAILLOGIN_DOMAIN,
              label: '邮箱域名',
              maxlength: 50,
              placeholder:
                '${EMAILLOGIN_DOMAIN} 请输入登录邮箱的后缀名称，例如：qq.com'
            }
          ]
          break
        case 'centerSetting':
          this.formList = []
          break
      }
    },
    handleSubmit (value) {
      this.btn_loading = true;
      setTimeout(() => {
        operationSysconfig(value.data).then(res => {
          if (res.data.code === 0) {
            this.$Message.info(`${res.data.msg}`)
            // 重新获取数据
            this.getSttings('all')
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
        this.btn_loading = false;
      }, 1000)
    },
    handlerCheckTest (value) {
      this.btn_loading = true;
      setTimeout(() => {
        CheckSysconfig({ check_key: value }).then(res => {
          if (res.data.code === 0) {
            this.$Message.info(`${res.data.msg}`)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
        this.btn_loading = false;
      }, 3000)
    }
  },
  mounted () {
    this.getSttings('all')
    setTimeout(() => {
      this.handleTabs('WEBSITE')
    }, 500)
  },
  created () {
    this.getSttings('all')
    setTimeout(() => {
      this.handleTabs('WEBSITE')
    }, 500)
  },
}
</script>

<style scoped>
</style>

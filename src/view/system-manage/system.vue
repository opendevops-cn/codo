<template>
  <Card style="">
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
        <form-group
          :list="formList"
          @on-submit-success="handleSubmit"
        >
          <slot slot="left-btn">
            <Button
              v-if="theTabName === 'EMAIL'"
              type="success"
              style="margin-left: 8px"
              @click="handlerCheckTest(theTabName)"
            >测试邮件</Button>
            <Button
              v-if="theTabName === 'SMS'"
              type="success"
              style="margin-left: 8px"
              @click="handlerCheckTest(theTabName)"
            >测试短信</Button>
          </slot>
        </form-group>
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
      theTabName: '',
      tabs: [
        { label: '系统设置', icon: 'logo-tux', name: 'WEBSITE' },
        { label: '邮件设置', icon: 'ios-mail', name: 'EMAIL' },
        { label: '短信接口', icon: 'ios-notifications', name: 'SMS' },
        {
          label: 'LDAP设置',
          icon: 'ios-flag',
          name: 'LDAP',
          disabled: true
        },
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
        WEBSITE_API_GW_URL: '', // API 地址
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
        STORAGE_KEY_SECRET: ''
      }
    }
  },
  methods: {
    getSttings (value) {
      getSysconfig(value).then(res => {
        if (res.data.code === 0) {
          // this.$Message.success(`${res.data.msg}`);
          this.CONFIG_DATA = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handleTabs (name) {
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
              label: 'KEY_ID',
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
              label: 'KEY_SECRET',
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
          this.formList = []
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
            // {
            //   name: 'STORAGE_PATH',
            //   type: 'i-input',
            //   maxlength: 25,
            //   value: this.CONFIG_DATA.STORAGE_PATH,
            //   placeholder: '${STORAGE_PATH}, 存储桶的路径',
            //   label: '存储路径',
            //   rule: [
            //     {
            //       required: true,
            //       message: 'STORAGE_PATH不能为空',
            //       trigger: 'blur'
            //     }
            //   ]
            // },
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
      }, 1000)
    },
    handlerCheckTest (value) {
      setTimeout(() => {
        CheckSysconfig({ check_key: value }).then(res => {
          if (res.data.code === 0) {
            this.$Message.info(`${res.data.msg}`)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }, 500)
    }
  },
  mounted () {
    this.getSttings('all')
    setTimeout(() => {
      this.handleTabs('WEBSITE')
    }, 200)
  }
}
</script>

<style scoped>
</style>

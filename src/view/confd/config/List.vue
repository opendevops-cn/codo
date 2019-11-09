<template>
  <div style="height:100%; background: #f8f8f9">
    <Row>
      <Col span="24">
        <div class="search-con">
          <p v-show="false">{{ $route.query.project_code }}</p>
          <h2 class="search-title">项目配置</h2>
          <span>{{display_name}}</span>
          <Button type="success" class="search-add" size="small" @click="addEditor()">添加配置</Button>
        </div>
        <Alert type="success" closable>添加/编辑/保存权限请点击项目环境如[dev]进行授权, 发布权限请点击项目名进行授权。 历史版本的最后一个为线上版本。</Alert>
      </Col>
      <Col span="6">
        <Card>
          <Tree :data="treeData" @on-select-change="treeSelect"></Tree>
        </Card>
      </Col>

      <Col span="17" offset="1">
        <Card v-show="is_editor && config_id">
            <div class="search-con">
                <Button :type="editor.color" size="small" class="search-input" @click="editEditor(editor.read)">{{ editor.title }}</Button>
                <Button v-show="!editor.read" type="info" size="small" class="search-input" @click="editBack()">返回</Button>
                <Button v-show="editor.read" type="error" size="small" class="search-input" @click="delConfig()">删除</Button>
                <Button v-show="editor.read" type="info" size="small" class="search-input" @click="goHistory()">历史版本</Button>
                <Button v-show="editor.read && config_id" type="info" size="small" class="search-input" @click="getApi()">API</Button>
                <h4 class="search-title">项目文件KEY</h4>
                <span>{{config_path}}</span>

              <Select v-model="mode_type" placeholder="格式校验" filterable @on-change="selectModeType" class="search-col">
                  <Option value="python" >Python</Option>
                  <Option value="json" >JSON</Option>
                  <Option value="yaml" >YAML</Option>
                  <Option value="ini" >INI</Option>
                  <Option value="dockerfile" >Dockerfile</Option>
                  <Option value="xml" >XML</Option>
                  <Option value="sql" >SQL</Option>
                  <Option value="lua" >Lua</Option>
                  <Option value="php" >PHP</Option>
                  <Option value="java" >JAVA</Option>
                  <Option value="golang" >GO</Option>
                  <Option value="javascript" >JavaScript</Option>
              </Select>
            </div>
            <div class="search-con" v-if="!is_published" v-show="editor.read">
              <Alert type="warning" show-icon>当前版本未发布，你可以选择：<Button type="info" size="small" class="search-publish" @click="diffConfData('diff')">与线上配置进行对比</Button> OR <Button v-show="editor.read" type="error" size="small" class="search-publish" @click="publishEditor()">发布当前版本至线上</Button></Alert>
            </div>
            <editor v-model="file_data" @init="editorInit" @setCompletions="setCompletions" :mode_type="mode_type" :read="editor.read"></editor>
        </Card>

        <Card v-show="is_history_one">
            <div class="search-con">
              <h4 class="search-title">项目文件KEY</h4>
              <span>{{config_path}}</span>
              <Button type="info" size="small" class="search-inputright" @click="is_history=true; is_history_one=false">返回列表</Button>
              <Button type="error" size="small" class="search-inputright" @click="goCallBack()">回滚</Button>
              <Button type="primary" size="small" class="search-inputright" @click="diffConfData('diffHistory')">对比</Button>
            </div> </br>
              <editor v-model="history_content" @init="editorInit" @setCompletions="setCompletions" :mode_type="mode_type" :read="editor.read"></editor>
        </Card>

        <Card v-show="is_history">
            <div class="search-con">
              <h4 class="search-title">发布历史</h4>
              <span>{{display_name}}</span>
              <Button type="info" size="small" class="search-inputright" @click="is_history=false;is_editor=true">返回</Button>
            </div> </br>
            <div>
              <!-- <CellGroup @on-click="clickOneHistory"> -->
              <CellGroup>
                <Cell  v-for="value in history_data" :name="value.content">
                  <span color="success" slot=""><a @click="clickOneHistory(value.content,value.id)">{{value.create_time}}&nbsp;&nbsp;&nbsp;&nbsp; {{value.config}}&nbsp;&nbsp;&nbsp;&nbsp;</a></span>
                  <Tag color="success" slot="extra"><p @click="clickOneHistory(value.content,value.id)"> {{value.create_user}}</p></Tag>
                </Cell>
              </CellGroup>
            </div>
        </Card>
      </Col>
    </Row>
    <Add :dialog="dialog" :display_name="display_name" :wordList="wordList" :project_code="project_code" @e-update="getData(project_code)" @e-close="closeModal"></Add>
    <!-- <Modal v-model="del_dialog.show" :title="del_dialog.title" :loading=true @on-ok="removePerm(del_dialog.id)" @on-cancel="closeDelModal">
       <p>确定要进行删除操作?</p>
    </Modal> -->
    <Modal v-model="diff_dialog.show" :title="diff_dialog.title" :loading=true @on-cancel="closeDiffModal" width="1100px;" :styles="{top: '5px',right:'-10%'}">
       <div v-html="diff_dialog.dffHtml"></div>
        <div slot="footer">
            <Button v-if="show_publish_btn==='publish'" type="error" size="large" long :loading="loading" @click="patchConfData()">确认发布</Button>
        </div>
    </Modal>

    <Modal v-model="auth_dialog.show"  :title="auth_dialog.title" :loading=true :footer-hide=true>
      <Select class="search-input-long" v-model="authUser" filterable multiple placeholder="请选择关联的用户">
        <Option v-for="item in allUser" :value="item.nickname"  :key="item.nickname">{{ item.nickname }}</Option>
      </Select>
      <Button type="success" style="margin-top: 10px;"  @click="authSubmit" long>确定关联</Button>
    </Modal>

    <Modal v-model="back_dialog.show" :title="back_dialog.title" :loading=true @on-ok="backConfig()" @on-cancel="back_dialog=false">
       <p>确定要进行回滚操作?</p>
    </Modal>

    <Modal v-model="del_dialog.show" :title="del_dialog.title" :loading=true @on-ok="removeConfig()" @on-cancel="del_dialog=false">
       <p>确定要进行删除操作?</p>
    </Modal>
    <Modal v-model="config_api_dialog.show" :title="config_api_dialog.title" :loading=true >
      <div slot="footer"> </div>
    <Alert type="success" closable>已发布配置API地址，第一个是当前配置，第二个为当前服务下所有的配置</Alert>
      <Input v-model="config_api">
        <Button slot="append" v-clipboard:copy="config_api" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</Button>
      </Input><br/>
      <Input v-model="service_api">
        <Button slot="append" v-clipboard:copy="service_api" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</Button>
      </Input>
    </Modal>
  </div>
</template>

<script>
import Vue from 'vue'
import {Tag} from 'view-design'
import VueClipboard from 'vue-clipboard2'
import editor from '@/components/public/editor'
import Tables from '_c/tables'
import Add from './Add'
// import History from './History'
import { getConfTree, getConf, putConf, patchConf, deleteConf, diffConf, getHistory, backHistory, setAuth, getAuth} from '@/api/confd/conf.js'
import { getuserlist } from '@/api/user'
import { highlight } from '@/libs/util.js'
Vue.use(VueClipboard)
export default {
  name: 'list',
  components: {
    editor,
    Tables,
    Tag,
    Add
    // History
  },
  data () {
    return {
      // 弹出框
      config_api: '',
      service_api: '',
      loading: true,
      is_history: false,
      is_history_one: false,
      is_editor: true,
      show_publish_btn: false,
      editor: {
        title: '编辑',
        read: true,
        color: 'primary'
      },
      params: {},
      mode_type: 'python',
      // 项目代号
      project_code: '',
      config_id: null,
      file_data: '',
      history_data: [],
      history_id: null,
      history_content: 'history_content....',
      is_published: true,
      wordList: [],
      display_name: '',
      config_path: '',
      treeData: [],
      loading: false,
      dialog: {
        show: false,
        title: '',
        option: ''
      },
      diff_dialog: {
        show: false,
        title: ''
      },
      auth_dialog: {
        show: false,
        title: '授权用户【可对配置文件添加/编辑/保存】'
      },
      back_dialog: {
        show: false,
        title: '版本回滚'
      },
      del_dialog: {
        show: false,
        title: '删除配置'
      },
      config_api_dialog: {
        show: false,
        title: '获取API'
      },
      auth_env: null,
      auth_type: null,
      authUser: [],
      allUser: [],
      del_dialog: {
        show: false,
        title: ''
      },
      tableData: [],
      formData: {
      },
      select_id: []
    }
  },
  methods: {
    goCallBack () {
      this.back_dialog.show = true
    },
    // 版本回滚
    backConfig () {
      backHistory({history_id: this.history_id}).then(res => {
        const data = res.data
        if (data.code === 0) {
          this.$Message.success('History回滚成功获取成功')
          this.back_dialog.show = false
        } else {
          this.$Message.error(data.msg)
        }
      }).catch(error => {
        this.$Message.error({
          content: JSON.stringify(error.response.data),
          duration: 10
        })
      })
    },

    delConfig () {
      this.del_dialog.show = true
    },

    removeConfig () {
      if (!this.params) {
        this.$Message.error(`你总要选中一个呀`)
      } else {
        const params = this.params
        delete params['content']
        deleteConf(params).then(res => {
          const data = res.data
          if (data.code === 0) {
            this.$Message.info(data.msg)
            this.getData(this.project_code)
          } else {
            this.$Message.error(data.msg)
          }
        })
      }
      this.del_dialog.show = false
    },

    // 历史版本
    goHistory () {
      this.is_editor = false
      this.is_history = true
      getHistory(this.params).then(res => {
        const data = res.data
        // console.log(data)
        if (data.code === 0) {
          // this.$Message.success('Config获取成功')
          this.history_data = data.data
        } else {
          this.$Message.error(data.msg)
        }
      }).catch(error => {
        this.$Message.error({
          content: JSON.stringify(error.response.data),
          duration: 10
        })
      })
    },
    clickOneHistory (content, id) {
      this.is_history = false
      this.is_history_one = true
      this.history_content = content
      this.history_id = id
    },

    diffConfData (arg) {
      this.show_publish_btn = arg
      // 配置文件对比
      let params = {}
      if (arg === 'diffHistory') {
        params = {history_id: this.history_id}
      } else {
        params = {config_id: this.config_id}
      }
      diffConf(params).then(res => {
        // console.log(res)
        const data = res.data
        if (data.code === 0) {
          this.diff_dialog = {
            show: true,
            title: '配置文件对比',
            dffHtml: data.data
          }
        } else {
          this.$Message.error(data.msg)
        }
      }).catch(error => {
        this.$Message.error({
          content: JSON.stringify(error.response.data),
          duration: 10
        })
      })
    },
    publishEditor () {
      // 发布 = 保存+发布
      this.diffConfData('publish')
    },
    addEditor () {
      this.dialog = {
        show: true,
        title: '添加配置'
      }
    },
    editBack () {
      this.editor = {
        title: '编辑',
        read: true,
        color: 'primary'
      }
      this.getConfData(this.params)
    },
    editEditor (value) {
      if (this.config_id) {
        if (value) {
          this.editor = {
            title: '保存',
            read: false,
            color: 'warning'
          }
        } else {
          this.editor = {
            title: '编辑',
            read: true,
            color: 'primary'
          }
          this.params['content'] = this.file_data
          // console.log(this.params)
          this.putConfData(this.params)
        }
      } else {
        this.$Message.error({
          content: '请选择文件',
          duration: 3
        })
      }
    },

    // 设置要选则的编辑器语言
    selectModeType (value) {
      this.mode_type = value
    },

    editorInit: function () {
      require(`brace/mode/${this.mode_type}`) // language
      require('brace/theme/terminal')
      require('brace/theme/xcode')
    },

    getWordList () {
      for (let i of highlight.split('|')) {
        this.wordList.push({'vl': i, 'meta': '关键字'})
      }
    },

    setCompletions (editor, session, pos, prefix, callback) {
      callback(null, this.wordList.map(function (word) {
        return {
          caption: word.vl,
          value: word.vl,
          meta: word.meta
        }
      }))
    },

    handleDelete (params) {
      console.log(params)
    },
    // show (index) {
    //   this.$Modal.info({
    //       title: '开始发布',
    //       content: `项目名称：${this.tableData[index].name}<br>运行时间：${this.tableData[index].time}<br>镜像：${this.tableData[index].iamge}`
    //   })
    // },
    remove (index) {
      this.tableData.splice(index, 1)
    },
    // 弹出对话框
    showModal () {
      this.dialog.show = true
    },
    selectOne (selection, row) {
      this.select_id.push(row.id)
    },
    unselectOne (selection, row) {
      this.select_id.splice(this.select_id.indexOf(row.id), 1)
    },
    selectAll (selection) {
      let select_list = []
      for (const line in selection) {
        select_list.push(selection[line].id)
      }
      this.select_id = select_list
      // console.log(this.select_id)
    },
    unselectAllUnselectAll () {
      // Bug不生效。
      console.log(1111)
      this.select_id = []
    },

    // 删除
    handleRemove (row) {
      this.del_dialog = {
        show: true,
        title: '删除 ' + row.name,
        id: row.id
      }
    },
    removePerm (id) {
      delMenu(id).then(res => {
        this.$Message.success({
          content: 'Success!',
          duration: 3
        })
        this.closeDelModal()
        this.getData(project_code)
      }).catch(error => {
        this.$Message.error({
          content: JSON.stringify(error.response.data),
          duration: 10
        })
      })
    },

    // 新增
    handleAdd () {
      this.dialog = {
        show: true,
        title: '添加权限',
        option: 'add'
      }
    },
    // 编辑
    handleEdit (index, row) {
      this.dialog = {
        show: true,
        title: '编辑用户',
        option: 'edit'
      }
      this.formData = {
        name: row.name,
        uri: row.uri,
        method: row.method,
        id: row.id
      }
    },

    changePage (value) {
      // 切换页码时
      this.getParams.pageNum = value
      this.getData(project_code)
    },
    // 切换每页显示条数时
    handlePageSize (value) {
      this.getParams.pageSize = value
      this.getData(project_code)
    },

    // 获取项目Tree
    getData (project_code) {
      getConfTree(project_code).then(res => {
        const data = res.data
        if (data.code === 0) {
          this.treeData = data.data
          this.display_name = data.data[0].display_name
        } else {
          this.$Message.error(data.msg)
        }
      }).catch(error => {
        this.$Message.error({
          content: JSON.stringify(error.response.data),
          duration: 10
        })
      })
    },

    // 获取配置文件内容
    getConfData (params) {
      delete params['content']
      getConf(params).then(res => {
        const data = res.data
        this.config_api = `${res.request.responseURL.split('/kerrigan/')[0]}/kerrigan/v1/conf/publish/config/?project_code=${params['project_code']}&environment=${params['environment']}&service=${params['service']}&filename=${params['filename']}`
        this.service_api = `${res.request.responseURL.split('/kerrigan/')[0]}/kerrigan/v1/conf/publish/service/?project_code=${params['project_code']}&environment=${params['environment']}&service=${params['service']}`
        if (data.code === 0) {
          this.file_data = data.data.content
          this.is_published = data.data.is_published
          this.config_path = data.data.config_key
        } else {
          this.$Message.error(data.msg)
        }
      }).catch(error => {
        this.$Message.error({
          content: JSON.stringify(error.response.data),
          duration: 10
        })
      })
    },

    // 修改配置文件内容
    putConfData (params) {
      putConf(params).then(res => {
        // console.log(res)
        const data = res.data
        if (data.code === 0) {
          this.$Message.success('Config修改成功')
          this.getConfData(this.params)
        } else {
          this.$Message.error(data.msg)
        }
      }).catch(error => {
        this.$Message.error({
          content: JSON.stringify(error.response.data),
          duration: 10
        })
      })
    },

    // 发布到线上配置
    patchConfData () {
      patchConf({config_id: this.config_id}).then(res => {
        // console.log(res)
        const data = res.data
        if (data.code === 0) {
          this.$Message.success('Config发布成功')
          this.closeDiffModal()
          this.getConfData(this.params)
        } else {
          this.$Message.error(data.msg)
        }
      }).catch(error => {
        this.$Message.error({
          content: JSON.stringify(error.response.data),
          duration: 10
        })
      })
    },
    // 获取用户列表
    getUserList () {
      getuserlist(1, 301).then(res => {
        if (res.data.code === 0) {
          this.allUser = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 授权
    authSubmit () {
      const data = {
        project_code: this.project_code,
        environment: this.auth_env,
        auth_user_list: this.authUser
      }
      const action = this.auth_type === 'user' ? 'post' : 'put'
      setAuth(data, action).then(res => {
        const data = res.data
        if (data.code === 0) {
          this.$Message.success(data.msg)
          this.auth_dialog.show = false
        } else {
          this.$Message.error(data.msg)
        }
      }).catch(error => {
        this.$Message.error({
          content: JSON.stringify(error.response.data),
          duration: 10
        })
      })
    },

    getAuthUser () {
      // 获取授权用户列表
      this.auth_type = 'user'
      getAuth({project_code: this.project_code, environment: this.auth_env}).then(res => {
        const data = res.data
        this.authUser = data.data.user_list
        if (data.code === 0) {
          this.$Message.success(data.msg)
        } else {
          this.$Message.error(data.msg)
        }
      }).catch(error => {
        this.$Message.error({
          content: JSON.stringify(error.response.data),
          duration: 10
        })
      })
    },

    getAuthAdmin () {
      // 获取授权管理员列表
      this.auth_type = 'admin'
      getAuth({project_code: this.project_code, environment: 'all_env'}).then(res => {
        const data = res.data
        // console.log(data)
        if (data.code === 0) {
          this.$Message.success(data.msg)
          this.authUser = data.data.admin_list
          this.auth_dialog = {
            show: true,
            title: '授权管理员【可对配置文件 添加/发布】'
          }
        } else {
          this.$Message.error(data.msg)
        }
      }).catch(error => {
        this.$Message.error({
          content: JSON.stringify(error.response.data),
          duration: 10
        })
      })
    },

    // 配置文件点击是触发
    treeSelect (obj) {
      if (obj.length !== 0) {
        const data = obj[0]
        if (data.data_type === 'file') {
          this.config_id = data.id
          this.params = {
            project_code: this.project_code,
            environment: data.env,
            service: data.service,
            filename: data.title
          }
          this.getConfData(this.params)
          this.is_editor = true
          this.is_history = false
          this.is_history_one = false
        } else if (data.data_type === 'env') {
          // 授权用户权限
          this.auth_dialog = {
            show: true,
            title: '授权用户【可对配置文件 编辑/保存】'
          },
          this.auth_env = data.title
          this.getAuthUser()
        } else if (data.data_type === 'project') {
          // 授权管理员权限
          this.auth_env = data.title
          this.getAuthAdmin()
        }
      }
    },

    closeDiffModal () {
      this.diff_dialog.show = false
    },
    closeModal () {
      // 关闭modal
      this.formData = {
        name: null,
        uri: null,
        method: null
      },
      this.dialog.show = false
    },
    getApi () {
      this.config_api_dialog.show = true
    },
    onCopy () {
      this.$Message.success('复制成功')
    },
    onError () {
      this.$Message.error('复制失败')
    }
  },
  watch: {
    project_code (val) {
      this.getData(this.project_code)
    }
  },
  computed: {
    historyTitle () {
      return function (a, b) {
        return `${a} ${b}`
      }
    }
  },
  updated: function () {
    this.project_code = this.$route.query.project_code
  },
  mounted () {
    /** 获取表格数据 **/
    if (!this.$route.query.project_code) {
      this.project_code = ''
    } else {
      this.project_code = this.$route.query.project_code
    }
    // this.getData(this.project_code)
    this.getUserList()
    this.getWordList()
  }
}
</script>

<style lang="less" scoped>
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }

  .search-con {
    padding: 10px 0;
    .search {
      &-col {
        display: inline-block;
        width: 100px;
        float: right;
      }
      &-input {
        display: inline-block;
        width: 85px;
        margin-right: 3px;
      }
      &-inputright {
        display: inline-block;
        width: 60px;
        margin-right: 3px;
        float: right;
      }
      &-publish {
        display: inline-block;
        width: 150px;
        margin-left: 2px;
      }
      &-add {
        display: inline-block;
        width: 80px;
        float: right;
      }
      &-title {
        display: inline-block;
        width: 90px;
        margin-left: 2px;
      }
    }
  }

  .demo-badge-alone{
      background: #5cb85c !important;
  }
</style>

<template>
  <div>
    <Card>
      <tables border ref="tables" searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete"
        @on-select="selectOne" @on-select-cancel="unselectOne" @on-select-all="selectAll"
        @on-search-table="handleSearchTable"
      >
        <div slot="new_btn" class="search-col" style="width:450px">
          <Button type="info" class="search-btn"  @click="handleAdd">添加DB</Button>
          <Button type="info" class="search-btn"  @click="multiAdd">批量添加</Button>
          <Button type="error" class="search-btn"  @click="multliRemove">批量删除</Button>
        </div>
      </tables>
      </br>
      <Page :total="pageTotal" :current="getParams.pageNum" :page-size="getParams.pageSize" :page-size-opts=[25,50,100] show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
    </Card>

    <Add :dialog="dialog" :formData="formData" @e-update="getData" @e-close="closeModal"></Add>
    <Api :dialog="api_dialog" :apiUrl="apiUrl" @e-close="closeApiModal"></Api>
    <multiAdd :dialog="multi_dialog" :formData="formData_multi" @e-update="getData" @e-close="closeMultiModal"></multiAdd>
    <Detail :dialog="dialog2" :formData="formData" @e-close="closeModal"></Detail>

    <Modal v-model="del_dialog.show" :title="del_dialog.title" :loading=true @on-ok="removeServer(del_dialog.id)" @on-cancel="closeDelModal">
       <p>确定要进行删除操作?</p>
    </Modal>
    <Modal v-model="dels_dialog.show" :title="dels_dialog.title" :loading=true @on-ok="removeMultiServer" @on-cancel="closeDelsModal">
       <p>确定要进行批量删除操作吗?</p>
    </Modal>

    <copyRight> </copyRight>

  </div>
</template>

<script>
import {Tag} from 'iview'
import copyRight from '@/components/public/copyright'
import Tables from '_c/tables'
import Add from './Add'
import Api from '@/view/cmdb/common/Api'
import multiAdd from './multiAdd'
import Detail from './Detail'
import { getDBData, delMulti, delDB } from '@/api/cmdb/db.js'
export default {
  name: 'list',
  components: {
    copyRight,
    Tables,
    Tag,
    Add,
    multiAdd,
    Detail,
    Api
  },
  data () {
    return {
      apiUrl: null,
      api_dialog: {
        show: false,
        title: '',
        name: ''
      },
      // 弹出框
      loading: false,
      dialog: {
        show: false,
        title: '',
        option: ''
      },
      dialog2: {
        show: false,
        title: '主机详情'
      },
      multi_dialog: {
        show: false,
        title: '批量添加'
      },
      del_dialog: {
        show: false,
        title: '删除主机'
      },
      dels_dialog: {
        show: false,
        title: '批量删除主机'
      },
      columns: [
        {
          title: '',
          key: '',
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '主机',
          key: 'host',
          sortable: true,
          align: 'center',
          render: (h, params) => {
            // return h('router-link', {props:{to:'/project/publish/'+params.row.id+ '/'}}, params.row.name)
            return h('a', {
              on: {
                click: () => {
                  this.handleDetail(params.index, params.row)
                }
              }
            }, params.row.host
            )
          }
        },
        {title: '端口', key: 'port', align: 'center'},
        {title: '用户名', key: 'username', align: 'center'},
        // {title: '密码', key: 'password', align: 'center',},
        {title: '角色', key: 'role_name', align: 'center'},
        {title: 'IDC', key: 'idc_name', align: 'center'},
        {title: 'DB类型', key: 'db_type', align: 'center'},
        {title: '版本', key: 'db_version', align: 'center'},
        {
          title: '操作',
          key: 'handle',
          width: 200,
          align: 'center',
          button: [
            (h, params, vm) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                    // this.show(params.index)
                      this.handleAPI(params.index, params.row)
                    }
                  }
                }, 'API'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                    // this.show(params.index)
                      this.handleEdit(params.index, params.row)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      // this.remove(params.index)
                      this.handleRemove(params.row)
                    }
                  }
                }, '删除')
              ])
            }
          ]
        }

      ],
      getParams: {
        pageNum: 1, // 当前页码
        pageSize: 25 // 每页条数
      },
      pageTotal: 0, // 数据总数

      tableData: [],
      formData_multi: {
        data: null
      },
      formData: {
        host: '',
        port: 3306,
        username: null,
        password: null,
        role: 'master',
        idc: 'other',
        db_type: 'MySQL',
        db_version: '5.7',
        comment: '',
        group: [],
        tag: [],
        region: null
      },
      select_id: []
    }
  },
  methods: {
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
        title: '删除主机 ' + row.hostname,
        id: row.id
      }
    },
    removeServer (id) {
      delDB(id).then(res => {
        this.$Message.success({
          content: 'Success!',
          duration: 3
        })
        this.closeDelModal()
        this.getData()
      }).catch(error => {
        this.$Message.error({
          content: JSON.stringify(error.response.data),
          duration: 10
        })
      })
    },

    // 批量删除
    multliRemove () {
      if (this.select_id.length === 0) {
        this.$Message.error({
          content: '请选择要删除的主机',
          duration: 3
        })
      } else {
        // console.log('select_id------>',this.select_id)
        this.dels_dialog = {
          show: true,
          title: '批量删除'
        }
      }
    },
    removeMultiServer () {
      // start multi remove
      delMulti(this.select_id).then(res => {
        if (res.data.status == true) {
          this.$Message.success({
            content: '批量删除成功!',
            duration: 3
          })
          this.closeDelsModal()
        } else {
          this.$Message.error({
            content: res.data.msg,
            duration: 10
          })
        }
      }).catch(error => {
        this.$Spin.hide()
        this.$Message.error({
          content: 'Error',
          duration: 10
        })
      })
      this.getData()
    },

    // 批量添加
    multiAdd () {
      this.multi_dialog = {
        show: true,
        title: '批量添加DB（仅限MySQL）'
      }
    },
    // 获取API
    handleAPI (index, row) {
      this.api_dialog = {
        show: true,
        title: '获取API',
        name: 'host=' + row.host
      }
    },
    // 新增
    handleAdd () {
      this.dialog = {
        show: true,
        title: '添加DB',
        option: 'add'
      }
    },
    // 编辑
    handleEdit (index, row) {
      this.dialog = {
        show: true,
        title: '编辑DB',
        option: 'edit'
      }
      this.formData = {
        host: row.host,
        port: row.port,
        username: row.username,
        password: row.password,
        role: row.role,
        idc: row.idc,
        db_type: row.db_type,
        db_version: row.db_version,
        comment: row.comment,
        group: row.group,
        tag: row.tag,
        id: row.id,
        region: row.region
      }
      if (this.formData.username != null) {
        this.formData.single = true
      }
    },
    handleDetail (index, row) {
      this.dialog2.show = true
      this.formData = {
        host: row.host,
        port: row.port,
        username: row.username,
        password: row.password,
        role_name: row.role_name,
        idc_name: row.idc_name,
        db_type: row.db_type,
        db_version: row.db_version,
        comment: row.comment,
        group_name: row.group_name.join(' '),
        tag_name: row.tag_name.join(' '),
        id: row.id,
        region: row.region
      }
    },

    changePage (value) {
      // 切换页码时
      this.getParams.pageNum = value
      this.getData()
    },
    // 切换每页显示条数时
    handlePageSize (value) {
      this.getParams.pageSize = value
      this.getData()
    },
    handleSearchTable (k, v) {
      // 子组件table发送过来的搜索条件
      this.getParams = {
        pageNum: 1,
        pageSize: 25
      }

      if (k !== '') {
        // 模糊匹配
        if (k === 'group') {
          this.getParams['group__name'] = v
        } else {
          this.getParams[k + '__contains'] = v // contanis包含,﻿startswith开始
        }
      }
      this.getData()
    },

    getData () {
      // 获取数据
      getDBData(this.getParams).then(res => {
        this.tableData = res.data.data
        this.pageTotal = res.data.count
        this.apiUrl = res.request.responseURL.split('?')[0]
        // console.log(this.tableData)
      })
    },
    closeDelModal () {
      this.del_dialog.show = false
    },
    closeDelsModal () {
      this.dels_dialog.show = false
    },
    closeMultiModal () {
      this.formData_multi = {
        data: null
      }
      this.multi_dialog.show = false
    },
    closeModal () {
      // 关闭modal
      this.formData = {
        hostname: '',
        ip: '',
        port: 22,
        cpu: '',
        memory: '',
        disk: '',
        os_platform: 'Linux',
        os_distribution: '',
        os_version: '',
        sn: '',
        comment: '',
        role: 'master',
        idc: 'other',
        admin_user: null,
        group: [],
        tag: [],
        username: null,
        password: null,
        region: null
      },
      this.dialog.show = false
    },
    closeApiModal () {
      this.api_dialog.show = false
    }
  },
  mounted () {
    /** 获取表格数据 **/
    this.getData()
  }
}
</script>

<style>
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
</style>

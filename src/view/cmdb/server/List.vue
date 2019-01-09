<template>
  <div>
    <Card>
      <tables border ref="tables" searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete"
        @on-select="selectOne" @on-select-cancel="unselectOne" @on-select-all="selectAll"
        @on-search-table="handleSearchTable"
      >
        <div slot="new_btn" class="search-col" style="width:450px">
          <Button type="info" class="search-btn"  @click="handleAdd">添加主机</Button>
          <Button type="info" class="search-btn"  @click="multiAdd">批量添加</Button>
          <Button type="error" class="search-btn"  @click="multliRemove">批量删除</Button>
          <Button type="warning" class="search-btn"  @click="rsyncPublicKey">公钥推送</Button>
          <Button type="info" class="search-btn"  @click="rsyncHost">资产更新</Button>
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
// import { getTableData } from '@/api/data'
import { getTableData, searchTableData, rsyncHostData, rsyncPublicKeyData, delServer, delMultiServer } from '@/api/cmdb/server.js'
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
      // 弹出框
      apiUrl: null,
      api_dialog: {
        show: false,
        title: '',
        name: ''
      },
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
        // {
        //   title: 'ID',
        //   key: 'id',
        //   sortable: true,
        //   sortType: 'desc',
        //   width: 70,
        //   align: 'center',
        // },
        {
          title: '主机名',
          key: 'hostname',
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
            }, params.row.hostname
            )
          }
        },
        {title: 'IP', key: 'ip', align: 'center'},
        {
          title: '主机组',
          key: 'group',
          align: 'center',
          render: (h, params) => {
            const s_group = params.row.group_name.join(' ')
            return h('span', s_group)
          }
        },
        // {
        //   title: 'Tag',
        //   key: 'tag',
        //   align: 'center',
        //   render: (h, params) => {
        //     const s_tag = params.row.tag_name.join(' ')
        //     return h('span', s_tag)
        //   }
        // },
        {title: 'IDC', key: 'idc_name', align: 'center'},
        {title: '系统类型', key: 'os_platform', align: 'center'},
        {title: 'CPU', key: 'cpu', align: 'center'},
        {title: '内存', key: 'memory', align: 'center'},
        {title: '硬盘', key: 'disk', align: 'center'},
        {
          title: '连通性',
          key: 'handle',
          align: 'center',
          button: [
            (h, params, vm) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: params.row.public_key == true ? 'success' : 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  }
                }, params.row.public_key)
              ])
            }
          ]
        },
        {
          title: '操作',
          key: 'handle',
          width: 220,
          align: 'center',
          button: [
            (h, params, vm) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      window.open('/terminal/?id=' + params.row.id)
                    }
                  }
                }, 'SSH'),
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
        idc: 'other',
        admin_user: null,
        group: [],
        tag: [],
        username: null,
        passowrd: null,
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

    // 资产搜集
    rsyncHost () {
      if (this.select_id.length === 0) {
        this.$Message.error({
          content: '请选择要更新的主机',
          duration: 3
        })
      } else {
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
        rsyncHostData(this.select_id).then(res => {
          this.$Spin.hide()
          this.getData()
          if (res.data.status == true) {
            this.$Message.success({
              content: '资产更新成功!',
              duration: 3
            })
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
      }
      this.select_id = []
    },

    // 公钥推送
    rsyncPublicKey () {
      if (this.select_id.length === 0) {
        this.$Message.error({
          content: '请选择要推送的主机',
          duration: 3
        })
      } else {
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
              h('div', '公钥推送中....')
            ])
          }
        })
        rsyncPublicKeyData(this.select_id).then(res => {
          this.$Spin.hide()
          this.getData()
          // console.log(res.data)
          if (res.data.status == true) {
            this.$Message.success({
              content: '公钥推送成功!',
              duration: 3
            })
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
      }
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
      delServer(id).then(res => {
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
      delMultiServer(this.select_id).then(res => {
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
        title: '批量添加主机'
      }
    },
    // 新增
    handleAdd () {
      this.dialog = {
        show: true,
        title: '添加主机',
        option: 'add'
      }
    },
    // 获取API
    handleAPI (index, row) {
      this.api_dialog = {
        show: true,
        title: '获取API',
        name: 'hostname=' + row.hostname
      }
    },
    // 编辑
    handleEdit (index, row) {
      this.dialog = {
        show: true,
        title: '编辑主机',
        option: 'edit'
      }
      this.formData = {
        hostname: row.hostname,
        ip: row.ip,
        port: row.port,
        cpu: row.cpu,
        memory: row.memory,
        disk: row.disk,
        os_platform: row.os_platform,
        os_version: row.os_version,
        sn: row.sn,
        comment: row.comment,
        idc: row.idc,
        admin_user: row.admin_user,
        group: row.group,
        tag: row.tag,
        id: row.id,
        username: row.username,
        password: row.password,
        region: row.region
      }
      if (this.formData.username != null) {
        this.formData.single = true
      }
    },
    handleDetail (index, row) {
      this.dialog2.show = true
      this.formData = {
        hostname: row.hostname,
        ip: row.ip,
        port: row.port,
        cpu: row.cpu,
        memory: row.memory,
        disk: row.disk,
        os_platform: row.os_platform,
        os_version: row.os_version,
        sn: row.sn,
        comment: row.comment,
        idc: row.idc,
        admin_user: row.admin_user,
        group: row.group,
        tag: row.tag,
        id: row.id,
        group_name: row.group_name.join(' '),
        admin_user_name: row.admin_user_name,
        idc_name: row.idc_name,
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
      getTableData(this.getParams).then(res => {
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

<template>
  <div>
    <Row>
      <Col span="16">
        <Card>
          <tables border ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete">
            <!-- <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button> -->
            <div slot="new_btn" class="search-col">
              <Button type="info" class="search-btn"  @click="handleAdd">添加主机组</Button>
            </div>
          </tables>
        </Card>
        <Add :dialog="dialog" :formData="formData" @e-update="getData" @e-close="closeModal"></Add>
        <Api :dialog="api_dialog" :apiUrl="apiUrl" @e-close="closeApiModal"></Api>
      </Col>
      <Col span="7" offset="1">
        <Card>
          <Tree :data="treeData"></Tree>
        </Card>
      </Col>
    </Row>
    <Modal v-model="del_dialog.show" :title="del_dialog.title" :loading=true @on-ok="removeAction(del_dialog.id)" @on-cancel="closeDelModal">
       <p>确定要进行删除操作?</p>
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
import { getTableData, delGroup } from '@/api/cmdb/server_group.js'
export default {
  name: 'list',
  components: {
    copyRight,
    Tables,
    Tag,
    Add,
    Api
  },
  data () {
    return {
      apiUrl: null,
      treeData: [],
      // 弹出框
      loading: false,
      dialog: {
        show: false,
        title: '',
        option: ''
      },
      api_dialog: {
        show: false,
        title: '',
        name: ''
      },
      del_dialog: {
        show: false,
        title: '删除主机'
      },
      columns: [
        {
          title: 'ID',
          key: 'id',
          sortable: true,
          sortType: 'desc',
          width: 70,
          align: 'center'
        },
        {title: '组名', key: 'name', align: 'center'},
        {
          title: '主机',
          key: 'server',
          align: 'center',
          render: (h, params) => {
            return h('div', [h(Tag, {props: {color: 'primary'}}, params.row.server_set.length)])
          }
        },
        {
          title: 'DB',
          key: 'dbserver',
          align: 'center',
          render: (h, params) => {
            return h('div', [h(Tag, {props: {color: 'primary'}}, params.row.dbserver_set.length)])
          }
        },
        {title: '描述', key: 'comment', align: 'center'},
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
                      this.handleRemove(params.row)
                      // this.remove(params.index)
                      // vm.$emit('on-delete', params)
                      // vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                    }
                  }
                }, '删除')
              ])
            }
          ]
        }

      ],
      tableData: [],
      formData: {
        name: '',
        comment: '',
        server_set: []
      }
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

    // 删除
    handleRemove (row) {
      this.del_dialog = {
        show: true,
        title: '删除主机组 ' + row.name,
        id: row.id
      }
    },
    removeAction (id) {
      delGroup(id).then(res => {
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

    remove (index) {
      this.tableData.splice(index, 1)
    },
    // 弹出对话框
    showModal () {
      this.dialog.show = true
    },
    // 新增
    handleAdd () {
      this.dialog = {
        show: true,
        title: '添加主机组',
        option: 'add'
      }
    },
    // 获取API
    handleAPI(index, row) {
      this.api_dialog = {
        show: true,
        title: '获取API',
        name: 'group='+row.name
      }
    },
    // 编辑
    handleEdit (index, row) {
      this.dialog = {
        show: true,
        title: '编辑主机组',
        option: 'edit'
      }
      this.formData = {
        name: row.name,
        comment: row.comment,
        id: row.id,
        server_set: row.server_set,
        dbserver_set: row.dbserver_set
      }
    },
    getData () {
      // 获取数据
      getTableData().then(res => {
        this.tableData = res.data
        let resUrl = res.request.responseURL.split('v1')[0]
        this.apiUrl = resUrl + 'v1/cmdb/all_server/'
        // console.log(this.tableData)
        this.treeData = []

        for (let item in res.data) {
          let serverChildren = []
          for (let c in res.data[item].server_set_name) {
            serverChildren.push({ title: res.data[item].server_set_name[c] })
          }

          this.treeData.push({
            title: res.data[item].name,
            expand: false,
            render: (h, { root, node, data }) => {
              return h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%'
                }
              }, [
                h('span', [
                  h('Icon', {
                    props: {
                      type: 'ios-folder-outline'
                    },
                    style: {
                      marginRight: '8px'
                    }
                  }),
                  h('span', data.title)
                ])
              ])
            },
            children: serverChildren
          })
        }
      })
    },
    closeModal () {
      // 关闭modal
      this.dialog.show = false
    },
    closeDelModal () {
      this.del_dialog.show = false
    },
    closeApiModal () {
      this.api_dialog.show = false
    }
  },
  mounted () {
    /** 获取表格数据 **/
    this.getData()
    // console.log('get user->'+ this.$store.getters.user.id)
  }
}
</script>

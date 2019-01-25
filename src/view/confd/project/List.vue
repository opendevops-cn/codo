<template>
  <div>
    <Card>
      <tables border ref="tables" searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete"
        @on-select="selectOne" @on-select-cancel="unselectOne" @on-select-all="selectAll"
        @on-search-table="handleSearchTable"
      >
        <div slot="new_btn" class="search-col" style="width:450px">
          <Button type="info" class="search-btn"  @click="handleAdd">添加项目</Button>
        </div>
      </tables>
      </br>
      <Page :total="pageTotal" :current="getParams.pageNum" :page-size="getParams.pageSize" :page-size-opts=[25,50,100] show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
    </Card>

    <Add :dialog="dialog" :formData="formData" @e-update="getData" @e-close="closeModal"></Add>
    <Modal v-model="del_dialog.show" :title="del_dialog.title" :loading=true @on-ok="removePerm(del_dialog.id)" @on-cancel="closeDelModal">
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
import { getMenus, delMenu} from '@/api/mg/menu.js'
import { getProject } from '@/api/confd/project.js'
export default {
  name: 'list',
  components: {
    copyRight,
    Tables,
    Tag,
    Add
  },
  data () {
    return {
      // 弹出框
      loading: false,
      dialog: {
        show: false,
        title: '',
        option: ''
      },
      del_dialog: {
        show: false,
        title: ''
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
          title: '项目名称',
          key: 'project_name', 
          align: 'center',
          render: (h, params) => {
            return h('router-link', {props:{to:'/confd/confd_config/'+params.row.project_code+ '/'}}, params.row.project_name)
          }
        },
        {title: '项目代号', key: 'project_code', align: 'center'},
        {title: '创建者', key: 'user', align: 'center'},
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

      tableData: [
        {'id':'2', 'project_code': 'ss','project_name': 'shenshuo','user':'sss'},
        {'id':'3','project_code': 'yanghongfei','project_name': '杨红飞','user':'shenshuo'}
      ],
      formData_multi: {
        data: null
      },
      formData: {
        name: null
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
        this.getData()
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
      // getProject(this.getParams).then(res => {
      //   //this.tableData = res.data.message
      //   // console.log(this.tableData)
      // })
    },
    closeDelModal () {
      this.del_dialog.show = false
    },
    closeModal () {
      // 关闭modal
      this.formData = {
        name: null,
        uri: null,
        method: null
      },
      this.dialog.show = false
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

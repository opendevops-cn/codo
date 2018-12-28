<template>
  <div>
    <Card>
      <tables border ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete">
        <!-- <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button> -->
        <div slot="new_btn" class="search-col">
          <Button type="info" class="search-btn"  @click="handleAdd">新建应用</Button>
        </div>
      </tables>
    </Card>
    <Modal width="600px;" v-model="dialog.show"  :title="dialog.title" :loading=true :footer-hide=true> 
        <!-- <form-group :list="formList"  @on-submit-success="handleSubmit"></form-group> -->
        <Add :dialog="dialog" :formData="formData" @e-update="getData" @e-close="closeModal"></Add>
    </Modal>
    <copyRight> </copyRight>
    
  </div>
</template>

<script>
import {Tag} from 'iview'
import copyRight from '@/components/public/copyright'
import Tables from '_c/tables'
import Add from './Add'
// import { getTableData } from '@/api/data'
// import { getTableData } from '@/api/project.js'
import { getTableData } from '@/api/k8s/app.js'
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
      dialog:{
        show: false,
        title: '',
        option: ''
      },
      publish_dialog:{
        show: false,
        title: '应用发布'
      },
      columns: [
        {
          title: 'ID',
          key: 'id',
          sortable: true,
          sortType: 'desc',
          width: 70,
          align: 'center',
        },
        {
          title: '应用名称', 
          key: 'name', 
          sortable: true,
          align: 'center',
          // render: (h, params) => {
          //   //return h('router-link', {props:{to:'/project/publish/'+params.row.id+ '/'}}, params.row.name)
          //   return h('router-link', {props:{to:'/publish/'}}, params.row.name)
          // }
        },
        {
          title: '应用端口', 
          key: 'port', 
          sortable: true,
          align: 'center',
        },
        {
          title: 'Git仓库', 
          key: 'git_url', 
          sortable: true,
          align: 'center',
        },
        // {
        //   title: '状态', 
        //   key: 'status',
        //   width: 150,
        //   align: 'center',
        //   sortable: true,
        //   render: (h, params) => {
        //     let status = params.row.status
        //     if(status == 0){
        //       return h('div', [h(Tag,{props:{color:'warning'}}, '未发布')])
        //     }
        //     else if (status == 1) {
        //       return h('div', [h(Tag,{props:{color:'success'}}, '已发布')])
        //     }    
        //   }
        // },
        {title: '创建者', key: 'cuser', align: 'center',},
        {title: '创建时间', key: 'ctime', align: 'center',},
        // {title: '控制器', key: 'controller', editable: true},
        // {title: '副本数', key: 'replicas'},
        // {title: '运行时间', key: 'time'},
        // {title: '镜像', key: 'iamge', width: 200},
        
        {
          title: '操作',
          key: 'handle',
          width: 150,
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
                    //this.show(params.index)
                    this.handleEdit(params.index,params.row)
                  }
                }
              },'编辑'),
              h('Button', {
                  props: {
                      type: 'error',
                      size: 'small'
                  },
                  on: {
                      click: () => {
                          this.remove(params.index)
                          // vm.$emit('on-delete', params)
                          // vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                      }
                  }
              }, '删除')
              ])
            }
          ]
        },



      ],
      tableData: [],
      formData: {
          name: 'demo01',
          domain: 'demo01.xxx.com',
          port: '5000',
          env: [],
          owner: [],
          replicas: 2,
          desc: '这是一个测试demo',
          git_url: 'http://github.com//demo01.git',
          git_user: 'xxx',
          git_pwd: '123456',
          // cuser_id: this.$store.getters.user.id
          cuser_id: '2' 
      }
    }
  },
  methods: {
    handleDelete (params) {
      console.log(params)
    },
    show (index) {
      this.$Modal.info({
          title: '开始发布',
          content: `项目名称：${this.tableData[index].name}<br>运行时间：${this.tableData[index].time}<br>镜像：${this.tableData[index].iamge}`
      })
    },
    remove (index) {
      this.tableData.splice(index, 1);
    },
    // 弹出对话框
    showModal () {
      this.dialog.show = true
    },
    // 新增
    handleAdd() {
      this.dialog = {
        show: true,
        title: '新建项目',
        option: 'add'
      }
    },
    // 编辑
    handleEdit(index,row) {
      this.dialog = {
        show: true,
        title: '编辑项目',
        option: 'edit'
      };
      this.formData= {
          name: row.name,
          domain: row.domain,
          port: row.port,
          env: row.env,
          owner: row.owner,
          replicas: row.replicas,
          desc: row.desc,
          git_url: row.git_url,
          git_user: row.git_user,
          git_pwd: row.git_pwd,
          id: row.id
      }
    },
    getData(){
      //获取数据
      getTableData().then(res => {
        // console.log('tableData==>')
        // console.log(res)
        this.tableData = res.data.data
      })
    },
    closeModal(){
      //关闭modal
      this.dialog.show = false
    }
  },
  mounted () {
    /** 获取表格数据 **/
    this.getData()
    //console.log('get user->'+ this.$store.getters.user.id)
  }
}
</script>
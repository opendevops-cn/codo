<template>
  <div>
    <Card>
      <tables border ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete">
        <!-- <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button> -->
        <div slot="new_btn" class="search-col">
          <Button type="info" class="search-btn"  @click="handleAdd">新建项目</Button>
        </div>
      </tables>
    </Card>
    <Modal width="600px;" v-model="dialog.show"  :title="dialog.title" :loading=true :footer-hide=true> 
        <!-- <form-group :list="formList"  @on-submit-success="handleSubmit"></form-group> -->
        <Add :dialog="dialog" :formData="formData" @e-update="getData" @e-close="closeModal"></Add>
    </Modal>
    <Publish :dialog="publish_dialog" :formData="publishFormData" @e-close="closePublishModal"></Publish>
    <copyRight> </copyRight>
    
  </div>
</template>

<script>
import {Tag} from 'iview'
import copyRight from '@/components/public/copyright'
import Tables from '_c/tables'
import Add from './Add'
import Publish from './Publish'
// import { getTableData } from '@/api/data'
import { getTableData } from '@/api/k8s/project.js'
export default {
  name: 'list',
  components: {
    copyRight,
    Tables,
    Tag,
    Add,
    Publish
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
        title: '项目发布'
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
          title: '项目名称', 
          key: 'name', 
          sortable: true,
          align: 'center',
          render: (h, params) => {
            //return h('router-link', {props:{to:'/project/publish/'+params.row.id+ '/'}}, params.row.name)
            return h('router-link', {props:{to:'/k8s/publish/'}}, params.row.name)
          }
        },
        {
          title: '状态', 
          key: 'status',
          width: 150,
          align: 'center',
          sortable: true,
          render: (h, params) => {
            let status = params.row.status
            if(status == 0){
              return h('div', [h(Tag,{props:{color:'warning'}}, '未发布')])
            }
            else if (status == 1) {
              return h('div', [h(Tag,{props:{color:'success'}}, '已发布')])
            }    
          }
        },
        {title: '创建者', key: 'cuser', align: 'center',},
        {title: '创建时间', key: 'ctime', align: 'center',},
        // {title: '控制器', key: 'controller', editable: true},
        // {title: '副本数', key: 'replicas'},
        // {title: '运行时间', key: 'time'},
        // {title: '镜像', key: 'iamge', width: 200},
        {
          title: '发布管理',
          key: 'handle',
          width: 200,
          align: 'center',
          // options: ['delete'],
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
                    this.handlePublish(params.row)
                  }
                }
              },'发布'),
              // h('Button', {
              //     props: {
              //         type: 'warning',
              //         size: 'small'
              //     },
              //     style: {
              //       marginRight: '5px'
              //     },
              //     on: {
              //         click: () => {
              //             vm.$emit('on-delete', params)
              //             vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
              //         }
              //     }
              // }, '回滚'),
              h('Button', {
                  props: {
                      type: 'warning',
                      size: 'small',
                      loading: this.loading                      
                  },
                  on: {
                      click: () => {
                          this.loading = true
                          this.remove(params.index)
                          //this.loading = false
                          
                          // vm.$emit('on-delete', params)
                          // vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                      }
                  }
              }, '下架')
              ])
            }
          ]
        },
        
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
          name: '测试项目',
          //env: [],
          owner: [],
          desc: '这是一个测试demo',
          cuser_id: '2' ,
          app: []
      },
      publishFormData: {
          project_id: '',
          project_name: '',
          // env_id: 1,
          // env_list: [],
          review_user_id: '',
          owner_list:[],
          submit_user_id:'2',
          // submit_user: this.$store.getters.user.id
          desc: ''
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
      this.$refs.childAdd.parentHandleclick()
      this.dialog = {
        show: true,
        title: '编辑项目',
        option: 'edit'
      };
      this.formData= {
          name: row.name,
          domain: row.domain,
          port: row.port,
          //env: row.env,
          owner: row.owner,
          app: row.app,
          replicas: row.replicas,
          desc: row.desc,
          git_url: row.git_url,
          git_user: row.git_user,
          git_pwd: row.git_pwd,
          id: row.id
      }
    },
    // 发布
    handlePublish(row){
      this.publish_dialog= {
        show: true,
        title: '【'+ row.name + '】发布'
      };
      this.publishFormData.project_id = row.id
      this.publishFormData.project_name = row.name
      this.publishFormData.owner_list = row.owner_list
      //this.publishFormData.env_list = row.env_list
      this.publishFormData.app_list = row.app_list
      this.publishFormData.app = row.app
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
    },
    closePublishModal(){
      this.publish_dialog.show = false
    }
  },
  mounted () {
    /** 获取表格数据 **/
    this.getData()
    //console.log('get user->'+ this.$store.getters.user.id)
  }
}
</script>
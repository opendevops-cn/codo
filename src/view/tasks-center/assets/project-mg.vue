<template>
  <Card>

    <Alert show-icon>提示：此次为全局资源组</Alert>
      <div class="search-con">
        <ButtonGroup class="search-btn">
            <Button  @click="handlerAddProject" >新建项目</Button>
        </ButtonGroup>
      </div>
    <Table  size="small" :columns="projectColumns" :data="projectData"/>
    
    <div>
       <Modal width="680px;" v-model="modalData.show" :title="modalData.title" :footer-hide=true>

        <Form ref="formInline" :model="formInline" :rules="formRule" :label-width="100" :label-colon=true>
          <FormItem  label="名称" prop="project_name">
            <Input type="text" v-model="formInline.project_name" :maxlength='20' placeholder="记录值" ></Input>
          </FormItem>

          
            <FormItem label="代号" prop="project_code">
              <Input type="text" v-model="formInline.project_code" :maxlength='20' placeholder="记录值" ></Input>
            </FormItem>

          <FormItem>
            <Button type="primary" @click="handlerSubmit('formInline')" :loading="btnLoading">提交</Button>
            <Button style="margin-left: 8px" @click="handlerReset('formInline')">重置</Button>
          </FormItem>
        </Form>

      </Modal>
    </div>
  </Card>
</template>

<script>
import {getServerlist, operationServer, getProjectlist,operationProjectlist, getProjecttree, getProjectResource, getProjec11tlist} from '@/api/task-other'
import { getuserlist } from '@/api/user'
export default {
    name: '',
    data() {
      return {
        btnLoading: false,
        modalData: {
          show: false,
          title: '添加项目/业务线',
        },
        formInline: {
            project_name: '',
            project_code: '',
            admin_user: ''
        },
        formRule: {
          project_name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          project_code: [{ required: true, message: '代号不能为空', trigger: 'blur' }],
        },
        projectData: [],
        allUser:[], //所有用户
        projectColumns: [
          { title: '名称', key: 'project_code', width: 150},
          { title: '代号', key: 'project_name', width: 150},
          { title: '管理员', key: 'admin_user',  minWidth: 250,
              render: (h, params) => {
              return h(
                'Select',
                {
                  props: {
                    value: this.projectData[params.index].admin_user.length > 0 ? this.projectData[params.index].admin_user : [],
                    // size: 'small',
                    multiple: true,
                    filterable: true,
                    transfer: true
                  },
                  on: {
                    'on-change': event => {
                      let the_user_list = this.projectData[params.index].admin_user.length > 0  ? this.projectData[params.index].admin_user : []
                      this.handlerChangeProjectUser(event, the_user_list, params.row.project_id, 'admin_user')
                    }
                  }
                },
                this.allUser.map(item => {
                  return h('Option', {
                    props: {
                      value: item.nickname,
                      label: item.nickname
                    }
                  })
                })
              )
            }  
          },
          { title: '运维人员', key: 'operations',  minWidth: 250,
              render: (h, params) => {
              return h(
                'Select',
                {
                  props: {
                    value: this.projectData[params.index].operations.length > 0 ? this.projectData[params.index].operations : [],
                    // size: 'small',
                    multiple: true,
                    filterable: true,
                    transfer: true
                  },
                  on: {
                    'on-change': event => {
                      let the_user_list = this.projectData[params.index].operations.length > 0  ? this.projectData[params.index].operations : []
                      this.handlerChangeProjectUser(event, the_user_list, params.row.project_id, 'operations')
                    }
                  }
                },
                this.allUser.map(item => {
                  return h('Option', {
                    props: {
                      value: item.nickname,
                      label: item.nickname
                    }
                  })
                })
              )
            }  
          },
          { title: '其他人员', key: 'user_list',    minWidth: 250,
            render: (h, params) => {
            return h(
              'Select',
              {
                props: {
                  value: this.projectData[params.index].user_list.length > 0 ? this.projectData[params.index].user_list : [],
                  // size: 'small',
                  multiple: true,
                  filterable: true,
                  transfer: true
                },
                on: {
                  'on-change': event => {
                    let the_user_list = this.projectData[params.index].user_list.length > 0 ? this.projectData[params.index].user_list : []
                    this.handlerChangeProjectUser(event, the_user_list, params.row.project_id,'user_list')
                  }
                }
              },
              this.allUser.map(item => {
                return h('Option', {
                  props: {
                    value: item.nickname,
                    label: item.nickname
                  }
                })
              })
            )
          }  
          },
        ] ,
    }
    
  },
  methods: {
    // 查询项目
    handlerGetProjectList() {
      getProjectlist().then(res => {
          if (res.data.code === 0) {
            this.projectData= res.data.data
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
      })
    },
     // 查询项目
    handlerGetProjectList1() {
      getProjec11tlist().then(res => {
          if (res.data.code === 0) {
            console.log(res.data.data)
            // this.projectData= res.data.data
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
      })
    },
    handlerAddProject() {
      this.modalData.show = true
    },
    //
    handlerChangeProjectUser(new_value, value, project_id, user_type) {
      if (new_value.join(",") != value.join(",")) {
        let user_list =  new_value? new_value.join(",") :'' 
        operationProjectlist({user_list, project_id, user_type}, 'put').then(
          res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`);
            } else {
              this.$Message.error(`${res.data.msg}`);
            }
          }
        );
      }
    },
    // 获取用户列表
    getUserList () {
      //大于200时候则会返回全部数据
      getuserlist(1, 300).then(res => {
        if (res.data.code === 0) {
          this.allUser = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handlerSubmit(name) {
      this.btnLoading = true
      this.$refs[name].validate((valid) => {
        if (valid) {
          setTimeout(() => {
            operationProjectlist(this.formInline, 'post').then(res => {
              if (res.data.code == 0) {
                this.modalData = this.$options.data().modalData
                this.$Message.success(res.data.msg)
                this.handlerGetProjectList()
              } else {
                  this.$Message.error({
                      content: JSON.stringify(res.data.msg),
                      duration: 5
                  })
              }
              this.btnLoading = false
              })
              .catch(error => {
                this.btnLoading = false
                this.$Message.error({
                    content: '请求数据出错',
                    duration: 10
                })
            })
          }, 2000)
        } else {
            this.btnLoading = false
            this.$Message.error('表单校验不通过!');
        }
      })
    },
    handlerReset() {
      this.btnLoading = false
      this.formInline = this.$options.data().formInline
    },
  },
  watch:{
  },
  mounted(){
    this.handlerGetProjectList()
    this.handlerGetProjectList1()
    this.getUserList()
  }
}
</script>
<style lang="less" scoped>
  .search-con {
    padding: 6px 0;
    .search {
      &-col {
        display: inline-block;
        width: 160px;
      }
      &-input {
        display: inline-block;
        width: 300px;
        margin-left: 1px;
      }
      &-input-long {
        display: inline-block;
        width: 480px;
        margin-left: 1px;
      }
      &-btn {
        margin-left: 2px;
      }
    }
  }
</style>
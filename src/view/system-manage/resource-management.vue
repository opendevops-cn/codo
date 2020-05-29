<template>
  <Card>

    <Alert show-icon>
      <h2>资源管理（Resource Management）</h2><br>
      <p> 资源管理服务包含一系列支持企业IT治理的资源管理产品集合，主要包括资源组、资源目录。通过资源管理服务，您可以按照业务需要搭建合适的资源组织关系，使用目录、资源夹、账号以及资源组，分层次地组织和管理您的资源。</p>
      <p> 此处只提供全局资源组的信息，其他组件可以从这里获取划分的基础信息。</p><br>


      <h3>资源目录（全局唯一）待完善</h3><br>
      <p>建立一套与您的企业相关的，基于资源使用的关系结构。资源目录具有全局一致性的特点，方便您基于此关系结构，对企业内多个应用服务所对应的各种资源进行高效的规划、构建和管理。</p><br>

      <h3>资源组（全局唯一）</h3><br>
      <p>1、对多个云厂商多个云账号下多个地域、多种云资源进行集中的分组管理。</p>
      <p>2、为每个资源组设置管理员，资源组管理员可以独立管理资源组内的所有资源。</p>
      <p>3、获取云厂商的资源可以根据厂商划分的项目/资源/标签 等自动划分进资源组</p>
      <p>4、后续可以按资源组维度查看您的账单消费数据，以解决不同业务的成本分摊问题。</p>

    </Alert>


      <div class="search-con">
        <ButtonGroup class="search-btn">
            <Button  @click="handlerAddResource" >新建资源组</Button>
        </ButtonGroup>
      </div>
    <Table  size="small" :columns="resourceColumns" :data="tableData"/>
    
    <div>
       <Modal width="680px;" v-model="modalData.show" :title="modalData.title" :footer-hide=true>

        <Form ref="formInline" :model="formInline" :rules="formRule" :label-width="100" :label-colon=true>
          <FormItem  label="资源组名称" prop="name">
            <Input type="text" v-model="formInline.name" :maxlength='20' placeholder="资源组名称" ></Input>
          </FormItem>

          
          <FormItem label="资源组标识" prop="code">
            <Input type="text" v-model="formInline.code" :maxlength='20' placeholder="资源组标识" ></Input>
          </FormItem>

          <FormItem label="企业主体" prop="entity">
            <Input type="text" v-model="formInline.entity" :maxlength='100' placeholder="关联的企业主体" ></Input>
          </FormItem>

         <FormItem label="可扩展目录"  prop="expand">
          <Select v-model="formInline.expand"  placeholder="请选择关联的标签">
            <Option value="no">否</Option>
            <Option value="yes">是 </Option>
          </Select>
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
import { mapState, mapActions, mapGetters } from 'vuex'
import {optResource} from '@/api/mg/resource-mg'
import { getuserlist } from '@/api/user'
export default {
    name: '',
    data() {
      return {
        btnLoading: false,
        modalData: {
          show: false,
          title: '添加资源组/业务线',
        },
        formInline: {
            name: '',
            code: '',
            entity:'',
            expand: 'no'
        },
        formRule: {
          name: [{ required: true, message: '资源名称不能为空', trigger: 'blur' }],
          code: [{ required: true, message: '资源代号不能为空', trigger: 'blur' }],
          expand: [{ required: true, message: '不能为空', trigger: 'blur' }],
        },
        tableData: [],
        allUser:[], //所有用户
        resourceColumns: [
          { title: '资源组名称', key: 'name', width: 150},
          { title: '资源组标识', key: 'code', width: 150},
          { title: '资源ID', key: 'resource_id', minWidth: 150, maxWidth: 230},
          {
            title: '可扩展目录',
            key: 'expand',
            width: 120,
            render: (h, params) => {
                let expand = params.row.expand
                if (expand == 'yes' ) {
                  return h('div', [
                    h('Tag', { props: { color: 'green' } }, '是')
                  ])
                } else if (expand == 'no' ) {
                  return h('div', [
                    h('Tag', { props: { color: 'blue' } }, '否')
                ])
                }else{ return h('div', [ h('Tag', { props: { color: 'error' } }, expand)]) }
              }
          },
          // { title: '状态', key: 'state', width: 100},
          { title: '资源管理员', key: 'user_list', minWidth: 250,
            render: (h, params) => {
            return h(
              'Select',
              {
                props: {
                  // value: this.projectData[params.index].user_list.length > 0 ? this.projectData[params.index].user_list : [],
                  value: params.row.user_list.length > 0 ? params.row.user_list : [],
                  // size: 'small',
                  multiple: true,
                  filterable: true,
                  transfer: true
                },
                on: {
                  'on-change': event => {
                    let user_list = params.row.user_list.length > 0 ? params.row.user_list : []
                    this.handlerChangeUser(event, user_list, params.row.id)
                  }
                }
              },
              this.allUser.map(item => {
                return h('Option', {
                  props: {
                    value: item.user_id,
                    label: item.nickname
                  }
                })
              })
            )
          }  
        },
        {
          title: '#',
          key: 'handle',
          width: 130,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.handlerEdit(params.row)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.handlerDelete(params)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ] ,
    }
    
  },
  methods: {
     ...mapActions([
       'handleGetResourceList'
    ]),
    handlerGetResourceList() {
      this.handleGetResourceList().then(res => {
          if (res.code === 0) {
            this.tableData= res.data
          } else {
            this.$Message.error(`${res.msg}`)
          }
      })
    },

    handlerAddResource() {
      this.modalData = {
          show: true,
          title: '添加资源组/业务线',
          action: 'post'
       }
    },
    //
    handlerChangeUser(new_value, value, id) {
      if (new_value.join(",") != value.join(",")) {
        let user_list =  new_value ? new_value : []
        optResource({user_list, id}, 'patch').then(
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
    handlerGetUserList () {
      //大于200时候则会返回全部数据
      getuserlist(1, 300).then(res => {
        if (res.data.code === 0) {
          this.allUser = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handlerDelete(params) {
      optResource({id: params.row.id}, 'delete').then(res => {
        if (res.data.code == 0) {
          this.$Message.success(res.data.msg)
          this.tableData.splice(params.index, 1)
        } else {
            this.$Message.error({
                content: JSON.stringify(res.data.msg),
                duration: 5
            })
        }
        this.btnLoading = false
      })
    },
    handlerEdit(paramsRow) {
       this.modalData = {
          show: true,
          title: '编辑资源组/业务线',
          action: 'put'
       }
       this.formInline = paramsRow
    },
    handlerSubmit(name) {
      this.btnLoading = true
      this.$refs[name].validate((valid) => {
        if (valid) {
          setTimeout(() => {
            optResource(this.formInline, this.modalData.action).then(res => {
              if (res.data.code == 0) {
                this.modalData = this.$options.data().modalData
                this.$Message.success(res.data.msg)
                this.handlerGetResourceList()
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
  computed: {
    ...mapState({
      rules: state => state.user.rules,
      resourceGroupTAG: state => state.app.resourceGroupTAG,
      allResourceGroup: state => state.app.allResourceGroup,
      resourceGroupDir: state => state.app.resourceGroupDir,
    })
  },
  watch:{
    // resourceGroupTAG(value) {
    //   console.log('resourceGroupTAG',value)
    // },
    // allResourceGroup(value) {
    //   console.log('allResourceGroup',value)
    // },
    // resourceGroupDir(value) {
    //   console.log('resourceGroupDir',value)
    // }
  },
  mounted(){
    this.handlerGetResourceList()
    this.handlerGetUserList()
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
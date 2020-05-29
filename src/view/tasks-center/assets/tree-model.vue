<template>
<div style="height:100%; padding: 0px;background: #f8f8f9">
  <Card >
    <!-- <Divider dashed /> -->
     <Row>
        <Col :xs="23" :sm="23" :md="9" :lg="8" :xl="7" :xxl="6">
           <Tree :data="treeData" :render="renderContent"/>
        </Col>

        <Col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" :xxl="1">
          <div style="border-left: solid 1px #ccc; margin-bottom: 100px; width: 1px; height: 500px;"></div>
        </Col>

        <Col :xs="24" :sm="24" :md="14" :lg="15" :xl="16" :xxl="17">
            <div class="search-con">
                <Input class="search-input" v-model="searchValue" clearable  placeholder="输入名称进行搜索"/>
                <ButtonGroup class="search-btn">
                    <Button :loading="btnLoading" :disabled="btnDisabled" >批量移除</Button>
                    <Button :loading="btnLoading" :disabled="btnDisabled" >批量关联</Button>
                    <Button :loading="btnLoading" :disabled="btnDisabled" >删除</Button>
                </ButtonGroup>
            </div>
          <div>
            <Table size="small"  ref="selection" :columns="tableColumns" :data="tableData"   @on-selection-change="handleSelectResource"/>
            <div style="margin: 10px; overflow: hidden">
              <div style="float: left;">
                <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[10,15,20,50,100,1000] show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"> </Page>
              </div>

            </div>
          </div>
        </Col>
    </Row>
   
  </Card>
</div>
</template>

<script>
  import { getProjectlist,operationProjectlist, getProjecttree, getProjectResource } from '@/api/task-other'
  export default {
    name: '',
    data() {
      return {
        btnLoading: false,
        btnDisabled: true,
         // 分页
        pageTotal: 0, // 数据总数
        pageNum: 1, // 当前页码
        pageSize: 10, // 每页条数
        selectProject: '',
        searchType: 'server', //默认查询server
        searchValue:'', //资源查询
        searchVal:'', 
        selectList: [],
        tableColumns: [ 
          { type: 'selection', key: 'id', width: 60},
          { title: '主机名', key: 'hostname', minWidth: 200},
          { title: 'IP', key: 'ip',  minWidth: 150},
          { title: '区域', key: 'region', align: 'center', minWidth: 100},
          { title: '状态', key: 'state', minWidth: 90, align: 'center'},
          { title: '#', key: 'handle', width: 100,
            render: (h, params) => {
              return h('div', [
                h(
                  'a',
                  {
                    props: {
                      type: 'success',
                      size: 'small'
                    },
                    style: {
                      marginRight: '10px'
                    },
                    on: {
                      click: () => {
                        this.handlerServer(params.row, 'put', '更新主机')
                      }
                    }
                  },
                  '详情'
                ),
                // h(
                //   'a',
                //   {
                //     props: {
                //       type: 'error',
                //       size: 'small'
                //     },
                //     on: {
                //       click: () => {
                //         this.handlerDeleteServer(params)
                //       }
                //     }
                //   },
                //   '移除'
                // )
              ])
            }
        }],
        projectList: [],
        projectData: [],
        buttonProps: {
                    type: 'text',
                    size: 'small',
                },
        tableData: [],
        treeData: [{
                    title: '项目',
                    expand: true,
                    render: (h, { root, node, data }) => {
                      return h('span', {
                        style: {
                                display: 'inline-block',
                                width: '100%'
                        }}, 
                        [ 
                          h( 'Select',
                        {
                          props: {
                            placeholder:"选择资源组/项目组/业务线",
                            value: this.selectProject,
                            transfer: true
                        },
                          style: 'width:225px',
                          on: {
                            'on-change': event => {
                               this.handlerChangeProject(event)
                            }
                          }
                        },
                          this.projectList.map(item => {
                            return h('Option', {
                              props: {
                                value: item,
                                label: item,
                              }
                            })
                          })
                          )]
                          );
                        },

                    }
              ]
        }
    },
    methods: {
      // 查询项目
      getProjectList() {
        getProjectlist().then(res => {
            if (res.data.code === 0) {
              this.projectData= res.data.data

              this.projectList = []
              res.data.data.forEach(element => {
                this.projectList.push(element.project_name)
              });
              this.selectProject= this.projectList[0]
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
        })
      },
      // 根据项目查询树
      getProjectTree(value) {
        getProjecttree(value).then(res => {
            if (res.data.code === 0) {
              this.treeData = res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
        })
      },
      // 根据树中的参数查询关联的资源 
      handlerGetProjectResource(project_name, environment, service) {
        getProjectResource(this.pageNum, this.pageSize,  project_name, environment, service, this.searchType,this.searchValue).then(res => {
            if (res.data.code === 0) {
              this.pageTotal = res.data.count
              this.tableData = res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
       })
      },

      handlerChangeProjectUser(new_value, value, project_id) {
        if (new_value.join(",") != value.join(",")) {
          let user_list = new_value.join(","); 
          operationProjectlist({user_list, project_id}, 'put').then(
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
      handlerChangeProject(value) {
           this.$Message.success(`你选择了-------${value}`)
           this.selectProject =value
           this.getProjectTree(value)
      },
       //
    handleSelectResource(val) {
      let SelectIdList = []
          val.forEach(item => {
            SelectIdList.push(item.id.toString())
          })
      this.selectList = SelectIdList
    },
      // 点击节点
      // handlerTreeChange(obj) {
      //   console.log(obj)
      //   if(obj.length !==0 ){
      //     const data = obj[0]
      //     // this.searchVal = null
      //     this.pageNum = 1
      //     console.log(data)
      //     this.$Message.success(`你选择了-------${data.title}`)
      //   }
      // },
      renderContent (h, { root, node, data }) {
                // console.log('root---',root)
                // console.log('node---',node.node.data_type)
                // console.log('data---',data.title)
                if (node.node && node.node.data_type == 'project') {
                  return h('span', {
                        style: {
                                display: 'inline-block',
                                width: '100%'
                        }},

                        [ 
                          h( 'Select',
                        {
                          props: {
                            placeholder:"选择资源组/项目组/业务线",
                            value: this.selectProject,
                            // size: 'small',
                            transfer: true
                        },
                          style: 'width:280px',
                          on: {
                            'on-change': event => {
                               this.handlerChangeProject(event)
                            }
                          }
                        },
                          this.projectList.map(item => {
                            return h('Option', {
                              props: {  value: item, label: item}
                            })
                          })
                      )]
                  );
                }
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: 'ios-paper'
                            },
                            style: {
                                marginRight: '10px'
                            },
                            nativeOn: {
                              click: () => {
                                if (data.parent == 'root') {
                                   this.handlerGetProjectResource(this.selectProject, data.title)
                                } else {
                                   this.handlerGetProjectResource(this.selectProject, data.parent ,data.title)
                                }
                              }
                            }
                        }),
                        h('span',{
                          on: {
                              click: () => {
                                 if (data.parent == 'root') {
                                   this.handlerGetProjectResource(this.selectProject, data.title)
                                } else {
                                   this.handlerGetProjectResource(this.selectProject, data.parent ,data.title)
                                }
                              }
                            }
                        }, data.title)
                    ]),
                     h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '10px'
                        }
                    }, [
                      h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-add'

                            }),
                            style: {
                                marginLeft: '10px'
                            },
                            on: {
                              click: () => { this.handlerNodeAdd(data) }
                                // click: () => {  this.$Message.success(`点击了-------加号${data.title},${data.data_type},${data.parent}`) }
                            }
                        }),
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-remove'
                            }),
                            on: {
                                click: () => { this.handlerNodeRemove(data) }
                            }
                        })
                    ])
                ]);
            },
      // // 获取用户列表
      // getUserList () {
      //   //大于200时候则会返回全部数据
      //   getuserlist(1, 300).then(res => {
      //     if (res.data.code === 0) {
      //       this.allUser = res.data.data
      //     } else {
      //       this.$Message.error(`${res.data.msg}`)
      //     }
      //   })
      // },
      handlerNodeAdd(data){
        if (data.parent == 'root') {
          // 第二级
          this.$Message.success(`点击了-------第二级+号${data.title},${data.data_type},${data.parent}`)
        } else {
          this.$Message.success(`点击了-------第三级+号${data.title},${data.data_type},${data.parent}`) 
        }
      },
      handlerNodeRemove(data){
        if (data.parent == 'root') {
          // 第二级
          this.$Message.success(`点击了-------第二级-号${data.title},${data.data_type},${data.parent}`)
        } else {
          this.$Message.success(`点击了-------第三级-号${data.title},${data.data_type},${data.parent}`) 
        }
      },
      //添加资源
      handlerAddResources(){

      },
      //添加节点
      handlerAddNode(){

      },
      //删除资源
      handlerMoveResources(){

      },
      //删除节点
      handlerMoveNode(){

      },
      //
      changePage (value) {
        this.pageNum = value
      },
      handlePageSize(value){
        this.pageSize = value
      },
    },
    watch:{
      searchVal (val) {
      },
      selectList (val) {
        if (this.selectList.length > 0) {
          this.btnDisabled = false
        } else {
          this.btnDisabled = true
        }
      },
      selectProject(val){
        this.getProjectTree(val)
      }
    },
    mounted(){
      // this.getServerList()
      this.getProjectList()
      // this.getUserList()
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
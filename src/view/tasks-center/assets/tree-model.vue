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
                <Input v-if="!isMore" class="search-input" v-model="searchVal2" clearable  placeholder="输入名称进行搜索"/>
                <ButtonGroup class="search-btn">
                    <Button v-if="isMore">新建业务</Button>
                    <Button v-if="isMore">手动关联</Button>
                    <Button v-if="isMore">自动关联</Button>
                    <Button v-if="!isMore">配置</Button>
                    <Button @click="handlerGetMore">管理</Button>
                </ButtonGroup>
            </div>
          <div v-if="isMore">
              <Table  size="small" :columns="projectColumns" :data="projectData"/>
          </div>
          <div  v-else>
            <Table size="small" :columns="tableColumns" :data="tableData"/>
            <div style="margin: 10px; overflow: hidden">
                <div style="float: left;">
                    <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[10,15,20,50,100,1000] show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize">
                    </Page>
                </div>
            </div>
          </div>
        </Col>
    </Row>
   
  </Card>
</div>
</template>

<script>
  import {getServerlist, operationServer, getProjectlist,operationProjectlist, getProjecttree} from '@/api/task-other'
  import { getuserlist } from '@/api/user'
  // import { getServerlist } from '@/api/assets/server.js'
  // import { getProjectlist, getProjecttree } from '@/api/assets/business.js'
  export default {
    name: '',
    data() {
      return {
         // 分页
        pageTotal: 0, // 数据总数
        pageNum: 1, // 当前页码
        pageSize: 10, // 每页条数
        searchVal:'', 
        searchVal2:'',
        isMore: false,
        // model1: '',
        allUser:[], //所有用户
        tableColumns: [ 
          { type: 'selection', key: 'id', width: 60},
          { title: '主机名', key: 'hostname', minWidth: 200},
          { title: 'IP', key: 'private_ip',  minWidth: 150},
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
                  '更新'
                ),
                h(
                  'a',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.handlerDeleteServer(params)
                      }
                    }
                  },
                  '删除'
                )
              ])
            }
        }],
        projectList: [],
        projectColumns: [
          { title: '名称', key: 'project_name', width: 150},
          { title: '代号', key: 'project_code', width: 150},
          { title: '人员', key: 'user_list',  minWidth: 300,
            render: (h, params) => {
            return h(
              'Select',
              {
                props: {
                  value: this.projectData[params.index].user_list,
                  // size: 'small',
                  multiple: true,
                  filterable: true,
                  transfer: true
                },
                on: {
                  'on-change': event => {
                    let the_user_list = this.projectData[params.index].user_list
                    this.handlerChangeProjectUser(event, the_user_list, params.row.project_id)
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
          // { title: '#',  key: 'action', minWidth: 110}
        ] ,
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
                            // value: this.model1,
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
      getServerList() {
        getServerlist(this.pageNum, this.pageSize, this.searchValue).then(res => {
            if (res.data.code === 0) {
            this.pageTotal = res.data.count
            this.tableData = res.data.data
            } else {
            this.$Message.error(`${res.data.messages}`)
            }
        })
      },
      
      getProjectList() {
        getProjectlist().then(res => {
            if (res.data.code === 0) {
              this.projectData= res.data.data

              this.projectList = []
              res.data.data.forEach(element => {
                this.projectList.push(element.project_code)
              });
            } else {
              this.$Message.error(`${res.data.messages}`)
            }
        })
      },

      getProjectTree(value) {
        getProjecttree(value).then(res => {
            if (res.data.code === 0) {
              console.log(res.data.data)
              this.treeData = res.data.data
            } else {
              this.$Message.error(`${res.data.messages}`)
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
           this.getProjectTree(value)
      },
      handlerGetMore(){
        this.isMore = !this.isMore
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
                            value: this.model1,
                            // size: 'small',
                            transfer: true
                        },
                          style: 'width:250px',
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
                                this.$Message.success(`点击了-------${data.title},${data.data_type}${data.parent}`)
                              }
                            }
                        }),
                        h('span',{
                          on: {
                              click: () => {
                                 this.$Message.success(`点击了-------${data.title},${data.data_type}${data.parent}`)
                              }
                            }
                        }, data.title)
                    ]),
                     h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px'
                        }
                    }, [
                      h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-add'
                            }),
                            on: {
                                click: () => {  this.$Message.success(`点击了-------${data.title},${data.data_type}${data.parent}`) }
                            }
                        }),
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-remove'
                            }),
                            on: {
                                click: () => {  this.$Message.success(`点击了-------${data.title},${data.data_type}${data.parent}`) }
                            }
                        })
                    ])
                ]);
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
      searchVal2 (val) {
        if (val.length > 3) {
          this.$Message.success(`你搜索了-------${val}`)
        }
      }
    },
    mounted(){
      this.getServerList()
      this.getProjectList()
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
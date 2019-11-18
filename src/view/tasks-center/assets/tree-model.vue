<template>
  <Card style="height:100%; padding: 0px;background: #f8f8f9">
    <!-- <Divider dashed /> -->
     <Row>
        <Col :xs="23" :sm="23" :md="11" :lg="10" :xl="9" :xxl="6">
           <Tree :data="treeData"  @on-select-change="handlerTreeChange" getSelectedNodes/>
        </Col>

        <Col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" :xxl="1">
          <div style="border-left: solid 1px #ccc; margin-bottom: 100px; width: 1px; height: 650px;"></div>
        </Col>

        <Col :xs="24" :sm="24" :md="12" :lg="13" :xl="14" :xxl="17"  v-if="isMore">
          <div class="search-con">
            <Input class="search-input" v-model="searchVal2" clearable  placeholder="输入名称进行搜索"/>
            <ButtonGroup class="search-btn">
              <Button>新建项目</Button>
              <Button>手动关联</Button>
              <Button>自动关联</Button>
            </ButtonGroup>
          </div>

          <Table border size="small" :columns="projectColumns" :data="projectData"/>
        </Col>

        <Col :xs="24" :sm="24" :md="12" :lg="13" :xl="14" :xxl="17" v-else>
          <Table size="small" :columns="tableColumns" :data="tableData"></Table>
          <div style="margin: 10px; overflow: hidden">
            <div style="float: left;">
                <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[15,20,50,100,500] show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize">
                </Page>
            </div>
        </div>
        </Col>
    </Row>
   
  </Card>
</template>

<script>
  import {getServerlist, operationServer} from '@/api/task-other'
  import { getuserlist } from '@/api/user'
  export default {
    name: '',
    data() {
      return {
         // 分页
        pageTotal: 0, // 数据总数
        pageNum: 1, // 当前页码
        pageSize: 15, // 每页条数
        searchVal:'', 
        searchVal2:'',
        isMore: true,
        model1: '',
        allUser:[], //所有用户
        tableColumns: [ 
          { type: 'selection', key: 'id', width: 80},
          { title: '主机名', key: 'hostname', minWidth: 220},
          { title: 'IP', key: 'ip',  minWidth: 160},
          { title: '区域', key: 'region', align: 'center', minWidth: 120},
          { title: '状态', key: 'state', minWidth: 100, align: 'center'},
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
        projectList: ['神奇的老沈','神奇的老沈1','的','老', '沈'],
        projectColumns: [
          { title: '名称', key: 'the_name', width: 200},
          { title: '人员', key: 'the_admin',  minWidth: 300,
            render: (h, params) => {
            return h(
              'Select',
              {
                props: {
                  value: this.projectData[params.index].the_admin,
                  // size: 'small',
                  multiple:true,
                  filterable:true,
                  transfer: true
                },
                on: {
                  'on-change': event => {
                    console.log(event)
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
         projectData: [
          {
            the_admin: 'admin',
            the_name: '919526400000',
          },
          {
            the_admin: ['神奇的老沈','admin'],
            the_name: '696096000000',
          }
        ],
        tableData: [],
        treeData: [{
                    title: '项目',
                    expand: true,
                    render: (h, { root, node, data }) => {
                      return h('span', {
                        style: {
                                display: 'inline-block',
                                width: '100%'
                        }}, [ 
                          h('span', {
                                    style: {
                                        display: 'inline-block',
                                        float: 'right',
                                        marginRight: '30px'
                                    }
                                }, [
                                h('Button', {
                                        props: {
                                          // icon: 'ios-color-wand-outline',
                                          // type: 'primary'
                                        },
                                        style: {
                                            width: '60px'
                                        },
                                        on: {
                                            click: () => { this.handlerGetMore()}
                                        }
                                    },'更多')
                                ]),
                          h( 'Select',
                        {
                          props: {
                            placeholder:"请选择项目组/业务线",
                            value: this.model1,
                            // size: 'small',
                            transfer: true
                        },
                          style: 'width:230px',
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
                          )]);
                        },
                        children: [
                            {
                                title: '环境/集群',
                                expand: false,
                                children: [
                                    {
                                        title: '服务/模块/应用'
                                    },
                                    {
                                        title: 'mysql'
                                    }
                                ]
                            },
                            {
                                title: '测试环境',
                                expand: false,
                                children: [
                                    {
                                        title: 'leaf 1-2-1'
                                    },
                                    {
                                        title: 'leaf 1-2-1'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
      },
    methods: {
      getServerList(key, value) {
          getServerlist( this.pageNum, this.pageSize, key, value).then(res => {
            if (res.data.code === 0) {
              this.pageTotal = res.data.count
              this.tableData =  res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
      },
      
      handlerChangeProject(value) {
           this.$Message.success(`你选择了-------${value}`)
      },
      handlerGetMore(){
        this.isMore = !this.isMore
      },
      // 点击节点
      handlerTreeChange(obj) {
        console.log(obj)
        if(obj.length !==0 ){
          const data = obj[0]
          // this.searchVal = null
          this.pageNum = 1
          console.log(data)
          this.$Message.success(`你选择了-------${data.title}`)
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
        width: 350px;
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
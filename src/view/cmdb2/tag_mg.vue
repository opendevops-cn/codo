<template>
  <div>
  <Row :gutter="20">
    <!-- <i-col :md="24" :lg="5" style="margin-bottom: 20px;">
      <Card>
        <Tree ref="tree" :data="tagTreeData"  @on-select-change="handlerTreeChange" getSelectedNodes></Tree>
      </Card>
    </i-col>
    <i-col :md="24" :lg="19" style="margin-bottom: 20px;"> -->
      <Card shadow>
        <div class="search-con search-con-top">
            <Select
                v-model="searchKey"
                class="search-col"
            >
                <Option
                v-for="item in columns2"
                v-if="item.key !== 'handle' && item.key !== 'status' && item.key !== ''"
                :value="item.key"
                >{{ item.title }}</Option>
            </Select>
            <Input
                @on-change="handleClear"
                clearable
                placeholder="输入关键字搜索"
                class="search-input"
                v-model="searchValue"
            />
            <Button
                @click="handleSearch"
                class="search-btn"
                type="primary"
            >搜索</Button>
            <slot name="new_btn"><Button
            type="primary"
            @click="handlerTag('', 'post', '添加标签')"
            class="search-btn"
            >添加标签</Button></slot>
            <Button type="error" class="search-btn"  @click="handlerDelete">批量删除</Button>
        </div>

        <Table
        size="small"
        ref="selection"
        border
        :columns="columns2"
        :data="tableData"
        @on-selection-change="handleSelectChange"
         ></Table>

        <div style="margin: 10px; overflow: hidden">
          <div style="float: left;">
              <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[15,35,50,100] show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize">
              </Page>
          </div>
        </div>
      </Card>
    <!-- </i-col> -->
  </Row>
    <Modal v-model="modalMap2.modalVisible"  :title="modalMap2.modalTitle" :loading=true :footer-hide=true width="540" :mask-closable=false>
      <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate2" :label-width="85">
        <FormItem label="标签名称" prop="tag_name">
          <div  v-if="formValidate2.id">
            <Input v-model="formValidate2.tag_name" :maxlength="20" disabled placeholder='请输入标签名称'></Input>
          </div>
          <div v-else>
            <Input v-model="formValidate2.tag_name" :maxlength="20" placeholder='请输入标签名称'></Input>
          </div>
        </FormItem>
        <FormItem label="主机" prop="servers">
          <Select class="search-input-long" v-model="formValidate2.servers" filterable multiple placeholder="请选择关联的主机">
            <Option v-for="item in allServerList" :value="item.id" :key="item.hostname" >{{ item.hostname }}</Option>
          </Select>
        </FormItem>
        <FormItem label="数据库" prop="dbs">
          <Select class="search-input-long" v-model="formValidate2.dbs" filterable multiple placeholder="请选择关联的数据库">
            <Option v-for="item in allDBList" :value="item.id" :key="item.id" >{{ item.db_code }}</Option>
          </Select>
        </FormItem>
        <FormItem label="代理" prop="proxy_host">
          <Select v-model="formValidate2.proxy_host"  placeholder='请选择代理主机，通过代理主机访问数据库'>
            <Option v-for="item in allProxyList" :value="item.proxy_host" :key="item.id">{{ item.proxy_host }}</Option>
          </Select>
        </FormItem>
        <FormItem label="授权用户" prop="users">
          <Select class="search-input-long" v-model="formValidate2.users" filterable multiple placeholder="请选择关联的用户">
            <Option v-for="item in allUser" :value="item.nickname" :key="item.user_id" >{{ item.nickname }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmitTag('formValidate2')">提交</Button>
          <Button @click="handleReset('formValidate2')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
  import { getTagList, operationTag } from '@/api/cmdb2/tag.js'
  import { getServerList } from '@/api/cmdb2/server.js'
  import { getDBlist } from '@/api/cmdb2/db.js'
  import { getuserlist } from '@/api/user'

  export default {
    data () {
      return {
        // 分页
        pageTotal: 0, // 数据总数
        pageNum: 1, // 当前页码
        pageSize: 15, // 每页条数
        selectTwo: 'tag',
        selectTag: null,
        tagTreeData:[],
        searchVal:'',
        modalMap2: {
          modalVisible: false,
          modalTitle: '新建标签',
        },
        editModalData: null,
        tableData: [],
        tableDataServer: [],
        tableDataDB: [],
        //
        allServerList: [],
        allDBList: [],
        allUser:[],
        allTagList: [],
        allProxyList: [],
        tableSelectIdList: [],
        //
        searchKey: "",
        searchValue: "",
        formValidate2: {
          id: null,
          tag_name: '',
          dbs: [],
          servers: [],
          users:[],
          proxy_host:'',
        },
        serverTitle: ['可关联主机', '已关联'],
        dbTitle: ['可关联DB', '已关联'],

        ruleValidate2: {
          tag_name: [{ required: true, message: "标签名不能为空", trigger: "blur"}],
          users: [
          {
            required: true,
            type: 'array',
            message: "请选择授权用户",
            trigger: "change"
          }
        ]
        },

        columns2: [
        { type: 'selection', key: 'id', width: 80, align: 'center'},
        {
          title: '标签名称',
          key: 'tag_name',
          align: 'center',
          // render: (h, params) => {
          //   return h('div', [
          //     h('a',{
          //         on: {
          //           click: () => {
          //             this.$Message.error(`待完善`)
          //           }
          //         }
          //       },
          //       params.row.tag_name
          //     )
          //   ])
          // }
        },
        { title: '主机', key: 'server_len', align: 'center' },
        { title: '数据库', key: 'db_len', align: 'center' },
        { title: '操作', key: 'handle', width: 120, align: 'center',
          render: (h, params) => {
            return h('div', [
              h( 'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '2px'
                  },
                  on: {
                    click: () => {
                      this.handlerTag(params.row, 'put', '更新标签')
                    }
                  }
                },'更新'
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
                      this.handlerDeleteTag(params)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],

      }},
      methods: {
        // getTagTree (key) {
        //   getTagtree(key).then(res => {
        //     if (res.data.code === 0) {
        //       this.tagTreeData = res.data.data
        //     } else {
        //       this.$Message.error(`${res.data.msg}`)
        //     }
        //   })
        // },
        getTagList (key, value) {
          getTagList(this.pageNum, this.pageSize, key, value).then(res => {
            if (res.data.code === 0) {
               this.tableData = res.data.data
               this.pageTotal = res.data.count
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },
        getAllTagList () {
          getTagList(1, 888).then(res => {
            if (res.data.code === 0) {
              this.allTagList = res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },
        getServerList(key, value) {
          getServerList( this.pageNum, this.pageSize, key, value).then(res => {
            if (res.data.code === 0) {
              this.pageTotal = res.data.count
              this.tableDataServer =  res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },
        getAllServerList() {
          getServerList(1, 888).then(res => {
            if (res.data.code === 0) {
              this.allServerList =  res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },
        // 获取数据库
        // getDBList(key, value) {
        //   getDBlist( this.pageNum, this.pageSize, key, value).then(res => {
        //     if (res.data.code === 0) {
        //       this.pageTotal = res.data.count
        //       this.tableDataDB = res.data.data
        //     } else {
        //       this.$Message.error(`${res.data.msg}`)
        //     }
        //   })
        // },
        geALLDBList() {
          getDBlist(1, 888).then(res => {
            if (res.data.code === 0) {
              this.allDBList = res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },
        // 获取用户列表
        getUserList () {
          getuserlist(1, 2000).then(res => {
            if (res.data.code === 0) {
              this.allUser = res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },
        // getProxyList() {
        //   getProxylist().then(res => {
        //     if (res.data.code === 0) {
        //       this.allProxyList = res.data.data
        //     } else {
        //       this.$Message.error(`${res.data.msg}`)
        //     }
        //   })
        // },
        // 添加标签
        handlerTag(paramsRow, meth, mtitle){
          this.modalMap2.modalVisible = true
          this.modalMap2.modalTitle = mtitle
          this.editModalData = meth
          //
          this.geALLDBList()
          this.getAllServerList()
          this.getUserList()
          // this.getProxyList()
          if (paramsRow && paramsRow.id) {
            this.formValidate2 = {
              id: paramsRow.id,
              tag_name: paramsRow.tag_name,
              dbs: paramsRow.dbs,
              servers: paramsRow.servers,
              users: paramsRow.users,
              proxy_host: paramsRow.proxy_host,
            }
          }else{
            this.formValidate2 = {
              id: null,
              tag_name: '',
              dbs: [],
              servers: [],
              users:'',
              proxy_host:'',
            }
          }
        },
        closeTagModal () {
          // 关闭modal
          this.modalMap2.modalVisible = false
        },
        handlerDelete(){
          // console.log('长度',this.tableSelectIdList.length)
          if (this.tableSelectIdList.length > 3) {
            this.$Message.error(`批量删除最多三个`)
            return
          }
          if (this.tableSelectIdList.length > 0) {
            if(this.selectTwo === 'tag'){
              if (confirm(`确定要批量删除选中的标签`)) {
                operationTag({ 'id_list': this.tableSelectIdList }, 'delete').then(
                  res => {
                    if (res.data.code === 0) {
                      this.$Message.success(`${res.data.msg}`)
                      this.getTagList("tag_name", this.searchVal)
                    } else {
                      this.$Message.error(`${res.data.msg}`)
                    }
                  })
              }
            }
          }else {
            this.$Message.info(`你总要选中点什么吧`)
          }
        },
        //
        handleSubmitTag(value) {
          this.$refs[value].validate((valid) => {
            if (valid) {
              setTimeout(() => {
                operationTag(this.formValidate2, this.editModalData).then(
                  res => {
                    if (res.data.code === 0) {
                      this.$Message.success(`${res.data.msg}`);
                      this.getTagList('tag_name', this.searchVal);
                      // this.getTagTree()
                      this.modalMap2.modalVisible = false;
                    } else {
                      this.$Message.error(`${res.data.msg}`);
                    }
                  }
                );
              }, 1000);
            } else {
              this.$Message.error('表单校验错误');
            }
          })
        },
        handlerDeleteTag(params) {
          if (confirm(`确定要删除标签 ${params.row.tag_name}`)) {
            operationTag({ tag_id: params.row.id }, 'delete').then(
              res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.getTagList("tag_name", this.searchVal)
                } else {
                  this.$Message.error(`${res.data.msg}`)
                }
              })
          }
        },
        handleReset(name) {
          this.$refs[name].resetFields();
        },
        handlerCheck(){
          this.$Message.error(`待完善`)
        },
        // 翻页
        changePage (value) {
          this.pageNum = value
          if(this.selectTwo === 'tag'){
             if (this.searchValue) {
              this.getTagList("tag_name", this.searchValue)
            }else{
              this.getTagList()
            }
          }else if(this.selectTwo === 'DB'){
            if (this.searchValue) {
              this.getDBList(this.searchValue)
            } else if (this.selectTag) {
              this.getDBList("tag_name",this.selectTag)
            }else{
              this.getDBList()
            }
          }else if(this.selectTwo === 'server'){
            if (this.searchValue) {
              this.getServerList(this.searchValue)
            } else if (this.selectTag) {
              this.getServerList("tag_name",this.selectTag)
            }else{
              this.getServerList()
            }
          }
        },
        // 切换分页
        handlePageSize(value){
          this.pageSize = value
          this.pageNum = 1
          if(this.selectTwo === 'tag'){
            if (this.searchValue) {
              this.getTagList("tag_name", this.searchValue)
            }else{
              this.getTagList()
            }
          }else if(this.selectTwo === 'DB'){
            if (this.searchValue) {
              this.getDBList(this.searchValue)
            } else if (this.selectTag) {
              this.getDBList("tag_name",this.tag_name)
            }else{
              this.getDBList()
            }
          }else if(this.selectTwo === 'server'){
            if (this.searchValue) {
              this.getServerList(this.searchValue)
            } else if (this.selectTag) {
              this.getServerList("tag_name",this.tag_name)
            }else{
              this.getServerList()
            }
          }
        },
        handleClear(e) {
          if (e.target.value === "") this.tableData = this.value;
        },
        handleSearch() {
          this.getTagList(this.pageNum,this.pageSize,this.searchKey, this.searchValue);
        },
        // table 选中的ID
        handleSelectChange (val) {
          let SelectIdList = []
          val.forEach(item => {
            SelectIdList.push(item.id)
          })
          this.tableSelectIdList = SelectIdList
        },
        // 点击节点
        handlerTreeChange(obj) {
          if(obj.length !==0 ){
            const data = obj[0]
            this.searchVal = null
             this.pageNum = 1
            if(data.title === 'root'){
              this.selectTag = null
              this.selectTwo = 'tag'
              this.getTagList()
            }else if (data.tag_name && data.node ==='DB'){
              this.selectTwo = data.node
              this.selectTag = data.tag_name
              this.getDBList("tag_name", data.tag_name)
            }else if (data.tag_name && data.node ==='server'){
              this.selectTwo = data.node
              this.selectTag = data.tag_name
              this.getServerList("tag_name", data.tag_name)
            }else if(data.title === 'DB' && !data.node){
              this.selectTag = null
              this.selectTwo = data.title
              this.getDBList()
            }else if(data.title === 'server' && !data.node){
              this.selectTag = null
              this.selectTwo = data.title
              this.getServerList()
            }
          }
        },
    },
    watch:{
      // searchVal (val) {
      //   this.searchVal = val
      //   if(this.selectTwo === 'tag'){
      //     this.getTagList("tag_name", this.searchVal)
      //   }else if(this.selectTwo === 'DB'){
      //     this.getDBList(this.searchVal)
      //   }else if(this.selectTwo === 'server'){
      //     this.getServerList(this.searchVal)
      //   }
      // }
    },
    mounted(){
      // this.getTagTree()
      this.getTagList()

    }
  }
</script>
<style lang="less" scoped>
  .search-con {
    padding: 10px 0;
    .search {
      &-col {
        display: inline-block;
        width: 160px;
      }
      &-input {
        display: inline-block;
        width: 250px;
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

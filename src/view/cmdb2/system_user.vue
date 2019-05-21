<template>
  <Card>
  <Alert>一般来说系统用户只分为2个，一个是带有sudo权限的用户， 一个是默认普通用户，注意: 优先级数字越大的用户将会被首选为系统用户进行跳板</Alert>
    <div class="search-con search-con-top">
      <Select
        v-model="searchKey"
        class="search-col"
      >
        <Option
          v-for="item in columns"
          v-if="item.key !== 'handle' && item.key !== 'status' && item.key !== ''"
          :value="item.key"
          :key="`search-col-${item.key}`"
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
      <slot name="new_btn">
        <Button type="primary" @click="editModal('', 'post', '新建用户')" class="search-btn" >新建用户</Button>
        </slot>
    </div>
    <Table
      size="small"
      height="660"
      ref="selection"
      border
      :columns="columns"
      :data="tableData"
    ></Table>
        <Modal v-model="modalMap.modalVisible"  :title="modalMap.modalTitle" :loading=true :footer-hide=true width="540" :mask-closable=false>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="85">
        <FormItem label="名称" prop="name">
          <div  v-if="formValidate.id">
            <Input v-model="formValidate.name" :maxlength="20" disabled placeholder='请输入名称'></Input>
          </div>
          <div v-else>
            <Input v-model="formValidate.name" :maxlength="20" placeholder='请输入名称'></Input>
          </div>
        </FormItem>

        <FormItem label="系统用户" prop="system_user">
          <div  v-if="formValidate.id">
            <Input v-model="formValidate.system_user" :maxlength="20" disabled placeholder='请输入系统用户'></Input>
          </div>
          <div v-else>
            <Input v-model="formValidate.system_user" :maxlength="20" placeholder='请输入系统用户'></Input>
          </div>
        </FormItem>

        <FormItem label="优先级" prop="priority">
          <Input v-model="formValidate.priority" :maxlength="3"  placeholder='请输入优先级'></Input>
        </FormItem>

        <FormItem label="Shell" prop="bash_shell">
          <div  v-if="formValidate.id">
            <Input v-model="formValidate.bash_shell" :maxlength="300" disabled placeholder='请输入Shell'></Input>
          </div>
          <div v-else>
            <Input v-model="formValidate.bash_shell" :maxlength="300" placeholder='请输入Shell'></Input>
          </div>
        </FormItem>

        <!-- <FormItem label="Shell" prop="bash_shell">
          <Input v-model="formValidate.bash_shell" :maxlength="100"  placeholder='请输入Shell'></Input>
        </FormItem> -->
       <FormItem label="sudo权限" prop="sudo_list">
          <Input v-model="formValidate.sudo_list" :maxlength="300"  placeholder='请输入sudo权限'></Input>
        </FormItem>
        <FormItem label="关联用户" prop="platform_users">
          <Select class="search-input-long" v-model="formValidate.platform_users" filterable multiple placeholder="请选择关联的用户">
            <Option v-for="item in allUser" :value="item.nickname" :key="item.user_id" >{{ item.nickname }}</Option>
          </Select>
        </FormItem>
        <FormItem label="备注" prop="remarks">
          <Input v-model="formValidate.remarks" type="textarea" :autosize="{minRows: 2,maxRows: 10}" :maxlength="50" placeholder="简单描述下吧"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem> -->
    
<!-- 
        <FormItem label="主机" prop="servers">
          <Select class="search-input-long" v-model="formValidate.servers" filterable multiple placeholder="请选择关联的主机">
            <Option v-for="item in allServerList" :value="item.id" :key="item.hostname" >{{ item.hostname }}</Option>
          </Select>
        </FormItem>
        <FormItem label="数据库" prop="dbs">
          <Select class="search-input-long" v-model="formValidate.dbs" filterable multiple placeholder="请选择关联的数据库">
            <Option v-for="item in allDBList" :value="item.id" :key="item.id" >{{ item.db_code }}</Option>
          </Select>
        </FormItem>
        <FormItem label="代理" prop="proxy_host">
          <Select v-model="formValidate.proxy_host"  placeholder='请选择代理主机，通过代理主机访问数据库'>
            <Option v-for="item in allProxyList" :value="item.proxy_host" :key="item.id">{{ item.proxy_host }}</Option>
          </Select>
        </FormItem>
        <FormItem label="授权用户" prop="users">
          <Select class="search-input-long" v-model="formValidate.users" filterable multiple placeholder="请选择关联的用户">
            <Option v-for="item in allUser" :value="item.nickname" :key="item.user_id" >{{ item.nickname }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmitTag('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem> -->
      </Form>
    </Modal>

  </Card>
</template>

<script>
import FormGroup from "_c/form-group";
import { getSystemUserList, operationSystemUser } from "@/api/cmdb2/system_user";
import { getuserlist } from '@/api/user'

export default {
  components: {
    FormGroup
  },
  data() {
    return {
      columns: [
        {
          title: "ID",
          key: "id",
          align: "center",
          width: 100,
          sortable: true
        },
        {
          title: "名称",
          key: "name",
          align: "center",
          width: 200,
          // render: (h, params) => {
          //   return h('a', {
          //     on: {
          //       click: () => {
          //           this.handleDetail(params.row.user_key)
          //       }
          //     }
          //   }, params.row.admin_user
          //   )
          // }
        },
        {
          title: "系统用户",
          key: "system_user",
          align: "center",
          width: 200
        },
        // {
        //   title: "关联用户",
        //   key: "platform_users",
        //   align: "center",
        // },
        {
          title: "优先级",
          key: "priority",
          align: "center",
          width: 100
        },
        {
          title: "sudo权限",
          key: "sudo_list",
          align: "center",
        },
        {
          title: "备注",
          key: "remarks",
          align: "center",
        },
        {
          title: "操作",
          key: "handle",
          width: 180,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      this.editModal(params.row, "put", "编辑用户");
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.delData(params);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      ruleValidate: {
        // platform_users: [{ required: true, message: "请选择用户", trigger: "change"}],
        name: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur"
          }
        ],
        system_user: [
          {
            required: true,
            message: "系统用户不能为空",
            trigger: "blur"
          }
        ],
        sudo_list: [
          {
            required: true,
            message: "SUDO权限，如：/bin/su",
            trigger: "blur"
          }
        ],
        bash_shell: [
          {
            required: true,
            message: "新建用户的环境默认：/bin/bash，可登陆",
            trigger: "blur"
          }
        ],
      },
      formValidate: {
          id: null,
          name:'',
          system_user:'',
          priority:'10',
          sudo_list: '/bin/su',
          bash_shell:'/bin/bash',
          platform_users:'',
          remarks:'',
      },
      
      tableData: [],
      modalMap: {
        modalVisible: false,
        modalTitle: "新建"
      },
      modalMapCorrelation: {
        modalVisible: false,
        modalTitle: "关联用户"
      },
      // modalMapShow: {
      //   modalVisible: false,
      //   modalTitle: "用户密钥",
      //   user_key: '',
      // },
      // formList: [],
      editModalData: "",
      searchKey: "",
      searchValue: "",
      allUser: [], // 所有用户
    };
  },
  methods: {
    // 获取系统用户列表
    getSystemUserList (page, limit, key, value) {
        getSystemUserList(page, limit, key, value).then(res => {
            if (res.data.code === 0) {
            // this.$Message.success(`${res.data.msg}`)
            this.pageTotal = res.data.count
            this.tableData = res.data.data
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
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    // handleDetail (index) {
    //     this.$Modal.info({
    //         title: '用户信息',
    //         content: `<strong>名称</strong>：${this.tableData[index].name}<br><strong>用户名</strong>：${this.tableData[index].admin_user}<br><strong>用户密钥</strong>：${this.tableData[index].user_key}<br><strong>备注</strong>：${this.tableData[index].remarks}<br><strong>更新时间</strong>：${this.tableData[index].update_time}`
    //     })
    // },
    editModal(paramsRow, meth, mtitle) {
        this.modalMap.modalVisible = true;
        this.modalMap.modalTitle = mtitle;
        this.editModalData = meth;
        if (paramsRow && paramsRow.id) {
            // put
            this.getUserList()
            console.log('111',paramsRow)
            this.formValidate = {
                id: paramsRow.id,
                name: paramsRow.name,
                system_user: paramsRow.system_user,
                priority: paramsRow.priority,
                sudo_list: paramsRow.sudo_list,
                bash_shell: paramsRow.bash_shell,
                platform_users: paramsRow.platform_users,
                remarks: paramsRow.remarks,
            }
        } else {
            // post
            this.formValidate = {
                id: null,
                name:'',
                system_user:'',
                priority:'10',
                sudo_list: '/bin/su',
                bash_shell:'/bin/bash',
                platform_users:'',
                remarks:'',
            }
        }
      },
    handleSubmit (value) {
        this.$refs[value].validate((valid) => {
                    if (valid) {
                        setTimeout(() => {
                            operationSystemUser(this.formValidate, this.editModalData).then(res => {
                                if (res.data.code === 0) {
                                    this.$Message.success(`${res.data.msg}`)
                                    this.getSystemUserList(
                                    // this.pageNum,
                                    // this.pageSize,
                                    // this.searchKey,
                                    // this.searchValue
                                    )
                                    this.modalMap.modalVisible = false
                                } else {
                                    this.$Message.error(`${res.data.msg}`)
                                }
                            })
                        }, 1000)
                        // this.$Message.success('Success!');
                    } else {
                        this.$Message.error('缺少必要参数');
                    }
                })
            },
    // 删除
    delData(params) {
      if (confirm(`确定要删除 ${params.row.admin_user}`)) {
        operationSystemUser({ id: params.row.id }, "delete" ).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`);
            this.tableData.splice(params.index, 1);
          } else {
            this.$Message.error(`${res.data.msg}`);
          }
        });
      }
    },
    setDefaultSearchKey() {
      this.searchKey =
        this.columns[0].key && this.columns[0].key !== "handle"
          ? this.columns[0].key
          : this.columns.length > 1
            ? this.columns[1].key
            : "";
    },
    handleClear(e) {
      if (e.target.value === "") this.tableData = this.value;
    },
    handleSearch() {
      this.getSystemUserList(this.searchKey, this.searchValue);
    }
  },
//   watch: {
//     searchValue(val) {
//       this.getAdminUserList(this.searchKey, val);
//     }
//   },
  mounted() {
      this.getSystemUserList()
      this.setDefaultSearchKey()
      this.getUserList()
  }
};
</script>

<style lang="less" scoped>
.search-con {
  padding: 10px 0;
  .search {
    &-col {
      display: inline-block;
      width: 200px;
    }
    &-input {
      display: inline-block;
      width: 200px;
      margin-left: 2px;
    }
    &-btn {
      margin-left: 2px;
    }
  }
}
</style>

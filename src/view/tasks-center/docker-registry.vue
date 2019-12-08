<template>
  <Card style="height:100%">
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
      <Button  @click="handleSearch" class="search-btn">搜索</Button>
      <slot name="new_btn"><Button @click="editModal('', 'post', '新建项目')" class="search-btn" >新建项目</Button></slot>
    </div>
    <Table size="small" height="718" ref="selection" :columns="columns" :data="tableData"/>
    <Modal
      v-model="modalMap.modalVisible"
      :title="modalMap.modalTitle"
      :loading=true
      :footer-hide=true
    >
      <form-group
        :list="formList"
        @on-submit-success="handleSubmit"
      ></form-group>
    </Modal>
  </Card>
</template>

<script>
import FormGroup from '_c/form-group'
import { getDockerrepository, operationDockerrepository } from '@/api/task-other'
export default {
  components: {
    FormGroup
  },
  data () {
    return {
      columns: [
        {
          title: '项目名称',
          key: 'project_name',
          align: 'center',
          minWidth: 120,
          sortable: true
        },
        {
          title: '仓库地址',
          key: 'registry_url',
          minWidth: 120,
        },
        {
          title: '用户',
          key: 'user_name',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '#',
          key: 'handle',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'a',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$Message.error('镜像仓库不支持修改')
                      // this.editModal(params.index, "put", "编辑仓库");
                    }
                  }
                },
                '编辑'
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
                      this.delData(params)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      tableData: [],
      modalMap: {
        modalVisible: false,
        modalTitle: '新建'
      },
      formList: [],
      editModalData: '',
      //
      searchKey: '',
      searchValue: '',
      //
      theRepository: ''
    }
  },
  methods: {
    getDockerRepository (key, value) {
      getDockerrepository(key, value).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    editModal (index, meth, mtitle) {
      this.modalMap.modalVisible = true
      this.modalMap.modalTitle = mtitle
      this.editModalData = meth
      this.formList = [
        {
          name: 'project_name',
          type: 'i-input',
          label: '项目名称',
          maxlength: 20,
          placeholder: '请输入项目的名称',
          rule: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
        },
        {
          name: 'registry_url',
          type: 'i-input',
          maxlength: 100,
          label: '项目路径',
          placeholder:
            '请输入项目地址，例如：harbor.shinezone.com/shinezonetest/',
          rule: [
            {
              required: true,
              message: '镜像仓库项目地址不能为空',
              trigger: 'blur'
            }
          ]
        },
        {
          name: 'user_name',
          type: 'i-input',
          label: '账户名称',
          maxlength: 20,
          placeholder: '请输入访问的用户名',
          rule: [
            { required: true, message: '用户名称不能为空', trigger: 'blur' }
          ]
        },
        {
          name: 'password',
          type: 'i-input',
          label: '账户密码',
          maxlength: 80,
          placeholder: '请输入账户密码',
          rule: [
            { required: true, message: '账户密码不能为空', trigger: 'blur' }
          ]
        }
      ]
    },
    handleSubmit (value) {
      setTimeout(() => {
        operationDockerrepository(value.data, this.editModalData).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.getDockerRepository(this.searchKey, this.searchValue)
            this.modalMap.modalVisible = false
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }, 1000)
    },
    // 删除
    delData (params) {
      if (confirm(`确定要删除 ${params.row.project_name}`)) {
        operationDockerrepository(
          { repository_id: params.row.id },
          'delete'
        ).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.tableData.splice(params.index, 1)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }
    },
    setDefaultSearchKey () {
      this.searchKey =
        this.columns[0].key && this.columns[0].key !== 'handle'
          ? this.columns[0].key
          : this.columns.length > 1
            ? this.columns[1].key
            : ''
    },
    handleClear (e) {
      if (e.target.value === '') this.tableData = this.value
    },
    handleSearch () {
      this.getDockerRepository(this.searchKey, this.searchValue)
    }
  },
  watch: {
    searchValue (val) {
      this.getDockerRepository(this.searchKey, val)
    }
  },
  mounted () {
    this.getDockerRepository()
    this.setDefaultSearchKey()
  }
}
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

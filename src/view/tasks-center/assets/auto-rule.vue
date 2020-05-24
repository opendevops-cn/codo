<template>
  <Card>

    <Alert show-icon>小提示：1、关联规则可以根据hostname='ops-%'模糊匹配， 2、IP的子网网段。 自动关联到标签或者树上，此关联具有高优先级</Alert>
      <div class="search-con search-con-top">
        <ButtonGroup class="search-btn">
          <Button :loading="btnLoading" @click="handlerAddRule">添加记录</Button>
          <Button :loading="btnLoading">刷新规则</Button>
        </ButtonGroup>
      </div>
    <Table size="small" ref="selection" :columns="columns" :data="tableData" ></Table>

    <Modal width="680px;" v-model="modalData.show" :title="modalData.title" :footer-hide=true>

      <Form ref="formInline" :model="formInline" :rules="formRule" :label-width="100" :label-colon=true>
        <FormItem  label="规则名称" prop="name">
          <Input type="text" v-model="formInline.name" :maxlength='50' placeholder="规则名称" ></Input>
        </FormItem>

        <FormItem  label="规则类型" prop="rule_type">
          <Select v-model="formInline.rule_type">
            <Option value="hostname" >主机名</Option>
            <Option value="subnet" >子网</Option>
          </Select>
        </FormItem>
        
        <FormItem label="规则内容" prop="rule_info">
          <Input type="text" v-model="formInline.rule_info" :maxlength='100' placeholder="例如：主机名 demo-001- 或者子网 192.168.10.32/28" ></Input>
        </FormItem>

        <FormItem label="关联标签">
          <Select v-model="formInline.tag_name" filterable  placeholder="请选择关联的标签">
            <Option v-for="item in allTagList" :value="item.tag_name" :key="item.id" >{{ item.tag_name }} </Option>
          </Select>
        </FormItem>

        <FormItem label="关联树">
          <Select v-model="formInline.business_tree" filterable  placeholder="请选择...">
            <Option v-for="item in allBizList" :value="item" :key="item" >{{ item }} </Option>
          </Select>
        </FormItem>

        <FormItem>
          <Button type="primary" @click="handlerSubmit('formInline')" :loading="btnLoading">提交</Button>
          <Button style="margin-left: 8px" @click="handlerReset('formInline')">重置</Button>
        </FormItem>
      </Form>

    </Modal>

  </Card>
</template>
<script>
import {getautoRule,optAutoRule, getTaglist, getBizlist} from '@/api/task-other'
export default {
  data () {
    return {
      allBizList: [],
      allTagList: [],
      searchValue: '',
      btnLoading: false,
      modalData: {
        show: false,
        action: 'post',
        title: '添加自动划分规则',
      },
      formInline: {
          name: '',
          rule_type: 'hostname',
          rule_info:'',
          tag_name: '',
          business_tree:'',
      },
      formRule: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        rule_type: [{ required: true, message: '规则类型不能为空', trigger: 'change' }],
        rule_info:  [{ required: true, message: '规则内容不能为空', trigger: 'blur' }],
      },
      tableData: [],
        columns: [
        {
          title: '规则名称',
          key: 'name',
          width: 120,
        },
        {
          title: '规则类型',
          key: 'rule_type',
          minxWidth: 150,
        },
        {
          title: '规则内容',
          key: 'rule_info',
          minxWidth: 150,
        },
        {
          title: '关联标签',
          key: 'tag_name',
          minxWidth: 120,
        },
        {
          title: '关联项目树',
          key: 'business_tree',
          minxWidth: 150,
        },
        {
          title: '#',
          key: 'handle',
          width: 150,
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
      ],
    }
  },
  methods: {
    handlerGetAutoRule () {
      getautoRule().then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    getAllTagList () {
      getTaglist(1, 888).then(res => {
        if (res.data.code === 0) {
          this.allTagList = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handlerGetBizlist () {
        getBizlist().then(res => {
          if (res.data.code === 0) {
            this.allBizList = res.data.data
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
    handlerAddRule() {
      this.modalData.show = true
      this.formInline =this.$options.data().formInline
    },
    handlerEdit(paramsRow){
      this.modalData.show = true
      this.modalData.action = 'put'
      this.modalData.title ='编辑自动划分规则'
      this.formInline = paramsRow
    },
    handlerDelete(params){
      optAutoRule({id: params.row.id}, 'delete').then(res => {
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
    handlerSubmit(name) {
      this.btnLoading = true
      this.$refs[name].validate((valid) => {
        if (valid) {
          setTimeout(() => {
            optAutoRule(this.formInline, this.modalData.action).then(res => {
              if (res.data.code == 0) {
                this.modalData = this.$options.data().modalData
                this.$Message.success(res.data.msg)
                this.handlerGetAutoRule()
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
    handlerReset(name) {
      this.formInline =this.$options.data().formInline
    },
  },
  mounted () {
    this.handlerGetAutoRule()
    this.getAllTagList()
    this.handlerGetBizlist()
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
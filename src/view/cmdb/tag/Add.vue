<template>
<!-- <div> -->
  <!-- <Card> -->
<Modal width="600px;" v-model="dialog.show"  :title="dialog.title" :loading=true :footer-hide=true>
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
        <FormItem label="Tag" prop="name">
            <Input v-model="formData.name" placeholder=""></Input>
        </FormItem>

        <FormItem label="主机" >
            <Transfer
            :data="ServerList"
            :target-keys="formData.server_set"
            filterable
            :filter-method="serverFilter"
            :titles="serverTitle"
            @on-change="serverHandleChange">
            </Transfer>
        </FormItem>

        <FormItem label="数据库" >
            <Transfer
            :data="DBList"
            :target-keys="formData.dbserver_set"
            filterable
            :filter-method="dbFilter"
            :titles="dbTitle"
            @on-change="dbHandleChange">
            </Transfer>
        </FormItem>

        <FormItem>
            <Button type="primary" @click="handleSubmit('formData')">提交</Button>
            <Button @click="handleReset('formData')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
</Modal>
  <!-- </Card>     -->
<!-- </div> -->
</template>
<script>
import { addTag } from '@/api/cmdb/tag'
import { getTableData } from '@/api/cmdb/server'
import { getDBData } from '@/api/cmdb/db'
export default {
  name: 'add',
  data () {
    return {
      ServerList: [],
      DBList: [],
      serverTitle: ['可关联', '已关联'],
      dbTitle: ['可关联DB', '已关联DB'],
      ruleValidate: {
        name: [
          { required: true, message: 'tag名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    serverHandleChange (newTargetKeys) {
      this.formData.server_set = newTargetKeys
    },
    serverFilter (data, query) {
      return data.label.indexOf(query) > -1
    },
    dbHandleChange (newTargetKeys) {
      this.formData.dbserver_set = newTargetKeys
    },
    dbFilter (data, query) {
      return data.label.indexOf(query) > -1
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // add => post => /api/cmdb/tag/
          // edit => put => /api/cmdb/tag/1
          const url = this.dialog.option == 'add' ? '/' : `/${this.formData.id}/`
          const action = this.dialog.option == 'add' ? 'post' : 'put'
          addTag(this.formData, url, action).then(res => {
            console.log(res)
            if (res.status) {
              this.$Message.success({
                content: '主机添加成功',
                duration: 3
              })
              this.$emit('e-close')
              this.$emit('e-update')
            } else {
              this.$Message.error({
                content: res.data.msg,
                duration: 3
              })
            }
          }).catch(error => {
            this.$Message.error({
              content: JSON.stringify(error.response.data),
              duration: 10
            })
          })
        } else {
          this.$Message.error({
            content: '请检查必选项',
            duration: 3
          })
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }

  },
  props: {
    dialog: Object,
    formData: Object
  },
  mounted () {
    const params = {pageNum: 1, pageSize: 10000}
    getTableData(params).then(res => {
      const data = res.data.data
      for (var item in data) {
        this.ServerList.push({
          key: data[item].id,
          label: data[item].hostname
        })
      }
    })
    getDBData(params).then(res => {
      const data = res.data.data
      for (var item in data) {
        this.DBList.push({
          key: data[item].id,
          label: data[item].host
        })
      }
    })
  }
}
</script>

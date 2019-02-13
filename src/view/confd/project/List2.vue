<template>
  <div class="confd-def">
    <Row>
      <i-col>
        <Affix :offset-top="80">
          <Input autofocus="autofocus" v-model="searchVal" style="padding:6px;" placeholder="输入名称或者代号进行搜索"/>
        </Affix>
      </i-col>
       <i-col :lg=4 :md=6 :sm=8 :xs=12>
        <Card style="margin: 0 5px 10px; text-align: center; background:#aee888">
          <a @click="handlerCreate()">
            <Icon type="md-add" />
            <p>新建项目</p>
          </a>
        </Card>
      </i-col >
        <i-col :lg=4 :md=6 :sm=8 :xs=12 v-for="item in project_list" :key="`custom-icon-${item.project_code}-${_uid}`">
          <Card style="margin: 0 5px 10px; text-align: center;">
            <a  @click="handlerCheck(item.project_code)">
              <p>{{item.project_code}}</p>
              <p>{{item.project_name}}</p>
            </a>
          </Card>
        </i-col>
      </i-col >
        <i-col :lg=4 :md=6 :sm=8 :xs=12>
        <Card style="margin: 0 5px 10px; text-align: center; background:">
          <a @click="handlerMore()">
            <Icon type="ios-more" />
            <p>查看更多</p>
          </a>
        </Card>
      </i-col >
      </Row>
    <Add :dialog="dialog" :formData="formData" @e-update="getProjectData" @e-close="closeModal"></Add>
  </div>
</template>

<script>
import Add from './Add'
import { getProject } from '@/api/confd/project.js'
export default {
  name: "add",
  components: {
    Add
  },
  data() {
    return {
      project_list: [],
      dialog: {
        show: false,
        title: '添加项目'
      },
      formData: {
        project_code: null,
        project_name: null
      },
      project_limit: 50,
      searchVal:''
    };
  },
  methods: {
    handlerCreate(){
      this.dialog.show = true
    },
    handlerMore(){
      this.project_limit = this.project_limit + 30
      this.getProjectData()
    },
    handlerCheck(val){
      const route = {
        name: 'confd_config',
        query: {
          "project_code":val
        },
        meta: {
          title: `项目配置-${val}`
        }
      }
      this.$router.push(route)
    },
    getProjectData () {
      // 获取数据
      getProject({limit: this.project_limit,'key': this.searchVal}).then(res => {
        if (res.data.code === 0) {
          this.project_list = res.data.data
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(error => {
        this.$Message.error({
          content: JSON.stringify(error.response.data),
          duration: 10
        })
      })
    },
    closeModal () {
      // 关闭modal
      this.formData = {
        project_code: null,
        project_name: null
      },
      this.dialog.show = false
    }
  },
  watch:{
    searchVal (val) {
      this.getProjectData()
    }
  },
  created () {
    this.getProjectData()
  }
};
</script>

<style lang="less" scoped>
  .confd-def{
    background:#eee;padding: 10px 5px 0px 5px;
  }
  .card{
    &-create{
      width:305px; height:70px; background:#aee888;
    }
    &-create div{
      text-align:center
    }
  }
</style>

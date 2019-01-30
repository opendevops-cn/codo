<template>
  <div class="confd-def">
      <Row >
       <i-col  span="4">
        <Card style="margin: 0 5px 10px; text-align: center; background:#aee888">
          <a @click="handlerCreate()">
            <Icon type="md-add" />
            <p>新建项目</p>
          </a>
        </Card>
      </i-col >
        <i-col span="4" v-for="item in project_list" :key="`custom-icon-${item.project_code}`">
          <Card style="margin: 0 5px 10px; text-align: center;">
            <a  @click="handlerCheck(item.project_code)">
              <p>{{item.project_code}}</p>
              <p>{{item.project_name}}</p>
            </a>
          </Card>
        </i-col>
        <i-col  span="4">
        <Card style="margin: 0 5px 10px; text-align: center; background:">
          <a @click="handlerMore()">
            <Icon type="ios-more" />
            <p>查看更多</p>
          </a>
        </Card>
      </i-col >
      </Row>
    <Add :dialog="dialog" :formData="formData" @e-update="getData" @e-close="closeModal"></Add>
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
    };
  },
  methods: {
    handlerCreate(){
      console.log('新建项目')
      this.dialog.show = true
    },
    handlerCheck(val){
      console.log(val)
      this.$router.push({ path:'/confd/confd_config/'+val})
    },
    getData () {
      // 获取数据
      getProject(this.getParams).then(res => {
        if (res.data.code === 0) {
          //this.$Message.success(res.data.msg)
          console.log(res.data.data)
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
        //this.tableData = res.data.message
        // console.log(this.tableData)
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
  mounted () {
    this.getData()
  }
};
</script>

<style lang="less" scoped>
  .confd-def{
    background:#eee;padding: 40px 5px 0px 5px;
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

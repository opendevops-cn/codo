<template>
  <div class="confd-def">
    <Row type="flex" justify="center" :gutter="20">
      <Col>
      <Card class="card-create">
        <div style="">
          <a href="#" slot="extra" @click.prevent="handlerCreate()">
            <h2><Icon type="md-add"/> 创建项目</h2>
          </a>
        </div>
      </Card>
      </Col>
      <div v-for="value in project_list">
      <Col>
        <Card style="width:305px; height:70px;">
          <div style="text-align:center;">
            <a href="#" slot="extra" @click.prevent="handlerCheck(value.project_code)">
              <h2><Icon type="ios-albums-outline" /> {{value.project_code}} {{value.project_name}}</h2>
            </a>
          </div>
        </Card>
        <br>
      </Col>
      </div>
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

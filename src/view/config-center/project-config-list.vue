<template>
  <div style="background:#eee;padding: 40px 5px 0px 5px;">
    <Row type="flex" justify="center" :gutter="20">
      <Col>
      <Card style="width:305px; height:70px; background:#aee888">
        <div style="text-align:center">
          <a href="#" slot="extra" @click.prevent="handlerCreate()">
            <h2><Icon type="md-add"/> 创建项目</h2>
          </a>
        </div>
      </Card>
      </Col>
      <div v-for="i in project_list">
      <Col>
        <Card style="width:305px; height:70px;">
          <div style="text-align:center;">
            <a href="#" slot="extra" @click.prevent="handlerCheck(i)">
              <p>A high quality UI Toolkit {{i}}</p>
              <p>A high quality UI Toolkit {{i}}</p>
            </a>
          </div>
        </Card>
        <br>
      </Col>
      </div>
    </Row>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      project_list: [1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,16,17]
    };
  },
  methods: {
    handlerCreate(){
      console.log('新建项目')
    },
    handlerCheck(val){
      console.log(val)
    }
  }
};
</script>

<style scoped>
</style>

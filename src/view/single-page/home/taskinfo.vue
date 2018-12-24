<style scoped>
  .y-title{
    font-size: 18px;
  }
</style>


<template>
  <div>
    <span class="y-title">待处理任务订单</span>
    <br><br>
    <div style="margin-top:10px;margin-bottom:10px">
      <Row v-for="(item,index) in data">
        <Col span="6">
          {{ index+1 }}
        </Col>
        <Col span="12">
          <p> <b>{{item.name}}</b> </p>
        </Col>
        <Col span="6">
          <Tag color="blue">{{item.user}}</Tag>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'taskinfo',
  props:{
    data : Array
  },
}
</script>
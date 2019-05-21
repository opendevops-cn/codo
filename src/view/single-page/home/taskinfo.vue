<style scoped>
  .y-title{
    font-size: 18px;
    color:#516b91;
    font-weight:bold;
  }
</style>

<template>
  <div>
    <span class="y-title">进行中的任务</span>
    <br>
    <br>
    <div style="margin-top:10px;margin-bottom:5px;height:276px">
      <Row v-for="(item,index) in data">
        <Col span="4">
          {{item.id}}
        </Col>
        <Col span="12">
          <p> <b>{{item.name}}</b> </p>
        </Col>
        <Col span="4">
          <Tag color="blue">{{item.creator}}</Tag>
        </Col>
        <Col span="4">
            <Tag v-if="item.status === '0'" color="default">新建</Tag>
            <Tag v-if="item.status === '1'" color="cyan">等待</Tag>
            <Tag v-if="item.status === '2'" color="green">运行中</Tag>
            <Tag v-if="item.status === '3'" color="success">完成</Tag>
            <Tag v-if="item.status === '4'" color="error" >错误</Tag>
            <Tag v-if="item.status === '5'" color="#FFA2D3">手动</Tag>
            <Tag v-if="item.status === '6'" color="magenta">中止</Tag>
            <Tag v-if="item.status === '7'" color="geekblue">定时</Tag>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'taskinfo',
  props: {
    data: Array
  }
}
</script>

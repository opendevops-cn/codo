<style scoped>
  .y-title{
    font-size: 18px;
    color:#516b91;
    font-weight:bold;
  }
</style>

<template>
  <div>
    <span class="y-title">Zabbix Last 10 issues</span>
    <br>
    <br>
    <div style="margin-top:10px;margin-bottom:5px; ">
      
      <Row v-for="(item,index) in data">
        <Col span="8" >
          {{item.host}}
        </Col>
        <Col span="10">
          <p> <b>{{item.issue}}</b> </p>
        </Col>
        <Col span="4">
          <Tag color="blue">{{item.last_change}}</Tag>
        </Col>
        <Col span="2">
            <Tag v-if="item.level === '0'" color="success">Normal</Tag>
            <Tag v-if="item.level === '1'" color="blue">Information</Tag>
            <Tag v-if="item.level === '2'" color="yellow">Warning</Tag>
            <Tag v-if="item.level === '3'" color="warning" >Average</Tag>
            <Tag v-if="item.level === '4'" color="red" >High</Tag>
            <Tag v-if="item.level === '5'" color="error" >Disaster</Tag>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'issuesinfo',
  props: {
    data: Array
  }
}
</script>

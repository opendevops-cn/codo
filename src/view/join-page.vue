<template>
  <div>
    <Row :gutter="20">
      <i-col span="12">
        <Card title="使用交流群1(火爆)" shadow>
          <img class="qq-group-img" :src="qqFans" alt="">
          <p class="qq-group-intro">
            本群为CoDo（CloudOpenDevOps）用户使用交流群，在这里，可以帮你解决平台使用中的困惑和技巧，同时也希望你能提出宝贵的意见和建议，我们一直在努力优化，欢迎你的加入，共同进步。</p>
        </Card>
      </i-col>
      <i-col span="12">
        <Card title="开发交流群1" shadow>
          <img class="qq-group-img" :src="qqFans2" alt="">
          <p class="qq-group-intro">
            本群为CoDo（CloudOpenDevOps）开发交流群，欢迎有一定开发基础（python、vue、 lua等），并且对本项目感兴趣的开发人员来此交流，共同进步。</p>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import qqFans from '@/assets/images/qq-fance.png'
import qqFans2 from '@/assets/images/qq-fance2.jpg'
export default {
  name: 'join_page',
  data () {
    return {
      qqFans,
      qqFans2
    }
  }
}
</script>

<style>
.qq-group-img{
  display: block;
  margin: 0 auto;
  width: 240px;
}
.qq-group-intro{
  padding: 20px;
  font-size: 16px;
}
</style>

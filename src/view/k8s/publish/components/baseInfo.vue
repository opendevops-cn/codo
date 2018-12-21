<template>
    <div>
      <div style="margin-top:10px;margin-bottom:10px">
        <Row>
          <Col span="3">
            <p> <b>任务ID：</b> </p>
          </Col>
          <Col span="9">
            <p> {{row.id}} </p>
          </Col>


          <Col span="3">
            <p> <b>任务状态：</b>  </p>
          </Col>
          <Col span="9">
            <p v-if="row.status == 0" > <Tag>待执行</Tag> </p>
            <p v-else-if="row.status == 11 || row.status== 31" > <Tag color="blue">执行中</Tag> </p>
            <p v-else-if="row.status == 12" > <Tag color="warning">待审核</Tag> </p>
            <p v-else-if="row.status == 2" > <Tag color="warning">审核中</Tag> </p>
            <p v-else-if="row.status == 32" > <Tag color="green">完成</Tag> </p>
            <p v-else> <Tag color="red">失败</Tag> </p>
          </Col>
          
        </Row>

        <Row>
          <!-- <Col span="3">
            <p> <b>环境：</b> </p>
          </Col>
          <Col span="9">
            <p v-if="row.env == 'dev'" > <Tag color="gray">开发</Tag> </p>
            <p v-else-if="row.env == 'qa'" > <Tag color="gray">测试</Tag> </p>
            <p v-else-if="row.env == 'staging'" > <Tag color="gray">预正式</Tag> </p>
            <p v-else-if="row.env == 'release'" > <Tag color="primary">正式</Tag> </p>
            <p v-else> <Tag color="red">未知</Tag> </p>
          </Col> -->
          <Col span="3">
            <p> <b>项目名称：</b>  </p>
          </Col>
          <Col span="9">
            <p> {{row.project}} </p>
          </Col>
          <Col span="3">
            <p> <b>提交时间：</b> </p>
          </Col>
          <Col span="9">
            <p> {{row.ctime}} </p>
          </Col>
        </Row>

        <Row>
          <Col span="3">
            <p> <b>发起人：</b> </p>
          </Col>
          <Col span="9">
            <p> {{row.submit_user}} </p>
          </Col>
          <Col span="3">
            <p> <b>批准时间</b>  </p>
          </Col>
          <Col span="9">
            <p> {{row.review_time}} </p>
          </Col>
        </Row>

        <Row>
          <Col span="3">
            <p> <b>批准人：</b>  </p>
          </Col>
          <Col span="9">
            <p> {{row.review_user}} </p>
          </Col>
          <Col span="3">
            <p> <b>备注：</b> </p>
          </Col>
          <Col span="19">
            <p> {{row.desc}} </p>
          </Col>

        </Row>


        <!-- <Row>
          <Col span="3">
            <p> <b>马上访问:</b> </p>
          </Col>
          <Col span="19">
            <p> <a target="_blank" :href="get_domain">{{get_domain}}</a> </p>
          </Col>
        </Row> -->
      </div>
    </div>
</template>

<script>
export default {
  props: ['row'],
  computed: {
    // getTime: function () {
    //   return this.row.createtime.split('.')[0].replace('T',' ')
    // }, 
    // get_domain: function(){
    //   const env = this.row.env
    //   let url = null
    //   if(env == 'dev'){
    //     url = 'http://'+ 'dev-' + this.row.domain + ':30080'
    //   }else if(env == 'qa'){
    //     url = 'http://'+ 'qa-' + this.row.domain + ':30080'
    //   }else if(env == 'staging'){
    //     url = 'http://'+ 'st-' + this.row.domain + ':30080'
    //   }else{
    //     url = 'http://'+ this.row.domain + ':30080'
    //   }
    //   return url
    // }
  }
}
</script>



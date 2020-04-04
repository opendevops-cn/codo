<template>
  <Modal width="700px;" v-model="modalData.show" :title="modalData.title" :footer-hide=true>
    <Card dis-hover>
      <div class="inner">
        <Alert show-icon>基本信息</Alert>
            <div style="margin-top:10px; margin-bottom:10px">
               <Row>
                    <Col span="4" ><p> <b>域名ID：</b> </p></Col>
                    <Col span="20"  v-if="domainData.domain_id"><p> {{domainData.domain_id}}</p></Col>
                </Row>

                <Row style="margin-top:10px; margin-bottom:10px">
                    <Col span="4"><p> <b>域名：</b></p></Col>
                    <Col span="8"><p> {{domainData.domain_name}} </p></Col>
                    <Col span="4"><p> <b>解析数量：</b></p></Col>
                    <Col span="8"><p> {{domainData.record_count}} </p></Col>
                </Row>

                <Row style="margin-top:10px; margin-bottom:10px">
                    <Col span="4"><p> <b>状态：</b></p></Col>
                    <Col span="8"><p> {{domainData.domain_state}} </p></Col>
                    <Col span="4"><p> <b>星标：</b></p></Col>
                    <Col span="8"><p> {{domainData.star_mark}} </p></Col>
                </Row>

                <Row style="margin-top:10px; margin-bottom:10px">
                    <Col span="4"><p> <b>厂商：</b></p></Col>
                    <Col span="8" v-if="domainData.cloud_name"><p> {{domainData.cloud_name}} </p></Col>
                    <Col span="4"><p> <b>账户别名：</b></p></Col>
                    <Col span="8" v-if="domainData.account"><p> {{domainData.account}} </p></Col>
                </Row>

                <Row style="margin-top:10px; margin-bottom:10px">
                    <Col span="4"><p> <b>过期时间（注）</b></p></Col>
                    <Col span="20" v-if="domainData.record_end_time"><p> {{domainData.record_end_time}} </p></Col>
                </Row>

                <Row style="margin-top:10px; margin-bottom:10px">
                    <Col span="4"><p> <b>备注：</b></p></Col>
                    <Col span="20"><p> {{domainData.remark}} </p></Col>
                </Row>

                <Row>
                    <Col span="4"><p><b>最后更新时间：</b></p></Col>
                    <Col span="20"><p> {{domainData.update_time}} </p></Col>
                </Row>
                
            </div>
      </div>
    </Card>
  </Modal>
</template>
<script>
export default {
  name: 'domainDetail',
  props: {
    modalData: {
        type :Object,
        default: {}
    },
    domainData: {
        type :Object,
        default: {}
    }
  }
}
</script>
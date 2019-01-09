<template>
<Modal width="600px;" v-model="dialog.show"  :title="dialog.title" :loading=true :footer-hide=true>
    <Card dis-hover>
      <div class="inner" >
        <Alert show-icon>基本信息</Alert>
            <div style="margin-top:10px;margin-bottom:10px">
                <Row>
                    <Col span="3"><p> <b>资产ID：</b> </p></Col>
                    <Col span="9"><p> {{formData.id}} </p></Col>
                    <Col span="3"><p> <b>主机名：</b>  </p></Col>
                    <Col span="9"><p> {{formData.hostname}} </p></Col>
                </Row>

                <Row>
                    <Col span="3"><p> <b>主机组：</b> </p></Col>
                    <Col span="9"><p> {{formData.group_name}} </p></Col>
                    <Col span="3"><p> <b>IDC：</b>  </p></Col>
                    <Col span="9"><p> {{formData.idc_name}} </p></Col>
                </Row>

                <Row>
                    <Col span="3"><p> <b>IP：</b> </p></Col>
                    <Col span="9"><p> {{formData.ip}} </p></Col>
                    <Col span="3"><p> <b>端口</b>  </p></Col>
                    <Col span="9"><p> {{formData.port}} </p></Col>
                </Row>

                <Row>
                    <Col span="3"><p> <b>CPU：</b> </p></Col>
                    <Col span="9"><p> {{formData.cpu}} </p></Col>
                    <Col span="3"><p> <b>内存</b>  </p></Col>
                    <Col span="9"><p> {{formData.memory}} </p></Col>
                </Row>

                <Row>
                    <Col span="3"><p> <b>磁盘</b> </p></Col>
                    <Col span="9"><p> {{formData.disk}} </p></Col>
                    <Col span="3"><p> <b>管理用户</b>  </p></Col>
                    <Col span="9"><p> {{formData.admin_user_name}} </p></Col>
                </Row>

                <Row>
                    <Col span="3"><p> <b>系统类型</b> </p></Col>
                    <Col span="9"><p> {{formData.os_platform}} </p></Col>
                    <Col span="3"><p> <b>系统版本</b>  </p></Col>
                    <Col span="9"><p> {{formData.os_version}} </p></Col>
                </Row>

                <Row>
                    <Col span="3"><p> <b>SN</b> </p></Col>
                    <Col span="9"><p> {{formData.sn}} </p></Col>
                    <Col span="3"><p> <b>区域</b>  </p></Col>
                    <Col span="9"><p> {{formData.region}} </p></Col>
                </Row>

                <Row>
                    <Col span="3"><p> <b>备注</b>  </p></Col>
                    <Col span="9"><p> {{formData.comment}} </p></Col>
                </Row>

                <!-- <Row>
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
                </Row>  -->

            </div>
      </div>
    </Card>
</Modal>

</template>
<script>
export default {
  name: 'detail',
  props: {
    dialog: Object,
    formData: Object
  }
}
</script>

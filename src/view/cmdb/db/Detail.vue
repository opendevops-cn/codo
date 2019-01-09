<template>
<Modal width="600px;" v-model="dialog.show"  :title="dialog.title" :loading=true :footer-hide=true>
    <Card dis-hover>
      <div class="inner" >
        <Alert show-icon>基本信息</Alert>
            <div style="margin-top:10px;margin-bottom:10px">
                <Row>
                    <Col span="3"><p> <b>ID：</b> </p></Col>
                    <Col span="9"><p> {{formData.id}} </p></Col>
                    <Col span="3"><p> <b>IDC：</b>  </p></Col>
                    <Col span="9"><p> {{formData.idc_name}} </p></Col>
                </Row>

                <Row>
                    <Col span="3"><p> <b>主机：</b> </p></Col>
                    <Col span="9"><p> <Tag color="blue">{{formData.host}}</Tag> </p></Col>
                    <Col span="3"><p> <b>端口</b>  </p></Col>
                    <Col span="9"><p> <Tag color="blue">{{formData.port}}</Tag></p></Col>
                </Row>

                <Row>
                    <Col span="3"><p> <b>用户名：</b> </p></Col>
                    <Col span="9"><p> {{formData.username}}  </p></Col>
                    <Col span="3"><p> <b>密码</b>  </p></Col>
                    <Col span="9"><p> {{formData.password}} </p></Col>
                </Row>

                <Row>
                    <Col span="3"><p> <b>类型</b> </p></Col>
                    <Col span="9"><p> <Tag color="blue">{{formData.db_type}}</Tag> </p></Col>
                    <Col span="3"><p> <b>版本</b>  </p></Col>
                    <Col span="9"><p> {{formData.db_version}}</p></Col>
                </Row>

                <Row>
                    <Col span="3"><p> <b>主机组</b> </p></Col>
                    <Col span="9"><p> {{formData.group_name}}</p></Col>
                    <Col span="3"><p> <b>Tag标签</b>  </p></Col>
                    <Col span="9"><p> {{formData.tag_name}} </p></Col>
                </Row>

                <Row>
                    <Col span="3"><p> <b>角色</b>  </p></Col>
                    <Col span="9"> <Tag color="blue"> {{formData.role_name}}</Tag> </Col>
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

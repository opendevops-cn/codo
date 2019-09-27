<template>
  <Modal width="800px;" v-model="dialog.show" :title="dialog.title" :loading=true :footer-hide=true>
    <Card dis-hover>
      <div class="inner">
        <Alert show-icon>基本信息</Alert>
        <div style="margin-top:10px;margin-bottom:10px">
          <Row>
            <Col span="3"><p><b>ID：</b></p></Col>
            <Col span="9"><p> {{formData.id}} </p></Col>
          </Row>

          <Row>
            <Col span="3"><p><b>状态：</b></p></Col>
            <Col span="21">
              <p>
                <Tag color="blue">{{formData.state}}</Tag>
              </p>
            </Col>
          </Row>

          <Row>
            <Col span="3"><p><b>DB名称：</b></p></Col>
            <Col span="21">
              <p>
                <Tag color="blue">{{formData.db_code}}</Tag>
              </p>
            </Col>

          </Row>

          <Row>
            <Col span="3"><p><b>主机：</b></p></Col>
            <Col span="21">
              <p>
                <Tag color="blue">{{formData.db_host}}</Tag>
              </p>
            </Col>
          </Row>
          <Row>
            <Col span="3"><p><b>外网地址：</b></p></Col>
            <Col span="21">
              <p>
                <Tag color="blue">{{formData.db_public_ip}}</Tag>
              </p>
            </Col>
          </Row>
          <Row>
            <Col span="3"><p><b>IDC：</b></p></Col>
            <Col span="9"><p> {{formData.idc}} </p></Col>
            <Col span="3"><p><b>区域：</b></p></Col>
            <Col span="9"><p> {{formData.db_region}} </p></Col>
          </Row>

          <Row>
            <Col span="3"><p><b>用户名：</b></p></Col>
            <Col span="9"><p> {{formData.db_user}} </p></Col>
            <Col span="3"><p><b>密码：</b></p></Col>
            <Col span="9">
              <Tag color="blue"> {{formData.db_pwd}}</Tag>
            </Col>
          </Row>

          <Row>
            <Col span="3"><p><b>端口：</b></p></Col>
            <Col span="9"><p> {{formData.db_port}} </p></Col>
            <Col span="3"><p><b>磁盘</b></p></Col>
            <Col span="9"><p> {{formData.db_disk}} </p></Col>
          </Row>

          <Row>
            <Col span="3"><p><b>类型</b></p></Col>
            <Col span="9">
              <p>
                <Tag color="blue">{{formData.db_type}}</Tag>
              </p>
            </Col>
            <Col span="3"><p><b>版本</b></p></Col>
            <Col span="9"><p> {{formData.db_version}}</p></Col>
          </Row>

          <Row>
            <Col span="3"><p><b>环境</b></p></Col>
            <Col span="9">
              <p>
                <Tag color="blue">{{formData.db_env}}</Tag>
              </p>
            </Col>
            <Col span="3"><p><b>角色</b></p></Col>
            <Col span="9">
              <Tag color="blue"> {{formData.db_mark}}</Tag>
            </Col>
          </Row>

          <Row>
            <Col span="3"><p><b>实例类型</b></p></Col>
            <Col span="9">
              <Tag color="blue"> {{formData.db_class}}</Tag>
            </Col>
            <Col span="3"><p><b>代理主机</b></p></Col>
            <Col span="9">
              <Tag color="blue"> {{formData.proxy_host}}</Tag>
            </Col>
          </Row>

          <Row>
            <Col span="3"><p><b>关联标签</b></p></Col>
            <Col span="9"><p> {{formData.db_tag}} </p></Col>
          </Row>

          <Row>
            <Col span="3"><p><b>更新时间</b></p></Col>
            <Col span="9"><p> {{formData.update_time}} </p></Col>
          </Row>

          <Row>
            <Col span="3"><p><b>备注</b></p></Col>
            <Col span="21"><p> {{formData.db_detail}} </p></Col>
          </Row>

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

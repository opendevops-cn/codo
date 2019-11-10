<template>
<Modal width="800px;" v-model="dialog.show"  :title="dialog.title" :loading=true :footer-hide=true>
    <Card dis-hover>
      <div class="inner" >
        <Alert show-icon>基本信息</Alert>
            <div style="margin-top:10px;margin-bottom:10px">
                <Row>
                    <Col span="4"><p> <b>资产ID：</b> </p></Col>
                    <Col span="20"><p> {{formData.id}} </p></Col>
                </Row>

                <Row>
                    <Col span="4"><p> <b>实例ID：</b> </p></Col>
                    <Col span="20"><p> {{formData.instance_id}}</p></Col>
                </Row>
                <Row>
                    <Col span="4"><p> <b>实例状态：</b> </p></Col>
                    <Col span="8"><p> <Tag color="blue">{{formData.instance_state}}</tag> </p></Col>
                    <Col span="4"><p> <b>实例类型：</b> </p></Col>
                    <Col span="8"><p> {{formData.instance_type}} </p></Col>
                </Row>
                <Row>
                    <Col span="4"><p> <b>IP地址：</b> </p></Col>
                    <Col span="20"><p> <Tag color="blue">{{formData.ip}}</tag> </p></Col>

                </Row>
                <Row>
                    <Col span="4"><p> <b>主机名：</b> </p></Col>
                    <Col span="20"><p> <Tag color="blue">{{formData.hostname}}</tag> </p></Col>
                </Row>
                <Row>
                    <Col span="4"><p> <b>IDC：</b>  </p></Col>
                    <Col span="8"><p> {{formData.idc}} </p></Col>
                    <Col span="4"><p> <b>区域</b>  </p></Col>
                    <Col span="8"><p> {{formData.region}} </p></Col>
            
                </Row>

                <Row>
                    <Col span="4"><p> <b>管理用户</b>  </p></Col>
                    <Col span="8"><p> <Tag color="blue">{{formData.admin_user}}</tag> </p></Col>
                    <Col span="4"><p> <b>公网IP</b>  </p></Col>
                    <Col span="8"><p> {{formData.public_ip}} </p></Col>
                </Row>

                <Row>
                    <Col span="4"><p> <b>CPU型号</b>  </p></Col>
                    <Col span="8"><p> {{formData.cpu}} </p></Col>
                    <!-- <Col span="4"><p> <b>CPU数量</b>  </p></Col>
                    <Col span="8"><p> {{formData.cpu_count}} </p></Col> -->
                    <Col span="4"><p> <b>CPU核心</b>  </p></Col>
                    <Col span="8"><p> {{formData.cpu_cores}} </p></Col>
                </Row>
                <Row>
                    <Col span="4"><p> <b>内存</b>  </p></Col>
                    <Col span="8"><p> {{formData.memory}} </p></Col>
                    <Col span="4"><p> <b>磁盘</b>  </p></Col>
                    <Col span="8"><p> {{formData.disk}} </p></Col>
                </Row>

                <Row>
                    <Col span="4"><p> <b>系统类型</b>  </p></Col>
                    <Col span="20"><p> {{formData.os_type}} </p></Col>
                </Row>
                <Row>
                    <Col span="4"><p> <b>系统内核</b>  </p></Col>
                    <Col span="8"><p> {{formData.os_kernel}} </p></Col>
                </Row>
                <Row>
                    <Col span="4"><p> <b>关联标签：</b>  </p></Col>
                    <Col span="20"><p> {{formData.tag_list}} </p></Col>
                </Row>
                <Row>
                    <Col span="4"><p> <b>SN</b> </p></Col>
                    <Col span="20"><p> {{formData.sn}} </p></Col>

                </Row>

                <Row>
                    <Col span="4"><p> <b>备注</b>  </p></Col>
                    <Col span="20"><p> {{formData.detail}} </p></Col>
                </Row>
                <Row>
                    <Col span="4"><p> <b>最后一次更新时间</b>  </p></Col>
                    <Col span="20"><p> {{formData.update_time}} </p></Col>
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

<template>
<Modal width="600px;" v-model="dialog.show"  :title="dialog.title" :loading=true :footer-hide=true> 
    <Card dis-hover>
      <div class="inner" >
        <div style="margin-top:10px;margin-bottom:10px">
            <Row>
                <Col span="3"><p> <b>规则ID：</b> </p></Col>
                <Col span="21"><p> {{formData.id}} </p></Col>
            </Row>
            <br>
            <Row>
                <Col span="3"><p> <b>规则名：</b> </p></Col>
                <Col span="21"><p> {{formData.name}} </p></Col>
            </Row>
            <br>
            <Row>
                <Col span="3"><p> <b>用户：</b> </p></Col>
                <Col span="21">
                    <Tag color="blue" v-for="item in formData.user">{{item}}</Tag>
                </Col>
            </Row>
            <br>
            <Row>
                <Col span="3"><p> <b>主机:</b> </p></Col>
                <Col span="21">
                    <Tag color="blue" v-for="item in formData.server">{{item}}</Tag>
                </Col>
            </Row>
            <br>
            <Row>
                <Col span="3"><p> <b>主机组:</b> </p></Col>
                <Col span="21">
                    <Tag color="blue" v-for="item in formData.servergroup">{{item}}</Tag>
                </Col>
            </Row>
        </div>
      </div>
    </Card>
</Modal>

</template>
<script>
    export default {
        name: 'detail',
        props:{
            dialog: Object,
            formData: Object
        }
    }
</script>

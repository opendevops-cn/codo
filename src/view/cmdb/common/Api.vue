<template>
<Modal width="600px;" v-model="dialog.show"  :title="dialog.title" :loading=true :footer-hide=true>
      <div class="inner">
        <div>
            <Row>
                <!-- <Col span="4"> <b>API接口地址</b> </Col> -->
                <Col span="20"><Input v-model="get_apiUrl" placeholder=""></Input></Col>
                <Col span="3" offset="1">
                  <Tooltip content="已复制" placement="top-end" :disabled="disabled">
                      <Button type="success" ghost @click="disabled=false" v-clipboard:copy="get_apiUrl">复制</Button></Input>
                  </Tooltip>
                </Col>
            </Row>
        </div>
      </div>
</Modal>
</template>
<script>
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
export default {
  name: 'add',
  data () {
    return {
      disabled: true,
    }
  },
  methods: {
    handleReset (name) {
      this.$refs[name].resetFields()
    }
  },
  props: {
    dialog: Object,
    apiUrl: String
  },
  computed:{
    get_apiUrl(){
      return `${this.apiUrl}?${this.dialog.name}`
    }
  }
}
</script>

<template>
    <Row>
        <Col span="100">
            <Card>
                <p slot="title">随机密码</p>
                你要生成多少位的密码：<InputNumber :max="40" :min="8" v-model="passwordNum"></InputNumber>  
                <Button type="success" @click="getRandomPassword(passwordNum)">生成密码</Button>
                <h3> {{ hData }} </h3>  
            </Card>
        </Col>
    <br>

    <Card>
      <p slot="title">加密解密</p>
      <Alert>提醒：AES加密所用到的Key在后端代码里面，前端不展示，使用人员可自行修改，防止被破解！</Alert>

    <Row type="flex">
        <Col span="10">
          <Form :model="formItem">
            <FormItem label="输入要加密的内容">
              <Input v-model="formItem.text" type="textarea" :autosize="{minRows: 7,maxRows: 10}" placeholder="输入要加密的内容"></Input>
            </FormItem>
          </Form>
      </Col>
        <Col span="2"  offset="1" style="text-align: center;">
          <br>
          <br/>
          <Radio v-model="single" >AES</Radio>
          <br>
          
          <br/>
          <Button type="primary" @click="operationMycrypy('text', formItem.text)">点击加密</Button>
          <br>

          <br/>

          <Button type="success" @click="operationMycrypy('ciphertext', formItem.ciphertext)">点击解密</Button>
        </Col>
        <Col span="10"  offset="1">
          <Form :model="formItem">
            <FormItem label="输入要解密的内容">
              <Input v-model="formItem.ciphertext" type="textarea" :autosize="{minRows: 7,maxRows: 10}" placeholder="输入要加密的内容"></Input>
            </FormItem>
          </Form>
        </Col>

      
      </Row>
       </Card>
    </Row>
</template>
<script>
import { getRandomPassword, operationMycrypy } from "@/api/devops-tools";

    export default {
      data(){
        return{
          single: true,
          passwordNum: 16,  //位数
          hData:'',   //随机密码

          formItem:{
            text: '',  //普通文本，明文
            ciphertext: '', //加密文本， 密文
          }
        }
      },
      methods:{
         // 获取随机密码
        getRandomPassword (num) {
            getRandomPassword(num).then(res => {
                if (res.data.code === 0) {
                // this.$Message.success(`${res.data.msg}`)
                this.hData = res.data.data
                } else {
                this.$Message.error(`${res.data.msg}`)
                }
            })
          },
        // 获取随机密码
        operationMycrypy (key, value) {
          if ( key === 'text'){
            operationMycrypy(key, value).then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
                this.formItem.ciphertext = res.data.data
              } else {
                this.$Message.error(`${res.data.msg}`)
                }
            })
          }

          if ( key === 'ciphertext'){
            operationMycrypy(key, value).then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
                this.formItem.text = res.data.data
              } else {
                this.$Message.error(`${res.data.msg}`)
                }
            })
          }
  
          },
      }
    }
</script>


<style>
    .demo-split{
        height: 200px;
        border: 1px solid #dcdee2;
    }
    .demo-split-pane{
        padding: 10px;
    }
</style>
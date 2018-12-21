<template>
  <div>
    <div id="qrcode"></div>
    </br>
    <!-- <vue-q-art :config="config"></vue-q-art> -->
    <h3>如果手机无法扫描，请手动录入: </h3>
    <p>{{mfa}}</p>
    </br>
    <h2 style="color:red">录入完成，请联系管理员添加权限</h2>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
// import VueQArt from "vue-qart";
export default {
  name: 'MFA',
  components: { QRCode },
  props: {
    mfa: {
      type: String
    },
    mail: {
      type: String
    }
  },
  // data() {
  //   return {
  //     msg: this.mail,
  //     config: {
  //       value: this.mfa,
  //       imagePath: require("./logo.jpg"),
  //       width: 486,
  //       height: 486,
  //       filter: "color"
  //     }
  //   };
  // },
  methods: {
    qrcode () {
      /* eslint-disable no-new */
      new QRCode('qrcode', {
        text: `otpauth://totp/${this.mail}?secret=${this.mfa}`,
        width: 486,
        height: 486,
        background: '#ffffff', // 背景颜色
        foreground: '#000000', // 前景颜色
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
    }
  },
  mounted () {
    this.qrcode()
  }
}
</script>

<style scoped>
</style>

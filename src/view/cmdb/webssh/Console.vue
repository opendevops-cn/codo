<template>
    <div class="console" id="terminal"></div>
</template>
<script>
import { getToken } from '@/libs/util'
import jwt_decode from 'jwt-decode'
import { checkAuthServer } from '@/api/cmdb/server_auth'
import Terminal from './Xterm'
import { webSocketUrl } from '@/api/cmdb/server' 
export default {
  name: 'Console',
  props: {
    terminal: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      term: null,
      terminalSocket: null
    }
  },
  methods: {
    runRealTerminal () {
      console.log('webSocket is finished')
    },
    errorRealTerminal () {
      console.log('error')
    },
    closeRealTerminal () {
      console.log('close')
    },
    openSocket(pid){
      console.log('start conn...')
      this.terminalSocket = new WebSocket(webSocketUrl +'?id=' +pid)
      this.terminalSocket.onopen = this.runRealTerminal
      this.terminalSocket.onclose = this.closeRealTerminal
      this.terminalSocket.onerror = this.errorRealTerminal
      this.term.attach(this.terminalSocket)
      this.term._initialized = true
      console.log('mounted is going on')
    },
    checkAuth(server_id){
      //判断当前用户对该资产是否有权限
      // const token = getToken()
      // const decoded = jwt_decode(token)
      // checkAuthServer(decoded.name,server_id).then(res => {
      // 改用后端用户验证  
      checkAuthServer(server_id).then(res => {  
        // console.log(res)
        if(res.data.status === true){
          this.openSocket(server_id)
        }else{
          this.term.write('当前用户无权限登录,请联系管理员')
        }
      }).catch(error =>{
        this.term.write('权限认证出现错误，请检查认证接口')
      });
    }
  },
  mounted () {
    let pid = this.$route.query.id
    console.log('pid : ' + pid + ' is on ready')
    let terminalContainer = document.getElementById('terminal')
    this.term = new Terminal({rows: 40})
    this.term.open(terminalContainer)

    // auth and connect web socket
    this.checkAuth(pid)

    
  },
  beforeDestroy () {
    if(this.terminalSocket){
      this.terminalSocket.close()
    } 
    this.term.destroy()
  }
}
</script>
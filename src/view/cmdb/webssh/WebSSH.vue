<template>
  <div class="container">
    <my-terminal :terminal="terminal"></my-terminal>
  </div>
</template>

<script>
import 'xterm/dist/xterm.css'
import Console from './Console'

export default {
  name: 'WebSSH',
  data () {
    return {
      terminal: {
        pid: 1,
        name: 'terminal',
        cols: 600,
        rows: 1000
      }
    }
  },
  components: {
    'my-terminal': Console
  }
}
</script>

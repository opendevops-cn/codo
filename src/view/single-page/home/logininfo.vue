<style scoped>
  .y-title{
    font-size: 18px;
  }
</style>

<template>
  <div>
    <span class="y-title"><b>SSH登录记录</b></span><br><br>
    <Table :columns="columns1" :data="data"></Table>
  </div>
</template>

<script>
export default {
  name: 'logoinfo',
  data () {
    return {
      columns1: [
        {
          title: '登录用户',
          key: 'user'
        },
        {
          title: '登录主机',
          key: 'host'
        },
        {
          title: '来源IP',
          key: 'remote_ip'
        },
        {
          title: '登录时间',
          key: 'start_time'
        }
      ]
    }
  },
  props: {
    data: Array
  }
}
</script>

<template>
  <error-content code="403" desc="Oh~~您没有的权限~" :src="src"/>
</template>

<script>
import error403 from '@/assets/images/error-page/error-403.svg'
import errorContent from './error-content.vue'
export default {
  name: 'error_403',
  components: {
    errorContent
  },
  data () {
    return {
      src: error403
    }
  }
}
</script>

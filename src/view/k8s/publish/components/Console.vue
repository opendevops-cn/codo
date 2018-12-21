<style scoped>
    .wrapper {
        background-color:black;
        color:white 
    }
    .inner {
        margin-bottom: 10px;
        margin-left: 10px;
        font-size: 14px;
    }
    .totalDesc {
       margin-left: 10px;
       color: #7b7b7b
    }
</style>

<template>
    <div>
      <div>
        <Row>
          <Col span="24">
            <Scroll height=500>
              <div class="wrapper" >
                <!-- <div class="inner" v-for="item in msg_list">{{ item }} </div> -->
                <div class="inner" v-for="item in console_data">{{ item }} </div>
              </div>
            </Scroll>
          </Col>
        </Row>
      </div>
    </div>
</template>

<script>
export default {
  props:{
    dialog: Object,
    console_data:Array
  },
    watch:{
      //定位log csroll到底部
      console_data: function () {
        this.$nextTick(() => {
          var div = this.$el.querySelector(".ivu-scroll-container");
          div.scrollTop = div.scrollHeight
        })
      },
    }
  // data () {
  //   return {
  //     data:['11','222','333'],
  //   }
  // }
}
</script>

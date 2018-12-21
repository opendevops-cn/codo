<style scoped>
    .outer{
        background-color:black;
    }
    .wrapper {
        background-color:black;
        /* color:white  */
        color: #00FF00
    }
    .inner {
        margin-bottom: 10px;
        margin-left: 10px;
        font-size: 14px;
        background-color:black;
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
            <Scroll height=300 class="outer"> 
              <div class="wrapper" >
                <!-- <div class="inner" v-for="item in msg_list">{{ item }} </div> -->
                <div class="inner" v-for="item in ttylog_data">{{ item.datetime }} :  {{ item.cmd }} </div>
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
    ttylog_data:Array
  }
}
</script>
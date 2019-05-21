<template>
  <div class="container">
    <!-- <my-terminal :terminal="terminal"></my-terminal> -->
    <div style="margin: 10px;">
      <Row>
          <Col span="5">
            <Button size="default" type="info" @click="pause">{{pause_msg}}</Button>
            <!-- <Button :size="pasuse_size" :type="contine_type" @click="continues">继续</Button> -->
            <Button size="small" @click="restart(1)">重新开始</Button>
          </Col>

          <Col span="2"> <Tag color="default">{{this.start_time}}</Tag> </Col>
          <Col span="8" style="margin-left:12px;">
            <Slider :tip-format="hideFormat" v-model="scrubber" @on-change="sliderChange"></Slider>
          </Col>
          <Col span="2" style="margin-left:4px;"> <Tag color="default">{{this.end_time}}</Tag></Col>

          <!-- <Col span="1"> <Tag color="default">-5x</Tag> </Col>
          <Col span="4">
            <Slider :tip-format="hideFormat" v-model="speeds" :step="10"></Slider>
          </Col>
          <Col span="1"> <Tag color="default">+5x</Tag> </Col> -->
            
          
      </Row>
    </div>

    <div class="console" id="terminal"></div>
  </div>
</template>

<script>
import 'xterm/dist/xterm.css'
import Terminal from './Xterm'
import { getRecordData } from '@/api/cmdb/server_log.js'

export default {
  name: 'Record',
  props:{
    record_data:Object
  },
  data () {
    return {
      scrubber: 0,
      pause_size: 'small',
      pause_msg: '暂停',
      // speeds: 50,
      // pause: true,
      term: null,
      terminal: {
        pid: 1,
        name: 'terminal',
        cols: 600,
        rows: 1000
      },
      timelist : null,
      totalTime: 0,
      start_time: '00:00:00',
      end_time: '',
      res: {},
      toggle: true,
      TICK: 33,
      TIMESTEP : 33,
      time : 33,
      timer: null,
      pos: 0
    }
  },
  methods: {
    getTerm(){
      //let pid = this.$route.query.id
      let terminalContainer = document.getElementById('terminal')
      this.term = new Terminal({rows: 40})
      this.term.open(terminalContainer)
      this.term._initialized = true
      console.log('start term--->',this.term)
    },
    set_close(){
      //alert('父组件调用了我,表示窗口已关闭')
      clearInterval(this.timer);  //关闭定时器
      this.term.destroy() //好像不生效
      Object.assign(this.$data, this.$options.data()) //重置data数据
      console.log('end term--->',this.term)
    },
    hideFormat () {
      return null;
    },
    zeroPad(num, size) {
        var s = "0" + num;
        return s.substr(s.length - size);
    },
    buildTimeString(millis){
      //转换为可视化时间
      var hours = this.zeroPad(Math.floor(millis / (1000 * 60 * 60)), 2);
      millis -= hours * (1000 * 60 * 60);
      var minutes = this.zeroPad(Math.floor(millis / (1000 * 60)), 2);
      millis -= minutes * (1000 * 60);
      var seconds = this.zeroPad(Math.floor(millis / 1000), 2);
      return hours + ':' + minutes + ':' + seconds;
    },
    // sliderStart(){
    //   console.log('change...start....')
    // },
    sliderChange(){
      //滑动结束后才会触发，滑动过程中不会触发
      //需要在滑块结束前，先暂停 this.pause()
      console.log('change.....')
      console.log(this.scrubber)
      var ztime = (this.scrubber / 100) * this.totalTime;
      this.restart(ztime);
    },
    pause() {
      //暂停 继续
      if(this.toggle){
        clearInterval(this.timer);
        this.toggle = !this.toggle;
        this.pause_msg = '继续';
      }else{
        this.timer = setInterval(this.advance, this.TICK);
        this.toggle = !this.toggle;
        this.pause_msg = '暂停';
      }
    },
    restart(millis) {
      //重新开始
      console.log(millis)
      clearInterval(this.timer);
      this.term.reset();
      this.time = millis;
      this.pos = 0;
      this.toggle = true;
      this.timer = setInterval(this.advance, this.TICK);
    },
    advance() {
      this.scrubber = Math.ceil((this.time / this.totalTime) * 100);
      this.start_time = this.buildTimeString(this.time);
      // console.log('start_time...',this.start_time)
      for (; this.pos < this.timelist.length; this.pos++) {
        if (this.timelist[this.pos] * 1000 <= this.time) {
          this.term.write(this.res[this.timelist[this.pos]]);
        } else {
            break;
        }
      }
      if (this.pos >= this.timelist.length) {
          clearInterval(this.timer);
      }
      this.time += this.TIMESTEP;
    },
    playData(){
        var timelist = []
        for (var i in this.res) {
            this.totalTime = Math.max(this.totalTime, i);   //找出最大的时间
            timelist.push(i);
        }        
        this.timelist = timelist.sort(function(a, b){return a-b}); //对时间进行排序
        // console.log('new timelist--->',this.timelist)
        this.totalTime = this.totalTime*1000
        this.end_time = this.buildTimeString(this.totalTime)
        // console.log('end_time---->',this.end_time)
        this.timer = setInterval(this.advance, this.TICK);
    }
  },
  watch:{
    record_data: function(){
      this.getTerm()
      this.res = this.record_data
      this.playData() //开始播放

    },
  }
  // beforeDestroy () {
  //   this.term.destroy()
  // }
}
</script>

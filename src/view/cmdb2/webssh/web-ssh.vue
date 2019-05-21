<template>
    <div class="layout">
        <Layout>
          <Row>
            <Col span="24">
            <div class="hearder-wrapper"></div>
            </Col>
            <Col span="4" >
             <Row>
               <Col span="24" >
                <Input placeholder="搜索..." />
              </Col>
             </Row>
             <Scroll :on-reach-bottom="handleReachBottom" height='760'>
                <Tree :data="data1"></Tree>
            </Scroll>
            </Col>
            <Col></Col>
            <Col span="20">
               <Layout>
                <div class="tag-nav-wrapper">
                  <Tabs type="card" closable @on-tab-remove="handleTabRemove" @on-click="handleTabSelect" :value=selectTab >
                    <TabPane v-for="item, index in tabs" :key="`${_uid}_${index}`" :label="item.lable" :name="item.key"></TabPane>
                  </Tabs>
                  <div class="close-con">
                    <Dropdown transfer @on-click="handleTagsOption" style="margin-top:7px;">
                      <Button size="small" type="text">
                        <Icon :size="15" type="ios-close-circle-outline" />
                      </Button>
                      <DropdownMenu slot="list">
                        <DropdownItem name="close-all">关闭所有</DropdownItem>
                        <DropdownItem name="close-others">关闭其他</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
                <div v-if="selectTab !== '0'" class="container">
                  <my-terminal :terminal="terminal"></my-terminal>
                </div>
                <!-- <Content v-else :style="{margin: '2px', background: '#000000', minHeight: '740px'}">
                </Content> -->
            </Layout>
            </Col>
          </Row>
        </Layout>
    </div>
</template>
<script>
import 'xterm/dist/xterm.css'
import Console from './Console'
export default {
   components: {
  },
  data () {
    return {
      terminal: {
        pid: 1,
        name: 'terminal',
        cols: 600,
        rows: 1000
      },
      tabs: [
        {key: "0", lable:'8888'},
        {key: "1", lable:'1111'},
        {key: "2", lable:'2222'},
        {key: "3", lable:'3333'},
        {key: "4", lable:'4444'},
        {key: "5", lable:'5555'},
        ],
      selectTab: "",
      data1: [
        {
          title: 'parent 1',
          expand: true,
          disabled: true,
          children: [
              {
                  title: 'parent 1-1',
                  expand: true,
              },
              {
                  title: 'parent 1-2',
                  expand: true,
                  children: [
                      {
                          title: 'leaf 1-2-1'
                      },
                      {
                          title: 'leaf 1-2-1'
                      }
                  ]
              }
          ]
        }
      ]
    };
    },
    methods: {
      handleReachBottom(){

      },
      handleClick() {

      },
      handleTagsOption (type) {
        if (type.includes('all')) {
          this.$Message.success(`关闭所有`)
        } else if (type.includes('others')) {
          this.$Message.success(`关闭其他`)
          setTimeout(() => {

          }, 100)
        }
      },
      handleTabSelect(name){
        console.log(name)
        this.selectTab = name
      },
      handleTabRemove(name) {
        console.log(name)
      }
    },
    components: {
    'my-terminal': Console
  }
}
</script>
<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .hearder-wrapper{
      margin: '2px';
      height:5px;
      background:#e8eaec;
    }
    .tag-nav-wrapper{
      border: 1px solid #d7dde4;
      margin: '2px';
      padding: 0;
      height:32px;
      background:#F0F0F0;
    }
    .menu-item span{
        display: inline-block;
        overflow: hidden;
        width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }
    .menu-item i{
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }
    .collapsed-menu span{
        width: 0px;
        transition: width .2s ease;
    }
    .collapsed-menu i{
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }

  .close-con{
    position: absolute;
    border: 1px solid #d7dde4;
    right: 0;
    top: 0;
    height:32px;
    width: 32px;
    background:#F0F0F0;
    text-align: center;
    z-index: 10;
  }
</style>

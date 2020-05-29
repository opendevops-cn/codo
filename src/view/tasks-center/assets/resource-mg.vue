<template>
  <div style="height:100%; padding: 0px;background: 	#FFFFFF">
    <Row :gutter="20">
      <Col span="4">

        <Menu active-name="tag" @on-select="handlerSelectMenu" width='auto'>
          <MenuItem name="tag">
              <Icon type="md-pricetags" />
              标签管理
          </MenuItem>
          <MenuItem name="server">
              <Icon type="md-document" />
              主机资源
          </MenuItem>
          <MenuItem name="db">
              <Icon type="md-chatbubbles" />
              数据库资源
          </MenuItem>
          <MenuItem name="proxy">
              <Icon type="md-chatbubbles" />
              代理管理
          </MenuItem>
        </Menu>

      </Col>
      <Col span="20"  style="padding: 10px;">
         {{selectMenu}}
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  data() {
      return {
        selectMenu: 'tag'
      }
  },
  methods: {
    getProjectList() {
    },

    handlerSelectMenu(value) {
      this.selectMenu = value
    }
  }
}
</script>

<style>

</style>
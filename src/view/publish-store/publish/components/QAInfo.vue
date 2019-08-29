<template>
  <div>
    <Alert show-icon closable style="margin-bottom:25px; margin-top:25px">
      <p>配置示例：ops/yanghongfei 环境qa， 配置名称为settings.py 则为 https://domain.com/api/kerrigan/v1/conf/publish/config/?project_code=ops&environment=qa&service=yanghongfei&filename=settings.py</p>
      <p>数据库更新对应的标签为 relative_path/环境名 例如：ops/yanghongfei/qa。</p>
      <p></p>
      <p></p>
    </Alert>

    <Row>
      <!-- <ButtonGroup style="margin-bottom:15px;  margin-top:15px">
          <Button type="error"   >保存选择应用</Button>
          <Button type="info"    >查看持续集成</Button>
          <Button type="success" >准备发布测试</Button>
      </ButtonGroup> -->
      <Divider orientation="left">测试地址</Divider>
      <Col span="3" offset=1 ><b>xx</b></Col>
      <Col span="18" offset=1>xxxxx</Col>
      <Col span="3"  offset=1><b>xx2</b></Col>
      <Col span="18" offset=1>xxxxx</Col>
      <br><br>
      <Divider orientation="left">数据库语句路径</Divider>
      <Divider orientation="left">任务详细信息</Divider>
    </Row>            
     <div v-if="list_id" ><task-list :list_id="list_id" :task_type="task_type"></task-list></div>
        // 可以查询到项目的配置
        // 2. 应查询测试任务的订单详情。 
        如果有数据更新会通知到DBA
        // 3. 如果有订单，则查询测试的接口
        // 4. 如果订单完成，才展示通过测试按钮
  </div>
</template>

<script>
import taskList from '@/view/task-order/components/task-list'
export default {
  components: {taskList},
  props: {
    projectInfo: {
       type: Object,
       default: null
    }
  },
   data () {
    return {
      list_id: '1351', //订单ID
      task_type: 'normal1',
      user_btn_loading: false,
    }
  }
}
</script>
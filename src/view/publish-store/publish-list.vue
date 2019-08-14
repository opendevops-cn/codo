<template>
  <div>
    <!-- <Divider >上线中的项目</Divider> -->
    <div  style="margin-bottom :30px;">
      <Table size="small" ref="selection"  :columns="columns" :data="tableDataOnline"></Table>
    </div>

    <div  style="margin-top:30px; margin-bottom :30px;">
      <Divider orientation="left">测试中的项目</Divider>
      <Table size="small" ref="selection"  :columns="columns" :data="tableDataQA"></Table>
    </div>

    <Divider orientation="left">开发中的项目</Divider>
    <Table size="small" ref="selection" :columns="columns" :data="tableDataDEV"></Table>
  </div>
</template>

<script>
import { getProjectPublishlist } from '@/api/task-other'
export default {
  data () {
    return {
      tableDataOnline: [],
      tableDataQA: [],
      tableDataDEV: [],
      tableData: [],
      columns: [
        {
          title: '项目名称',
          key: 'project_name',
          align: 'center',
          render: (h, params) => {
              return h('div', [
                h('a',{
                    on: {
                      click: () => {
                        this.handlerCheck(params.row.id, params.row.project_name)
                        this.$Message.success('xxxx')
                      }
                    }
                  },
                  params.row.project_name
                )
              ])
            } 
         },
         {
          title: '项目管理',
          key: 'pm',
          width: 150
        },
        {
          title: '开发人员',
          key: 'developers',
          width: 300
        },
        {
          title: '测试人员',
          key: 'tester',
          width: 200
        },
         {
          title: '创建时间',
          key: 'create_time',
          align: 'center',
          width: 150
        },
      ],
    }
  },
  methods: {
    getProjectPublishList () {
      getProjectPublishlist().then(res => {
        if (res.data.code === 0) {
            this.tableDataOnline= res.data.publish_online_list
            this.tableDataQA = res.data.publish_qa_list
            this.tableDataDEV =res.data.publish_dev_list
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handlerCheck(RowID,RowName){
      const route = {
        name: 'project_detail',
        path: `/project_detail/${RowID}`,
        // query: {
        //   "project_id": RowID
        // },
         params: {
          project_id: RowID
        },
        meta: {
          title: `项目详情-${RowID}`
        }
      }
      this.$router.push(route)
    },
  },
  mounted () {
    this.getProjectPublishList()
  }
}
</script>

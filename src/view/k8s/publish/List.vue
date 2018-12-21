<template>
  <div>

          <Row>
            <Col span="6">
              <Card>
                <tables border highlight-row ref="tables" v-model="tableData" :columns="columns" @on-delete="handleDelete" @on-row-click="onRowClick"></tables>
              </Card>
            </Col>
        
            <Col span="17" offset="1"> 
              <Detail :row="row" :pid="pid" @e-update="getData"></Detail>
            </Col>
          </Row>
    
    <copyRight> </copyRight>
  </div>
</template>

<script>
import {Tag} from 'iview'
import copyRight from '@/components/public/copyright'
import Tables from '_c/tables'
import Detail from './Detail'
import { getTableData } from '@/api/k8s/publish.js'
export default {
  name: 'list',
  components: {
    copyRight,
    Tables,
    Detail,
    Tag
  },
  data () {
    return {
      columns: [
        {
          title: 'ID',
          key: 'id',
          sortable: true,
          sortType: 'desc',
          width: 70,
          align: 'center',
        },
        {
          title: '发布项目', 
          key: 'project', 
          sortable: true,
          align: 'center',
        },
        // {
        //   title: '发布环境', 
        //   key: 'env', 
        //   sortable: true,
        //   align: 'center',
        //   render: (h, params) => {
        //     const envMap = {
        //       'dev':{color:'gray', desc:'开发'},
        //       'qa':{color:'gray', desc:'测试'},
        //       'staging':{color:'primary', desc:'预正式'},
        //       'release':{color:'primary', desc:'正式'}
        //     }
        //     const env = params.row.env
        //     return h(Tag, {props:{type:'dot', color:envMap[env]['color']}}, envMap[env]['desc'])
        //   }
        // },
        {
          title: '状态', 
          key: 'status',
          align: 'center',
          width: 90,
          render: (h, params) => {
            let status = params.row.status
            if(status == 0){
              return h('div', [h(Tag,{props:{color:'default'}}, '待执行')])
            }
            else if(status == 11 || status == 31){
              return h('div', [h(Tag,{props:{color:'primary'}}, '执行中')])
            }
            else if (status == 12) {
              return h('div', [h(Tag,{props:{color:'warning'}}, '待审核')])
            }  
            else if (status == 2) {
              return h('div', [h(Tag,{props:{color:'primary'}}, '审核中')])
            }
            else if (status == 32) {
              return h('div', [h(Tag,{props:{color:'success'}}, '完成')])
            }
            else{
              return h('div', [h(Tag,{props:{color:'error'}}, '失败')])
            }
          }
        },
        // {title: '审批人', key: 'review_user', align: 'center',width: 120},
        // {title: '提交人', key: 'submit_user', align: 'center',width: 120},
        // {title: '提交时间', key: 'ctime', align: 'center',width: 150},
        
        {
          title: '操作',
          key: 'handle',
          width: 90,
          align: 'center',
          button: [
            (h, params, vm) => {
              return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                    marginRight: '5px'
                },
                on: {
                  click: () => {
                    //this.show(params.index)
                    //this.handleEdit(params.index,params.row)
                    //this.$router.push('/publish/detail/'+ params.row.id +'/');
                    this.row = params.row
                    this.pid = params.row.id
                  }
                }
              },'详情'),
              ])
            }
          ]
        },



      ],
      tableData: [],
      row: [],
      pid: null
    }
  },
  methods: {
    handleDelete (params) {
      console.log(params)
    },
    onRowClick (row,index){
      //点击行时
      //console.log(row.id)
      //this.row = row
    },
    show (index) {
      this.$Modal.info({
          title: '开始发布',
          content: `项目名称：${this.tableData[index].name}<br>运行时间：${this.tableData[index].time}<br>镜像：${this.tableData[index].iamge}`
      })
    },
    remove (index) {
      this.tableData.splice(index, 1);
    },
    getData(){
      //获取数据
      getTableData().then(res => {
        // console.log('tableData==>')
        // console.log(res)
        this.tableData = res.data.data
        this.pid = res.data.data[res.data.data.length - 1].id
        this.row = res.data.data[res.data.data.length - 1]
        //console.log(this.row)
      })
    }
  },
  mounted () {
    /** 获取表格数据 **/
    this.getData()
  }
}
</script>
<template>
  <div>
    <Row>
      <Col span="16">
        <Card>
          <tables border ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete">
            <!-- <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button> -->
            <div slot="new_btn" class="search-col">
              <Button type="info" class="search-btn"  @click="handleAdd">添加主机组</Button>
            </div>
          </tables>
        </Card>
        <Add :dialog="dialog" :formData="formData" @e-update="getData" @e-close="closeModal"></Add>
      </Col>
      <Col span="7" offset="1">
        <Card>
          <Tree :data="treeData"></Tree>
        </Card>
      </Col>
    </Row> 

    <copyRight> </copyRight>
    
  </div>
</template>

<script>
import {Tag} from 'iview'
import copyRight from '@/components/public/copyright'
import Tables from '_c/tables'
import Add from './Add'
import { getTableData } from '@/api/cmdb/server_group.js'
export default {
  name: 'list',
  components: {
    copyRight,
    Tables,
    Tag,
    Add
  },
  data () {
    return {
      treeData: [],
      // 弹出框
      loading: false,
      dialog:{
        show: false,
        title: '',
        option: ''
      },
      columns: [
        {
          title: 'ID',
          key: 'id',
          sortable: true,
          sortType: 'desc',
          width: 70,
          align: 'center',
        },
        {title: '组名', key: 'name', align: 'center',},
        {title: '描述', key: 'comment', align: 'center',},

        {
          title: '操作',
          key: 'handle',
          width: 200,
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
                    this.handleEdit(params.index,params.row)
                  }
                }
              },'编辑'),
              h('Button', {
                  props: {
                      type: 'error',
                      size: 'small'
                  },
                  on: {
                      click: () => {
                          this.remove(params.index)
                          // vm.$emit('on-delete', params)
                          // vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                      }
                  }
              }, '删除')
              ])
            }
          ]
        },

      ],
      tableData: [],
      formData: {
          name: '',
          comment: '',
          server_set: []
      }
    }
  },
  methods: {
    handleDelete (params) {
      console.log(params)
    },
    // show (index) {
    //   this.$Modal.info({
    //       title: '开始发布',
    //       content: `项目名称：${this.tableData[index].name}<br>运行时间：${this.tableData[index].time}<br>镜像：${this.tableData[index].iamge}`
    //   })
    // },
    remove (index) {
      this.tableData.splice(index, 1);
    },
    // 弹出对话框
    showModal () {
      this.dialog.show = true
    },
    // 新增
    handleAdd() {
      this.dialog = {
        show: true,
        title: '添加主机组',
        option: 'add'
      }
    },
    // 编辑
    handleEdit(index,row) {
      this.dialog = {
        show: true,
        title: '编辑主机组',
        option: 'edit'
      };
      this.formData= {
          name: row.name,
          comment: row.comment,
          id: row.id
      }
    },
    getData(){
      //获取数据
      getTableData().then(res => {
        this.tableData = res.data
        //console.log(this.tableData)

        this.treeData = []
        for(let item in res.data){
          let children = []
            for(let c in res.data[item].server_set){
              children.push({ title: res.data[item].server_set[c] })
            }
          this.treeData.push({
              title: res.data[item].name,
              expand: false,
              render: (h, { root, node, data }) => {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: 'ios-folder-outline'
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', data.title)
                    ])
                ]);
            },
              children:children
          })
        }

      })
    },
    closeModal(){
      //关闭modal
      this.dialog.show = false
    }
  },
  mounted () {
    /** 获取表格数据 **/
    this.getData()
    //console.log('get user->'+ this.$store.getters.user.id)
  }
}
</script>
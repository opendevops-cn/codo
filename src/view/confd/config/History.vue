<template>
  <tables border ref="tables" searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete"
    @on-select="selectOne" @on-select-cancel="unselectOne" @on-select-all="selectAll"
    @on-search-table="handleSearchTable"
  >
    <div slot="new_btn" class="search-col" style="width:450px">
      <Button type="info" class="search-btn"  @click="handleAdd">添加项目</Button>
    </div>
  </tables>
</template>
<script>
export default {
  name: 'history',
  props: {

  },
  data () {
    return {
      tableData: [
        {'id':'2', 'project_code': 'ss','project_name': 'shenshuo','user':'sss'},
        {'id':'3','project_code': 'yanghongfei','project_name': '杨红飞','user':'shenshuo'}
      ],
      columns: [
        {
          title: '',
          key: '',
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '项目名称',
          key: 'project_name', 
          align: 'center',
          render: (h, params) => {
            return h('router-link', {props:{to:'/confd/confd_config/'+params.row.project_code+ '/'}}, params.row.project_name)
          }
        },
        {title: '项目代号', key: 'project_code', align: 'center'},
        {title: '创建者', key: 'user', align: 'center'},
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
                    // this.show(params.index)
                      this.handleEdit(params.index, params.row)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      // this.remove(params.index)
                      this.handleRemove(params.row)
                    }
                  }
                }, '删除')
              ])
            }
          ]
        }

      ],
    }
  },
  methods: {
    
  }

}
</script>

<template>
  <div>
    <div class="search-con search-con-top">
      <Input class="search-input" v-model="searchValue" clearable :maxlength='50' placeholder="输入关键字搜索"/>
    </div>

    <Table :columns="tableColumns" :data="tableData" size="small" stripe ref="businessTable"></Table>

    <div class="tz-page-layout">
      <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" show-total show-sizer :page-size-opts="[15,20,50,100,500,1000]"
        @on-change="changePage" @on-page-size-change="handlePageSize" />
    </div>
    
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { getSSLChecklog } from '@/api/domain/SSL.js'
export default {
  data () {
    return {
      tableColumns: [
        {
            title: '简介',
            key: 'present',
            ellipsis: true,
            minWidth: 150,
            maxWidth: 250,
        },
        {
            title: '监控状态',
            key: 'status',
            minWidth: 150,
            maxWidth: 250,
            render: (h, params) => {
            if (params.row.status == "异常") {
              return h("div", [
                h(
                  "p",
                  {
                    style: {
                      fontSize: "14px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      color: "red"
                    }
                  },
                  params.row.status
                )
              ]);
            } else {
              return h("div", [
                h(
                  "p",
                  {
                    style: {
                      fontSize: "14px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      color: "green"
                    }
                  },
                  params.row.status
                )
              ]);
            }
          }
        },
        {
            title: '记录内容',
            key: 'record',
            minWidth: 300,
            maxWidth: 700,
        },
        {
            title: '记录时间',
            key: 'last_update',
            minWidth: 150,
        }
      ],
      tableData: [],
      pageTotal: 0, // 数据总数
      pageNum: 1, // 当前页码
      pageSize: 15, // 每页条数，设置为15是为了方便一般情况下，显示出所有的业务
      searchValue: '',
    }
  },
   methods: {
    handlerSSLChecklog() {
      getSSLChecklog(this.pageNum, this.pageSize, this.searchValue).then(res => {
        if (res.data.result) {
          this.pageTotal = res.data.data.count
          this.tableData = res.data.data.data
        } else {
          this.tableData = this.$options.tableData
          this.$Message.error({
              content: JSON.stringify(res.data.messages),
              duration: 3
          })
        }
      })
    },

    // 切换页码
    changePage(value){
      this.pageNum = value
      this.handlerSSLChecklog()
    },    
    handlePageSize(value){
       this.pageSize = value
       this.handlerSSLChecklog()
    }  
   },
   watch:{
    searchValue (val) {
      this.handlerSSLChecklog()
    },
   },
   mounted () {
     this.handlerSSLChecklog()
   }
}
</script>
<style lang="less" scoped>
  .search-con {
    padding: 5px 0;
    .search {
      &-input {
        display: inline-block;
        width: 350px;
        margin-left: 2px;
      }
      &-btn {
        margin-right: 0px;
        float:right;
      }
    }
  }
</style>
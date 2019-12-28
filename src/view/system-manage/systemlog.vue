<template>
 <Card>
    <div class="search-con search-con-top">
      <Select v-model="searchKey" class="search-col">
        <Option v-for="item in columns" v-if="item.key !== 'handle'" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
      </Select>
      <Input @on-change="handleClear" clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
      <DatePicker :value="dateValue" type="daterange" placement="bottom-end" @on-change="changeDate" placeholder="Select date" style=" margin-left: 2px; width: 200px"></DatePicker>
      <Button @click="handleSearch" class="search-btn" type="primary">搜索</Button>
    </div>
  <Table size="small" :columns="columns" :data="tableData"></Table>
  <div style="margin: 10px;overflow: hidden">
    <div style="float: left;">
      <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[10,15,25,35,50,100] show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
    </div>
  </div>
</Card>
</template>

<script>
import { getLoglist } from '@/api/app'
export default {
  data () {
    return {
      columns: [
        {
          title: '用户名',
          key: 'username',
          align: 'center',
          minWidth: 120,
          sortable: true
        },
        {
          title: '昵称',
          key: 'nickname',
          minWidth: 100
        },
        {
          title: '请求方法',
          key: 'method',
          minWidth: 100
        },
        {
          title: '请求路径',
          key: 'uri',
          minWidth: 220
        },
        {
          title: '请求数据',
          key: 'data',
          minWidth: 220
        },
        {
          title: '登录IP',
          key: 'login_ip',
          width: 140
        },
        {
          title: '操作时间',
          key: 'ctime',
          width: 160
        }
      ],
      tableData: [],
      pageTotal: 0, // 数据总数
      pageNum: 1, // 当前页码
      pageSize: 15, // 每页条数
      //
      searchKey: 'username',
      searchValue: '',
      dateValue: []
    }
  },
  methods: {
    getLogList (page, limit, key, value, dateValue) {
      getLoglist(page, limit, key, value, dateValue).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
          this.pageTotal = res.data.count
          this.tableData = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    changeDate (value) {
      this.dateValue = value
    },
    changePage (value) {
      this.pageNum = value
      this.getLogList(
        this.pageNum,
        this.pageSize,
        this.searchKey,
        this.searchValue,
        this.dateValue
      )
    },
    // 每页条数
    handlePageSize (value) {
      this.pageSize = value
      this.getLogList(
        1,
        this.pageSize,
        this.searchKey,
        this.searchValue,
        this.dateValue
      )
    },
    handleClear (e) {
      if (e.target.value === '') this.tableData = this.value
    },
    handleSearch () {
      this.getLogList(
        this.pageNum,
        this.pageSize,
        this.searchKey,
        this.searchValue,
        this.dateValue
      )
    }
  },
  watch: {
    value (val) {
      this.handleSearch()
    }
  },
  mounted () {
    this.getLogList(this.pageNum, this.pageSize)
  }
}
</script>

<style lang="less" scoped>
.search-con {
  padding: 10px 0;
  .search {
    &-col {
      display: inline-block;
      width: 200px;
    }
    &-input {
      display: inline-block;
      width: 200px;
      margin-left: 2px;
    }
    &-btn {
      margin-left: 2px;
    }
  }
}
</style>

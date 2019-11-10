<template>
<Card style="height:100%">
    <div class="search-con search-con-top">
      <Select v-model="searchKey" class="search-col">
        <Option v-for="item in columns" v-if="item.key !== 'task_log'" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
      </Select>
      <Input @on-change="handleClear" clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
      <DatePicker :value="dateValue" type="daterange" placement="bottom-end" @on-change="changeDate" placeholder="Select date" style=" margin-left: 2px; width: 200px"></DatePicker>
      <Button @click="handleSearch" class="search-btn" type="primary">搜索</Button>
    </div>
  <Table size="small" ref="selection" :columns="columns" :data="tableData"></Table>
  <div style="margin: 10px;overflow: hidden">
    <div style="float: left;">
      <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[10,15,25,35,50,100] show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
    </div>
  </div>
</Card>
</template>

<script>
import { getCronLoglist } from '@/api/cron'
export default {
  data () {
    return {
      columns: [
        {
          title: 'job id',
          key: 'job_id',
          width: 180
        },
        {
          title: '状态',
          key: 'status',
          width: 100
        },
        {
          title: '任务指令',
          key: 'task_cmd',
          width: 400
        },
        {
          title: '日志数据',
          key: 'task_log'
        },
        {
          title: '执行时间',
          key: 'exec_time',
          width: 160
        }
      ],
      tableData: [],
      pageTotal: 0, // 数据总数
      pageNum: 1, // 当前页码
      pageSize: 15, // 每页条数
      //
      searchKey: 'job_id',
      searchValue: '',
      dateValue: []
    }
  },
  methods: {
    getCronLogList (page, limit, key, value, dateValue) {
      getCronLoglist(page, limit, key, value, dateValue).then(res => {
        if (res.data.code === 0) {
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
      this.getCronLogList(
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
      this.getCronLogList(
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
      this.getCronLogList(
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
    this.getCronLogList(this.pageNum, this.pageSize)
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

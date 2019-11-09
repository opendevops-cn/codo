<template>
  <Card style="height:100%;">
    <div class="search-con search-con-top">
      <Select v-model="searchKey" class="search-col">
        <Option
          v-for="item in columns"
          v-if="item.key !== 'handle'"
          :value="item.key"
          :key="`search-col-${item.key}`"
        >{{ item.title }}</Option>
      </Select>
      <Input
        @on-change="handleClear"
        clearable
        placeholder="输入关键字搜索"
        class="search-input"
        v-model="searchValue"
      />
      <DatePicker
        :value="dateValue"
        type="daterange"
        placement="bottom-end"
        @on-change="changeDate"
        placeholder="Select date"
        style=" margin-left: 2px; width: 200px"
      ></DatePicker>
      <Button @click="handleSearch" class="search-btn" type="primary">搜索</Button>

      <Button v-if="rules.webterminal_log_btn" type="info" class="search-btn"  @click="webTerminnalLog">录像回放</Button>
      </Button>
    </div>
    <Table size="small" ref="selection" border :columns="columns" :data="tableData"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: left;">
        <Page
          :total="pageTotal"
          :current="pageNum"
          :page-size="pageSize"
          :page-size-opts="[10,15,25,35,50,100]"
          show-sizer
          show-total
          @on-change="changePage"
          @on-page-size-change="handlePageSize"
        ></Page>
      </div>
    </div>
  </Card>
</template>

<script>
import { getLoglist } from "@/api/cmdb2/audit";
import { webterminnalLog } from "@/api/cmdb2/server.js";
import { mapState } from "vuex";
export default {
  data() {
    return {
      columns: [
        {
          title: "ID",
          key: "id",
          align: "center",
          width: 100,
          sortable: true
        },
        {
          title: "用户名",
          key: "username",
          align: "center",
          sortable: true,
          minWidth: 100,
        },
        {
          title: "请求对象",
          key: "request_object",
          align: "center",
          width: 130,
          sortable: true
        },
        {
          title: "操作机器",
          key: "request_host",
          align: "center",
          minWidth: 150,
          sortable: true
        },
        {
          title: "请求方法",
          key: "request_method",
          align: "center",
          width: 130,
          sortable: true
        },
        {
          title: "变更内容",
          key: "",
          width: 180,
          align: "center",
          sortable: true,
          render: (h, params) => {
            let url = this.config_api + "?" + "id" + "=" + params.row.id;
            return h(
              "a",
              {
                attrs: {
                  href: url,
                  target: "_black"
                }
              },
              "查看详情"
            );
          }
        },
        {
          title: "操作时间",
          key: "ctime",
          align: "center",
          minWidth: 120,
          sortable: true
          //   width: 120,
        }
      ],
      tableData: [],
      pageTotal: 0, // 数据总数
      pageNum: 1, // 当前页码
      pageSize: 15, // 每页条数
      //
      searchKey: "username",
      searchValue: "",
      config_api: "",
      dateValue: []
    };
  },
  methods: {
    getLogList(page, limit, key, value, dateValue) {
      getLoglist(page, limit, key, value, dateValue).then(res => {
        this.config_api = `${
          res.request.responseURL.split("/cmdb2/")[0]
        }/cmdb2/v1/cmdb/operational_audit/`;
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`);
          this.pageTotal = res.data.count;
          this.tableData = res.data.data;
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },
    //请求Web Terminal log接口
    webTerminnalLog() {
      webterminnalLog().then(res => {
        if (res.data.code === 0) {
          // this.loading = false;
          this.$Message.success(`${res.data.msg}`);
          let web_terminallog_conncet =
            res.data.data.web_terminal_url +
            res.data.data.web_terminal_key +
            "/";
          // console.log('web_terminal_conncet-->',web_terminal_conncet)
          window.open(web_terminallog_conncet);
        } else {
          // this.loading = false;
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },
    changeDate(value) {
      this.dateValue = value;
    },
    changePage(value) {
      this.pageNum = value;
      this.getLogList(
        this.pageNum,
        this.pageSize,
        this.searchKey,
        this.searchValue,
        this.dateValue
      );
    },
    // 每页条数
    handlePageSize(value) {
      this.pageSize = value;
      this.getLogList(
        1,
        this.pageSize,
        this.searchKey,
        this.searchValue,
        this.dateValue
      );
    },
    handleClear(e) {
      if (e.target.value === "") this.tableData = this.value;
    },
    handleSearch() {
      this.getLogList(
        this.pageNum,
        this.pageSize,
        this.searchKey,
        this.searchValue,
        this.dateValue
      );
    }
  },
  computed: {
    ...mapState({
      rules: state => state.user.rules
    })
  },
  watch: {
    value(val) {
      this.handleSearch();
    }
  },
  mounted() {
    this.getLogList(this.pageNum, this.pageSize);
  }
};
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

<template>
  <Card style="height:100%">
    <div class="search-con search-con-top">
      <Select v-model="searchKey" class="search-col">
        <Option
          v-for="item in columns"
          v-if="item.key !== 'handle' && item.key !== 'status' && item.key !== ''"
          :value="item.key"
        >{{ item.title }}</Option>
      </Select>
      <Input class="search-input" v-model="searchValue" @on-change="handleClear" clearable placeholder="输入关键字搜索"/>
      <Button class="search-btn" type="primary" @click="handleSearch">搜索</Button>
      <slot name="new_btn"><Button type="primary" @click="editModal('', 'post', '新建发布')" class="search-btn">新建应用</Button></slot>
    </div>
    <Table size="small" height="718" ref="selection" border :columns="columns" :data="tableData"/>
    <Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :loading=true :footer-hide=true :mask-closable=false width="850">
      <Alert show-icon>
        <p>1. 任务在构建主机执行，确保构建主机可从仓库拉取代码和访问目标主机。</p>
        <p>2. 考虑到安全性，任务会屏蔽 Secret secret 开头的参数，请通过API获取。</p>
      </Alert>

      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="85">
        <!-- <FormItem label="代码仓库">
          <div>
            <treeselect v-model="selectRepo" :disable-branch-nodes="true" search-nested :options="repoTreeData"  placeholder="选择代码仓库"/>
          </div>
        </FormItem> -->
        <div v-if="editModalData && editModalData == 'put'">
          <FormItem
            label="发布应用"
            prop="publish_name"
          >
            <Input
              v-model="formValidate.publish_name"
              disabled
              :maxlength="45"
              placeholder="参数名：PUBLISH_NAME 发布应用的名称，建议加上发布类型，发布环境的后缀"
            ></Input>
          </FormItem>
        </div>
        <div v-else>
          <FormItem
            label="发布应用"
            prop="publish_name"
          >
            <Input
              v-model="formValidate.publish_name"
              :maxlength="45"
              placeholder="参数名：PUBLISH_NAME 发布应用的名称，建议加上发布类型，发布环境的后缀"
            ></Input>
          </FormItem>
        </div>
        <FormItem
          label="发布类型"
          prop="publishType"
        >
          <RadioGroup
            v-model="formValidate.publish_type"
            @on-change="handlerSelectType"
          >
            <Radio label="service">服务器</Radio>
            <Radio label="bucket">存储桶</Radio>
            <Radio label="container">容器</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          label="构建主机"
          prop="build_host"
        >
          <Input
            v-model="formValidate.build_host"
            :maxlength=20
            placeholder="参数名：BUILD_HOST 构建、发布应用的主机"
          ></Input>
        </FormItem>
        <FormItem
          label="代码仓库"
          prop="repository"
        >
          <Select v-model="formValidate.repository" clearable filterable placeholder="参数名：REPOSITORY 选择代码仓库">
            <Option
              v-for="(repository, index) in repositoryList"
              :value="repository"
              :key="`${_uid}_${index}`"
            >{{repository}}</Option>
          </Select>
        </FormItem>
        <FormItem label="关联模板" prop="temp_name">
          <Select v-model="formValidate.temp_name"  clearable filterable placeholder="关联一个模板，用来执行发布任务">
            <Option
              v-for="temp in templateList"
              :value="temp"
              :key="`${_uid}_${temp}`"
            >{{temp}}</Option>
          </Select>
        </FormItem>
        <FormItem
          label="排除文件"
          prop="exclude_file"
        >
          <Input
            v-model="formValidate.exclude_file"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            :maxlength="200"
            placeholder="参数名：EXCLUDE_FILE 需要排除的文件, 默认排除.git。使用回车分割。"
          ></Input>
        </FormItem>
        <div v-if="formValidate.publish_type === 'service'">
          <FormItem
            label="发布类型"
            prop="publishType"
          >
            <RadioGroup
              v-model="formValidate.publish_type1"
              @on-change="handlerSelectType1"
            >
              <Radio label="simple">简单</Radio>
              <Radio
                disabled
                label="gray "
              >灰度</Radio>
              <Radio
                disabled
                label="blue"
              >蓝绿</Radio>
            </RadioGroup>
          </FormItem>
          <div v-if="formValidate.publish_type1 === 'blue'">
            <FormItem
              label="负载均衡"
              prop="build_host"
            >
              <Input
                v-model="formValidate.buildHost"
                placeholder="根据负载均衡地址获取发布主机，支持阿里云、腾讯云、AWS"
              ></Input>
            </FormItem>
            <FormItem
              label="负载均衡blue"
              prop="build_host"
            >
              <Input
                v-model="formValidate.buildHost"
                placeholder="根据负载均衡地址获取发布主机，支持阿里云、腾讯云、AWS"
              ></Input>
            </FormItem>
          </div>
          <div v-else>
            <FormItem label="目标主机" prop="tag_name">
              <Alert>
                根据标签来选择主机，要保证构建主机可连通选择的主机 HOSTNAME_LIST 可以当作salt name 来使用，IP_LIST使用SSH协议
              </Alert>
              <Select class="search-input-long" v-model="formValidate.tag_name" filterable  placeholder="参数名：HOSTNAME_LIST 和 IP_LIST">
                <Option v-for="item in allTagList" :value="item.tag_name" :key="item.id" >{{ item.tag_name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="API(自定义)">
              <Input
                v-model="formValidate.publish_hosts_api"
                :maxlength="120"
                placeholder="参数名：HOSTS_API 输入一个参数。系统会把此参数传给任务"
              ></Input>
            </FormItem>
          </div>
          <FormItem label="发布目录" prop="publish_path">
            <Input
              v-model="formValidate.publish_path"
              :maxlength=35
              placeholder="参数名：PUBLISH_PATH 发布到目标主机的目录路径，例如： /var/www/"
            ></Input>
          </FormItem>
        </div>
        <div v-else-if="formValidate.publish_type === 'bucket'">
          <FormItem
            label="存储桶类型"
            prop="bucket_type"
          >
            <RadioGroup
              v-model="formValidate.bucket_type"
              @on-change="handlerSelectType2"
            >
              <Radio label="oss">OSS</Radio>
              <Radio label="cos">COS</Radio>
              <Radio label="s3">S3</Radio>
            </RadioGroup>
          </FormItem>
          <div v-if="formValidate.bucket_type === 'cos'">
            <FormItem label="温馨提示">
              <Alert
                type="warning"
                show-icon
              >${bucket_name} 腾讯云COS 存储桶名称需要带上APP ID</Alert>
            </FormItem>
          </div>
          <FormItem
            label="区域region"
            prop="region"
          >
            <Input
              v-model="formValidate.region"
              :maxlength=30
              placeholder="参数名：REGION 参考云厂商的可用区编号，例如："
            ></Input>
          </FormItem>
          <FormItem
            label="存储桶名称"
            prop="bucket_name"
          >
            <Input
              v-model="formValidate.bucket_name"
              :maxlength=45
              placeholder="参数名：BUCKET_NAME  你要发布的存储桶名称"
            ></Input>
          </FormItem>
          <div v-if="formValidate.bucket_type === 'cos'">
            <FormItem
              label="存储路径"
              prop="bucket_path"
            >
              <Input
                v-model="formValidate.bucket_path"
                :maxlength=50
                placeholder="参数名：BUCKET_PATH 存储的路径 ${bucket_name}/${bucket_path}"
              ></Input>
            </FormItem>
          </div>
          <FormItem
            label="SecretID"
            prop="SecretID"
          >
            <Input
              v-model="formValidate.SecretID"
              :maxlength=60
              placeholder="相对应云厂商的SecretID, 注意使用方法，不要泄露"
            ></Input>
          </FormItem>
          <FormItem
            label="SecretKey"
            prop="SecretKey"
          >
            <Input
              v-model="formValidate.SecretKey"
              :maxlength=120
              type="password"
              placeholder="相对应云厂商的SecretKey  注意使用方法，不要泄露"
            ></Input>
          </FormItem>
        </div>
        <div v-else-if="formValidate.publish_type === 'container'">
          <FormItem
            label="镜像仓库"
            prop="docker_registry"
          >
            <Select
              v-model="formValidate.docker_registry"
              placeholder="参数名：DOCKER_REGISTRY 选择镜像仓库项目地址"
            >
              <Option
                v-for="(item, index) in dockerRepositoryList"
                :value="item"
                :key="`${_uid}_${index}`"
              >{{item}}</Option>
            </Select>
          </FormItem>
          <FormItem
            <FormItem
            label="K8S主机"
            prop="k8s_host"
          >
            <Input
              v-model="formValidate.k8s_host"
              placeholder="参数名：K8S_HOST 输入K8S主机地址信息，通过构建主机连接此主机执行命令"
            ></Input>
          </FormItem>
          <FormItem
            label="命名空间"
            prop="namespace"
          >
            <Input
              v-model="formValidate.namespace"
              placeholder="参数名：NAMESPACE 请输入namespace"
            ></Input>
          </FormItem>
        </div>
        <FormItem label="邮件通知人">
          <Input
            v-model="formValidate.mail_to"
            :maxlength=500
            placeholder="参数名：MAIL_TO 执行任务中如果需要发送邮件，则需要填写"
          ></Input>
        </FormItem>
        <FormItem label="配置文件">
          <Input
            v-model="formValidate.config_file"
            type="textarea"
            :maxlength=500
            :autosize="{minRows: 3,maxRows: 10}"
            placeholder="参数名：CONFIG_FILE。格式： key,,path,,abs|rel(绝对路径|相对路径) /conf/shenshuo/dev/nginx/demo.conf,,/etc/nginx/conf.d,,abs /conf/shenshuo/dev/app/settings.py,,settings.py,,rel     这只是一种使用方法，如果不理解，请自行查看配置中心的文档，来实现"
          ></Input>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            @click="handleSubmit('formValidate')"
          >提交</Button>
          <Button
            @click="handleReset('formValidate')"
            style="margin-left: 8px"
          >重置</Button>
        </FormItem>
      </Form>
    </Modal>
  </Card>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getTemplist } from "@/api/task";
import { getGittree2, getGitrepo } from '@/api/git-repo'
import { getPublishlist, operationPublishlist, getTaglist,  getDockerrepository } from '@/api/task-other'
export default {
  components: { Treeselect },
  data() {
    return {
      repositoryList: [],
      selectRepo: null,
      repoTreeData:[],
      dockerRepositoryList: [],
      templateList: [],
      allTagList:[],
      formValidate: {
        publish_name: "",
        publish_type: "service",
        build_host: "127.0.0.1",
        repository: "",
        temp_name: "",
        exclude_file: "",
        publish_type1: "simple",
        publish_hosts: "",
        publish_hosts_api: "",
        tag_name:"",
        publish_path: "",
        config_file:"",
        mail_to: "",
        bucket_type: "oss",
        region: "",
        bucket_name: "",
        bucket_path: "",
        SecretID: "",
        SecretKey: "",
        docker_registry: "",
        k8s_host: "",
        namespace: ""
      },
      ruleValidate: {
        publish_name: [
          {
            required: true,
            message: "The app name cannot be empty",
            trigger: "blur"
          }
        ],
        build_host: [
          {
            required: true,
            message: "构建主机不能为空",
            trigger: "blur"
          }
        ],
        repository: [
          {
            required: true,
            message: "请选择一个仓库地址",
            trigger: "change"
          }
        ],
        temp_name: [
          {
            required: true,
            message: "请选择一个模板",
            trigger: "change"
          }
        ],
        publish_path: [
          { required: true, message: "发布的目录不能为空", trigger: "blur" }
        ],
        region: [{ required: true, message: "区域不能为空", trigger: "blur" }],
        bucket_name: [
          { required: true, message: "存储桶名称不能为空", trigger: "blur" }
        ],
        bucket_path: [
          { required: true, message: "存储路径不能为空", trigger: "blur" }
        ],
        SecretID: [
          { required: true, message: "SecretID不能为空", trigger: "blur" }
        ],
        SecretKey: [
          { required: true, message: "SecretKey不能为空", trigger: "blur" }
        ],
        k8s_host: [
          {
            required: true,
            message: "K8S master 主机不能为空",
            trigger: "blur"
          }
        ],
        namespace: [
          { required: true, message: "K8S 命名空间不能为空", trigger: "blur" }
        ]
      },
      columns: [
        {
          title: "应用名称",
          key: "publish_name",
          align: "center",
          width: 200,
          sortable: true
        },
        {
          title: "发布类型",
          key: "publish_type",
          width: 150,
          align: "center",
          sortable: true
        },
        {
          title: "构建主机",
          key: "build_host",
          width: 180,
          align: "center",
          sortable: true
        },
        {
          title: "关联模板",
          key: "temp_name",
          width: 200,
          align: "center",
          sortable: true
        },
        {
          title: "仓库地址",
          key: "repository",
          align: "center",
          sortable: true
        },
        {
          title: "操作",
          key: "handle",
          width: 160,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.editModal(params.row.id, "put", "编辑应用");
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.delData(params);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      tableData: [],
      modalMap: {
        modalVisible: false,
        modalTitle: "新建"
      },
      formList: [],
      editModalData: "",
      //
      searchKey: "",
      searchValue: ""
    };
  },
  methods: {
    // 获取发布配置信息
    getPublishList(key, value) {
      getPublishlist(key, value).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data;
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },
    // 获取模板
    getTempList() {
      getTemplist().then(res => {
        if (res.data.code === 0) {
          res.data.data.forEach(element => {
            this.templateList.push(element.temp_name);
          });
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },
    // 获取仓库地址
    getCodeRepository() {
      getGitrepo().then(res => {
        if (res.data.code === 0) {
            res.data.data.forEach(element => {
            this.repositoryList.push(element.ssh_url_to_repo);
          });
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },
    //
    getCodeRepoTree() {
      getGittree2().then(res => {
        if (res.data.code === 0) {
          this.repoTreeData =res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },
    // 获取docker仓库地址
    getDockerRepository(key, value) {
      getDockerrepository(key, value).then(res => {
        if (res.data.code === 0) {
          res.data.data.forEach(element => {
            this.dockerRepositoryList.push(element.registry_url);
          });
        } else {
          this.$Message.error(`${res.data.msg}`);
        }
      });
    },
    getAllTagList() {
      getTaglist(1, 888).then(res => {
        if (res.data.code === 0) {
          this.allTagList = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 选择类型
    handlerSelectType(val) {
      this.formValidate.publish_type = val;
    },

    // 选择类型
    handlerSelectType1(val) {
      this.formValidate.publish_type1 = val;
    },
    handlerSelectType2(val) {
      this.formValidate.bucket_type = val;
    },
    editModal(ID, meth, mtitle) {
      this.modalMap.modalVisible = true;
      this.modalMap.modalTitle = mtitle;
      this.editModalData = meth;
      if (ID) {
        getPublishlist("id", ID).then(res => {
          if (res.data.code === 0) {
            this.formValidate = res.data.data[0];
          } else {
            this.$Message.error(`${res.data.msg}`);
          }
        });
      }else{
        this.formValidate = {
          publish_name: "",
          publish_type: "service",
          build_host: "127.0.0.1",
          repository: "",
          temp_name: "",
          exclude_file: "",
          publish_type1: "simple",
          publish_hosts: "",
          publish_hosts_api: "",
          tag_name:"",
          publish_path: "",
          config_file:"",
          mail_to: "",
          bucket_type: "oss",
          region: "",
          bucket_name: "",
          bucket_path: "",
          SecretID: "",
          SecretKey: "",
          docker_registry: "",
          k8s_host: "",
          namespace: ""
        }
      }
    },

    handleSubmit(value) {
      this.$refs[value].validate((valid) => {
        if (valid) {
          setTimeout(() => {
            operationPublishlist(this.formValidate, this.editModalData).then(
              res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`);
                  this.getPublishList(this.searchKey, this.searchValue);
                  this.modalMap.modalVisible = false;
                } else {
                  this.$Message.error(`${res.data.msg}`);
                }
              }
            );
          }, 1000);
        } else {
          this.$Message.error('表单校验错误');
        }
      })
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    // 删除
    delData(params) {
      if (confirm(`确定要删除 ${params.row.publish_name}`)) {
        operationPublishlist({ publish_app_id: params.row.id }, "delete").then(
          res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`);
              this.tableData.splice(params.index, 1);
            } else {
              this.$Message.error(`${res.data.msg}`);
            }
          }
        );
      }
    },
    setDefaultSearchKey() {
      this.searchKey =
        this.columns[0].key && this.columns[0].key !== "handle"
          ? this.columns[0].key
          : this.columns.length > 1
          ? this.columns[1].key
          : "";
    },
    handleClear(e) {
      if (e.target.value === "") this.tableData = this.value;
    },
    handleSearch() {
      this.getPublishList(this.searchKey, this.searchValue);
    }
  },
  watch: {
    searchValue(val) {
      this.getPublishList(this.searchKey, val);
    },
    selectRepo(val) {
      console.log(val)
    }
  },
  mounted() {
    this.getPublishList()
    this.setDefaultSearchKey()
    // this.getCodeRepoTree()
    this.getCodeRepository()
    this.getTempList()
    this.getDockerRepository()
    this.getAllTagList()
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
    &-select-col {
      display: inline-block;
      width: 70px;
      
    }
    &-select {
      display: inline-block;
      margin-left:85px;
    }
    &-btn {
      margin-left: 2px;
    }
  }
}
</style>

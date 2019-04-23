
<template>
  <div style="background:#eee">
   <Card style="height:100%;">
    <Row style="margin-top: 5px;">
      <Col span="15">
       <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
        <Row>
          <Col span="11">
            <FormItem label="执行主机" prop="exec_host">
              <Input v-model="formValidate.exec_host" placeholder="请输入在那里执行下列任务"></Input>
            </FormItem>
          </Col>
          <Col span="11" offset='2'>
            <FormItem label="任务模板" prop="temp_name">
              <Input v-model="formValidate.temp_name" disabled></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="关联标签" prop="tag_list">
              <Select class="search-input-long" v-model="formValidate.tag_list" filterable placeholder="请选择关联的标签">
                <Option v-for="item in allTagList" :value="item.tag_name" :key="item.id" >{{ item.tag_name }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="选择资源">
          <CheckboxGroup v-model="selectType">
            <Checkbox label="服务器"></Checkbox>
            <Checkbox label="MySQL数据库"></Checkbox>
            <Checkbox label="Redis缓存"></Checkbox>
            <Checkbox label="域名"></Checkbox>
          </CheckboxGroup>
        </FormItem>
        <div v-if="select_server">
        <FormItem label="主机名称" prop="hostname">
           <Input v-model="formValidate.hostname" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder='请输入主机名，并以半角逗号分隔，请严格按照规范填写。例如：OPS-SH_TX-salt-master01，磁盘默认为100G，系统默认获取 FT-VA-01 为当前组的标签。购买主机时，默认使用标签命名的镜像，如果不存在，则取默认镜像。'></Input>
        </FormItem>
        <FormItem label="主机类型" prop="instance_type">
            <Input v-model="formValidate.instance_type" placeholder="请输入CVM的instance type，类型需要参考文档"></Input>
        </FormItem>
        <FormItem label="主机磁盘" prop="disk_size">
          <Select v-model="formValidate.disk_size">
            <Option v-for="item in rdsSize" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="环境-工具" prop="host_env">
          <CheckboxGroup v-model="formValidate.host_env">
            <Checkbox label="PHP56"></Checkbox>
            <Checkbox label="PHP72"></Checkbox>
            <Checkbox label="PHP70"></Checkbox>
            <Checkbox label="Python3"></Checkbox>
            <Checkbox label="JAVA8"></Checkbox>
            <Checkbox label="golang"></Checkbox>
            <Checkbox label="node.js"></Checkbox>
            <Checkbox label="filebeat"></Checkbox>
            <Checkbox label="Nginx"></Checkbox>
            <Checkbox label="zabbix"></Checkbox>
            <Checkbox label="salt"></Checkbox>
          </CheckboxGroup>
        </FormItem>
        </div>
        <div v-if="select_rds">
        <FormItem label="RDS类型" prop='rds_type'>
            <Input v-model="formValidate.rds_type" placeholder="输入RDS型号，具体参考文档"></Input>
        </FormItem>
        <FormItem label="RDS集群" prop="rds_cluster">
          <Select v-model="formValidate.rds_cluster">
            <Option v-for="item in rdsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="RDS磁盘" prop="rds_size">
          <Select v-model="formValidate.rds_size">
            <Option v-for="item in rdsSize" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        </div>
        <FormItem v-if="select_redis" label="Redis类型" prop="redis_type">
          <Input v-model="formValidate.redis_type" placeholder="请输入redis缓存类型，具体请参考文档"></Input>
        </FormItem>
        <FormItem  v-if="select_domain" label="域名" prop="domain_name">
          <Input v-model="formValidate.domain_name" placeholder="请输入你需要绑定的域名，关联负载均衡地址"></Input>
        </FormItem>
        <Row>
          <Col span="7">
            <FormItem v-if="select_server" label="负载均衡" prop="lb">
              <RadioGroup v-model="formValidate.lb">
                <Radio label="true">关联</Radio>
                <Radio label="false">不关联</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="2" style="text-align: center">_</Col>
          <Col span="6">
           <FormItem v-if="select_server" label="域名CDN" prop="CDN">
            <RadioGroup v-model="formValidate.CDN">
              <Radio label="true">是</Radio>
              <Radio label="false">否</Radio>
            </RadioGroup>
           </FormItem>
          </Col>
          <Col span="2" style="text-align: center">_</Col>
          <Col span="7">
            <FormItem label="COS对象存储" prop="COS">
              <RadioGroup v-model="formValidate.COS">
                <Radio label="true">是</Radio>
                <Radio label="false">否</Radio>
              </RadioGroup>
           </FormItem>
          </Col>
        </Row>
        <FormItem>
          <Button type="primary" :loading="btn_loading" @click="handleSubmit('formValidate')" >提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 50px">重置</Button>
        </FormItem>
     </Form>
     </Col>
        <Col span="8" offset="1">
        <Alert>
          <div style="color: #ed4014">
            <h3>1. 执行主机：是指任务在那里运行，执行主机必须要能访问相关云厂商的API，并且能执行到相关任务。</h3>
            <h3>2. 执行模板：名称固定不能修改，必须存在，如果有修改，请自行编辑内容。</h3>
            <h3>3. 镜像默认使用关联的标签命名的镜像，如果没有则自行设置默认值，一般在任务的配置中体现。</h3>
            <h3>4. 主机名称必须符合规范，例如：OPS-SH_TX-salt-master01 第一位代表运维，第二位代表区域是腾讯云的上海，第三位代表这是第一组测试，最后一位代表运行的服务。（暂时不开通强规范）</h3>
            <h3>5. 购买的类型要参考腾讯云的文档。<br>
              <!-- <a style="margin-left: 15px" target="_blank" href="https://aws.amazon.com/cn/ec2/pricing/on-demand/">EC2</a><br>
              <a style="margin-left: 15px" target="_blank" href="https://aws.amazon.com/cn/rds/aurora/pricing/">RDS for Amazon Aurora</a><br>
              <a style="margin-left: 15px" target="_blank" href="https://aws.amazon.com/cn/rds/mysql/pricing/">RDS for MySQL</a><br>
              <a style="margin-left: 15px" target="_blank" href="https://aws.amazon.com/cn/elasticache/pricing/">Redis</a> -->
            </h3>
            <h3>6. 必须使用弹性IP，正式环境必须使用负载均衡地址，域名直接关联负载均衡地址。 </h3>
            <h3>7. 开通所有的服务均为按量付费。</h3>
          </div>
        </Alert>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
import { getTaglist, operationAssetPurchaseQcloud} from '@/api/task-other'
  export default {
    data () {
      return {
        allTagList: [],
        btn_loading: false,
        selectType: ['服务器'],
        select_server: true,
        select_rds:  false,
        select_redis: false,
        select_lb: false,
        select_domain: false,
        select_cdn: false,
        select_s3: false,
        formValidate: {
          exec_host: '127.0.0.1',
          temp_name: 'Qcloud资源申请',
          hostname: '',
          disk_size: '100',
          tag_list:'',
          instance_type: '',
          host_env: ['zabbix','salt','Python3',' Nginx'],
          rds_type:'',
          redis_type: '',
          rds_cluster:'M1',
          rds_size: '',
          domain_name: '',
          lb: 'true',
          CDN: 'true',
          COS: 'false'
        },
        rdsList: [
                  {
                      value: 'M1',
                      label: '单台高可用'
                  },
                  {
                      value: 'O1',
                      label: '单台（用于非正式）'
                  },
                  {
                      value: 'M1S1',
                      label: '一主一从'
                  },
                  {
                      value: 'M2S2',
                      label: '两主两从'
                  },
                  {
                      value: 'M3S3',
                      label: '三主三从'
                  },
                  {
                      value: 'M4S4',
                      label: '四主四从'
                  },
        ],
        rdsSize: [
                  { value: '50', label: '50G'},
                  { value: '100', label: '100G'},
                  { value: '150', label: '150G'},
                  { value: '200', label: '200G'},
                  { value: '300', label: '300G'},
                  { value: '500', label: '500G'},
                  { value: '800', label: '800G'},
                  { value: '1000', label: '1000G'},
                  { value: '2000', label: '2000G'},
                 ],
        ruleValidate: {
          exec_host: [
              { required: true, message: '执行主机不能为空，默认为127.0.0.1', trigger: 'blur' }
          ],
          hostname: [
              { required: true, message: '请输入主机名，并以半角逗号分隔，请严格按照规范填写', trigger: 'blur' }
          ],
          disk_size: [
              { required: true, message: '请选择服务器磁盘大小', trigger: 'blur' }
          ],
          tag_name: [
              { required: true, message: '请输入关联标签，如果有主机 则会自动获取', trigger: 'blur' }
          ],
          instance_type: [
              { required: true, message: '请输入主机类型，请严格按照规范填写', trigger: 'blur' }
          ],
          rds_type: [
              { required: true, message: '请输入RDS类型，请严格按照规范填写', trigger: 'blur' }
          ],
          rds_cluster: [
              { required: true, message: '请选择RDS集群类型', trigger: 'blur' }
          ],
          rds_size: [
              { required: true, message: '请选择RDS磁盘大小', trigger: 'blur' }
          ],
          redis_type: [
              { required: true, message: '请输入Redis类型，请严格按照规范填写', trigger: 'blur' }
          ],
          domain_name: [
              { required: true, message: '请输入关联域名', trigger: 'blur' }
          ],
        }
    }
  },
  methods: {
    handleSubmit (name) {
      this.btn_loading = true;
      this.$refs[name].validate((valid) => {
        if (valid) {
          setTimeout(() => {
            operationAssetPurchaseQcloud(this.formValidate, "post").then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`);
              } else {
                this.$Message.error(`${res.data.msg}`);
              }
            });
            this.btn_loading = false;
          }, 2000);
        } else {
          this.$Message.error('表单验证失败！');
          this.btn_loading = false;
        }
      })
    },
    handleReset (name) {
        this.$refs[name].resetFields();
    },
    getAllTagList () {
          getTaglist(1, 888).then(res => {
            if (res.data.code === 0) {
              this.allTagList = res.data.data
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        },
  },
  watch: {
    selectType(val){
      this.select_server = val.indexOf("服务器") === -1 ? false : true
      this.select_rds = val.indexOf("MySQL数据库")  === -1 ? false : true
      this.select_redis = val.indexOf("Redis缓存") === -1 ? false : true
      // this.select_lb = val.indexOf("负载均衡") === -1 ? false : true
      this.select_domain = val.indexOf("域名") === -1 ? false : true
      // this.select_cdn = val.indexOf("CDN加速") === -1 ? false : true
      // this.select_s3 = val.indexOf("S3存储") === -1 ? false : true
    }
  },
  mounted(){
      this.getAllTagList()
    }
}
</script>

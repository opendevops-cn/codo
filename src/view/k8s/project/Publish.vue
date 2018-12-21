<template>
<Modal width="800px;" v-model="dialog.show"  :title="dialog.title" :loading=true :footer-hide=true> 
  <div>
      <Row>            
        <Col span="12">
            <Alert show-icon>请选择发布条件</Alert>
            </br>
            <div>

              <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
                <FormItem label="Project">
                    <span class="project">{{formData.project_name}}</span>
                </FormItem>
                <!-- <FormItem label="环境">
                  <RadioGroup v-model="formData.env_id">
                    <Radio :label="item.id" v-for="item in formData.env_list">{{item.name}}</Radio>
                  </RadioGroup>
                </FormItem> -->

              <FormItem label="应用" prop="env">
                  <CheckboxGroup v-model="formData.app">
                      <Checkbox :label="item.id" v-for="item in formData.app_list">{{item.name}}</Checkbox>
                  </CheckboxGroup>
              </FormItem>

                <FormItem label="审核人" prop="review_user_id">
                    <Select v-model="formData.review_user_id" placeholder="请选择" filterable>
                        <Option v-for="item in formData.owner_list" :value="item.id" >{{ item.name }}</Option>
                    </Select>
                </FormItem>

                <FormItem label="备注">
                  <Input v-model="formData.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注" />
                </FormItem>
                <FormItem label="操作">
                  <Row>
                    <Col span="12">
                      <center>
                        <Button type="primary" :loading="loading" @click="handleSubmit('formData')">提交发布工单</Button>
                      </center>
                    </Col>
                    <Col span="12">
                      <center>
                        <Button @click="handleReset('formData')">清空</Button>
                      </center>
                    </Col>
                  </Row>
                </FormItem>
              </Form>
            </div>
            </Col>

          <Col span="12">
            <div style='margin-left:50px'>
              <div>
                <Alert type="warning" show-icon closable>
                    <p><b>发布流程</b></p>
                <template slot="desc">
                  <p>
                    <b>1</b>.  关于发布流程说明
                  </p>
                  <p style="margin-left:20px">
                    <b>1.1</b>. 若管理员没有设置流程，工单将按 提交人 --- 执行人 的流程进行处理。
                  </p>
                  <p style="margin-left:20px">
                    <b>1.2</b>. 若管理员有设置流程，工单将按 提交人 --- 审批人 --- 执行人 的流程进行处理。
                  </p>
                </template>
                </Alert>
              </div>
            </div>
        </Col>
      </Row>
  </div>
</Modal>  
</template>

<script>
import { exeJob,addPublish } from '@/api/k8s/publish'
export default {
  name: 'publish',
  data () {
    return {
      loading:false,
      readonly:true,
      wordList:[],
      checkData:{},
      // checkData:{
      //   treater_username:'admin',
      //   sql_content:'',
      //   remark:'',
      //   env:'prd',
      //   db:'',
      //   treater:'',
      //   commiter:'',
      //   users:[]
      // },
      commiter:{},
      ruleValidate:{
        // sql_content:[{ required: true, message: '请输入SQL', trigger: 'blur' }],
        review_user_id: [{ required: true, message: '请选择审核人', trigger: 'change',type: 'number'}],
        // db: [{ required: true, message: '请选择project', trigger: 'change'}],
      },
      keyMap:{
        'sql_content':'SQL',
        'env':'环境',
        'db':'数据库',
        'treater':'执行人',
      },
    }
  },
  created () {
    // this.getWordList()
    //this.handleSelect(this.checkData.env)
  },
  methods: {
      // getWordList () {
      //   for (let i of this.util.highlight.split('|')) {
      //     this.wordList.push({'vl': i, 'meta': '关键字'})
      //   }
      // },

      // setCompletions (editor, session, pos, prefix, callback) {
      //   callback(null, this.wordList.map(function (word) {
      //     return {
      //       caption: word.vl,
      //       value: word.vl,
      //       meta: word.meta
      //     }
      //   }))
      // },

      // editorInit: function () {               
      //   require('brace/mode/mysql')    //language
      //   require('brace/theme/xcode')
      // },

      // renderFunc (treater, title) {
      //   this.$Notice.success({
      //     title: title,
      //     render: h => {
      //       return h('span', [
      //         '请等待 ',
      //         h('a', treater),
      //         ' 处理'
      //       ])
      //     }
      //   });
      // },

      // warning (title, msg) {
      //   this.$Notice.warning({
      //     title: title,
      //     duration: 0,
      //     desc: msg
      //   });
      // },

    handleReset (name) {
      this.$refs[name].resetFields();
    },
    handleSubmit (name) {
      //提交工单
      this.$refs[name].validate((valid) => {
          if (valid) {
              // add => post => /api/project/
              this.loading = true
              console.log('submit...')
              const postData = this.formData
              console.log(postData)
              delete postData.owner_list

              addPublish(postData).then(res => {
                if (res.data.status){
                    exeJob(res.data.data.id).then(exe_res => {
                      if (exe_res.data.status){
                        //task任务提交成功
                        this.$Message.success('Success!'); 
                        this.$emit('e-close');
                        this.$router.push('/publish/');
                      }else{
                          this.$Message.error(res.data.msg); 
                      }
                    })
                }else{
                    this.$Message.error(res.data.msg); 
                }
              })





              
              
              
          } else {
              this.$Message.error('请检查必选项!');
          }
      })

      // this.$refs.checkContent.validate((valid) => {
      //   if (!valid) {
      //     return
      //   }
      //   this.$refs.checkConf.validate((valid) => {
      //     if (!valid) {
      //       return
      //     }
      //     CheckSql(this.checkData)
      //     .then(response => {
      //       console.log(response)
      //       let status = response.data.status
      //       let data = response.data.data
      //       let msg = response.data.msg
      //       if (status == 0){
      //         this.renderFunc(this.checkData.treater_username, '发布任务 已提交')          
      //       } else if (status == -1 || status == -2){
      //         this.warning('SQL审核不通过', msg)
      //       } 
      //     })
      //     .catch(error => {
      //       console.log(error)
      //     })
      //   })
      // })

    },
    // handleSelect (e) {
    //     GetPersonalSettings({env:e})
    //     .then(response => {
    //       console.log(response)
    //       const data = response.data.results[0]
    //       const dbs = data.db_list
    //       const commiter = data.commiter
    //       const treater = data.leader
    //       this.setTreater(treater)
    //       this.checkData.commiter = commiter.username
    //       this.checkData.users = [commiter.id, treater.id]
    //       this.dbList = []
    //       dbs.map( (item) => {
    //         this.dbList.push({
    //           value:item.id,
    //           label:item.name
    //         })
    //       })
    //     })
    //     .catch(error => {
    //       console.log(error)
    //     })
    //   },

  },
  props:{
    dialog: Object,
    formData: Object
  }
}
</script>

<style scoped>
.project{
  color:red;
  font-size: 14px;
}
</style>

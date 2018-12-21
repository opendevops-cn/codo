<template>
<!-- <div> -->
  <!-- <Card> -->
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
        <FormItem label="应用名称" prop="name">
            <Input v-model="formData.name" placeholder="Enter project"></Input>
        </FormItem>
        <!-- <FormItem label="应用域名" prop="domain">
            <Input v-model="formData.domain" placeholder="demo01.yangmv.com"></Input>
        </FormItem> -->
        <FormItem label="应用端口" prop="port">
            <Input v-model="formData.port" placeholder=""></Input>
        </FormItem>
       
        <!-- <FormItem label="环境" prop="env">
            <CheckboxGroup v-model="formData.env">
                <Checkbox :label="item.id" v-for="item in EnvList">{{item.name}}</Checkbox>
            </CheckboxGroup>
        </FormItem>
        <FormItem label="负责人" prop="owner">
            <CheckboxGroup v-model="formData.owner">
                <Checkbox :label="item.id" v-for="item in UserList">{{item.name}}</Checkbox>
            </CheckboxGroup>
        </FormItem> -->

        <!-- <FormItem label="副本数" prop="replicas">
            <Slider v-model="formData.replicas" :max="10" show-input></Slider>
        </FormItem> -->

        <FormItem label="应用描述" prop="desc">
            <Input v-model="formData.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder=""></Input>
        </FormItem>

        <br>
        <FormItem label="Git地址" prop="git_url">
            <Input v-model="formData.git_url" placeholder="http://gitlab.shinezoneserver.com/Shinezone-OPS/ops_scripts.git"></Input>
        </FormItem>
        <!-- <FormItem label="用户名" prop="git_user">
            <Input v-model="formData.git_user" placeholder=""></Input>
        </FormItem>
        <FormItem label="密码" prop="git_pwd">
            <Input type="password" v-model="formData.git_pwd" placeholder=""></Input>
        </FormItem> -->

        <FormItem>
            <Button type="primary" @click="handleSubmit('formData')">提交</Button>
            <Button @click="handleReset('formData')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
  <!-- </Card>     -->
<!-- </div> -->
</template>
<script>
    import { addApp } from '@/api/k8s/app'
    export default {
        name: 'add',
        data () {
            const DomainCheck = (rule, value, callback) => {
                //自定义验证
                if (value === '') {
                    callback(new Error('域名不能为空'));
                } else if (value === 'aaa') {
                    callback(new Error('域名格式不正确！'));
                } else {
                    callback();
                }
            };
            return {
                EnvList: [],
                UserList: [],
                ruleValidate: {
                    name: [
                        { required: true, message: '项目名称不能为空', trigger: 'blur' }
                    ],
                    // domain: [
                    //     { required: true, validator: DomainCheck, trigger: 'blur' }
                    // ],
                    port: [
                        { required: true, message: '端口不能为空', trigger: 'blur' }
                    ],
                    // mail: [
                    //     { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' },
                    //     { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
                    // ],
                    // city: [
                    //     { required: true, message: 'Please select the city', trigger: 'change' }
                    // ],
                    // env: [
                    //     { required: true, type: 'array', min: 2, message: '至少选择2个环境', trigger: 'change' },
                    // ],
                    // owner: [
                    //     { required: true, type: 'array', min: 1, message: '至少选择1个负责人', trigger: 'change' },
                    // ],
                    // desc: [
                    //     { required: true, message: 'Please enter a personal introduction', trigger: 'blur' },
                    //     { type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur' }
                    // ]
                    git_url: [
                        { required: true, type: 'url', message: 'Git地址格式不正确', trigger: 'blur' }
                    ],
                    // git_user: [
                    //     { required: true, message: '用户名不能为空', trigger: 'blur' }
                    // ],
                    // git_pwd: [
                    //     { required: true, message: '密码不能为空', trigger: 'blur' }
                    // ]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        // add => post => /api/project/
                        // edit => put => /api/project/1
                        const url = this.dialog.option == 'add' ? '/' : `/${this.formData.id}/`;
                        const action = this.dialog.option == 'add' ? 'post' : 'put';
                        addApp(this.formData,url,action).then(res => {
                            if (res.data.status){
                                this.$Message.success('Success!'); 
                                this.$emit('e-close');
                                this.$emit('e-update');
                            }else{
                                this.$Message.error(res.data.msg); 
                            }
                            
                        })

                        
                    } else {
                        this.$Message.error('请检查必选项!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }

        },
        props:{
            dialog: Object,
            formData: Object
        },
        mounted () {

        }
    }
</script>

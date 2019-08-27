<template>
  <div style="height:100%">
    <Card>
       <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">

        <FormItem label="环境字典">
            <Input v-model="the_env_dict" :readonly=true type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="Enter something..."></Input>
        </FormItem>

        <FormItem label="流程清单">
            <Select v-model="formValidate.env_list" filterable placeholder="选择发布的流程" >
              <Option v-for="item in envList" :value="item" :key="item" >{{ item }}</Option>
            </Select>
        </FormItem>
        <FormItem label="流程配置">
            <Input v-model="formValidate.desc" type="text"  placeholder="Enter something..."></Input>
        </FormItem>

        <FormItem label="配置地址">
            <Input v-model="formValidate.config_api" type="text"  placeholder="输入配置中心地址..."></Input>
        </FormItem>

        <FormItem label="配置密钥">
            <Input v-model="formValidate.desc" type="text"  placeholder="Enter auth_key..."></Input>
        </FormItem>

        <FormItem label="通知方式">
            <CheckboxGroup v-model="formValidate.interest">
                <Checkbox label="短信"></Checkbox>
                <Checkbox label="邮件"></Checkbox>
                <Checkbox label="钉钉"></Checkbox>
                <Checkbox label="微信"></Checkbox>
            </CheckboxGroup>
        </FormItem>

        <FormItem label="通知频率" prop="gender">
            <RadioGroup v-model="formValidate.gender">
                <Radio label="1">流程前</Radio>
                <Radio label="2">流程后</Radio>
                <Radio label="3">流程前后</Radio>
            </RadioGroup>
        </FormItem>

        <!-- <FormItem label="City" prop="city">
            <Select v-model="formValidate.city" placeholder="Select your city">
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
            </Select>
        </FormItem>
        <FormItem label="Gender" prop="gender">
            <RadioGroup v-model="formValidate.gender">
                <Radio label="male">Male</Radio>
                <Radio label="female">Female</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="Hobby" prop="interest">
            <CheckboxGroup v-model="formValidate.interest">
                <Checkbox label="Eat"></Checkbox>
                <Checkbox label="Sleep"></Checkbox>
                <Checkbox label="Run"></Checkbox>
                <Checkbox label="Movie"></Checkbox>
            </CheckboxGroup>
        </FormItem>
        <FormItem label="Desc" prop="desc">
            <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
        </FormItem> -->
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
    </Card>  
  </div>
</template>
<script>
    export default {
        data () {
            return {
                the_env_dict: JSON.stringify({
                "项目开发": "dev",
                "测试环境": "qa",
                "集成环境": "sit",
                "性能环境": "per",
                "预发布环境": "pre",
                "演示环境": "staging",
                "沙箱环境 ": "sandbox",
                "灰度环境 ": "gray",
                "正式环境 ": "release"
                }),
                envList: ['项目信息-项目开发-测试环境-预发布环境-任务审核-灰度环境-正式环境','项目信息-项目开发-测试环境-性能环境-预发布环境-沙箱环境-任务审核-灰度环境-正式环境'],
                formValidate: {
                    env_list: [],
                    env_dict:null,
                    config_api:'',
                    name: '',
                    city: '',
                    gender: '',
                    interest: [],
                    desc: ''
                },
                ruleValidate: {
                    name: [
                        { required: true, message: 'The name cannot be empty', trigger: 'blur' }
                    ],
                    city: [
                        { required: true, message: 'Please select the city', trigger: 'change' }
                    ],
                    gender: [
                        { required: true, message: 'Please select gender', trigger: 'change' }
                    ],
                    interest: [
                        { required: true, type: 'array', min: 1, message: 'Choose at least one hobby', trigger: 'change' },
                        { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
                    ],
                    desc: [
                        { required: true, message: 'Please enter a personal introduction', trigger: 'blur' },
                        { type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            //`${res.request.responseURL.split('/kerrigan/')[0]}/kerrigan/v1/conf/publish/config/`
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        },
        // computed: {
        //     the_env_dict: function () {
        //          let obj = JSON.parse(the_env_dict)
        //         return JSON.parse(the_env_dict)
        //     }
        // }
    }
</script>

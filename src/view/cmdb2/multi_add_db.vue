<template>
<!-- <div> -->
  <!-- <Card> -->
<Modal width="600px;" v-model="dialog.show"  :title="dialog.title" :loading=true :footer-hide=true @on-cancel="handleCancel" :mask-closable=false> 
    <Form ref="formData3" :model="formData" :label-width="80">
        <Alert type="success">格式: [类型/mysql/redis] [名称] [地址] [端口] [用户名] [密码]  一行代表一个DB,若没密码则写null</Alert>
        <Alert type="info">示例1: redis redis_name 10.0.0.2 6379 root null </Alert>
        <Alert type="info">示例2: mysql mysql_name 10.0.0.1 3306 root password </Alert>
            <!-- <Input v-model="formData.data" type="textarea" :autosize="{minRows: 5,maxRows: 200}" placeholder="ops-hostname 10.0.0.1 22 ec2-user"></Input>
             -->
             <Input v-model="formData.data" type="textarea" :autosize="{minRows: 15,maxRows: 30}" :maxlength="5000" placeholder="mysql dbname 10.0.0.2 3306 root password"></Input>
            <br><br>
            <Button type="primary" @click="handleSubmit('formData3')">提交</Button>
            <!-- <Button @click="handleReset('formData3')" style="margin-left: 8px">重置</Button> -->
    </Form>
</Modal>

</template>
<script>
    import { multiAdddb } from '@/api/cmdb2/db'
    export default {
        name: 'multiadd',
        data () {
            return {
                ruleValidate: {
                    db_host: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                if (this.formData.data !== null) {
                    const new_data = this.formData.data.split('\n')
                    multiAdddb(new_data).then(res => {
                         if (res.data.code === 0){
                            this.$Message.success({
                                content: 'Success!',
                                duration: 3
                            });
                            this.$emit('e-close');
                            this.$emit('e-update');
                        }else{
                            this.$Message.error({
                                content: res.data.msg,
                                duration: 10
                            }); 
                        }
                    }).catch(error =>{
                        this.$Message.error({
                            content: JSON.stringify(error.response.data),
                            duration: 10
                        });
                    });
                } else {
                    this.$Message.error({
                            content: '不能为空',
                            duration: 3
                    });
                }
            },
            handleCancel(){
                this.$emit('e-close');
            },
            handleReset (name) {
            this.$refs[name].resetFields()
            },

        },
        props:{
            dialog: Object,
            formData: Object
        },
        mounted () {

        }
    }
</script>

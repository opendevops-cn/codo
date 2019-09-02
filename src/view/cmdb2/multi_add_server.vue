<template>
<!-- <div> -->
  <!-- <Card> -->
<Modal width="600px;" v-model="dialog.show"  :title="dialog.title" :loading=true :footer-hide=true @on-cancel="handleCancel" :mask-closable=false> 
    <Form ref="formData3" :model="formData" :label-width="90">
        <Alert type="success">格式: [hostname] [ip] [port] [管理用户] 多台换行分开, 管理用户必须是存在的</Alert>
        <!-- <Alert type="success">格式2: [hostname] [ip] [port] [username] [password]</Alert> -->
            <Input v-model="formData.data" type="textarea" :autosize="{minRows: 15, maxRows: 30}" :maxlength="5000" placeholder="ops-hostname 10.0.0.1 22 ec2-user"></Input>
            <br><br>
            <Button type="primary" @click="handleSubmit('formData3')">提交</Button>
            <Button @click="handleReset('formData3')" style="margin-left: 8px">重置</Button>
    </Form>
</Modal>

</template>
<script>
    import { multiAddserver } from '@/api/cmdb2/server'
    export default {
        name: 'multiadd',
        data () {
            return {
                ruleValidate: {
                    hostname: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                if (this.formData.data !== null) {
                    const new_data = this.formData.data.split('\n')
                    multiAddserver(new_data).then(res => {
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

<template>
<!-- <div> -->
  <!-- <Card> -->
<Modal width="600px;" v-model="dialog.show"  :title="dialog.title" :loading=true :footer-hide=true> 
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
        <FormItem label="名称" prop="name">
            <Input v-model="formData.name" placeholder=""></Input>
        </FormItem>
        <FormItem label="用户名" prop="username">
            <Input v-model="formData.username" placeholder=""></Input>
        </FormItem>
        <FormItem label="密码">
            <Input v-model="formData.password" placeholder=""></Input>
        </FormItem>
        <FormItem label="秘钥">
            <Input v-model="formData.private_key" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="密钥密码必填一项"></Input>
        </FormItem>
        <FormItem label="描述">
            <Input v-model="formData.comment" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder=""></Input>
        </FormItem>

        <FormItem>
            <Button type="primary" @click="handleSubmit('formData')">提交</Button>
            <Button @click="handleReset('formData')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
</Modal>
  <!-- </Card>     -->
<!-- </div> -->
</template>
<script>
    import { Add } from '@/api/cmdb/adm_user'
    //import { getAppList } from '@/api/app'
    export default {
        name: 'add',
        data () {
            return {
                ruleValidate: {
                    name: [{ required: true, message: '名称不能为空', trigger: 'blur' },],
                    username: [{ required: true, message: '用户名不能为空', trigger: 'blur' },]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        // add => post => /api/cmdb/adm_user/
                        // edit => put => /api/cmdb/adm_user/1
                        const url = this.dialog.option == 'add' ? '/' : `/${this.formData.id}/`;
                        const action = this.dialog.option == 'add' ? 'post' : 'put';
                        Add(this.formData,url,action).then(res => {
                            console.log(res)
                            if (res.status){
                                this.$Message.success({
                                    content: '管理用户添加成功',
                                    duration: 3
                                });
                                this.$emit('e-close');
                                this.$emit('e-update');
                            }else{
                                this.$Message.error({
                                    content: res.data.msg,
                                    duration: 3
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
                                content: '请检查必选项',
                                duration: 3
                        });
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
        }
    }
</script>

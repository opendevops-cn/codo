<template>
<!-- <div> -->
  <!-- <Card> -->
<Modal width="600px;" v-model="dialog.show"  :title="dialog.title" :loading=true :footer-hide=true> 
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
        <FormItem label="Tag" prop="name">
            <Input v-model="formData.name" placeholder=""></Input>
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
    import { addTag } from '@/api/cmdb/tag'
    export default {
        name: 'add',
        data () {
            return {
                ruleValidate: {
                    name: [
                        { required: true, message: 'tag名称不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        // add => post => /api/cmdb/tag/
                        // edit => put => /api/cmdb/tag/1
                        const url = this.dialog.option == 'add' ? '/' : `/${this.formData.id}/`;
                        const action = this.dialog.option == 'add' ? 'post' : 'put';
                        addTag(this.formData,url,action).then(res => {
                            console.log(res)
                            if (res.status){
                                this.$Message.success({
                                    content: '主机添加成功',
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

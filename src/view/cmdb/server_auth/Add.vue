<template>
<!-- <div> -->
  <!-- <Card> -->
<Modal width="600px;" v-model="dialog.show"  :title="dialog.title" :loading=true :footer-hide=true @on-cancel="handleCancel">
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
        <FormItem label="规则名" prop="name">
            <Input v-model="formData.name" placeholder=""></Input>
        </FormItem>

        <FormItem label="用户" >
            <Transfer
            :data="UserList"
            :target-keys="formData.user"
            filterable
            :filter-method="userFilter"
            :titles="userTitle"
            @on-change="userHandleChange">
            </Transfer>
        </FormItem>

        <FormItem label="主机" >
            <Transfer
            :data="ServerList"
            :target-keys="formData.server"
            filterable
            :filter-method="serverFilter"
            :titles="serverTitle"
            @on-change="serverHandleChange">
            </Transfer>
        </FormItem>

        <FormItem label="主机组" >
            <Transfer
            :data="GroupList"
            :target-keys="formData.servergroup"
            filterable
            :filter-method="groupFilter"
            :titles="groupTitle"
            @on-change="groupHandleChange">
            </Transfer>
        </FormItem>



        <FormItem label="规则描述">
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
    // import clonedeep from 'clonedeep'
    import { getGroupList,getTableData } from '@/api/cmdb/server'
    import { addRule } from '@/api/cmdb/server_auth'
    //import { getAppList } from '@/api/app'
    export default {
        name: 'add',
        data () {
            return {
                single : false,
                ServerList:[],
                GroupList:[],
                serverTitle: ['可关联','已关联'],
                groupTitle: ['可关联','已关联'],
                UserList: [],
                userTitle: ['可关联','已关联'],
                AdmUser: [],
                ruleValidate: {
                    name: [
                        { required: true, message: '规则名称不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            serverHandleChange (newTargetKeys) {
                this.formData.server = newTargetKeys;
            },
            serverFilter (data, query) {
                return data.label.indexOf(query) > -1;
            },
            groupHandleChange (newTargetKeys) {
                this.formData.servergroup = newTargetKeys;
            },
            groupFilter (data, query) {
                return data.label.indexOf(query) > -1;
            },
            userHandleChange (newTargetKeys) {
                this.formData.user = newTargetKeys;
            },
            userFilter (data, query) {
                return data.label.indexOf(query) > -1;
            },
            handleCancel(){
                this.$emit('e-close');
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        // add => post => /api/cmdb/server_auth/
                        // edit => put => /api/cmdb/server_auth/1
                        const url = this.dialog.option == 'add' ? '/' : `/${this.formData.id}/`;
                        const action = this.dialog.option == 'add' ? 'post' : 'put';
                        const msg = this.dialog.option == 'add' ? '规则添加成功' : '规则修改成功';
                        // 深copy
                        let postData = JSON.parse(JSON.stringify(this.formData))
                        postData.user = JSON.stringify(postData.user)
                        console.log(postData)

                        addRule(postData,url,action).then(res => {
                            if (res.status){
                                this.$Message.success({
                                    content: msg,
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
                console.log('name..',name)
                this.$refs[name].resetFields();
            }

        },
        props:{
            dialog: Object,
            formData: Object,
            systemUser: Array
        },
        watch:{
            formData: function(){
                this.single = this.formData.single
            },
            systemUser: function(){
                const data = this.systemUser
                for(var item in data){
                    this.UserList.push({
                        key: data[item].username,
                        label: data[item].nickname
                    })
                }
            },
            single: function(){
                if(this.single == false){
                    this.formData.username = null
                    this.formData.password = null
                }
            }
        },
        mounted(){
            getGroupList().then(res => {
            const data = res.data
            for (var item in data) {
                this.GroupList.push({
                key: data[item].id,
                label: data[item].name
                })
            }
            // console.log('GroupList-->',GroupList)
            // this.$store.dispatch('setGroupList',GroupList)
            })
            const params = {pageNum: 1, pageSize: 10000}
            getTableData(params).then(res => {
            const data = res.data.data
            for (var item in data) {
                this.ServerList.push({
                key: data[item].id,
                label: data[item].hostname
                })
            }
            // this.$store.dispatch('setServerList',ServerList)
            })
        }
        // computed:{
        //     ServerList(){
        //         return this.$store.getters.ServerList
        //     },
        //     GroupList(){
        //         return this.$store.getters.GroupList
        //     }
        // }



    }
</script>

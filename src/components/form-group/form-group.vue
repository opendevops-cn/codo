<template>
  <Form ref="form" v-if="Object.keys(valueList).length" :label-width="labelWidth" :model="valueList" :rules="rules">
    <FormItem
      v-for="(item, index) in list"
      :label="item.label"
      label-position="left"
      :prop="item.name"
      :error="errorStore[item.name]"
      :key="`${_uid}_${index}`"
      @click.native="handleFocus(item.name)"
    >
      <component :is="item.type" :range="item.range" v-model="valueList[item.name]"
      :placeholder='item.placeholder ? item.placeholder : "" '
      :maxlength='item.type === "i-input" && item.maxlength ? item.maxlength : 50 '
      :type='item.type === "i-input" && item.type1 ? item.type1 : "text" '>
        <template v-if="item.children">
          <component
            v-for="(child, i) in item.children.list"
            :is="item.children.type"
            :key="`${_uid}_${index}_${i}`"
            :label="child.label"
            :value="child.value">{{ child.title }}</component>
        </template>
      </component>
    </FormItem>
    <FormItem>
      <slot name="right-btn"></slot>
      <Button @click="handleSubmit" type="primary" :loading="loading">提交</Button>
      <Button @click="handleReset" style="margin-left: 8px">重置</Button>
      <slot name="left-btn"></slot>
    </FormItem>
  </Form>
</template>

<script>
import clonedeep from 'clonedeep'
export default {
  name: 'FormGroup',
  data () {
    return {
      loading: false,
      initValueList: [],
      rules: {},
      valueList: {},
      errorStore: {}
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    labelWidth: {
      type: Number,
      default: 110
    }
  },
  watch: {
    list () {
      this.setInitValue()
    }
  },
  methods: {
    setInitValue () {
      let rules = {}
      let valueList = {}
      let initValueList = {}
      let errorStore = {}
      this.list.forEach(item => {
        rules[item.name] = item.rule
        valueList[item.name] = item.value
        initValueList[item.name] = item.value
        errorStore[item.name] = ''
      })
      this.rules = rules
      this.valueList = valueList
      this.initValueList = initValueList
      this.errorStore = errorStore
    },
    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('on-submit-success', {
            data: this.valueList
          })
          // 按钮loading
          this.loading = true
          setTimeout(() => {
            this.loading = false
          }, 1000)
        }
      })
    },
    handleReset () {
      this.valueList = clonedeep(this.initValueList)
    },
    handleFocus (name) {
      this.errorStore[name] = ''
    }
  },
  mounted () {
    this.setInitValue()
  }
}
</script>

<style>
</style>

<template>
  <div :style="{width: '100%', height: editorHeight + 'px'}"></div>
</template>

<script>
  // require(['emmet/emmet'], function (data) {
  //   window.emmet = data.emmet
  // })
  const ace = require('brace')
  export default {
    name: 'editor',
    props: {
      value: {
        type: String,
        // required: true
      },
      mode_type: {
        type: String,
        default: 'python'
      },
      read: {
        type: Boolean,
        default: true
      },
      editorHeight:{
        type: Number,
        default: 630
      },
    },
    data () {
      return {
        editor: null,
        contentBackup: '',
        theme: 'xcode'
      }
    },
    methods:{
      initEditor(){
        let vm = this
        require('brace/ext/emmet')
        require('brace/ext/language_tools')
        let editor = vm.editor = ace.edit(this.$el)
        this.$emit('init', editor)
        let staticWordCompleter = {
          getCompletions: function (editor, session, pos, prefix, callback) {
            vm.$emit('setCompletions', editor, session, pos, prefix, callback)
          }
        }
        
        editor.completers = [staticWordCompleter]
        editor.setOptions({
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
        })
        editor.$blockScrolling = Infinity
        editor.setFontSize(14)
        editor.setOption('enableEmmet', true)
        editor.getSession().setMode(`ace/mode/${this.mode_type}`)
        this.theme = this.read ? 'xcode' : 'terminal' 
        // https://github.com/ajaxorg/ace/tree/master/lib/ace/theme
        editor.setTheme(`ace/theme/${this.theme}`);   // 设置主题背景

        editor.on('change', function () {
          let content = editor.getValue()
          vm.$emit('input', content)
          vm.contentBackup = content
        })
        editor.setFontSize(10); // 字体大小
        editor.setReadOnly(this.read);  // 是否只读
      }
    },
    watch: {
      value (val) {
        if (this.contentBackup !== val) {
          this.editor.setValue(val, 1)  //1代表光标移动到最后
        }
      },
      theme: function (newTheme) {
        this.editor.setTheme('ace/theme/' + newTheme)
      },
      lang: function (newLang) {
        this.editor.getSession().setMode('ace/mode/' + newLang)
      },
      mode_type: function(){
        this.initEditor()
      },
      read: function(){
        this.initEditor()
      }
    },
    mounted () {
      this.initEditor()
    }
  }
</script>

<style scoped>

</style>
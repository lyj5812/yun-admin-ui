<template>
  <div class="ck-container" :style="{width:containerWidth,height: height}">
    <ckeditor v-model="content" style="min-height: 500px" :editor="editor" :config="editorConfig" @input="onEditorInput" />
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link'
import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials'
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold'
import UnderlinePlugin from '@ckeditor/ckeditor5-basic-styles/src/underline'
import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading'
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic'
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage'
import Image from '@ckeditor/ckeditor5-image/src/image'
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar'
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption'
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle'
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize'
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
import Font from '@ckeditor/ckeditor5-font/src/font'
import TodoList from '@ckeditor/ckeditor5-list/src/todolist'
import Indent from '@ckeditor/ckeditor5-indent/src/indent'
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock'
import List from '@ckeditor/ckeditor5-list/src/list'
import Table from '@ckeditor/ckeditor5-table/src/table'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar'
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock'
const upload = require('./upload')
export default {
  name: 'CkEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    height: {
      type: [Number, String],
      required: false,
      default: 500
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    }
  },
  data() {
    return {
      editor: ClassicEditor,
      content: '',
      editorConfig: {
        placeholder: '请在此处输入!',
        extraPlugins: [upload.MyCustomUploadAdapterPlugin],
        // 配置
        plugins: [
          EasyImage, Image, ImageToolbar, ImageCaption, ImageStyle, ImageResize,
          EssentialsPlugin,
          BoldPlugin, UnderlinePlugin, ItalicPlugin,
          LinkPlugin,
          ParagraphPlugin,
          HeadingPlugin,
          Alignment,
          Font,
          TodoList, Indent, IndentBlock, List,
          Table, TableToolbar,
          CodeBlock
        ],
        image: {
          // You need to configure the image toolbar, too, so it uses the new style buttons.
          toolbar: ['imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight'],
          styles: [
            // This option is equal to a situation where no style is applied.
            'full',
            // This represents an image aligned to the left.
            'alignLeft',
            // This represents an image aligned to the right.
            'alignRight'
          ]
        },
        fontSize: {
          options: [
            9,
            11,
            13,
            'default',
            17,
            19,
            21
          ]
        },
        table: {
          contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
        },
        toolbar: {
          items: [
            'bold', 'underline', 'italic',
            'outdent', 'indent', 'bulletedList', 'numberedList',
            'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor',
            'alignment',
            'heading',
            'link',
            'undo',
            'redo',
            'imageUpload',
            'todoList',
            'insertTable',
            'codeBlock'
          ]
        }
      }
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  methods: {
    onEditorInput(editor) {
      console.log(editor)
    }
  }
}
</script>
<style lang="scss">
    .ck-container {
        position: relative;
        line-height: normal;
        .ck.ck-editor__editable > .ck-placeholder::before {
            color: rgba(0, 0, 0, 0.31);
            font-family: Georgia;
            font-size: 12px;
        }

        .ck-content pre code {
            box-shadow: none !important;
            color: #2d2f33;
            white-space: pre-wrap;
            font-style: normal;
            &::before,
            &::after {
                content: none;
            }
        }

        .ck-content {
            background: var(--ck-color-base-background);
            border-radius: 0;
            height: 500px !important;
        }
    }

</style>

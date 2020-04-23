import Vue from 'vue'
// Message
import Message from '@/components/Message'
Vue.prototype.$message = Message
// Message
import Confirm from '@/components/Confirm'
Vue.prototype.$confirm = Confirm
// 按钮权限
import permission from '@/directive/permission/index.js'
Vue.use(permission)
// 分页组件
import Pagination from '@/components/Pagination'
Vue.component('Pagination', Pagination)
// 时间
import YDatePicker from '@/components/YDatePicker'
Vue.component('YDatePicker', YDatePicker)

import uploader from 'vue-simple-uploader'
Vue.use(uploader)
// 字典组件
import Dict from '@/views/components/dict'
Vue.component('Dict', Dict)
import CKEditor from '@ckeditor/ckeditor5-vue'
Vue.use(CKEditor)
import vuescroll from 'vuescroll'
Vue.use(vuescroll, {
  ops: {
    vuescroll: {
      mode: 'native',
      sizeStrategy: 'number',
      detectResize: true
    },
    bar: {
      showDelay: 500,
      onlyShowBarOnScroll: true,
      keepShow: false,
      background: '#c1c1c1',
      opacity: 1,
      hoverStyle: false,
      specifyBorderRadius: false,
      minSize: false,
      size: '6px',
      disable: false
    },
    scrollPanel: {
      scrollingX: false, // 关闭横向滑动
      scrollingY: true
    }
  }, // 在这里设置全局默认配置
  name: 'VScroll'
})

import Vue from 'vue'
import Pagination from '@/components/Pagination' // 分页组件
import Dict from '@/views/components/dict' // 字典组件
import Message from '@/components/message'
import permission from '@/directive/permission/index.js' // 按钮权限
import vuescroll from 'vuescroll'
import 'sweetalert'
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

Vue.use(permission)

Vue.component('Pagination', Pagination)
Vue.component('Dict', Dict)

Vue.prototype.message = Message.install
Vue.prototype.message.error = Message.error
Vue.prototype.message.success = Message.success
Vue.prototype.message.warning = Message.warning
Vue.prototype.message.info = Message.info

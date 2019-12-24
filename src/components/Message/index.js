import Vue from 'vue'
import Message from './index.vue'

const MessageBox = Vue.extend(Message)

Message.install = function(options, type) {
  if (options === undefined || options === null) {
    options = {
      content: ''
    }
  } else if (typeof options === 'string' || typeof options === 'number') {
    options = {
      content: options
    }
    if (type !== undefined && options != null) {
      options.type = type
    }
  }

  const instance = new MessageBox({
    data: options
  }).$mount()

  document.getElementById('app').appendChild(instance.$el)

  Vue.nextTick(() => {
    instance.visible = true
  })
}

Message.error = function(content) {
  Message.install(content, 'error')
}

Message.success = function(content) {
  Message.install(content, 'success')
}

Message.warning = function(content) {
  Message.install(content, 'warning')
}

Message.info = function(content) {
  Message.install(content, 'info')
}
export default Message

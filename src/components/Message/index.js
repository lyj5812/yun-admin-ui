import Swal from 'sweetalert2'
const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: false,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

const Message = (options) => {
  Toast.fire(options)
}

Message.error = function(title) {
  const options = {
    icon: 'error',
    title
  }
  Message(options)
}

Message.success = function(title) {
  const options = {
    icon: 'success',
    title
  }
  Message(options)
}

Message.warning = function(title) {
  const options = {
    icon: 'warning',
    title
  }
  Message(options)
}

Message.info = function(title) {
  const options = {
    icon: 'info',
    title
  }
  Message(options)
}

export default Message

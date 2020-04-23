import Swal from 'sweetalert2'
const Confirm = Swal.mixin({
  target: '#app',
  customClass: {
    confirmButton: 'v-btn v-btn--contained theme--dark v-size--default primary mr-2',
    cancelButton: 'v-btn v-btn--contained theme--dark v-size--default ml-2'
  },
  buttonsStyling: false,
  showCancelButton: true,
  confirmButtonText: '确定',
  cancelButtonText: '取消',
  reverseButtons: false
})

export default Confirm

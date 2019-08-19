module.exports = file => {
  try {
    return require('@/views' + file + '.vue').default // vue-loader at least v13.0.0+
  } catch (e) {
    return require('@/views/error-page/404.vue').default
  }
}

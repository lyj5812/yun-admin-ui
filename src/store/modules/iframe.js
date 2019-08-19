export default {
  state: {
    iframeUrls: []
  },
  mutations: {
    addIFrameUrl(state, iframeUrl) {
      state.iframeUrls.push(iframeUrl)
    }
  }
}

import { getLS, setLS } from '@/utils/storage'
const state = {
  sidebarMini: getLS('sidebarMini') || false,
  sidebarDrawer: getLS('sidebarDrawer') || false,
  sidebarMobile: false,
  toolColor: getLS('toolColor') || {},
  navColor: getLS('navColor') || {
    name: 'deep-purple-blue',
    dark: true,
    class: 'gradient-deep-purple-blue'
  },
  primaryColor: getLS('primaryColor') || {
    name: 'Purple-light',
    dark: false,
    scheme: 'md-purple-a700-scheme',
    primary: '#AA00FF'
  },
  settingDrawer: false
}

const mutations = {
  SET_SIDEBAR_MINI: (state, sidebarMini) => {
    state.sidebarMini = sidebarMini
  },
  SET_SIDEBAR_DRAWER: (state, sidebarDrawer) => {
    state.sidebarDrawer = sidebarDrawer
  },
  SET_SIDEBAR_MOBILE: (state, sidebarMobile) => {
    state.sidebarMobile = sidebarMobile
  },
  SET_TOOL_COLOR: (state, toolColor) => {
    state.toolColor = toolColor
  },
  SET_NAV_COLOR: (state, navColor) => {
    state.navColor = navColor
  },
  SET_PRIMARY_COLOR: (state, primaryColor) => {
    state.primaryColor = primaryColor
  },
  SET_SETTING_DRAWER: (state, settingDrawer) => {
    state.settingDrawer = settingDrawer
  }
}

const actions = {
  setSidebarMini({ commit }, sidebarMini) {
    setLS('sidebarMini', sidebarMini)
    commit('SET_SIDEBAR_MINI', sidebarMini)
  },
  setSidebarDrawer({ commit }, sidebarDrawer) {
    setLS('sidebarDrawer', sidebarDrawer)
    commit('SET_SIDEBAR_DRAWER', sidebarDrawer)
  },
  setSidebarMobile({ commit }, sidebarMobile) {
    commit('SET_SIDEBAR_MOBILE', sidebarMobile)
  },
  setToolColor({ commit }, toolColor) {
    setLS('toolColor', toolColor)
    commit('SET_TOOL_COLOR', toolColor)
  },
  setNavColor({ commit }, navColor) {
    setLS('navColor', navColor)
    commit('SET_NAV_COLOR', navColor)
  },
  setPrimaryColor({ commit }, primaryColor) {
    setLS('primaryColor', primaryColor)
    commit('SET_PRIMARY_COLOR', primaryColor)
  },
  setSettingDrawer({ commit }, settingDrawer) {
    commit('SET_SETTING_DRAWER', settingDrawer)
  }
}

const getters = {
  sidebarMini: state => state.sidebarMini,
  sidebarDrawer: state => state.sidebarDrawer,
  sidebarMobile: state => state.sidebarMobile,
  toolColor: state => state.toolColor,
  navColor: state => state.navColor,
  primaryColor: state => state.primaryColor,
  settingDrawer: state => state.settingDrawer
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

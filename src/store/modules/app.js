import { getLanguage } from '@/lang/index'
import localStorage from '@/utils/localStorage'

const state = {
  language: getLanguage(),
  navDrawer: true,
  navColor: localStorage.get('navColor') || {
    name: 'deep-purple-blue',
    dark: true,
    class: 'gradient-45deg-deep-purple-blue'
  },
  toolColor: localStorage.get('toolColor') || {},
  primaryColor: localStorage.get('primaryColor') || {
    name: 'light-deepPurple-accent4',
    dark: false,
    color: 'deep-purple accent4',
    primary: '#6200ea'
  },
  settingDrawer: false,
  footer: {
    show: true,
    fixed: false
  }
}

const mutations = {
  SET_LANGUAGE: (state, language) => {
    state.language = language
    localStorage.set('language', language)
  },
  SET_NAV_DRAWER: (state, navDrawer) => {
    state.navDrawer = navDrawer
  },
  SET_NAV_COLOR: (state, navColor) => {
    state.navColor = navColor
  },
  SET_TOOL_COLOR: (state, toolColor) => {
    state.toolColor = toolColor
  },
  SET_SETTING_DRAWER: (state, settingDrawer) => {
    state.settingDrawer = settingDrawer
  },
  SET_PRIMARY_COLOR: (state, primaryColor) => {
    state.primaryColor = primaryColor
  }
}

const actions = {
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  },
  setNavDrawer({ commit }, navDrawer) {
    commit('SET_NAV_DRAWER', navDrawer)
  },
  setNavColor({ commit }, navColor) {
    localStorage.set('navColor', navColor)

    commit('SET_NAV_COLOR', navColor)
  },
  setToolColor({ commit }, toolColor) {
    localStorage.set('toolColor', toolColor)
    commit('SET_TOOL_COLOR', toolColor)
  },
  setSettingDrawer({ commit }, settingDrawer) {
    commit('SET_SETTING_DRAWER', settingDrawer)
  },
  setPrimaryColor({ commit }, primaryColor) {
    localStorage.set('primaryColor', primaryColor)
    commit('SET_PRIMARY_COLOR', primaryColor)
  }
}

const getters = {
  navDrawer: state => state.navDrawer,
  navColor: state => state.navColor,
  toolColor: state => state.toolColor,
  settingDrawer: state => state.settingDrawer,
  primaryColor: state => state.primaryColor
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

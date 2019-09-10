import sessionStorage from '@/utils/sessionStorage'
const state = {
  visitedViews: sessionStorage.get('tags') || []
}

const mutations = {
  ADD_VISITED_VIEW: (state, view) => {
    if (state.visitedViews.some(v => v.path === view.path)) return
    const tag = {
      path: view.path,
      title: view.name
    }
    state.visitedViews.push(tag)
    sessionStorage.set('tags', state.visitedViews)
  },

  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        sessionStorage.set('tags', state.visitedViews)
        break
      }
    }
  },

  DEL_OTHERS_VISITED_VIEWS: (state, view) => {
    state.visitedViews = state.visitedViews.filter(v => {
      return v.path === view.path
    })
    sessionStorage.set('tags', state.visitedViews)
  },

  DEL_ALL_VISITED_VIEWS: state => {
    state.visitedViews = []
  }
}

const actions = {
  addView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view)
  },
  delView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view)
      resolve({
        visitedViews: [...state.visitedViews]
      })
    })
  },
  delOthersViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_VISITED_VIEWS', view)
      resolve({
        visitedViews: [...state.visitedViews]
      })
    })
  },
  delAllViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve({
        visitedViews: [...state.visitedViews]
      })
    })
  }
}

const getters = {
  visitedViews: state => state.visitedViews
}
export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}

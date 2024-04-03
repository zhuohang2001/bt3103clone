import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null, // This will hold the logged-in user state
  },
  mutations: {
    setUser(state, user) {
        console.log("user setting")
        console.log(user)
      state.user = user;
    },
  },
  actions: {
    fetchUser({ commit }, user) {
      commit('setUser', user);
    },
  },
})
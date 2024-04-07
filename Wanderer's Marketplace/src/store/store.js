import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null, // This will hold the logged-in user state
    currentListing: null, // Initialize currentListing
  },
  mutations: {
    setUser(state, user) {
        console.log("user setting")
        console.log(user)
      state.user = user;
    },
    setCurrentListing(state, listing) {
      state.currentListing = listing;
    },
  },
  actions: {
    fetchUser({ commit }, user) {
      commit('setUser', user);
    },
    setCurrentListing({ commit }, listing) {
      commit('setCurrentListing', listing);
    },
  },
})
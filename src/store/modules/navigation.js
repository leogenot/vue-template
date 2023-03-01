/*
 *
 * Navigation
 *
 */

// State
const state = {
    navHeight: 0,
};

// Getters
const getters = {};

// Actions
const actions = {
    setNavHeightGlobally(store, height) {
        store.commit("setNavHeight", height);
    }
};

// Mutations
const mutations = {
    setNavHeight(state, height) {
        state.navHeight = height;
    }
};

// Export module
export default {
    state,
    getters,
    actions,
    mutations,
    namespaced: true,
};

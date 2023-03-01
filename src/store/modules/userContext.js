/*
 *
 * Scroll
 *
 */

// State
const state = {
    isMobile: false,
    browser: null,
    isUserDeviceReady: false,
};

// Getters
const getters = {
    globalUserContext: (state) => ` ${state.browser?.name} ${state.browser?.os} ${state.isMobile ? "mobile" : ""}`,
};

// Actions
const actions = {
    setUserContext(store, userContext) {
        store.commit("updateUserContext", userContext);
    },
};

// Mutations
const mutations = {
    updateUserContext(state, userContext) {
        state.isMobile = userContext.isMobile;
        state.browser = userContext.browser;
        state.isUserDeviceReady = true;
    },
};

// Export module
export default {
    state,
    getters,
    actions,
    mutations,
    namespaced: true,
};

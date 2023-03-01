/*
 *
 * Scroll
 *
 */

// State
const state = {
    isScrollDisabled: false,
    isScrollReady: false,
    isScrollTop: true,
    isScrollingDown: false,
};

// Getters
const getters = {
    isScrollReady: (state) => state.isScrollReady === true,
    isScrollTop: (state) => state.isScrollTop === true,
    isScrollingUp: (state) => state.isScrollingUp === true,
    isNavVisibleOnScroll: (state) => state.isScrollTop === true || state.isScrollingUp === true,
};

// Actions
const actions = {
    toggleDisabledScroll(store, bool) {
        store.commit("updateDisabledScroll", bool);
    },
    toggleScrollReady(store, bool) {
        store.commit("updateScrollIsReady", bool);
    },
    toggleScrollTop(store, bool) {
        store.commit("updateScrollTop", bool);
    },
    toggleScrollDirection(store, bool) {
        store.commit("updateScrollDirection", bool);
    },
};

// Mutations
const mutations = {
    updateDisabledScroll(state, bool) {
        state.isScrollDisabled = bool;
    },
    updateScrollIsReady(state, bool) {
        state.isScrollReady = bool;
    },
    updateScrollTop(state, bool) {
        state.isScrollTop = bool;
    },
    updateScrollDirection(state, bool) {
        state.isScrollingUp = bool;
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

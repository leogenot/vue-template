/*
 *
 * Loader
 *
 */

// State
const state = {
    blocked: false,
    loading: 0,
    firstLoad: true,
    isLoaderVisible: true,
};

// Getters
const getters = {
    isBlocked: (state) => state.blocked === true,
    isLoading: (state) => state.loading > 0 && !state.blocked,
    isFirstLoad: (state) => state.firstLoad === true,
    loadCount: (state) => state.loading,
    isLoaderVisible: (state) => state.isLoaderVisible === true,
};

// Actions
const actions = {
    increment(store, context) {
        console.log("increment::", context);
        store.commit("setLoadingCount", store.state.loading + 1);
    },
    decrement(store, context) {
        console.log("decrement::", context);
        store.commit("setLoadingCount", store.state.loading - 1);
    },
    reset(store) {
        store.commit("setLoadingCount", 0);
    },
    markAsFirstLoaded(store) {
        store.commit("setFirstLoadStatus", false);
    },
    updateBlockStatus(store, value) {
        store.commit("setBlockStatus", value);
    },
    isLoaderVisible(store, bool) {
        store.commit("setLoaderVisibility", bool);
    },
};

// Mutations
const mutations = {
    setLoadingCount(state, value) {
        // Uncomment for debug
        console.log("::setLoadingCount", value);
        state.loading = value;
    },
    setFirstLoadStatus(state, isFirstLoaded) {
        state.firstLoad = isFirstLoaded;
    },
    setBlockStatus(state, value) {
        state.blocked = value;
    },
    setLoaderVisibility(state, bool) {
        state.isLoaderVisible = bool;
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

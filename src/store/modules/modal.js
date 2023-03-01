/*
 *
 * Modal
 *
 * @usage
 * 1. `import { MODAL_COMPONENTS } from "@/constants";` on the components where you want to open a modal from.
 * 2. `import { useStore } from "vuex";` on the components where you want to open a modal from.
 * 3. Use `store.dispatch("modal/open", { component: MODAL_COMPONENTS.<modal-name>, data: <data-to-pass> });` where you specify the modal component you want to use and shoot a `data` object with all needed details.
 *
 */

// State
const state = {
    data: false,
    component: false,
};

// Getters
const getters = {
    hasModal: (state) => state.component !== false,
};

// Actions
const actions = {
    open(store, { component, data }) {
        store.commit("openModal", { component, data });
    },
    close(store) {
        store.commit("closeModal", false);
    },
};

// Mutations
const mutations = {
    openModal(state, { component, data, layout }) {
        state.component = component;
        state.data = data;
        state.layout = layout || state.layout;
    },
    closeModal(state) {
        state.data = false;
        state.component = false;
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

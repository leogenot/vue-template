/*
 *
 * Global
 *
 */

import { LOADER } from "@/constants";
import { mutateState } from "@/utils";

const state = {
};

const getters = {
};

const actions = {
    async initLoad(context) {
        const promises = [context.dispatch("loadContent")];

        return Promise.all(promises).catch((e) => {
            console.error(e.message); // eslint-disable-line
        });
    },
    loadContent(context) {
        return new Promise((resolve, reject) => {
            // Timer in seconds
            const timer = new Date();

            // Start loader
            context.dispatch("loader/increment", "loadContent", { root: true });

            const loaderDelay = (LOADER.toCover + LOADER.cover) * 1000;

            // Duration in ms of the fetchContent + loaderDelay for the loader cover delay (see loader component) + 10ms for latency
            let delay = timer - new Date() + loaderDelay + 10;
            setTimeout(() => {

                // Timeout to let template to render data
                setTimeout(() => {
                    context.dispatch("loader/decrement", "loadContent", { root: true });
                }, 100);
            }, delay);


        });
    },
};

const mutations = {
    mutateState(state, payload) {
        mutateState(state, payload);
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

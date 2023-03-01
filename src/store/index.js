import { createLogger, createStore, useStore as baseUseStore } from "vuex";
import { modules } from "./modules";

const store = createStore({
    modules,
    plugins: [createLogger()],
});

export function useStore() {
    return baseUseStore();
}

export default store;

import { STORE_MODULES } from "@/constants";

export function loadModules() {
    const context = import.meta.globEager("./*.js"),
        modules = {};

    Object.keys(context).forEach((key) => {
        if (key === "./index.js") return;

        const moduleName = key.replace(/(\.\/|\.js)/g, "");

        if (!STORE_MODULES.includes(moduleName)) {
            console.error(`Vuex: "${moduleName}" module needs to be declare in constant.js`);
            return;
        }

        modules[moduleName] = context[key].default;
    });

    return { context, modules };
}

export const { context, modules } = loadModules();

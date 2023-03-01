<template>
    <footer class="l-footer">
        <button-primary
            class="l-footer__btn"
            label="Open Modal"
            color="light"
            @click="openModal"
        />
    </footer>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { MODAL_COMPONENTS } from "@/constants";

import ButtonPrimary from "@/templates/components/atoms/_buttons/ButtonPrimary.vue";

export default defineComponent({
    name: "TheFooter",
    components: {
        ButtonPrimary,
    },
    setup() {
        const store = useStore();
        function openModal(data) {
            store.dispatch("modal/open", {
                component: MODAL_COMPONENTS.Modal,

                data,
            });
        }

        return {
            openModal,
        };
    },
});
</script>

<style lang="scss">
.l-footer {
    height: 5rem;
    background-color: var(--color-black);
}
</style>

<template>
    <Teleport to="body">
        <div
            class="l-modal"
            :class="{ 'is-open': isReady }"
            role="dialog"
            aria-labelledby="modalTitle"
            aria-describedby="modalDescription"
        >
            <component :is="modalComponent" :data="modalData" @close="close" />
        </div>
        <div
            class="backdrop"
            :class="{ 'is-open': isReady }"
            @click="close"
        ></div>
    </Teleport>
</template>

<script>
import { defineComponent, computed, ref, watch } from "vue";
import { useStore } from "vuex";

import ModalComponent from "@/templates/components/organisms/Modals/ModalComponent.vue";

export default defineComponent({
    name: "TheModal",
    components: {
        ModalComponent,
    },
    props: {},
    setup(props) {
        const store = useStore();

        const isOpen = ref(false);

        const close = () => {
            isOpen.value = false;
            setTimeout(() => {
                store.dispatch("modal/close");
            }, 600);
        };

        const currentScroll = ref(0);

        const isReady = computed(() => {
            return store.getters["modal/hasModal"] && isOpen.value;
        });
        const hasModal = computed(() => {
            return store.getters["modal/hasModal"];
        });

        const modalData = computed(() => {
            return store.state.modal.data;
        });

        const modalComponent = computed(() => {
            return store.state.modal.component;
        });

        watch(hasModal, (open) => {
            if (open) {
                isOpen.value = true;
                currentScroll.value = window.scrollY;
                store.dispatch("scroll/toggleDisabledScroll", true);
            } else {
                window.scrollTo(0, currentScroll.value);
                store.dispatch("scroll/toggleDisabledScroll", false);
            }
        });

        return {
            isReady,
            currentScroll,
            isOpen,
            modalData,
            modalComponent,
            close,
            hasModal,
        };
    },
});
</script>

<style lang="scss">
.l-modal {
    @include full-screen-dom();
    z-index: 102;
    background: var(--color-beige);
    opacity: 0;
    pointer-events: none;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    overflow-y: auto;

    transition: opacity 0.4s linear;
    @include min(md) {
        width: min-content;
        height: min-content;

        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    @include min(md) {
        padding: 5rem;
    }
    @include max(md) {
        @include container("default");
    }

    &.is-open {
        opacity: 1;
        pointer-events: auto;
    }
}

.backdrop {
    background-color: var(--color-green);

    height: 100%;
    width: 100%;

    visibility: hidden;
    opacity: 0;
    transition: visibility 0.4s, opacity 0.4s linear;
    z-index: 99;

    &.is-open {
        visibility: visible;
        opacity: 0.4;
    }
}
</style>

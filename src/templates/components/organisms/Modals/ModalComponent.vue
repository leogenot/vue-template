<template>
  <div
    class="o-nameof-modal | l-container"
    :class="{ 'o-nameof-modal--active': isOpen }"
  >
    <button-primary
      class="o-nameof-modal__btn"
      label="Close Modal"
      color="light"
      @click="close"
    />
  </div>
</template>

<script>
import { defineComponent, toRef, computed } from "vue";
import { useStore } from "vuex";

import ButtonPrimary from "@/templates/components/atoms/_buttons/ButtonPrimary.vue";

export default defineComponent({
  name: "ProjectModal",
  components: {
    ButtonPrimary,
  },
  props: {
    data: {
      type: Object,
      required: true,
      default: {},
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    const store = useStore();

    const close = () => {
      emit("close");
    };

    const isOpen = computed(() => store.getters["modal/hasModal"]);

    const data = toRef(props, "data");
    return {
      close,
      data,
      isOpen,
    };
  },
});
</script>

<style lang="scss" scoped>
.o-nameof-modal {
  &--to-close {
    .l-modal {
      opacity: 0;
    }
    .backdrop {
      opacity: 0;
      visibility: hidden;
    }
  }

  &__btn {
    --btn-txt-color: var(--color-black);
    --btn-border-color: var(--color-black);
  }

  color: var(--color-pistachio);
}
</style>

<template>
  <div class="o-hero" ref="hero">HERO</div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { MODAL_COMPONENTS } from "@/constants";

import ButtonPrimary from "@/templates/components/atoms/_buttons/ButtonPrimary.vue";
import ObjectIcon from "@/templates/objects/ObjectIcon.vue";

export default defineComponent({
  name: "Hero",
  components: {
    ButtonPrimary,
    ObjectIcon,
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
.o-hero {
}
</style>

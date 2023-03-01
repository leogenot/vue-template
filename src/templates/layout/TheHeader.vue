<template>
  <div class="l-header" ref="navBar">
    <navigation />
  </div>
</template>

<script>
import {
  defineComponent,
  computed,
  onMounted,
  onBeforeUnmount,
  ref,
} from "vue";
import { useStore } from "vuex";
import { MODAL_COMPONENTS } from "@/constants";

import ButtonPrimary from "@/templates/components/atoms/_buttons/ButtonPrimary.vue";
import Navigation from "@/templates/components/organisms/Navigation/Navigation.vue";
export default defineComponent({
  name: "TheHeader",
  components: {
    ButtonPrimary,
    Navigation,
  },
  setup() {
    const store = useStore();
    function openModal(data) {
      store.dispatch("modal/open", {
        component: MODAL_COMPONENTS.Modal,

        data,
      });
    }

    const navBar = ref(null);

    const isMobile = computed(() => {
      return store.state.userContext.isMobile;
    });

    let height = null;

    function setNavStoreHeight(height) {
      store.dispatch("navigation/setNavHeightGlobally", height);
    }

    function setNavHeight() {
      height = navBar.value.offsetHeight;
      setNavStoreHeight(height);
    }

    function onResize() {
      !isMobile.value ? setNavHeight() : null;
    }

    onMounted(() => {
      setNavHeight();
      window.addEventListener("resize", onResize);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("resize", onResize);
    });

    return {
      openModal,
      navBar,
    };
  },
});
</script>

<style lang="scss">
.l-header {
  height: 5rem;
  background-color: var(--color-dark);
}
</style>

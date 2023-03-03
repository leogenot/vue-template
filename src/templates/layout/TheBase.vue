<template>
  <div
    class="l-base"
    :class="`${globalUserContext}`"
    :style="`--header-height: ${headerHeight}px; --app-height: ${appHeight}px;`"
    id="base"
  >
    <the-loader></the-loader>
    <the-header class="l-base__header" />

    <div id="smooth-wrapper">
      <div id="smooth-content">
        <main class="l-main" ref="main">
          <the-content ref="content" />
          <the-footer></the-footer>
        </main>
        <the-modal />
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  nextTick,
  computed,
  watch,
} from "vue";
import { useStore } from "vuex";
import { userContext } from "@/utils";

import { gsap, ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

import TheLoader from "@/templates/layout/TheLoader.vue";
import TheContent from "@/templates/layout/TheContent.vue";
import TheFooter from "@/templates/layout/TheFooter.vue";
import TheHeader from "@/templates/layout/TheHeader.vue";
import TheModal from "@/templates/layout/TheModal.vue";

import Lenis from "@studio-freight/lenis";

export default defineComponent({
  name: "TheBase",
  components: {
    TheLoader,
    TheContent,
    TheFooter,
    TheHeader,
    TheModal,
  },
  setup() {
    const store = useStore();

    const currentScrollProgress = ref(0);

    const isLoading = computed(() => store.getters["loader/isLoading"]);
    const isScrollDisabled = computed(
      () => store.state.scroll.isScrollDisabled
    );

    const globalUserContext = computed(
      () => store.getters["userContext/globalUserContext"]
    );
    const isScrollTop = computed(() => store.getters["scroll/isScrollTop"]);
    const isScrollingUp = computed(() => store.getters["scroll/isScrollingUp"]);

    ////////////////////////////////
    //       START SET USER CONTEXT
    ////////////////////////////////
    store.dispatch("userContext/setUserContext", userContext);

    ////////////////////////////////
    //       END SET USER CONTEXT
    ////////////////////////////////

    //======= START SCROLL TOP =======//

    function checkIfUserScrollTop(progress) {
      progress !== isScrollTop.value ? toggleUserScrolled(progress) : null;
    }

    function toggleUserScrolled(bool) {
      store.dispatch("scroll/toggleScrollTop", bool);
    }

    //======= END SCROLL TOP =======//

    ////////////////////////////////
    //       START SCROLL DIRECTION
    ////////////////////////////////
    function onScroll() {
      toggleScrollDirection(currentScrollProgress.value > window.pageYOffset);

      nextTick(() => {
        currentScrollProgress.value = window.pageYOffset;
      });
    }

    function toggleScrollDirection(bool) {
      isScrollingUp.value !== bool
        ? store.dispatch("scroll/toggleScrollDirection", bool)
        : null;
    }
    ////////////////////////////////
    //       END SCROLL DIRECTION
    ////////////////////////////////

    ////////////////////////////////
    //       APP SIZE
    ////////////////////////////////
    const appHeight = ref(window.innerHeight);

    const headerHeight = computed(() => {
      return store.state.navigation.navHeight;
    });

    const isMobile = computed(() => {
      return store.state.userContext.isMobile;
    });
    ////////////////////////////////
    //      END APP SIZE
    ////////////////////////////////

    ////////////////////////////////
    //       START RESIZE
    ////////////////////////////////
    function refreshScrollTrigger() {
      ScrollTrigger.refresh();
    }

    function onResize() {
      !isMobile.value ? refreshScrollTrigger() : null;
    }
    ////////////////////////////////
    //       END RESIZE
    ////////////////////////////////
    const main = ref(null);
    const wrapper = ref(null);
    const content = ref(null);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: "vertical", // vertical, horizontal
      gestureDirection: "vertical", // vertical, horizontal, both
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    //get scroll value
    lenis.on("scroll", ({ scroll, limit, velocity, direction, progress }) => {
      console.log({ scroll, limit, velocity, direction, progress });
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    onMounted(() => {
      window.addEventListener("resize", onResize);
      window.addEventListener("scroll", onScroll);
      refreshScrollTrigger();
    });
    onBeforeUnmount(() => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    });

    watch(() => {
      refreshScrollTrigger();
    });

    return {
      isLoading,
      globalUserContext,
      appHeight,
      headerHeight,
      isScrollDisabled,
      isScrollTop,
      isScrollingUp,
      wrapper,
      content,
      main,
    };
  },
});
</script>

<style lang="scss">
.l-base {
}
</style>

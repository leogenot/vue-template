<template>
  <the-base />
</template>
<script>
import { defineComponent, onMounted } from "vue";
import { isTouch } from "@/utils";
import "@/assets/scss/global.scss";
import TheBase from "@/templates/layout/TheBase.vue";

export default defineComponent({
  name: "App",
  components: {
    TheBase,
  },
  setup() {
    onMounted(() => {
      if (isTouch) document.documentElement.classList.add("is-touch");
    });
  },
});
</script>

<style lang="scss">
.is-touch {
  overscroll-behavior-y: contain;
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: hidden;
}
</style>

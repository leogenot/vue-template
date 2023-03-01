<template>
  <div class="o-navigation">
    <NavigationContent />
  </div>
</template>

<script>
import { defineComponent } from "vue";

import NavigationContent from "@/templates/components/molecules/Navigation/NavigationContent.vue";

export default defineComponent({
  name: "Navigation",
  components: {
    NavigationContent,
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss">
.o-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;

  color: var(--color-white);
}
</style>

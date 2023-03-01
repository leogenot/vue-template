<template>
  <span :class="className">
    <svg :class="`svg-${name}`" aria-hidden="true" :style="sizeIcon">
      <use :href="symbolId" :fill="color" />
    </svg>
  </span>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "Icon",
  props: {
    prefix: {
      type: String,
      default: "icon",
      required: false,
    },
    name: {
      type: String,
      required: false,
      default: "arrow-right",
    },
    color: {
      type: String,
      default: "#000",
      required: false,
    },
    size: {
      type: String,
      default: null,
    },
    size20: {
      type: Boolean,
      default: false,
    },
    size30: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`);

    const sizeIcon = computed(() => {
      if (props.size20) {
        return {
          "--svg-width": 2 + "em",
          "--svg-height": 2 + "em",
        };
      }
      if (props.size30) {
        return {
          "--svg-width": 3 + "em",
          "--svg-height": 3 + "em",
        };
      }
      return sizeIcon;
    });

    const className = computed(() => {
      let classname = `o-icon -${props.name}`;

      if (props.size) {
        classname += ` -${props.size}`;
      }

      return classname;
    });

    return { className, symbolId, sizeIcon };
  },
});
</script>

<style lang="scss" scoped>
.o-icon {
  display: inline-block;
  vertical-align: middle;

  svg {
    display: block;
    width: var(--svg-width, 1em);
    height: calc(
      var(--svg-height, var(--svg-width, 1em)) * var(--svg-ratio, 1)
    );
    fill: currentColor;
  }
}
</style>

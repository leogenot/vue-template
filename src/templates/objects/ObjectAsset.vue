<template>
    <picture
        v-if="specImg"
        :key="specImg"
        class="o-asset"
        :class="classesImg"
        :style="stylesImg"
    >
        <source
            v-if="webpImg"
            type="image/webp"
            :data-srcset="isLazyLoad ? webpImg.srcset : null"
            :srcset="!isLazyLoad ? webpImg.srcset : null"
        />
        <source
            v-if="specImg.srcset"
            :type="specImg.mimeType"
            :data-srcset="isLazyLoad ? specImg.srcset : null"
            :srcset="!isLazyLoad ? specImg.srcset : null"
        />
        <img
            ref="image"
            class="o-asset__img"
            :class="{ lazyload: isLazyLoad }"
            :alt="titleImg ? titleImg : specImg.title"
            :data-sizes="isLazyLoad ? 'auto' : null"
            :data-src="isLazyLoad ? specImg.url : null"
            :src="isLazyLoad ? '/src/assets/images/blank.gif' : null"
            :width="specImg.width"
            :height="specImg.height"
            @load="loaded()"
        />
    </picture>
</template>

<script>
import "lazysizes";

import { defineComponent, ref, onMounted, computed } from "vue";

export default defineComponent({
    props: {
        //--- Base ---//
        asset: {
            type: [Object, Array],
            required: false,
        },
        webp: {
            type: [Object, Array],
            required: false,
        },
        url: {
            type: String,
            required: false,
            default: null,
        },
        title: {
            type: String,
            required: false,
            default: null,
        },
        //--- Custom ---//
        isContain: {
            type: Boolean,
            required: false,
            default: false,
        },
        isCover: {
            type: Boolean,
            required: false,
            default: false,
        },
        fit: {
            type: String,
            required: false,
            default: "none",
            validator: (f) => ["none", "cover", "contain"].includes(f),
        },
        isLazy: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
    setup(props, { emit }) {
        const isLazyLoad = ref(props.isLazy);
        const isLoaded = ref(false);
        const specImg = ref(null);
        const webpImg = ref(null);
        const ratioImg = ref(null);
        const stylesImg = ref(null);
        const titleImg = ref(props.title);
        const objectFit = ref(props.fit);

        const classesImg = computed(() => ({
            "-fit": objectFit.value != "none",
            "-lazy": isLazyLoad.value,
            "-loaded": isLoaded.value,
        }));

        function setImage() {
            // If is array, take first index
            if (Array.isArray(props.asset) && props.asset.length > 0) {
                specImg.value = props.asset[0];
            }

            if (props.asset && props.asset.url) {
                specImg.value = props.asset;
            }

            if (props.url) {
                specImg.value = {
                    url: props.url,
                    title: props.title,
                    width: 0,
                    height: 0,
                };
            }

            // Webp format
            if (props.webp) {
                webpImg.value =
                    Array.isArray(props.webp) && props.webp.length > 0
                        ? props.webp[0]
                        : props.webp;
            }
        }

        function setRatio() {
            if (
                !specImg.value ||
                !specImg.value.width ||
                !specImg.value.height
            ) {
                ratioImg.value = 0;
                return;
            }
            ratioImg.value = (
                specImg.value.width / specImg.value.height
            ).toFixed(3);
        }

        function setStyles() {
            if (ratioImg.value) {
                stylesImg.value = `--asset-ratio: ${ratioImg.value};`;
            }
        }

        function loaded() {
            isLoaded.value = true;
            emit("loaded");
        }

        //--- STATES ---//

        onMounted(() => {
            setImage();
            setRatio();
            setStyles();
        });

        return {
            specImg,
            webpImg,
            classesImg,
            stylesImg,
            objectFit,
            isLoaded,
            isLazyLoad,
            titleImg,
            loaded,
        };
    },
});
</script>

<style lang="scss" scoped>
.o-asset {
    $_: &;

    &__img {
        display: block;
        max-width: 100%;
        height: auto;

        &.lazyload,
        &.lazyloading {
            opacity: 0;
        }
        &.lazyloaded {
            opacity: 1;
            transition: opacity 0.8s ease;
        }
    }

    /*==============================
    =      VISUAL VARIATIONS       =
    ==============================*/

    // Object fit image
    &.-fit {
        aspect-ratio: var(--asset-ratio) / 1;

        #{$_}__img {
            width: 100%;
            height: 100%;
            object-fit: v-bind(objectFit);
        }
    }
}
</style>

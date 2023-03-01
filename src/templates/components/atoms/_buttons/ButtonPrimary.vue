<template>
    <component
        :is="tag"
        :href="btnHref"
        :to="btnTo"
        :rel="tag == 'a' ? 'noopener' : null"
        :class="className"
        :aria-disabled="isDisabled ? true : null"
        :disabled="isDisabled ? true : null"
        :target="btnTarget"
        v-magnet
    >
        <span
            class="c-button-primary__bg | js-magnet-bg"
            :data-magnet-move="size == 'mega' ? 50 : 20"
        ></span>
        <span
            class="c-button-primary__inner | js-magnet-inner"
            :data-magnet-move="size == 'mega' ? 30 : 10"
        >
            <object-icon
                v-if="iconBefore"
                class="c-button-primary__icon c-button-primary__icon--before"
                :name="iconBefore"
            />
            <span class="c-button-primary__label" :data-label="label">
                <slot>{{ label }}</slot>
            </span>
            <object-icon
                v-if="iconAfter"
                class="c-button-primary__icon c-button-primary__icon--after"
                :name="iconAfter"
            />
        </span>

        <span class="js-magnet-hit"></span>
    </component>
</template>

<script>
import { defineComponent, computed } from "vue";

import ObjectIcon from "@/templates/objects/ObjectIcon.vue";

export default defineComponent({
    name: "ButtonPrimary",
    components: {
        ObjectIcon,
    },
    props: {
        //--- Base ---//
        href: {
            type: String,
            default: null,
        },
        label: {
            type: [String, Number],
            default: "Button Label",
        },
        tag: {
            type: String,
            default: "button",
        },
        isDisabled: {
            type: Boolean,
            default: null,
        },
        isTargetBlank: {
            type: Boolean,
            default: false,
        },

        //--- Visual ---//
        color: {
            type: String,
            required: false,
            default: "dark",
            validator: (val) => ["dark", "light"].includes(val),
        },
        isOutline: {
            type: Boolean,
            required: false,
            default: true,
        },
        size: {
            type: String,
            required: false,
            default: "regular",
            validator: (val) => ["regular", "large", "mega"].includes(val),
        },

        //--- Icons ---//
        iconBefore: {
            type: String,
            default: null,
        },
        iconAfter: {
            type: String,
            default: null,
        },
    },
    setup(_) {
        const className = computed(() => [
            "c-button-primary",
            `-color-${_.color}`,
            `-size-${_.size}`,
            _.isOutline ? "-outline" : "-fill",
        ]);

        const btnHref = computed(() =>
            (_.tag == "a" || _.tag == "router-link") && _.href !== null
                ? _.href
                : null
        );
        const btnTo = computed(() =>
            _.tag == "router-link" && _.href !== null ? href : null
        );

        const isTargetBlank = computed(() =>
            _.isTargetBlank ? "_blank" : "_self"
        );
        const btnTarget = computed(() =>
            _.tag === "a" ? isTargetBlank.value : null
        );

        return { className, btnHref, btnTo, btnTarget };
    },
});
</script>

<style lang="scss" scoped>
.c-button-primary {
    @include anim-reveal-default;
    --a-in-delay: 0.2s;

    --btn-txt-color: var(--color-pistachio);
    --btn-txt-size: var(--fs-regular);
    --btn-padding-v: 0.5em;
    --btn-padding-h: 1em;
    --btn-padding: var(--btn-padding-v) var(--btn-padding-h);

    --btn-bg-display: block;
    --btn-bg-color: transparent;
    --btn-border-color: var(--color-pistachio);
    --btn-hover-display: block;
    --btn-hover-color: var(--color-orange);
    --btn-hover-scale: 0;
    --btn-hover-txt-color: var(--btn-txt-color);

    --svg-spacing: 0.5em;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--btn-padding);
    transition: all 0.3s ease;
    cursor: pointer;

    text-decoration: none;

    //--- Background ---//
    &__bg {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;

        &:before,
        &:after {
            content: "";
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            border-radius: 10rem;
            transform-origin: center;
            transition: all 1s $out-expo, transform 0.6s $out-expo;
        }

        &:after {
            display: var(--btn-bg-display);
            background-color: var(--btn-bg-color);
            border: 1px solid var(--btn-border-color);

            @at-root .-fill#{&} {
                border: none;
            }
        }

        &:before {
            display: var(--btn-hover-display);
            width: calc(100% + 2px); // Prevent :after from showing under
            height: calc(100% + 2px);
            top: -1px;
            left: -1px;
            z-index: 2;
            transform: scale(var(--btn-hover-scale));
            background-color: var(--btn-hover-color);
        }
    }

    //--- Content ---//
    &__inner {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--svg-spacing);
        font-size: var(--btn-txt-size);
        z-index: 2;

        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    &__label {
        --btn-label-spacing: 0.07em;
        display: block;
        color: transparent;
        line-height: 1.3;
        overflow: hidden;
        white-space: nowrap;
        padding-bottom: var(--btn-label-spacing);

        &:before,
        &:after {
            content: attr(data-label);
            color: var(--btn-txt-color);
            position: absolute;
            top: 0;
            left: 0;
            transform-origin: top center;
            transform-style: preserve-3d;
            transform: perspective(5rem) rotateX(25deg) translateY(-100%);
            transition: color 1s $out-expo, transform 1.2s $out-expo;
        }
        &:before {
            transition-duration: 1s;
        }
        &:after {
            transform-origin: bottom center;
            transform: translateY(0);
        }
    }

    &__icon {
        --svg-width: 1.25em;
        --svg-height: var(--svg-width);

        &:deep(svg) {
            color: var(--btn-txt-color);
            transition: color 1s $out-expo;
        }
    }

    /*==============================
    =      VISUAL VARIATIONS       =
    ==============================*/

    &.-color-light {
        --btn-color: var(--color-dark);
        --btn-bg-color: var(--color-light);
    }

    &.-none {
        --btn-bg-display: none;
    }

    //--- Sizes ---//
    &.-large {
        @include min(md) {
            --btn-txt-size: var(--fs-large);
            padding: 0.55em 1.6em;
        }
    }

    &.-mega {
        --btn-txt-size: 2.3rem;
        --btn-padding: 1.35em;
        --btn-hover-display: none;
        width: 100%;

        @include between(md, xl) {
            --btn-txt-size: 4rem;
            --btn-padding: 2.1em;
        }

        @include min(xl) {
            --btn-txt-size: var(--fs-2xl);
            --btn-padding: 2.35em;
        }
    }

    /*==============================
    =           STATES             =
    ==============================*/

    //--- Hover ---//
    &:hover {
        --btn-color: var(--color-light);
        --btn-bg-color: var(--color-accent);
    }

    //--- DISABLED ---//
    &[disabled],
    &[aria-disabled="true"] {
        pointer-events: none;
        text-decoration: none;
        cursor: not-allowed;
        opacity: 0.4;
    }

    @at-root span#{&} {
        pointer-events: none;
    }

    //--- Hover ---//
    html:not(.is-touch) &:hover {
        --btn-hover-scale: 1;

        &__label {
            &:before {
                transform: translateY(0);
            }
            &:after {
                color: var(--btn-hover-txt-color);
                transform: perspective(5rem) rotateX(-25deg) translateY(100%);
                transition-duration: 1s;
            }
        }

        // Variations
        @at-root .-regular#{&} {
            --btn-txt-color: var(--color-black);
        }
        @at-root .-large#{&} {
            --btn-txt-color: var(--color-black);
        }
        @at-root .-mega#{&} {
            &__bg {
                &:after {
                    transform: scale(0.85);
                }
            }
        }
    }
}
</style>

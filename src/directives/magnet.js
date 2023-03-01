import { gsap } from "gsap/all";
import { isTouch, reducedMotion } from "@/utils";

const magnetClass = new (class Magnet {
    constructor() {
        // console.log(`${this.constructor.name}:contructor`)

        if (isTouch || reducedMotion) {
            return;
        }

        this.items = [];

        // Bind Window events
        window.addEventListener("resizeEnd", this.setSizes.bind(this));
    }

    addItem(id, $el) {
        // console.log(`${this.constructor.name}:addItem`)

        if (reducedMotion) {
            return;
        }

        const $inners = $el.querySelectorAll(".js-magnet-inner");
        const $hit = $el.querySelector(".js-magnet-hit");
        const $bg = $el.querySelector(".js-magnet-bg");
        const $img = $el.querySelector("img");

        // Add item to all items
        const item = {
            id,
            $el,
            inners: [],
            hit: {
                $el: $hit,
            },
            bg: false,
            $img,
        };

        if ($inners.length) {
            $inners.forEach(($inner) => {
                item.inners.push({
                    $el: $inner,
                    move: $inner.dataset.magnetMove ? $inner.dataset.magnetMove : 10,
                });
            });
        }

        if ($bg) {
            item.bg = {
                $el: $bg,
                move: $bg.dataset.magnetMove ? $bg.dataset.magnetMove : 20,
            };
        }

        this.items[id] = item;

        // Set item sizes
        this.setItemSizes(id);

        // Add event listeners
        item.hit.$el.addEventListener("mouseenter", (e) => {
            this.animateIn(e, item);
        });

        item.hit.$el.addEventListener("mouseleave", (e) => {
            this.animateOut(e, item);
        });

        item.hit.$el.addEventListener("mousemove", (e) => {
            this.animate(e, item);
        });

        // Trigger set sizes when image is loaded
        if ($img) {
            item.$img.addEventListener("load", () => {
                this.setItemSizes(id);
            });
        }
    }

    removeItem(id) {
        // console.log(`${this.constructor.name}:removeItem`)

        if (reducedMotion) {
            return;
        }

        const item = this.items[id];

        if (typeof item !== "undefined") {
            delete this.items[id];
        }
    }

    animateIn(i, item) {
        // console.log(`${this.constructor.name}:animateIn`)

        item.inners.forEach((inner) => {
            gsap.to(inner.$el, {
                duration: 0.3,
                ease: "power2.out",
            });
        });

        if (item.bg) {
            gsap.to(item.bg.$el, {
                duration: 0.3,
                ease: "power2.out",
                onStart: () => {
                    gsap.set(item.$el, { zIndex: 100 });
                },
            });
        }
    }

    animateOut(i, item) {
        // console.log(`${this.constructor.name}:animateOut`)

        item.inners.forEach((inner) => {
            gsap.to(inner.$el, {
                duration: 0.3,
                x: 0,
                y: 0,
                ease: "power2.out",
                overwrite: 1,
                onComplete: () => {
                    gsap.set(item.$el, { clearProps: "zIndex" });
                },
            });
        });

        if (item.bg) {
            gsap.to(item.bg.$el, {
                duration: 0.3,
                x: 0,
                y: 0,
                ease: "power2.out",
                overwrite: 1,
            });
        }
    }

    animate(e, item) {
        // console.log(`${this.constructor.name}:animate`)

        let rect = item.hit.$el.getBoundingClientRect();
        let relX = e.pageX - rect.left;
        let relY = e.pageY - rect.top;
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        item.inners.forEach((inner) => {
            gsap.to(inner.$el, {
                duration: 0.3,
                x: ((relX - rect.width / 2) / rect.width) * inner.move,
                y: ((relY - rect.height / 2 - scrollTop) / rect.width) * inner.move,
                ease: "power2.out",
            });
        });

        if (item.bg) {
            gsap.to(item.bg.$el, {
                duration: 0.3,
                x: ((relX - rect.width / 2) / rect.width) * item.bg.move,
                y: ((relY - rect.height / 2 - scrollTop) / rect.width) * item.bg.move,
                ease: "power2.out",
            });
        }
    }

    setSizes() {
        //console.log(`${this.constructor.name}:setSizes`);

        for (let item of this.items) {
            if (item?.id) {
                this.setItemSizes(item.id);
            }
        }
    }

    setItemSizes(id) {
        // console.log(`${this.constructor.name}:setItemSizes`)

        const item = this.items[id];

        if (typeof item === "undefined") {
            return;
        }

        item.w = item.$el.offsetWidth;
        item.h = item.$el.offsetHeight;

        item.hit.w = item.hit.$el.offsetWidth;
        item.hit.h = item.hit.$el.offsetHeight;
    }
})();

let magnetIndex = 0;
const magnet = {
    mounted: function ($el, bind) {
        const arg = bind.value;

        // Return if argument is set to false
        if (arg === false || isTouch) {
            return;
        }

        // Define item id
        let id = $el.dataset.magnet || magnetIndex++;

        $el.dataset.magnet = id;

        magnetClass.addItem(id, $el);
    },
    unmounted: function ($el, bind) {
        // Return if argument is set to false
        if (bind.value === false || isTouch) {
            return;
        }

        const id = Number($el.dataset.magnet);

        magnetClass.removeItem(id);
    },
};

export default magnet;

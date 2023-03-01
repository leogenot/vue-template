/**

# View Directive

## Usage

```
    <span v-view />
    <span v-view.parallax />
    <span v-view.progress />
    <span v-view.parallax.progress />
```

It can also support a function. Example :

```
<span v-view="(e) => exampleFunction(e)" />
...
const exampleFuntion = (e) => {
    console.log(e.percent.top);
};
```

## Reveal

The directive, by default, add CSS classes to let you handle the animations/transitions in plain CSS

Some properties can be controlled using CSS variables:
› --reveal-end (WIP)

## Parallax

The `parallax` modifier generate a GSAP transition based specific parameters.

Those parameters are fully customizable with CSS variables.
› --parallax-duration, default: 0.2
› --parallax-x, default: 0
› --parallax-y, default: 0
› --parallax-ease, default: "sine.out"

Those variables are plenty flexible to support @media queries.

## Scroll progression

The `progress` modifier output a percentage (0...1 decimal) through a CSS variables (`--view-progress`).

## States

The directive can be disabled and enabled using events(emit).

Example:

```
import emitter from "@/services/emitter";
...
setup() {
    emitter.emit("v-view-pause");
    setTimeout(() => {
        emmiter.emit('v-view-unpause')
    }, 1000);
}
```

Notes: The directive listen to the loader module(Vuex), meaning that you can achieve a play/pause behaviour by using the loader actions (increment/decrement).

 */

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import store from "@/store";
import emitter from "@/services/emitter";
import { LOADER } from "@/constants";

const roundPercent = Symbol("roundPercent");

const viewClass = new (class View {
    constructor() {
        // console.log(`${this.constructor.name}:init`)

        this.classname = {
            reveal: "js-reveal",
            visible: "is-visible",
        };

        this.pos = {};

        this.items = {};

        this.isEnabled = false;

        const $body = document.body;
        let bodyHeight = 0;
        let newHeight;

        this.setSizes();

        setInterval(() => {
            newHeight = $body.clientHeight;

            // Return if same height
            if (bodyHeight === newHeight) {
                return;
            }

            bodyHeight = newHeight;
            emitter.emit("bodyHeightUpdate");
            this.refreshTriggers();
        }, 1000);

        store.watch(
            () => store.getters["loader/isLoading"],
            (loading) => {
                if (loading) {
                    this.disable();
                } else {
                    // TMP Fix
                    // TODO: Find why all trigger arent register before being enabled
                    setTimeout(() => {
                        this.enable();
                    }, LOADER.toCover * 1);
                }
            }
        );

        // Window events
        window.addEventListener("load", () => {
            // Scroll in page
            this.scroll = {
                x: window.pageYOffset,
                y: window.pageXOffset,
            };

            // Set sizes
            this.setSizes();
        });

        window.addEventListener("resize", this.setSizes.bind(this));
    }

    setSizes() {
        //console.log(`${this.constructor.name}:setSizes`)

        this.W = {
            w: window.innerWidth,
            h: window.innerHeight,
        };

        this.doc = {
            h: document.documentElement.scrollHeight,
            w: document.documentElement.scrollWidth,
        };
    }

    refreshTriggers() {
        for (let id in this.items) {
            this.items[id].trigger.refresh(true);
            console.log("refresh");
        }
    }

    addTrigger(id, item) {
        // console.log(`${this.constructor.name}:addTrigger`, id);

        item.$el.classList.add(this.classname.reveal);

        this.items[id] = {
            id: item.id,
            rect: item.rect,
            $el: item.$el,
            cb: item.cb,
            once: item.once,
            trigger: ScrollTrigger.create({
                trigger: item.$el,
                start: "top 90%",
                end: "bottom 0",
                onUpdate: (self) => this.updateItem(id, self),
                once: item.once,
            }),
            reveal: item.reveal,
            progress: item.progress,
            parallax: item.parallax,
        };

        if (!this.isEnabled) {
            this.items[id].trigger.disable();
        }
    }

    updateItem(id, state) {
        // console.log(`${this.constructor.name}:updateItem`, id, state);
        const item = this.items[id];
        this.pos = {
            top: window.pageYOffset,
            right: window.pageXOffset + this.W.w,
            bottom: window.pageYOffset + this.W.h,
            left: window.pageXOffset,
        };
        if (!this.isEnabled || typeof item === "undefined") {
            return;
        }
        // if (item.cb) {
        //     item.cb(state);
        // }

        const inType = this.getInType(item);
        // Callback
        if (item.cb) {
            item.cb({
                percent: {
                    top: inType.percent.top,
                    bottom: inType.percent.bottom,
                    left: inType.percent.left,
                    right: inType.percent.right,
                    center: {
                        x: inType.percent.center.x,
                        y: inType.percent.center.y,
                    },
                    scroll: {
                        x: this[roundPercent](this.pos.top / (this.doc.h - this.W.h)),
                        y: this[roundPercent](this.pos.left / (this.doc.w - this.W.w)),
                    },
                },
                rect: inType.rect,
                scroll: {
                    x: this.pos.top - this.scroll.x,
                    y: this.pos.left - this.scroll.y,
                },
                target: item.$el,
                state: state,
            });
        }

        // Toggle reveal `visible` class
        if (state.isActive) {
            item.$el.classList.add(this.classname.visible);
        } else {
            item.$el.classList.remove(this.classname.visible);
        }

        // Modifier: Parallax
        if (item.parallax !== false) {
            gsap.to(item.$el, item.parallax.duration, {
                x: (1 - inType.percent.top) * item.parallax.x * 10,
                y: (1 - inType.percent.top) * item.parallax.y * 10,
                ease: item.parallax.ease,
            });
        }

        // Modifier: Progress
        if (item.progress) {
            item.$el.style.setProperty("--view-progress", state.progress);
        }

        // Modifier: Once
        if (state.isActive && item.once) {
            this.removeTrigger(id);
        }
    }

    removeTrigger(id, delay = 0) {
        // console.log(`${this.constructor.name}:removeTrigger`);

        const item = this.items[id];
        item.trigger.kill();
        delete item.$el.dataset.reveal;
        delete this.items[id];

        setTimeout(() => {
            item.$el.classList.remove(this.classname.reveal);
            item.$el.classList.remove(this.classname.visible);
        }, delay);
    }

    revealEnd(i) {
        // console.log(`${this.constructor.name}:revealEnd`, i)

        i.$el.classList.remove(this.classname.reveal);
        i.$el.classList.remove(this.classname.visible);
        i.$el.removeEventListener(this.transitionEnd, this.revealEnd);
    }

    getInType(i) {
        // console.log(`${this.constructor.name}:getInType`, i);

        let rect = i.$el.getBoundingClientRect();
        let elementTop = rect.top + this.pos.top;
        let elementLeft = rect.left + this.pos.left;
        let elementBottom = elementTop + rect.height;
        let topIn = elementTop > this.pos.top && elementTop < this.pos.bottom;
        let bottomIn = elementBottom > this.pos.top && elementBottom < this.pos.bottom;
        let percentInView =
            topIn || bottomIn
                ? ((bottomIn ? elementBottom : this.pos.bottom) - (topIn ? elementTop : this.pos.top)) / rect.height
                : 0;
        let centerPercentY = (elementTop - this.pos.top + rect.height / 2) / this.W.h;
        let centerPercentX = (elementLeft - this.pos.left + rect.width / 2) / this.W.w;

        let topPercent = this[roundPercent](rect.top + rect.height) / (this.W.h + rect.height);
        let bottomPercent = 1 - topPercent;
        let leftPercent = this[roundPercent](rect.left + rect.width) / (this.W.w + rect.width);
        let rightPercent = 1 - leftPercent;

        return {
            percent: {
                inView: this[roundPercent](percentInView),
                top: this[roundPercent](topPercent),
                bottom: this[roundPercent](bottomPercent),
                left: this[roundPercent](leftPercent),
                right: this[roundPercent](rightPercent),
                center: {
                    x: this[roundPercent](centerPercentX),
                    y: this[roundPercent](centerPercentY),
                },
            },
            rect: rect,
        };
    }

    enable() {
        // console.log(`${this.constructor.name}:enable`);

        this.isEnabled = true;

        let item;
        for (let id in this.items) {
            item = this.items[id];
            item.trigger.enable();
            //item.trigger.update()
            this.updateItem(id, item.trigger);
        }
    }

    disable() {
        // console.log(`${this.constructor.name}:disable`);

        for (let id in this.items) {
            this.items[id].trigger.disable();
        }

        this.isEnabled = false;
    }

    destroy() {
        // console.log(`${this.constructor.name}:destroy`)

        emitter.off("bodyHeightUpdate", this.refreshTriggers);
    }

    /**
     * Round percentage to a thousandth
     * @return {number} The rounded number
     */
    [roundPercent](v) {
        return ((v * 1000) | 0) / 1000;
    }
})();

let itemIndex = 0;
export const view = {
    mounted: function ($el, bind) {
        // Return if value is set to false
        if (typeof bind.value === "boolean" && !bind.value) {
            return;
        }

        // Define item id
        let id = Number($el.dataset.reveal) || itemIndex++;

        // Set default item values
        let item = viewClass.items[id] || {
            id,
            rect: {},
            element: $el,
            $el,
            cb: typeof bind.value === "function" ? bind.value : false,
            once: !!bind.modifiers.once,
            reveal: false,
            progress: false,
            parallax: false,
        };

        let propertyValue;
        const styles = window.getComputedStyle($el);

        // Set reveal
        if (bind.modifiers.reveal === true) {
            item.reveal = {};

            propertyValue = styles.getPropertyValue("--reveal-end");
            item.reveal.end = propertyValue ? propertyValue : false;

            item.$el.classList.add(viewClass.classname.reveal);
        }

        // Set parallax
        if (bind.modifiers.parallax === true) {
            item.parallax = {};

            propertyValue = styles.getPropertyValue("--parallax-duration");
            item.parallax.duration = propertyValue ? parseFloat(propertyValue) : 0.2;
            propertyValue = styles.getPropertyValue("--parallax-x");
            item.parallax.x = propertyValue ? parseFloat(propertyValue) : 0;
            propertyValue = styles.getPropertyValue("--parallax-y");
            item.parallax.y = propertyValue ? parseFloat(propertyValue) : 0;
            propertyValue = styles.getPropertyValue("--parallax-ease");
            item.parallax.ease = propertyValue ? parseFloat(propertyValue) : "sine.out";
        }

        // Set progress
        if (bind.modifiers.progress === true) {
            item.progress = true;
        }

        // Keep actual element ID if already set
        $el.id = $el?.getAttribute("id") || `reveal-id-${id}`;
        $el.dataset.reveal = id;

        viewClass.addTrigger(id, item);
    },
    unmounted: function ($el, bind) {
        if (typeof bind.value === "boolean" && !bind.value) {
            return;
        }

        const id = Number($el.dataset.reveal);

        viewClass.removeTrigger(id);
    },
};

emitter.on("v-view-pause", () => {
    viewClass.disable();
});

emitter.on("v-view-unpause", () => {
    viewClass.enable();
});

emitter.on("v-view-refresh", () => {
    viewClass.refreshTriggers();
});

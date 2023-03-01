import { onMounted, onUnmounted, reactive } from "vue";
import { browserName, osName, isMobile } from "mobile-device-detect";

export function useContext() {
    // Init vars
    const W = reactive({
        w: window.innerWidth,
        h: window.innerHeight,
        isSmallScreen: false,
        showMobileNav: false,
        ratio: window.innerWidth / window.innerHeight,
    });

    const browser = reactive({
        name: browserName.toLowerCase().replace(" ", "-"),
        os: osName.toLowerCase().replace(" ", "-"),
    });

    // Define window vars
    function set() {
        W.w = window.innerWidth;
        W.h = window.innerHeight;
        W.isSmallScreen = W.w <= 768 ? true : false;
        W.showMobileNav = W.w <= 1180 ? true : false;
        W.ratio = W.w / W.h;
    }

    // Event listeners
    onMounted(() => {
        set();
        window.addEventListener("resizeEnd", set);
    });

    onUnmounted(() => {
        window.removeEventListener("resizeEnd", set);
    });

    // Returns
    return { W, browser, isMobile };
}

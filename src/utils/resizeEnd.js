import debounce from "./debounce.js";

function resizeEnd() {
    const resizeEnd = new Event("resizeEnd");

    window.addEventListener(
        "resize",
        debounce(() => {
            window.dispatchEvent(resizeEnd);
        }, 200)
    );
}

export default resizeEnd;

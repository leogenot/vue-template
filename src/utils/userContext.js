import { browserName, osName, isMobile } from "mobile-device-detect";

const userDevice = {
    browser: {
        name: browserName.toLowerCase().replace(" ", "-"),
        os: osName.toLowerCase().replace(" ", "-"),
    },
    isMobile,
};

export default userDevice;

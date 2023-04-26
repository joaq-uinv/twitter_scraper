const { cronFrequency, twitterURL } = require("./config");
const { initCron } = require("./scheduler");

const init = () => {
    initCron({ cronFrequency, twitterURL });

    console.log("Scheduler running");
};

init();

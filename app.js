const { init } = require("./src");

exports.handler = async (event, context) => {
    console.log(`Event: ${event},  Context: ${context}`);

    await init();
};

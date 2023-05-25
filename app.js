const { init } = require("./src");

module.exports.handler = async (event, context) => {
    console.log(`Event: ${event},  Context: ${context}`);

    await init();
};

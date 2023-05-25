const { init } = require("./src");

exports.handler = (event, context) => {
    console.log(`Event: ${event},  Context: ${context}`);

    return new Promise((resolve, reject) => {
        resolve(init());
        reject((err) => console.error(err));
    });
};

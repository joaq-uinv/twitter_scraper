const { init } = require("./src");

exports.handler = (event, context) => {
    console.log(`Event: ${JSON.stringify(event)},  Context: ${JSON.stringify(context)}`);

    return new Promise((resolve, reject) => {
        resolve(init());
        reject((err) => console.error(err));
    });
};

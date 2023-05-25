const { twitterURL } = require("./config");
const handler = require("./handlers");

const init = async () => {
    console.log("Starting...");

    await handler.getAndEmailTweet(twitterURL);
};

module.exports = { init };

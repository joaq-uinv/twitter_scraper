const { twitterURL } = require("./config");
const handler = require("./handlers");

const init = async () => {
    await handler.getAndEmailTweet(twitterURL);
};

init();

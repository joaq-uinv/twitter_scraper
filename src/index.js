const { twitterURL } = require("./config");
const { getAndEmailTweet } = require("./helpers/tweet");

const init = async () => {
    await getAndEmailTweet(twitterURL);
};

init();

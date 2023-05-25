const { twitterURL } = require("./src/config");
const handler = require("./src/handlers");

exports.handler = async (event, context) => await handler.getAndEmailTweet(twitterURL);

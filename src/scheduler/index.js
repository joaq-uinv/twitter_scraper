const { schedule, validate } = require("node-cron");

const { getAndEmailTweet } = require("../helpers/tweet");

const initCron = ({ cronFrequency, twitterURL }) => {
    if (validate(cronFrequency)) {
        schedule(cronFrequency, async () => await getAndEmailTweet(twitterURL));
    }
};

module.exports = { initCron };

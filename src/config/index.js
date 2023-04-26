const dotenv = require("dotenv");
const envFound = dotenv.config();

if (!envFound) throw new Error("Couldn't find .env file");

module.exports = {
    twitterURL: process.env.TWITTER_URL,
    email: {
        service: process.env.EMAIL_SERVICE,
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
    },
    fromEmail: process.env.FROM_EMAIL,
    toEmail: process.env.TO_EMAIL,
    cronFrequency: process.env.CRON_FREQUENCY,
};

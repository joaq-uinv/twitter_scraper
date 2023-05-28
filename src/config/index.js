const dotenv = require("dotenv");
const { join } = require("node:path");
const envFound = dotenv.config({ path: join(__dirname, "../../.env") });

if (!envFound) throw new Error("Couldn't find .env file");

const env = process.env.NODE_ENV || "development";

const config = {
    development: {
        twitterURL: process.env.TWITTER_URL,
        email: {
            service: process.env.EMAIL_SERVICE,
            user: process.env.EMAIL_USER,
            password: process.env.EMAIL_PASSWORD,
        },
        fromEmail: process.env.FROM_EMAIL,
        toEmail: process.env.TO_EMAIL,
        puppeteer: {
            lib: require("puppeteer"),
        },
    },
    production: {
        twitterURL: process.env.TWITTER_URL,
        email: {
            service: process.env.EMAIL_SERVICE,
            user: process.env.EMAIL_USER,
            password: process.env.EMAIL_PASSWORD,
        },
        fromEmail: process.env.FROM_EMAIL,
        toEmail: process.env.TO_EMAIL,
        puppeteer: {
            lib: require("puppeteer-extra"),
            chromium: require("@sparticuz/chromium"),
        },
    },
};

module.exports = config[env];

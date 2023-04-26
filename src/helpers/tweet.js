const puppeteer = require("puppeteer");

const { emailTweet } = require("../helpers/email");

const getAndEmailTweet = async (twitterURL) => {
    let tweetContent;

    try {
        const browser = await puppeteer.launch();

        const page = await browser.newPage();

        page.setDefaultNavigationTimeout(2 * 60 * 1000);
        await page.goto(twitterURL);
        await page.waitForSelector('[data-testid="tweet"]');

        const selector = '[data-testid="tweet"]';

        const tweet = await page.$(selector);

        const content = await tweet.evaluate((tweet) => tweet.querySelector('[data-testid="tweetText"]')?.textContent);

        tweetContent = content;

        await browser.close();
    } catch (error) {
        console.error(error);
    }

    emailTweet(tweetContent);
};

module.exports = { getAndEmailTweet };

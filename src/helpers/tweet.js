const puppeteer = require("puppeteer");

const { emailTweet } = require("../helpers/email");

/**
 *@description Get tweets from a given twitter URL and email it to the user
 * @param {string} twitterURL
 * @returns {Promise<void>}
 */

const getAndEmailTweet = async (twitterURL) => {
    if (!twitterURL) throw new Error("twitterURL is required");

    if (typeof twitterURL !== "string") throw new Error("twitterURL must be a string");

    if (twitterURL.indexOf("twitter.com") === -1) throw new Error("twitterURL must be a valid twitter URL");

    let tweetsContent = "";

    try {
        const browser = await puppeteer.launch();

        const page = await browser.newPage();

        page.setDefaultNavigationTimeout(2 * 60 * 1000);
        await page.goto(twitterURL);

        const selector = '[data-testid="tweet"]';
        await page.waitForSelector(selector);

        // Get all tweets after a certain period of time
        const tweets = await page.$$eval(selector, (tweets) => {
            const result = [];

            tweets.forEach((tweet) => {
                const datetime = tweet.querySelector("time")?.getAttribute("datetime");

                if (datetime) {
                    const date = new Date(datetime);
                    const specifiedTime = new Date(date.getTime() - 6 * 60 * 60 * 1000);

                    if (date > specifiedTime) {
                        const content = tweet.querySelector('[data-testid="tweetText"]')?.textContent;
                        if (content) {
                            result.push(content);
                        }
                    }
                }
            });

            return result;
        });

        tweets.forEach((tweet) => {
            tweetsContent += tweet + "\n";
        });

        await browser.close();
    } catch (error) {
        console.error(error);
    }

    emailTweet(tweetsContent);
};

module.exports = { getAndEmailTweet };

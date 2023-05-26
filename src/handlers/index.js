const puppeteerExtra = require("puppeteer-extra");
const chromium = require("@sparticuz/chromium");

const nodemailer = require("nodemailer");

const { email, fromEmail, toEmail } = require("../config");

class Handler {
    constructor(email, fromEmail, toEmail) {
        this.email = email;
        this.fromEmail = fromEmail;
        this.toEmail = toEmail;
    }

    /**
     *@description Get tweets from a given twitter URL and email it to the user
     * @param {string} twitterURL
     * @returns {Promise<void>}
     */
    async getAndEmailTweet(twitterURL) {
        if (!twitterURL) throw new Error("twitterURL is required");

        if (typeof twitterURL !== "string") throw new Error("twitterURL must be a string");

        if (twitterURL.indexOf("twitter.com") === -1) throw new Error("twitterURL must be a valid twitter URL");

        let tweetsContent = "";

        try {
            const browser = await puppeteerExtra.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
                ignoreHTTPSErrors: true,
            });

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

        this._emailTweet(tweetsContent);
    }

    /**
     * @description Email a tweet to a user
     * @param {string} tweet
     * @returns {Promise<void>}
     */
    async _emailTweet(tweet) {
        if (!tweet) throw new Error("There is no tweet to email");

        const transporter = nodemailer.createTransport({
            service: email.service,
            auth: {
                user: email.user,
                pass: email.password,
            },
        });

        const message = {
            from: fromEmail,
            to: toEmail,
            subject: "Nuevo tweet",
            text: tweet,
        };

        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log(`Email sent: ${info.response}`);
            }
        });
    }
}

const handler = new Handler(email, fromEmail, toEmail);

module.exports = handler;

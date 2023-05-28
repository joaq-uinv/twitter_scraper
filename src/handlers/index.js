const nodemailer = require("nodemailer");

const config = require("../config");

class Handler {
    /**
     * @param {string} email
     * @param {string} fromEmail
     * @param {string} toEmail
     * @param {string} env
     * @param {any} puppeteer
     */
    constructor(email, fromEmail, toEmail, env, puppeteer) {
        this.email = email;
        this.fromEmail = fromEmail;
        this.toEmail = toEmail;
        this.env = env;
        this.puppeteer = puppeteer;
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
            let browser;

            if (this.env === "development") {
                browser = await this.puppeteer.lib.launch();
            } else {
                browser = await this.puppeteer.lib.launch({
                    args: this.puppeteer.chromium.args,
                    defaultViewport: this.puppeteer.chromium.defaultViewport,
                    executablePath: await this.puppeteer.chromium.executablePath(),
                    headless: this.puppeteer.chromium.headless,
                    ignoreHTTPSErrors: true,
                });
            }

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
            service: this.email.service,
            auth: {
                user: this.email.user,
                pass: this.email.password,
            },
        });

        const message = {
            from: this.fromEmail,
            to: this.toEmail,
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

const handler = new Handler(config.email, config.fromEmail, config.toEmail, process.env.NODE_ENV, config.puppeteer);

module.exports = handler;

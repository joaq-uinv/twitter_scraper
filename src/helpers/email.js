const nodemailer = require("nodemailer");

const { email, fromEmail, toEmail } = require("../config");

const emailTweet = (tweet) => {
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
};

module.exports = { emailTweet };

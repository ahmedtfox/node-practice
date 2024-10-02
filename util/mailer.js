// async..await is not allowed in global scope, must use a wrapper
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

exports.sendEmail = async (email) => {
  let config = {
    service: "gmail",
    auth: {
      user: "ahmedmahfouzt@gmail.com",
      pass: "vbyektuilkzaiguk", // this password from the Gmail
    },
  };

  let transporter = nodemailer.createTransport(config);
  let mailGenerator = new Mailgen({
    theme: "default",
    product: {
      // Appears in header & footer of e-mails
      name: "shop",
      link: "http://localhost:3000/",
    },
  });
  let intro = "";
  let instructions = "";
  let text = "";
  let outro = "";
  let subject = "";

  if (email.type === "ResetPassword") {
    intro =
      "You have received this email because a password reset request for your account was received.";
    instructions = "Click the button below to reset your password:";
    text = "Reset your password";
    outro =
      "If you did not request a password reset, no further action is required on your part.";
    subject = "Reset password";
  }

  let emailInfo = {
    body: {
      name: email.name,
      intro: intro,
      action: {
        instructions: instructions,
        button: {
          color: "#22BC66", // Optional action button color
          text: text,
          link: email.link,
        },
      },
      outro: outro,
    },
  };

  // Generate an HTML email with the provided contents
  let emailBody = mailGenerator.generate(emailInfo);

  // vbyektuilkzaiguk
  let msg = {
    from: "ahmedmahfouzt@gmail.com",
    /* to: "ahmed_mahfouz2014@outlook.com", */
    /*  to: "mahon73432@abevw.com", */
    to: email.to,
    subject: subject, // Subject line
    text: "Hello world?", // plain text body
    html: emailBody, // html body
  };
  // send mail with defined transport object
  transporter
    .sendMail(msg)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

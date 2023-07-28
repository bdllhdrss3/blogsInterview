const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
// const db = require("./app/models");
const webPush = require("web-push");
const { PRIVATE_KEY, PUBLIC_KEY } = require("./app/config/keys");
const { blogs } = require("./app/seed/data");

const app = express();

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

webPush.setVapidDetails("mailto:ist2atest@gmail.com", PUBLIC_KEY, PRIVATE_KEY);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my application." });
});

app.get("/blogs/:id", (req, res) => {
  // const id = req.params.id;
  blog = blogs[0];
  res.send(blog);
});

app.get("/blogs", (req, res) => {
  res.send(blogs);
});

app.post("/emailsubscribe", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: "Email is required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ist2atest@gmail.com",
        pass: "cmsjevuikqkrpwzr",
      },
    });

    const mailOptions = {
      from: "ist2atest@gmail.com",
      to: email,
      subject: "Subscription Confirmation - YoKatale interview app",
      text: "Thank you for subscribing to our blogs!",
      html: "<h3>Thank you for subscribing to our blogs!</h3>",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (e) {
    console.log(e);
  }
});

// push notification
const subscriptions = [];
function sendPushNotifications() {
  const payload = JSON.stringify({
    title: "My blog Notification",
    body: "This is a test notification.",
  });

  subscriptions.forEach((subscription) => {
    webPush.sendNotification(subscription, payload).catch((error) => {
      console.log(
        "Error sending push notification to:",
        subscription.endpoint,
        error
      );
      subscriptions.splice(subscriptions.indexOf(subscription), 1);
    });
  });
}

// Set the interval to run the function every 2 seconds (2000 milliseconds)
setInterval(sendPushNotifications, 2000);
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  console.log("Received Subscription:", subscription);
  res.status(201).json({ message: "Subscription successful" });
});

app.post("/send-notification", (req, res) => {
  const payload = JSON.stringify({
    title: "My blog Notification",
    body: "This is a test notification.",
  });
  sendPushNotifications();
  setInterval(sendPushNotifications, 3000);
  res.status(200).json({ message: "Push notifications sent successfully" });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

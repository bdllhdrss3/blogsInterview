const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const db = require("./app/models");

const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my application." });
});

app.get("/blogs/:id", (req, res) => {
  const Blog = db.blogs;
  const id = req.params.id;

  Blog.findByPk(id)
    .then((blog) => {
      if (blog) {
        res.send(blog);
      } else {
        res.status(404).send({ message: `Blog with id ${id} not found.` });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving blogs.",
      });
    });
});

app.get("/blogs", (req, res) => {
  const Blog = db.blogs;

  Blog.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving blogs",
      });
    });
});

app.post("/subscribe", (req, res) => {
  const Email = db.emails;
  const { email } = req.body;

  console.log(email);
  if (!email) {
    return res.status(400).send({ message: "Email is required." });
  }

  Email.create({ email })
    .then((data) => {
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
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while subscribing",
      });
    });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

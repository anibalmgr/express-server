require("dotenv").config();
require("./config/database").connect();
const express = require("express");
var cors = require("cors");
const User = require("./model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT, credentials: true }));
app.use(cookieParser());

const env = process.env.NODE_ENV;
console.log(env);

app.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    console.log(password);

    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All inputs are required");
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User alredy exist");
    }

    encPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encPassword,
    });

    const token = jwt.sign(
      {
        user_id: user._id,
        email,
      },
      process.env.TOKEN_KEY,
      { expiresIn: "1h" }
    );

    user.token = token;

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(password);

    if (!(email && password)) {
      res.status(400).send("All inputs are required");
    }
    const user = await User.findOne({ email });
    let compare = await bcrypt.compare(password, user.password);
    console.log("compare", compare);

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      user.token = token;

      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          // TODO: Check the right options
          // secure: process.env.NODE_ENV === "production",
        })
        .json({ user: user.email });
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
});
app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome");
});
app.get("/user", function (__, res) {
  res.sendFile(__dirname + "/data/users.json");
});
app.get("/products", function (__, res) {
  res.sendFile(__dirname + "/data/products.json");
});
app.get("/images/:image", (req, res) => {
  res.sendFile(__dirname + `/data/images/${req.params.image}.jpg`);
});
app.get("/products/:id", (__, res) => {
  res.sendFile(__dirname + `/data/product.json`);
});

module.exports = app;

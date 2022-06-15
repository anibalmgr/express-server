require("dotenv").config();
require("./config/database").connect();
const express = require("express");
var cors = require("cors");
const User = require("./model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

app.use(cors({origin: "http://localhost:3000", credentials: true}));

app.get("/", function (__, res) {
  res.sendFile(__dirname + "/index.html");
});
app.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

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
        email
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
app.get("/login", function (__, res) {
  res.sendFile(__dirname + "/data/token.json");
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
// Register
app.post("/register", (req, res) => {
  // our register logic goes here...
});
// Login
app.post("/login", (req, res) => {
  // our login logic goes here
});

module.exports = app;

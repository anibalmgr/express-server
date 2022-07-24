import { config } from "dotenv";
import { connect } from "./config/database.js";
import products from "./data/products.js";
import express, { json } from "express";
import cors from "cors";
import { findOne, create } from "./model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyToken } from "./middleware/auth.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

config();
connect();
const env = process.env.NODE_ENV;
const app = express();
app.use(json());
app.use(cors({ origin: process.env.CLIENT, credentials: true }));
app.use(cookieParser());

app.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!(email && password && firstname && lastname)) {
      return res.status(400).send("All inputs are required");
    }

    const oldUser = await findOne({ email });

    if (oldUser) {
      return res
        .status(409)
        .json({ code: "USER_ALREADY_EXIST", message: "User already exists" });
    }

    const encPassword = await bcrypt.hash(password, 10);

    const user = await create({
      firstname,
      lastname,
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
    if (!req.body) {
      return res.status(400).json({ code: "NO_PAYLOAD" });
    }
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({
        code: "MISSING_CREDENTIALS",
        message: "All inputs are required",
      });
    }
    const user = await findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ code: "USER_NOT_FOUND", message: "User does not exist" });
    }

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
          secure: env === "production",
        })
        .json({ user: user.email });
    } else {
      res.status(400).json({
        code: "INVALID_CREDENTIALS",
        message: "Wrong email or password, please try again",
      });
    }
  } catch (err) {
    console.log(err);
  }
});
app.get("/products", verifyToken, function (__, res) {
  res.status(200).json(products);
});
app.get("/images/:image", verifyToken, (req, res) => {
  res.sendFile(__dirname + `/data/images/${req.params.image}.jpg`);
});
app.get("/products/:id", verifyToken, (req, res) => {
  const product = products.find((p) => p.sn === req.params.id);
  if (!product) {
    res.status(404).json({
      code: "NO_PRODUCT",
      message: `No product valid product with SN:${req.params.id}`,
    });
  }
  res.status(200).json(product);
});

export default app;

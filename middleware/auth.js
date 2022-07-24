import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
const env = dotenv.config().parsed;

function getCookie(name, value) {
  if (!value) {
    return null;
  }
  const cookie = value.split(`=`);
  if (name === cookie[0]) return cookie[1];
}

export const verifyToken = (req, res, next) => {
  const token = getCookie("access_token", req.headers["cookie"]);

  if (!token) {
    return res.status(401).json({ code: "NO_CREDENTIALS" });
  }

  try {
    const decoded = jwt.verify(token, env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ code: "INVALID_CREDENTIALS" });
  }
  return next();
};

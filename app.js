const express = require("express");
const app = express();

const port = process.env.PORT || 3001;
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/data/users.json");
});
app.listen(port, function () {
  console.log(`Server started succefully in ${port}`);
});

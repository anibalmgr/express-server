const express = require("express");
const app = express();

const port = process.env.PORT || 3001;

app.get("/", function (__, res) {
  res.sendFile(__dirname + "/index.html");
});
app.get("/user", function (__, res) {
  res.set("Access-Control-Allow-Origin", "*");
  res.sendFile(__dirname + "/data/users.json");
});

app.listen(port, function () {
  console.log(`Server started succefully in ${port}`);
});

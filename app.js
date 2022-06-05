const express = require("express");
var cors = require("cors");
const app = express();
app.use(cors());

const port = process.env.PORT || 3001;

app.get("/", function (__, res) {
  res.sendFile(__dirname + "/index.html");
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

app.listen(port, function () {
  console.log(`Server started succefully in ${port}`);
});


// suli

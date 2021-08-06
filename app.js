const express = require("express");
const app = express();
require('./models'); 

const mongoose = require("mongoose");

app.get("/", (req, res) => {
    res.send("Big Martin is watching you");
})

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`The app is listening on port ${port}!`);
});
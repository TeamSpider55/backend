const express = require("express");
const app = express();
require('./models'); 

const mongoose = require("mongoose");

app.get("/", (req, res) => {
    res.send("Big Martin is watching you");
})
const express = require("express");
const app = express();
const scheduleRouter = require("./routes/scheduleRouter");
const eventRouter = require("./routes/eventRouter");
require('./models'); 

const mongoose = require("mongoose");

app.get("/", (req, res) => {
    res.send("Big Martin is watching you");
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use("/schedule", scheduleRouter);
app.use("/event", eventRouter);

console.log(Date.now());

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`The app is listening on port ${port}!`);
});
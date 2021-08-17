const express = require("express");
const app = express();
const passport = require("passport");
const authRouter = require("./routes/auth-router");
const userRouter = require("./routes/user-router");
require("./config/db");
const mongoose = require("mongoose");

require("./config/passport")(passport);

// initialize the passport object on every request
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", authRouter);
app.use("/user/", userRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`The app is listening on port ${port}!`);
});

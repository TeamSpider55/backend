// utils and libs
const express = require("express");
const app = express();
const passport = require("passport");
const cookieParser = require("cookie-parser");
const axios = require('axios');
const cors = require('cors');

// routes
const authRouter = require("./routes/authRouter");
const contactRouter = require("./routes/contactRouter");
const scheduleRouter = require("./routes/scheduleRouter");
const eventRouter = require("./routes/eventRouter");
const userRouter = require("./routes/userRouter");

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./config/passport")(passport);

// initialize the passport object on every request
app.use(passport.initialize());
app.use("/auth", authRouter);
app.use("/contact", contactRouter);
app.use("/user", userRouter);
app.use("/schedule", scheduleRouter);
app.use("/event", eventRouter);

module.exports = app;

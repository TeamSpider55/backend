// utils and libs
const express = require("express");
const app = express();
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require('cors');

// routes
const authRouter = require("./routes/authRouter");
const contactRouter = require("./routes/contactRouter");
const scheduleRouter = require("./routes/scheduleRouter");
const eventRouter = require("./routes/eventRouter");
const userRouter = require("./routes/userRouter");

const whitelist = [
  'http://localhost:3000/',
  'http://localhost:8080/',
  'https://heuristic-jang-9b6b9e.netlify.app',
];

app.set('trust proxy', 1);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

app.use(cors({
  origin: "https://deploy-preview-30--heuristic-jang-9b6b9e.netlify.app",
  credentials: true,
}));

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

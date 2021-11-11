// utils and libs
const express = require("express");
const app = express();
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require('cors');

// run the automator
require('./config/automator');

// routes
const authRouter = require("./routes/authRouter");
const contactRouter = require("./routes/contactRouter");
const scheduleRouter = require("./routes/scheduleRouter");
const eventRouter = require("./routes/eventRouter");
const userRouter = require("./routes/userRouter");
const participantRouter = require("./routes/participantRouter");
const whitelist = ['http://localhost:3000/', 'http://localhost:8080/'];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    if(!origin) return callback(null, true);
    if(whitelist.indexOf(origin) === -1){
      var message = 'The CORS policy for this origin doesn\'t ' +
                'allow access from the particular origin.';
      return callback(new Error(message), false);
    }
    return callback(null, true);
  },
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
app.use("/participant", participantRouter);

module.exports = app;

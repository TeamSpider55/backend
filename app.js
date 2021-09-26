const express = require("express");
const app = express();
const passport = require("passport");
const authRouter = require("./routes/auth-router");
const contactRouter = require('./routers/contactRouter')
const userRouter = require("./routes/user-router");
require("./config/db");
const scheduleRouter = require("./routes/scheduleRouter");
const eventRouter = require("./routes/eventRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./config/passport")(passport);

// initialize the passport object on every request
app.use(passport.initialize());
app.use("/auth", authRouter);
app.use('/contact', contactRouter)
app.use("/user", userRouter);
app.use("/schedule", scheduleRouter);
app.use("/event", eventRouter);

const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`The app is listening on port ${port}!`)
})

module.exports = app

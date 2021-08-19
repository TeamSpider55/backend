const express = require("express");
const app = express();
const passport = require("passport");
const authRouter = require("./routes/auth-router");
const userRouter = require("./routes/user-router");
require("./config/db");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./config/passport")(passport);

// initialize the passport object on every request
app.use(passport.initialize());
app.use("/auth", authRouter);
app.use("/user", userRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`The app is listening on port ${port}!`);
});

const router = require("express").Router();
const utils = require("../lib/auth-util");
const userController = require("../controllers/userController");
const mailConfig = require("../config/mailConfig");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const PUBLIC_KEY = process.env.PUBLIC_KEY;

// Handles login
router.post("/login", async (req, res, next) => {
  const userId = req.body.userId;
  const password = req.body.password;

  try {
    const user = await User.findOne({ userId: userId });
    // User exist, check if password correct
    // Sends a object that is handled by frontend, success = login success or not
    if (user) {
      if (utils.validPassword(password, user.hash, user.salt)) {
        // Account has not been verified yet
        if (user.status !== "ACTIVE") {
          return res.status(401).json({
            success: false,
            msg: "unverified account!",
          });
        }
        // Issue the token upon successful login
        // Frontend will store token in the cookie and handles redirect
        const token = utils.issueJWT(user, "20m");
        return res.status(200).json({
          token: token.token,
          expiresIn: token.expiresIn,
          success: true,
          msg: "login successful!",
        });
      } else {
        return res.status(401).json({
          success: false,
          msg: "password incorrect or user not found!!",
        });
      }
    } else {
      // Password incorrect
      return res.status(401).json({
        success: false,
        msg: "password incorrect or user not found!!",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      msg: "password incorrect or user not found!!",
      error: err,
    });
  }
});

// Handles register
router.post("/register", async (req, res) => {
  // get all form data
  const email = req.body.email;
  const userId = req.body.userId;
  const familyName = req.body.familyName;
  const givenName = req.body.givenName;
  const password = req.body.password;
  const phone = req.body.phone;
  const address = req.body.address;

  // get the confimation code
  const confirmationCode = utils.generateConfirmationCode(email);

  // User with same email or userId found, decline registration request
  const userWithSameEmail = await User.findOne({ email: email });
  if (userWithSameEmail) {
    return res.json({
      success: false,
      msg: "email is taken, try another email please!",
    });
  }
  const userWithSameId = await User.findOne({ userId: userId });
  if (userWithSameId) {
    return res.json({
      success: false,
      msg: "user id is taken, try another id please!",
    });
  }
  const { salt, hash } = utils.generatePassword(password);
  const credentials = {
    email,
    userId,
    familyName,
    givenName,
    salt,
    hash,
    phone,
    address,
    confirmationCode,
  };

  // create an user with the credentials
  const user = await User.create({ ...credentials });
  if (!user) {
    return res.json({ success: false, msg: "something went wrong..." });
  }

  // send the email upon success database register
  mailConfig.sendConfirmationEmail(
    user.givenName,
    user.email,
    user.confirmationCode
  );
  return res.json({
    success: true,
    msg: "please verify registration via your email",
  });
});

// update user status after clicking on verification link
router.get("/verify/:confirmationCode", async (req, res, next) => {
  const user = await User.findOne({
    confirmationCode: req.params.confirmationCode,
  });

  if (!user || user.status !== "PENDING") {
    return res.status(404).json({ success: false });
  }
  userController.activateUser(req.params.confirmationCode);
  return res.status(200).json({ success: true });
});

// send a magic link to reset password
router.post("/forget-password", async (req, res) => {
  // find user with the email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(200).json({ sucess: false, msg: "user not found!" });
  }
  if (user.status === "PENDING") {
    return res.status(200).json({
      sucess: false,
      msg: "unverified user, check your email for verification!",
    });
  }

  // generate a string that would comprise the path of magic link
  const token = utils.generateForgetPasswordLink(user);
  mailConfig.sendPasswordResetEmail(user.givenName, user.email, token);
  return res.status(200).json({
    sucess: true,
    msg: "an email will be sent to reset your password!",
    token: token,
  });
});

// magic link for resetting password
router.get("/reset-password/:token", async (req, res) => {
  try {
    const verify = jwt.verify(req.params.token, PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    const user = await User.findOne({ _id: verify.sub });
    // link is valid if the user has not changed the password
    if (user && user.hash === verify.random) {
      return res.status(200).json({ success: true });
    }
    return res.status(404).json({ success: false });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ success: false });
  }
});

// submitting post data in the magic link to reset password
router.post("/reset-password/:token", async (req, res) => {
  const password = req.body.password;
  try {
    // Verify the token
    const verify = jwt.verify(req.params.token, PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    const user = await User.findOne({ _id: verify.sub });
    // if the user has already changed the password, invalidate the link
    if (user && user.hash !== verify.random) {
      return res.status(401).json({ success: false, msg: "invalid link" });
    }
    // update user's hash and salt
    const { salt, hash } = utils.generatePassword(password);
    user.salt = salt;
    user.hash = hash;
    await user.save();
    res.status(200).json({ success: true });
  } catch (err) {
    return res.status(401).json({ success: false, msg: "link timed out!" });
  }
});

module.exports = router;

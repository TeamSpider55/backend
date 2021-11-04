const router = require('express').Router();
const jwt = require('jsonwebtoken');
const utils = require('../lib/authUtil');
const userController = require('../controllers/userController');
const mailConfig = require('../config/mailConfig');
const User = require('../models/users');
require('dotenv').config();

const { PUBLIC_KEY } = process.env;

// Handles login
router.post('/login', async (req, res) => {
  const { id, password } = req.body;

  try {
    // login with userName or email
    const userWithUserName = await User.findOne({ userName: id });
    const userWithEmail = await User.findOne({ email: id });
    let user;
    if (userWithUserName) {
      user = userWithUserName;
    } else if (userWithEmail) {
      user = userWithUserName;
    } else {
      user = null;
    }
    // user found in the database
    if (user) {
      // User exist, check if password correct
      // Sends a object that is handled by frontend, success = login success or not
      if (utils.validPassword(password, user.hash, user.salt)) {
        // Account has not been verified yet
        if (user.status !== 'ACTIVE') {
          return res.status(401).json({
            success: false,
            msg: 'unverified account!',
          });
        }
        // Issue the cookie upon successful login
        const token = utils.issueJWT(user, '20m');
        return res
          .cookie('CRM', token, {
            // 8 hours
            sameSite: "none",
            expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
          })
          .status(200)
          .json({
            success: true,
            msg: 'login successful!',
          });
      }
      return res.status(401).json({
        success: false,
        msg: 'password incorrect or user not found!!',
      });
    }
    // Password incorrect
    return res.status(401).json({
      success: false,
      msg: 'password incorrect or user not found!!',
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: 'password incorrect or user not found!!',
      error: err,
    });
  }
});

// Handles register
router.post('/register', async (req, res) => {
  // get all form data
  const {
    email, userName, familyName, givenName, password, phone, address,
  } = req.body;

  // User with same email or userName found, decline registration request
  const userWithSameEmail = await User.findOne({ email });
  if (userWithSameEmail) {
    return res.json({
      success: false,
      msg: 'email is taken, try another email please!',
    });
  }
  const userWithSameId = await User.findOne({ userName });
  if (userWithSameId) {
    return res.json({
      success: false,
      msg: 'user id is taken, try another id please!',
    });
  }

  // get the confimation code
  const confirmationCode = utils.generateConfirmationCode(email);

  const { salt, hash } = utils.generatePassword(password);
  const credentials = {
    email,
    userName,
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
    return res.json({ success: false, msg: 'something went wrong...' });
  }

  // send the email upon success database register
  mailConfig.sendConfirmationEmail(
    user.givenName,
    user.email,
    user.confirmationCodem,
  );
  return res.json({
    success: true,
    msg: 'please verify registration via your email',
  });
});

// update user status after clicking on verification link
router.get('/verify/:confirmationCode', async (req, res) => {
  const user = await User.findOne({
    confirmationCode: req.params.confirmationCode,
  });

  if (!user || user.status !== 'PENDING') {
    return res.status(404).json({ success: false });
  }
  userController.activateUser(req.params.confirmationCode);
  return res.status(200).json({ success: true });
});

// send a magic link to reset password
router.post('/forget-password', async (req, res) => {
  // find user with the email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(200).json({ sucess: false, msg: 'user not found!' });
  }
  if (user.status === 'PENDING') {
    return res.status(200).json({
      sucess: false,
      msg: 'unverified user, check your email for verification!',
    });
  }

  // generate a string that would comprise the path of magic link
  const token = utils.generateForgetPasswordLink(user);
  mailConfig.sendPasswordResetEmail(user.givenName, user.email, token);
  return res.status(200).json({
    sucess: true,
    msg: 'an email will be sent to reset your password!',
    token,
  });
});

// magic link for resetting password
router.get('/reset-password/:token', async (req, res) => {
  try {
    const verify = jwt.verify(req.params.token, PUBLIC_KEY, {
      algorithms: ['RS256'],
    });
    const user = await User.findOne({ _id: verify.sub });
    // link is valid if the user has not changed the password
    if (user && user.hash === verify.random) {
      return res.status(200).json({ success: true });
    }
    return res.status(404).json({ success: false });
  } catch (err) {
    return res.status(404).json({ success: false });
  }
});

// submitting post data in the magic link to reset password
router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  try {
    // Verify the token
    const verify = jwt.verify(req.params.token, PUBLIC_KEY, {
      algorithms: ['RS256'],
    });
    const user = await User.findOne({ _id: verify.sub });
    // if the user has already changed the password, invalidate the link
    if (user && user.hash !== verify.random) {
      return res.status(401).json({ success: false, msg: 'invalid link' });
    }
    // update user's hash and salt
    const { salt, hash } = utils.generatePassword(password);
    user.salt = salt;
    user.hash = hash;
    await user.save();
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(401).json({ success: false, msg: 'link timed out!' });
  }
});

module.exports = router;

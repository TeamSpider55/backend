const router = require("express").Router();
const passport = require("passport");
const utils = require("../lib/authUtil");
const User = require("../models/users");
const Blacklist = require("../models/blacklist");

// Will call the callback parameter in ../config/passport.js/JwtStrategy to verify jwt token
// Use this on every protected routes

router.use(passport.authenticate("jwt", { session: false }));

router.get("/change-password", (req, res) => {
  res.json({ success: true });
});

router.post("/change-password", async (req, res) => {
  const newPassowrd = req.body.password;
  const { salt, hash } = utils.generatePassword(newPassowrd);
  const user = req.user;
  try {
    // reset the user password
    user.salt = salt;
    user.hash = hash;
    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

// Handles logout
router.post("/logout", async (req, res) => {
  // add tokenId to blacklist
  const tokenId = req.payload.tokenId;
  const blacklist = await Blacklist.create({
    userId: req.user._id,
    tokenId: tokenId,
  });
  // deletes the cookie
  if (req.cookies["CRM"]) {
    return res
      .clearCookie("CRM")
      .status(200)
      .json({ success: true, redirect: true });
  }
  res.json({ success: true, redirect: true });
});

// get detail of a user
router.get("/profile", async (req, res) => {
  return res.json({ success: true, data: req.user });
});

module.exports = router;

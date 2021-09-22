const router = require("express").Router();
const passport = require("passport");
const utils = require("../lib/auth-util");
const User = require("../models/users");
const Blacklist = require("../models/blacklist");
const { authenticate } = require("passport");

// Will call the callback parameter in ../config/passport.js/JwtStrategy to verify jwt token
// Use this on every protected routes

router.use(passport.authenticate("jwt", { session: false }));

router.get("/change-password", (req, res) => {
  if (req.authResult.success) {
    return res.json({ success: true });
  }
  return res.json({ success: false });
});

router.post("/change-password", async (req, res) => {
  const newPassowrd = req.body.password;
  const { salt, hash } = utils.generatePassword(newPassowrd);
  try {
    // reset the user password
    user.salt = salt;
    user.hash = hash;
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

// Handles logout
router.post("/logout", async (req, res) => {
  if (req.authResult.success) {
    // add tokenId to blacklist
    const tokenId = req.authResult.payload.tokenId;
    const blacklist = await Blacklist.create({
      userId: req.authResult.user._id,
      tokenId: tokenId,
    });
    return res.json({ success: true, redirect: true });
  }
  res.json({ success: false, redirect: true });
});

module.exports = router;

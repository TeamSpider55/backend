const router = require("express").Router();
const passport = require("passport");
const utils = require("../lib/auth-util");

// Will call the callback parameter in ../config/passport.js/JwtStrategy to verify jwt token
// Use this on every protected routes

// all user-related path should be protected
router.use(passport.authenticate("jwt", { session: false }));

router.get(
  "/change-password",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ success: req.authResult.success });
  }
);

router.post(
  "/change-password",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
  }
);

// Handles logout
router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Overwrite the token with a fast expiring token
    const token = utils.issueJWT(user, "1");
    res.status(200).json({
      success: true,
      token: token.token,
      expiresIn: token.expiresIn,
      redirect: true,
      msg: "logged out",
    });
  }
);

module.exports = router;

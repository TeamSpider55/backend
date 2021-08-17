const router = require("express").Router();
const passport = require("passport");
const utils = require("../lib/auth-util");

// Will call the callback parameter in ../config/passport.js/JwtStrategy to verify jwt token
// Use this on every protected routes
router.post(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.result.success) {
      // redirect if fail to authenticate
      res.redirect("/login");
    }
    const user = req.user;
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

const router = require("express").Router();
const utils = require("../lib/auth-util");
const userController = require("../controllers/userController");
const mailConfig = require("../config/mailConfig");

// Handles login
router.post("/login", (req, res, next) => {
  const userId = req.body.userId;
  const password = req.body.password;
  try {
    const user = userController.findUserById(userId);

    // User exist, check if password correct
    // Sends a object that is handled by frontend, success = login success or not
    if (user) {
      if (validPassword(user.password, user.hash, user.salt)) {
        // Account has not been verified yet
        if (user.status !== "ACTIVE") {
          res.status(401).json({
            success: false,
            msg: "account has not been verified!",
          });
        }
        // Issue the token upon successful login
        // Frontend will store token in the cookie and handles redirect
        const token = utils.issueJWT(user, "10h");
        res.status(200).json({
          success: true,
          token: token.token,
          expiresIn: token.expiresIn,
          redirect: true,
          msg: "login successfully",
        });
      } else {
        // Password incorrect
        res.status(401).json({
          success: false,
          msg: "password or user id not found!",
        });
      }
    } else {
      // User not found
      res
        .status(401)
        .json({ success: false, msg: "password or user id not found!" });
    }
  } catch (err) {
    next(err);
  }
});

// Handles register
router.post("/register", (req, res) => {
  // get all form data
  const email = req.body.email;
  const userId = req.body.userId;
  const famillyName = req.body.familyName;
  const givenName = req.body.givenName;
  const password = req.body.password;
  const phone = req.body.phone;
  const address = req.body.address;

  // get the confimation code
  const confirmationCode = utils.generateConfirmationCode(email);

  // User with same email or userId found, decline registration request
  if (userController.findUserByEmail(email)) {
    res.json({
      success: false,
      msg: "email is taken, try another email please!",
    });
  }
  if (userController.findUserById(userId)) {
    res.json({
      success: false,
      msg: "user id is taken, try another id please!",
    });
  }

  const { salt, hash } = util.genereatePassword(password);
  const credentials = {
    email,
    userId,
    famillyName,
    givenName,
    salt,
    hash,
    phone,
    address,
    confirmationCode,
  };

  // create an user with the credentials
  const user = userController.createUser(credentials);
  if (!user) {
    res.json({ success: false, msg: "something went wrong..." });
  }

  // send the email upon success database register
  mailConfig.sendConfirmationEmail(
    user.givenName,
    user.email,
    user.confirmationCode
  );
  res.json({ success: true, msg: "please verify registration via your email" });
});

// update user status after they click on the link
router.get("/api/auth/verify/:confirmationCode", (req, res, next) => {
  const user = userController.findUserByConfirmationCode(
    req.params.confirmationCode
  );
  if (!user || user.status !== "PENDING") {
    res.status(404).json({ success: false });
  }
  userController.activateUser(req.params.confirmationCode);
  res.status(200).json({ success: true });
});

module.exports = router;

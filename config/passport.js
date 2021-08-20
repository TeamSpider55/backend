const User = require("../models/users");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
require("dotenv").config();

// Retrieve public key from the environment variable
const PUB_KEY = process.env.PUBLIC_KEY.replace(/\\n/g, "\n");

const options = {
  // Token will be found in the Authorization header of request
  // And will be in format of "Bearer Token....." Token is the actual token
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
  passReqToCallback: true /* <= Important, so that the verify function can accept 
                            the req param ie verify(req,payload,done)*/,
};

const strategy = new JwtStrategy(options, (req, payload, done) => {
  // Extract user id from the token in the sub field
  const userId = payload.sub;

  // Find user from the database by id
  User.findOne({ _id: userId })
    .then((user) => {
      // user found successfully, tell passport the user object
      if (user) {
        // put info into request object for protected routes to retrive info
        // of specific user
        req.authResult = {
          user: user,
          success: true,
          error: null,
        };
        done(null, user);
      } else {
        req.authResult = {
          user: null,
          success: false,
          error: null,
        };
        done(null, false);
      }
    })
    .catch((err) => {
      req.authResult = {
        user: null,
        success: false,
        error: err,
      };
      done(err, false);
    });
});

module.exports = (passport) => {
  passport.use(strategy);
};

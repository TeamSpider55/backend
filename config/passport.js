const User = require("../models/users");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const Blacklist = require("../models/blacklist");
require("dotenv").config();

// Retrieve public key from the environment variable
const PUB_KEY = process.env.PUBLIC_KEY.replace(/\\n/g, "\n");

const extractFromCookie = (req) => {
  let jwt = null;
  if (req && req.cookies["CRM"]) {
    // extract token from cookie
    jwt = req.cookies["CRM"].token;
  }
  return jwt;
};

const options = {
  // Token will be found in cookie
  jwtFromRequest: extractFromCookie,
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
    .then(async (user) => {
      // user found successfully, tell passport the user object
      if (user) {
        // whether token is in blacklist
        const blacklist = await Blacklist.findOne({
          tokenId: payload.tokenId,
          userId: payload.sub,
        });
        if (blacklist) {
          req.authResult = {
            user: null,
            success: false,
            error: null,
          };
          done(null, false);
        } else {
          req.authResult = {
            user: user,
            success: true,
            error: null,
            payload,
          };
          done(null, user);
        }
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

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Blacklist = require('../models/blacklist');
require('dotenv').config();

const PRIV_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');

function validPassword(password, hash, salt) {
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 50000, 64, 'sha512')
    .toString('hex');
  return hashVerify === hash;
}

// Generate the hash for the password
function generatePassword(password) {
  const salt = crypto.randomBytes(64).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 50000, 64, 'sha512')
    .toString('hex');
  return { salt, hash };
}

function issueJWT(user, expiresIn) {
  const { _id } = user;
  const payload = {
    sub: _id,
    tokenId: crypto.randomBytes(64).toString('hex'),
  };

  // Sign jwt with private key
  const signedToken = jwt.sign(payload, PRIV_KEY, {
    expiresIn,
    algorithm: 'RS256',
  });

  // Issue the signed token
  return {
    token: signedToken,
    expiresIn,
  };
}

function generateConfirmationCode(email) {
  // Sign the token for the verification
  const token = jwt.sign({ email }, PRIV_KEY);

  // Return the object with email and code
  return token;
}

function generateForgetPasswordLink(user) {
  // Sign the random string with key
  // don't need iad because token will generate iat property itself
  const payload = {
    sub: user._id,
    random: user.hash,
  };

  const token = jwt.sign(payload, PRIV_KEY, {
    algorithm: 'RS256',
    expiresIn: '15m',
  });

  return token;
}

module.exports = {
  validPassword,
  generatePassword,
  issueJWT,
  generateConfirmationCode,
  generateForgetPasswordLink,
};

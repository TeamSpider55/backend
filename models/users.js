const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  nickName: { type: String },
  familyName: { type: String, required: true },
  middleName: { type: String },
  givenName: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true }, //maybe we can pull weather information?
  contacts: [{ type: String }], //pull from clientSchema of client are we doing 1 guy login or?
  //what if we specified here with bool that client is also a user? then if so we know which schemas to pull from?
  tags: [{ type: String }],
  memo: [{ type: String }],
})

// // customerSchema password hash
// customerSchema.methods.generateHash = function (password) {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
// };

// // checks if password is valid
// customerSchema.methods.validPassword = function (password) {
//   return bcrypt.compareSync(password, this.password);
// };

const User = mongoose.model('User', userSchema)
module.exports = User

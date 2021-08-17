const User = require("../models/users");

const createUser = async (o) => {
  try {
    const user = await User.create({ ...o });
    return user;
  } catch (err) {
    return null;
  }
};

const findUserByConfirmationCode = async (confirmationCode) => {
  try {
    const user = await User.findOne({ confirmationCode: confirmationCode });
    return user;
  } catch (err) {
    return null;
  }
};

const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    return user;
  } catch (err) {
    return null;
  }
};

const findUserById = async (userId) => {
  try {
    const user = await User.findOne({ userId: userId });
    return user;
  } catch (err) {
    return null;
  }
};

const activateUser = async (confirmationCode) => {
  const user = findUserByConfirmationCode;
  if (!user) {
    return;
  }
  try {
    user.status = "ACTIVE";
    user.confirmationCode = null;
    user.save();
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createUser,
  findUserByConfirmationCode,
  findUserByEmail,
  findUserById,
  activateUser,
};

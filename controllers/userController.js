const User = require("../models/users");

const createUser = async (o) => {
  try {
    const user = await User.create({ ...o });
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
  const user = await User.findOne({ confirmationCode: confirmationCode });
  if (!user) {
    return;
  }
  try {
    await User.updateOne(
      { confirmationCode: confirmationCode },
      { $set: { status: "ACTIVE" }, $unset: { confirmationCode: "" } }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  activateUser,
};

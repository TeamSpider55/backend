const mongoose = require('mongoose')
const Contact = require('../models/contacts')
const User = require('../models/users')

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
  try {
    const user = await User.findOne({ confirmationCode: confirmationCode });
    if (!user) {
      return false;
    }
    await User.updateOne(
      { confirmationCode: confirmationCode },
      { $set: { status: "ACTIVE" }, $unset: { confirmationCode: "" } }
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};


// find all contacts for specific user
const getContactsForUser = async (req, res) => {
  try {
    const user = req.user;
    if (user === null) {
      // no User found in database
      res.status(404)
      return res.json({
        statusCode: 404,
      })
    }
    //id is contactId in this context
    
    const contacts = await Promise.all(
      user.contacts.map(async (id) => {
        var contact = await Contact.findOne({ _id: mongoose.Types.ObjectId(id) }).lean()
        return contact
      })
    )
    if (contacts === null) {
      // no contact found in database: 404
      res.status(404)
      return res.json({
        statusCode: 404,
      })
    }
    // user was found, return as response
    return res.json({
      statusCode: 200,
      data: contacts,
    })
  } catch (err) {
    console.log(err)
    // error occurred
    res.status(400)
    return res.json({
      statusCode: 400,
      data: err,
    })
  }
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  activateUser,
  getContactsForUser,
};

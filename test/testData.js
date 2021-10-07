const mongoose = require("mongoose");

users = [
  // the username and password is 123
  {
    _id: mongoose.Types.ObjectId('614ed15c606c0c1398b83a70'),
    userName: '123',
    email: 'john.doe@gmail.com',
    nickName: 'nick',
    givenName: 'given',
    middleName: 'middle',
    familyName: 'family',
    hash: '52c8cf7864ad6c0eaec95b13d2cd3e62abb8b5adf51202f9d8b28c44d74e3e26adb816959bee73ae6c4b5defb5705784d0a2af6e9763715545343c7555f6aee9',
    salt: 'b55774c3d1c61e8722f478d3bb55e62f48551183072d71ee966dd32a685303128cd5abed3486923145faed15472265e60d4a02e6d6a033d716ac9b63c94ff2bf',
    phone: "+123456789",
    address: "1 Apple Street",
    status: "ACTIVE",
    confirmationCode: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1laWh1bmdsQHN0dWRlbnQudW5pbWVsYi5lZHUuYXUiLCJpYXQiOjE2MzI1NTUzNTZ9.Qj2bB7a_tX-Ful2zvE86k_MlTNXYOy3BqQmbWjCHjcQ",
    contacts: [
      "61556e08e050338e94d23601",
      "6158496b9c2f38b16c37fc4f",
      "6159518327877d1500b47908",
    ],
    tags: [],
    blacklistTokens: [],
  }
];

contacts = [
  {
    _id: mongoose.Types.ObjectId('61556e08e050338e94d23601'),
    email: "email@gmail.com",
    familyName: "family",
    givenName: "given1",
    middleName: "middle",
    phone: "+1234567890",
    address: "2 Apple Street",
    description: "A cool person",
    note: "what is a note?",
    tags: [],
  },
  {
    _id: mongoose.Types.ObjectId('6158496b9c2f38b16c37fc4f'),
    email: "email@gmail.com",
    familyName: "family",
    givenName: "given2",
    middleName: "middle",
    phone: "+1234567890",
    address: "2 Apple Street",
    description: "A cool person",
    note: "what is a note?",
    tags: [],
  },
  {
    _id: mongoose.Types.ObjectId('6159518327877d1500b47908'),
    email: "email@gmail.com",
    familyName: "family",
    givenName: "given3",
    middleName: "middle",
    phone: "+1234567890",
    address: "2 Apple Street",
    description: "A cool person",
    note: "what is a note?",
    tags: [],
  }
]

module.exports = {
  users,
  contacts,
}

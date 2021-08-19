const mongoose = require("mongoose");

const memoSchema = new mongoose.Schema({
    // what should the memo key be:
    // can it be a data -> if so then the memo will is a diary

    // it can also has a seperate id -> indicate memo can be shorter and taken multiple per day.
    
    // beside that: let assume the format and layout of the memo is by CSS and HTML
    memoId: { type: String, unique: true, required: true},

    // depend on how we want to implement the memo.
    // it can be:
    // (1) -> short 1 paragraph with picture.
    // (2) -> a page with its layout + all the link
    body: { type: String, required: true},
    images: [
        // maybe store some the URL of the image attack to this memo store
        // this might not needed if the body is an HTML formatted, it contain the tag reference the image
        {type: String}
    ],
    // maybe we can also tag it? use to search
    tags: [
        {type: String},
    ],
    // maybe add the list of client this memo relate to => so when
    // we search client we can maybe see the memo (?) -> not sure
    contacts: [
        {type: String}
    ]

});

const Memo = mongoose.model("Memo", memoSchema);
module.exports = Memo;
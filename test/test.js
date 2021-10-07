const chai = require('chai');
const axios = require('axios');
const expect = chai.expect;
const mongoose = require('mongoose');

const app = require('../app');
const testData = require('./testData');

const { userSchema } = require('../models/users');

const TEST_MONGO_USERNAME = "spider55";
const TEST_MONGO_PASSWORD = "spider55";

const CONNECTION_STRING =
  "mongodb+srv://<username>:<password>" +
  "@cluster0.hgv0d.mongodb.net/crm-test?retryWrites=true&w=majority";

const MONGO_URL = CONNECTION_STRING.replace(
    "<username>",
    TEST_MONGO_USERNAME,
).replace(
    "<password>",
    TEST_MONGO_PASSWORD
);

const db = mongoose.createConnection(MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const User = db.model('User', userSchema);

describe('Test Backend API', function() {
    let server;

    // set things up before testing (inputting dummy data)
    before(async function () {
        this.timeout(16000);

        // start local server
        server = app.listen(5050);

        //FIXME: inserting all tests into mock database
        // console.log(await User.(testData.users));
        await User.insertMany(testData.users);
    });

    // clean up dummy data in testing DB after tests have run
    after(async function() {
        this.timeout(16000);
        
        await User.deleteMany({});

        await db.close();
        await server.close();
    });

    describe('User registering, logging in and getting profile', () => {
        it("test", async function() {
            console.log(await User.find());
            expect([1, 2, 3].indexOf(4)).to.equal(-1);
        })
    });
});

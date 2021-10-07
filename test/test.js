const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const axios = require('axios');

const app = require('../app');
const testData = require('./testData');
const User = require('../models/users');

// this is the user to the Mongo database
const TEST_MONGO_USERNAME = "spider55";
const TEST_MONGO_PASSWORD = "spider55";

// create connection to the testing database
// models will now be those in the testing database, which use the
// schemas shared in the production database.
mongoose.connect(
  `mongodb+srv://${TEST_MONGO_USERNAME}:${TEST_MONGO_PASSWORD}` +
  `@cluster0.hgv0d.mongodb.net/crm-test?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

describe('Test Backend API', function() {
    this.timeout(8000);
    let server;

    // set things up before testing (inputting dummy data)
    before(async function () {

        // start local server for testing
        server = app.listen(5050);

        await User.insertMany(testData.users);
    });

    // clean up dummy data in testing DB after tests have run
    after(async function() {

        await User.deleteMany({});

        await mongoose.connection.close();
        await server.close();
    });

    describe('User registering, logging in and getting profile', function() {
        let token;

        it("Existing user can log in", async function() {
            const result = await axios.post(
                'http://localhost:5050/auth/login',
                {
                    id: '123',
                    password: '123'

                }
            );

            // Extract the token from the cookie
            token = result.headers['set-cookie'][0].split(';')[0].slice(4);
    
            // // Login success
            expect(result.data.success).to.be.eq(true);
        });

        it("User can then access their profile", async function() {
            // testing GET user profile with the authentication cookie
            const result = await axios.get(
                'http://localhost:5050/user/profile', 
                {
                    headers: { 
                        Cookie:`CRM=${token}` 
                    }
                },
                { withCredentials: true }
            );

            // See if it returns the user that logs in
            expect(result.data.data.userName).to.be.eq('123');
        });

        it("Requesting profile without authorization fails", async function() {
            // request without token
            try{
                result = await axios.get('http://localhost:5050/user/profile');
            } catch (err) {
                result = err.response;
            }
            expect(result.data).to.be.eq('Unauthorized');
        });

        it("Cannot register a user with duplicate username", async function() {
            // username 123 is duplicate
            result = await axios.post(
                'http://localhost:5050/auth/register', 
                {
                    email: '123@123.com',
                    userName: '123',
                    familyName: '123',
                    givenName: '123',
                    password: '1234',
                    phone: '0123456776',
                    address: 'University of Procastination'   
                }
            );
            expect(result.data.success).to.be.eq(false);
        });
    });
});

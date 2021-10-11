const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const axios = require('axios');

const app = require('../appProgram');
const testData = require('./testData');
const User = require('../models/users');
const Contact = require('../models/contacts');

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

describe('Test Authentication API', function() {
    this.timeout(8000);
    let server;

    // set things up before testing (inputting dummy data)
    before(async function () {

        // start local server for testing
        server = app.listen(5050);

        await User.insertMany(testData.users);
        await Contact.insertMany(testData.contacts);
    });

    // clean up dummy data in testing DB after tests have run
    after(async function() {

        await Contact.deleteMany({});
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

    describe('Get contacts for user', function() {
        it('Should return the all contacts for a logged in user', async function() {
            const result = await axios.get('http://localhost:5050/contact/getAllContacts/123');

            // expecting 3 contacts as in test data
            expect(result.data.statusCode).to.be.eq(200);
            expect(result.data.data.length).to.be.eq(3)
        });

        it('Should fail returning all contacts because user invalid', async function() {
            try {
                await axios.get('http://localhost:5050/contact/getAllContacts/invalido');
            } catch(err) {
                result = err.response;
            }
            expect(result.data.statusCode).to.be.eq(404);
        });

        it('Should return one contact for a user', async function() {
            const result = await axios.get('http://localhost:5050/contact/getContact/123/61556e08e050338e94d23601');
            expect(result.data.statusCode).to.be.eq(200);
        });

        it('Should fail because contact is null', async function() {
            try {
                await axios.get('http://localhost:5050/contact/getContact/123/61554d08e050338e94d23601');
            } catch (err) {
                result = err.response;
            }
            expect(result.data.statusCode).to.be.eq(404);
        });

        it('Should fail because user is null', async function() {
            try {
                await axios.get('http://localhost:5050/contact/getContact/12345/61556e08e050338e94d23601');
            } catch (err) {
                result = err.response;
            }
            expect(result.data.statusCode).to.be.eq(404);
        });
    });

    describe('Add & Update Contact', function() {
        let newContact;

        it('Should add a contact succesfully', async () => {
            const result = await axios.post('http://localhost:5050/contact/addContact', {
                userName: '123',
                email: 'autoTest@autotest.com',
                givenName: 'auto',
                familyName: 'testing'
            });
            newContact = result.data.data._id;
            expect(result.data.statusCode).to.be.eq(200);
        });

        it('Should fail to add a contact (invalid user)', async () => {
            try{
                const result = await axios.post('http://localhost:5050/contact/addContact', {
                userName: '123423423',
                email: 'autoTest@autotest.com',
                givenName: 'auto',
                familyName: 'testing'
            });
            }catch(err){
                result = err.response;
            }
            expect(result.data.statusCode).to.be.eq(404);
        });

        it('Should update a contact succesfully', async () => {
            const result = await axios.post('http://localhost:5050/contact/updateContact', {
                contactId: newContact,
                nickName: 'autoTest@autotest.com',
                givenName: 'auto',
                middleName: 'auto testing',
                familyName: 'testing',
                email: 'changed',
                phone: 'changed',
                address: 'changed',
                description: 'changed',
                note: 'changed',
            });
            expect(result.data.statusCode).to.be.eq(200);
        });

        it('Should fail to update a contact', async () => {
            try{
                const result = await axios.post('http://localhost:5050/contact/updateContact', {
                    contactId: '61585037940c4edc9cd6e669',
                    nickName: 'autoTest@autotest.com',
                    givenName: 'auto',
                    middleName: 'auto testing',
                    familyName: 'testing',
                    email: 'changed',
                    phone: 'changed',
                    address: 'changed',
                    description: 'changed',
                    note: 'changed',
                });
            } catch (err) {
                result = err.response;
            }
            expect(result.data.statusCode).to.be.eq(404);
        });
    });

    describe('Delete Contact', () => {
        it('Should delete a contact succesfully', async () => {
            const result = await axios.delete(
                'http://localhost:5050/contact/deleteContact',
                {
                    data: { 
                        userName: '123',
                        contactId: '6158496b9c2f38b16c37fc4f'
                    }
                }
            );
            expect(result.data.statusCode).to.be.eq(200);
        });
        
        it('Should fail to delete a an already deleted contact', async () => {
            try{
                const result = await axios.delete(
                    'http://localhost:5050/contact/deleteContact',
                    {
                        data: { 
                            userName: '123123123123',
                            contactId: '6158496b9c2f38b16c37fc4f'
                        }
                    }
                );
            } catch (err) {
                result = err.response;
            }
            expect(result.data.statusCode).to.be.eq(404);
        });
    });
});

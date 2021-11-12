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

        const contactIds = testData.contacts.map(c => c._id);
        const userIds = testData.users.map(u => u._id);

        await Contact.deleteMany({ _id: contactIds });
        await User.deleteMany({ _id: userIds });

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
        let token;

        beforeEach(async function() {
            const result = await axios.post('http://localhost:5050/auth/login', {
                id: '123',
                password: '123'
            });
            
            // Extract the token from the cookie
            token = result.headers['set-cookie'][0].split(';')[0].slice(4);
        });

        it('Should return the all contacts for a logged in user', async function() {
            const result = await axios.get(
                'http://localhost:5050/contact/getAllContacts/',
                {
                    headers: { 
                        Cookie:`CRM=${token}` 
                    }
                },
                { withCredentials: true }
            );

            // expecting 3 contacts as in test data
            expect(result.data.statusCode).to.be.eq(200);
            expect(result.data.data.length).to.be.eq(3)
        });

        it('Should fail returning all contacts because user invalid', async function() {
            try {
                await axios.get(
                    'http://localhost:5050/contact/getAllContacts/', {
                    headers: { 
                        Cookie:`CRM=` 
                    }
                },
                { withCredentials: true }
            );
            } catch(err) {
                result = err.response;
            }
            expect(result.data).to.be.eq('Unauthorized');
        });

        it('Should return one contact for a user', async function() {
            const result = await axios.get(
                'http://localhost:5050/contact/getContact/61556e08e050338e94d23601', {
                    headers: { 
                        Cookie:`CRM=${token}` 
                    },
                },
                { withCredentials: true },
            );
            expect(result.data.statusCode).to.be.eq(200);
        });

        it('Should fail because contact is null', async function() {
            try {
                await axios.get(
                    'http://localhost:5050/contact/getContact/61554d08e050338e94d23601', {
                        headers: { 
                            Cookie:`CRM=${token}`
                        }
                    },
                    { withCredentials: true },
                );
            } catch (err) {
                result = err.response;
            }
            expect(result.data.statusCode).to.be.eq(404);
        });

        it('Should fail because user is null', async function() {
            try {
                await axios.get(
                    'http://localhost:5050/contact/getContact/61556e08e050338e94d23601', {
                        headers: { 
                            Cookie:`CRM=` 
                        }
                    },
                    { withCredentials: true }
                );
            } catch (err) {
                result = err.response;
            }
            expect(result.data).to.be.eq('Unauthorized');
        });
    });

    describe('Add & Update Contact', function() {
        let newContact;
        let token;

        beforeEach(async function() {
            const result = await axios.post('http://localhost:5050/auth/login', {
                id: '123',
                password: '123'
            });
            
            // Extract the token from the cookie
            token = result.headers['set-cookie'][0].split(';')[0].slice(4);
        });


        it('Should add a contact succesfully', async () => {
            const result = await axios.post('http://localhost:5050/contact/addContact', {
                userName: '123',
                email: 'autoTest@autotest.com',
                givenName: 'auto',
                familyName: 'testing'
            }, {
                headers: { 
                    Cookie:`CRM=${token}` 
                }
            },
            { withCredentials: true }
            );
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
            }, {
                headers: { 
                    Cookie:`CRM=` 
                }
            },
            { withCredentials: true }
            );
            }catch(err){
                result = err.response;
            }
            expect(result.data).to.be.eq('Unauthorized');
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
            }, {
                headers: { 
                    Cookie:`CRM=${token}` 
                }
            },
            { withCredentials: true }
            );
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
                }, {
                        headers: { 
                            Cookie:`CRM=${token}` 
                        }
                },
                { withCredentials: true }
                );
            } catch (err) {
                result = err.response;
            }
            expect(result.data.statusCode).to.be.eq(404);
        });
    });

    describe('Delete Contact', () => {
        let token;

        beforeEach(async function() {
            const result = await axios.post('http://localhost:5050/auth/login', {
                id: '123',
                password: '123'
            });
            
            // Extract the token from the cookie
            token = result.headers['set-cookie'][0].split(';')[0].slice(4);
        });


        it('Should delete a contact succesfully', async () => {
            const result = await axios.post(
                'http://localhost:5050/contact/deleteContact',
                {
                    userName: '123',
                    contactId: '6158496b9c2f38b16c37fc4f'
                }, {
                    headers: { 
                        Cookie:`CRM=${token}` 
                    }
                },
                { withCredentials: true }
            );
            expect(result.data.statusCode).to.be.eq(200);
        });
        
        it('Should fail to delete a an already deleted contact', async () => {
            try{
                const result = await axios.post(
                    'http://localhost:5050/contact/deleteContact',
                    {
                        userName: '123123123123',
                        contactId: '6158496b9c2f38b16c37fc4f'
                    },
                    {
                        headers: { 
                            Cookie:`CRM=${token}` 
                        }
                    },
                    { withCredentials: true }
                );
            } catch (err) {
                result = err.response;
            }
            expect(result.data.statusCode).to.be.eq(404);
        });
    });

    let hourCollection = [];
    before(() => {
        for(var i= 0; i < 240; i+= 20){
            hourCollection.push((i) * 1000 * 60 * 6) ;
        }
    });
    describe(
        "Unit testing for the event API!!!", function(){
            // testing GET request to user profile when provided the authentication cookie
            // testing GET request to user profile when provided the authentication cookie
            let dataInCache = (data) => {
                for(var i of inputInDb){
                    if(data.length == i.lenth){
                        for(var attribute in i){
                            if(i.attribute != data.attribute){
                                return false;
                            }
                        }return true;
                    }
                }return false;
            }
            let inputInDb = [];
            let token;

            
            
            describe( 
                
                "Assert the correctness of the 'Add' route",
                function(){
                    beforeEach(async function() {
                        const result = await axios.post('http://localhost:5050/auth/login', {
                            id: '123',
                            password: '123'
                        })
                        token = result.headers['set-cookie'][0].split(';')[0].slice(4);
                    });
                    it(
                        "[Expect: success] Enter an event to a User who does not have that schedule with the same date",
                        async() => {
                            const data = {
                                "title": "test",
                                "note": "test",
                                "start": hourCollection[0] + 1000 * 60 * 6,
                                "end": hourCollection[0] + 1500 * 60 * 6,
                                "type": "personal",
                            };
                            let res = await axios.post(
                                'http://localhost:5050/event/add',
                                data,{
                                    headers: { 
                                        Cookie:`CRM=${token}` 
                                    }
                                },
                                { withCredentials: true }
                                );
                            
                            expect(res.data.status.statusCode).to.deep.equal(200);
                            inputInDb.push({
                                "start": data.start,
                                "end": data.end
                            });
                        }
                    );
                    it(
                        "[Expect: fail]  Enter an event which should be existed in database!!",
                        async() => {
                            const data = {
                                "title": "test",
                                "note": "test",
                                "start": hourCollection[0] + 1000 * 60 * 6,
                                "end": hourCollection[0] + 1500 * 60 * 6,
                                "type": "personal",
                            };
                            let res = await axios.post(
                                'http://localhost:5050/event/add',
                                data, {
                                    headers: { 
                                        Cookie:`CRM=${token}` 
                                    }
                                },
                                { withCredentials: true }
                                );
                            expect(res.data.status.statusCode).to.deep.equal(400);
                        }
                    )
                    it(
                        "[Expect: success] Enter a list of event of a user",
                        async() => {
                            for (var i =1; i< hourCollection.length;i++){
                                const data = {
                                    "title": "test",
                                    "note": "test",
                                    "start": hourCollection[i] + 1000 * 60 * 6,
                                    "end": hourCollection[i] + 1500 * 60 * 6,
                                    "type": "personal",
                                    "tags": [],
                                    "contacts":[]
                                };
                                let res = await axios.post(
                                    'http://localhost:5050/event/add',
                                    data, {
                                        headers: { 
                                            Cookie:`CRM=${token}` 
                                        }
                                    },
                                    { withCredentials: true }
                                    );
                                
                                expect(res.data.status.statusCode).to.deep.equal(200);
                                inputInDb.push({
                                    "start": data.start,
                                    "end": data.end
                                });
                            }
                        }
                    );
                }
            );
            
            describe(
                'Assert the correctness of "Modified" route',
                function() {
                    beforeEach(async function() {
                        const result = await axios.post('http://localhost:5050/auth/login', {
                            id: '123',
                            password: '123'
                        })
                        token = result.headers['set-cookie'][0].split(';')[0].slice(4);
                    });
                    it(
                        "[Expect: success] modified an events ~!!!!", 
                        async () => {
                            var data = {
                                "title": "b",
                                "note": "b",
                                "start": hourCollection[0] + 1000 * 60 * 6,
                                "end": hourCollection[0] + 1500 * 60 * 6,
                                "type": "personal"
                            };
                            let res = await axios.post(
                                'http://localhost:5050/event/modify/content',
                                data, {
                                    headers: { 
                                        Cookie:`CRM=${token}` 
                                    }
                                },
                                { withCredentials: true }
                                );
                            // console.log(res.data);
                            expect(res.data.statusCode).to.deep.equal(200);
                        }
                    );
                }
            );
            describe(
                'Assert the correctness of "Remove" route',
                function() {
                    beforeEach(async function() {
                        const result = await axios.post('http://localhost:5050/auth/login', {
                            id: '123',
                            password: '123'
                        })
                        token = result.headers['set-cookie'][0].split(';')[0].slice(4);
                    });
                    it(
                        "[Expect: success] Remove all the event added to the data base ~!!!!", 
                        async () => {
                            for(var cached of inputInDb){
                                var data = {
                                    "start": cached.start,
                                    "end":cached.end
                                };
                                let res = await axios.post(
                                    'http://localhost:5050/event/remove',
                                    data, {
                                        headers: { 
                                            Cookie:`CRM=${token}` 
                                        }
                                    },
                                    { withCredentials: true }
                                    );
                                // console.log(res.data.statusCode);
                                expect(res.data.statusCode).to.deep.equal(200);
                            }
                    });
                    it(
                        "[Expect: fail] Remove an event that is not in data base ~!!!!", 
                        async () => {
                            
                            var data = {
                                "start": hourCollection[0] + 1000 * 60 * 6,
                                "end": hourCollection[0] + 1500 * 60 * 6,
                            };
                            let res = await axios.post(
                                'http://localhost:5050/event/remove',
                                data, {
                                    headers: { 
                                        Cookie:`CRM=${token}` 
                                    }
                                },
                                { withCredentials: true }
                                );
                            // console.log(res.data.statusCode);
                            expect(res.data.statusCode).to.deep.equal(400);
                            
                    });
                }
            );
        }
});

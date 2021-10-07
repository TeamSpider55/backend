const chai = require('chai');
const axios = require('axios');
const expect = chai.expect;
const mongoose = require("mongoose");
const Contact = require("../models/contacts");
const router = require("express").Router();
const User = require('../models/users')
// const contactController = require("../controllers/contactController");
// const userController = require("../controllers/userController");
// const Contact = require("../models/contacts");
// const User = require('../models/users');

describe('Get contacts for user', () => {
    let token;
    // testing GET request to user profile when provided the authentication cookie
    // testing GET request to user profile when provided the authentication cookie

    before(async function() {
        const result = await axios.post('http://localhost:8080/auth/login', {
            id: '123',
            password: '123'
        }, { 
            withCredentials: true 
        });

        // Extract the token from the cookie
        token = result.headers['set-cookie'][0].split(';')[0].slice(4);
    })

    it('Should return the all contacts for a user', async () => {
        const result = await axios.get('http://localhost:8080/contact/getAllContacts', 
        { headers: 
            { 
                Cookie:`CRM=${token}`
            }
        }, { 
            withCredentials: true 
        });
        expect(result.data.statusCode).to.be.eq(200);
        
    });
    // it('Should fail returning all contacts because user invalid', async () => {
    //     try{
    //         const result = await axios.get('http://localhost:8080/contact/getAllContacts', 
    //         { headers: 
    //             { 
    //                 Cookie:`CRM=${token}`
    //             }
    //         }, { 
    //             withCredentials: true 
    //         });
            
    //     }catch(err){
    //         result = err.response;
    //     }
    //     expect(result.data.statusCode).to.be.eq(404);
        
    // });
    it('Should return one contact for a user', async () => {
        const result = await axios.get('http://localhost:8080/contact/getContact/612e20f5e67c51b4ed06a030', 
        { headers: 
            { 
                Cookie:`CRM=${token}`
            }
        }, { 
            withCredentials: true 
        });
        expect(result.data.statusCode).to.be.eq(200);
        
    });
    it('Should fail because contact is null', async () => {
        try{
            const result = await axios.get('http://localhost:8080/contact/getContact/612e20f5e67c51b4ed06a039', 
            { headers: 
                { 
                    Cookie:`CRM=${token}`
                }
            }, { 
                withCredentials: true 
            });
        }catch(err){
            result = err.response;
        }
        expect(result.data.statusCode).to.be.eq(404);
        
    });
    it('Should fail because user is null', async () => {
        try{const result = await axios.get('http://localhost:8080/contact/getContact/612e20f5e67c51b4ed06a030', 
        { headers: 
            { 
                Cookie:`CRM=${token}`
            }
        }, { 
            withCredentials: true 
        });
        }catch(err){
            result = err.response;
        }
        expect(result.data.statusCode).to.be.eq(404);
        
    });
});

describe('Add & Update Contact', () => {
    let newContact;
    let token;

    before(async function() {
        const result = await axios.post('http://localhost:8080/auth/login', {
            id: '123',
            password: '123'
        }, { 
            withCredentials: true 
        });

        // Extract the token from the cookie
        token = result.headers['set-cookie'][0].split(';')[0].slice(4);
    })

    it('Should add a contact succesfully', async () => {
        const result = await axios.post('http://localhost:8080/contact/addContact', {
            email: 'autoTest@autotest.com',
            givenName: 'auto',
            familyName: 'testing'        
        }, 
        { headers: 
            { 
                Cookie:`CRM=${token}`
            }
        }, { 
            withCredentials: true 
        });
        newContact = result.data.data._id;
        expect(result.data.statusCode).to.be.eq(200);
    });
    it('Should Fail to add a contact', async () => {
        try{
            const result = await axios.post('http://localhost:8080/contact/addContact', {
            email: 'autoTest@autotest.com',
            givenName: 'auto',
            familyName: 'testing'
        }, 
        { headers: 
            { 
                Cookie:`CRM=${token}`
            }
        }, { 
            withCredentials: true 
        });
        }catch(err){
            result = err.response;
        }
        expect(result.data.statusCode).to.be.eq(404);
    });
    it('Should update a contact succesfully', async () => {
        const result = await axios.post('http://localhost:8080/contact/updateContact', {
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
        }, 
        { headers: 
            { 
                Cookie:`CRM=${token}`
            }
        }, { 
            withCredentials: true 
        });
        expect(result.data.statusCode).to.be.eq(200);
    });
    it('Should fail to update a contact', async () => {
        try{
            const result = await axios.post('http://localhost:8080/contact/updateContact', {
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
            }, 
            { headers: 
                { 
                    Cookie:`CRM=${token}`
                }
            }, { 
                withCredentials: true 
            });
        } catch (err) {
            result = err.response;
        }
        expect(result.data.statusCode).to.be.eq(404);
    });
    after( async function() {
        const user = await User.findOne({
            userName: '123',
        });
        const oneContact = await Contact.findOne({
            _id: mongoose.Types.ObjectId(newContact),
        }).lean();
        if (oneContact === null) {
            // no contact found in database
            res.status(404);
            return res.json({
                statusCode: 404,
            });
        }
        if (user === null) {
            // no User found in database
            res.status(404);
            return res.json({
                statusCode: 404,
            });
        }
        await Contact.deleteOne({ _id: mongoose.Types.ObjectId(oneContact._id) });
        const result = user.contacts.filter((contact) => contact !== newContact);
        user.contacts = result;
        await user.save();
        
    });



});

describe('Delete Contact', () => {
    let newContact; 
    let token;


    before(async function() {
        const result = await axios.post('http://localhost:8080/auth/login', {
            id: '123',
            password: '123'
        }, { 
            withCredentials: true 
        });

        // Extract the token from the cookie
        token = result.headers['set-cookie'][0].split(';')[0].slice(4);


        // const user = await User.findOne({
        //     userName: '123',
        // });
        // // const user = req.user;
        // if (user === null) {
        //     // no User found in database
        //     res.status(404);
        //     return res.json({
        //         statusCode: 404,
        //     });
        // }
        // const contact = await Contact.create({
        //     email: 'email',
        //     familyName: 'familyName',
        //     givenName: 'givenName',
        //     tags: [],
        // });
        // user.contacts.push(contact._id);
        // await user.save();
        // newContact = contact._id;
        const result_ = await axios.post('http://localhost:8080/contact/addContact', {
            email: 'autoTest@autotest.com',
            givenName: 'auto',
            familyName: 'testing'        
        }, 
        { headers: 
            { 
                Cookie:`CRM=${token}`
            }
        }, { 
            withCredentials: true 
        });
        newContact = result_.data.data._id;
        console.log(newContact);
    })
    it('Should delete a contact succesfully', async () => {
        const result = await axios.delete('http://localhost:8080/contact/deleteContact', 
        { headers: 
            { 
                Cookie:`CRM=${token}`
            }
        },
        { 
            withCredentials: true 
        },
        { data: 
            { 
                contactId: newContact
            }
        });
        expect(result.data.statusCode).to.be.eq(200);
    });
    // it('Should fail to delete a contact', async () => {
    //     try{
    //         const result = await axios.delete('http://localhost:8080/contact/deleteContact', { data: { 
    //             userName: 'spidertest54',
    //             contactId: newContact
    //         }
    //         }
    //         , 
    //         { headers: 
    //             { 
    //                 Cookie:`CRM=${token}`
    //             }
    //         }, { 
    //             withCredentials: true 
    //         });
    //     } catch (err) {
    //         result = err.response;
    //     }
    //     expect(result.data.statusCode).to.be.eq(404);
    // });
});

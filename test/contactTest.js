const chai = require('chai');
const axios = require('axios');
const expect = chai.expect;

// const contactController = require("../controllers/contactController");
// const userController = require("../controllers/userController");
// const Contact = require("../models/contacts");
// const User = require('../models/users');

describe('Get contacts for user', () => {
    it('Should return the all contacts for a user', async () => {
        const result = await axios.get('http://localhost:8080/contact/getAllContacts/spidertest55');
        //console.log(result.data.data);
        expect(result.data.statusCode).to.be.eq(200);
        
    });
    it('Should fail returning all contacts because user invalid', async () => {
        try{
            const result = await axios.get('http://localhost:8080/contact/getAllContacts/spidertest51');
        }catch(err){
            result = err.response;
        }
        //console.log(result.data);
        expect(result.data.statusCode).to.be.eq(404);
        
    });
    it('Should return one contact for a user', async () => {
        const result = await axios.get('http://localhost:8080/contact/getContact/spidertest55/612e20f5e67c51b4ed06a030');
        //console.log(result.data.data);
        expect(result.data.statusCode).to.be.eq(200);
        
    });
    it('Should fail because contact is null', async () => {
        try{
            const result = await axios.get('http://localhost:8080/contact/getContact/spidertest55/612e20f5e67c51b4ed06a039');
        }catch(err){
            result = err.response;
        }
        //console.log(result.data);
        expect(result.data.statusCode).to.be.eq(404);
        
    });
    it('Should fail because user is null', async () => {
        try{const result = await axios.get('http://localhost:8080/contact/getContact/spidertest51/612e20f5e67c51b4ed06a030');
        }catch(err){
            result = err.response;
        }
        //console.log(result.data);
        expect(result.data.statusCode).to.be.eq(404);
        
    });
});

describe('Add Contact, Update Contact, Delete Contact', () => {
    let newContact;
    //before( function(){
    it('Add a contact succesfully', async () => {
        const result = await axios.post('http://localhost:8080/contact/addContact', {
            userName: 'spidertest55',
            email: 'autoTest@autotest.com',
            givenName: 'auto',
            familyName: 'testing'
        });
        //console.log(result.data.data._id);
        newContact = result.data.data._id;
        //console.log(result.data.data);
        expect(result.data.statusCode).to.be.eq(200);
    });
    // after( function() {
    //     db.collection.findOneAndDelete(newContact);
    // });
    //}); TODO:NOT WORKING DB IS UNDEFINED

    //console.log(newContact); TODO: FIX DELETE CONTACT
    // it('Delete a contact succesfully', async () => {
    //     const result = await axios.delete('http://localhost:8080/contact/deleteContact', {
    //         userName: 'spidertest55',
    //         contactId: '61583e337f881de1b49bac7d'
    //     });
    //     console.log(result);
    //     expect(result.data.statusCode).to.be.eq(200);
    // });

    it('Fail to add a contact', async () => {
        try{
            const result = await axios.post('http://localhost:8080/contact/addContact', {
            userName: 'spidertest53',
            email: 'autoTest@autotest.com',
            givenName: 'auto',
            familyName: 'testing'
        });
        }catch(err){
            result = err.response;
        }
        //console.log(result.data);
        expect(result.data.statusCode).to.be.eq(404);
    });
    // it('Fail to delete a contact', async () => {
    //     const result = await axios.delete('http://localhost:8080/contact/deleteContact', {
    //         userName: 'spidertest52',
    //         contactId: '61583e337f881de1b49bac7d'
    //     }); TODO: THIS DOESNT WORK EITHER
    //     expect(result.data.statusCode).to.be.eq(404);
    // });
    it('Update a contact succesfully', async () => {
        const result = await axios.post('http://localhost:8080/contact/updateContact', {
            contactId: '61556e08e050338e94d23601',
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
        //console.log(result.data.data);
        expect(result.data.statusCode).to.be.eq(200);
    });
    // it('Fail to update contact', async () => {
    //     const result = await axios.post('http://localhost:8080/contact/updateContact', {
    //         contactId: '61556e08e050338e94d23609', TODO: CANT UPDATE BECAUSE OF INVALID ID?
    //         nickName: 'autoTest@autotest.com',
    //         givenName: 'auto',
    //         middleName: 'auto testing',
    //         familyName: 'testing',
    //         email: 'changed',
    //         phone: 'changed',
    //         address: 'changed',
    //         description: 'changed',
    //         note: 'changed',
    //     });
    //     //console.log(result.data.data);
    //     expect(result.data.statusCode).to.be.eq(404);
    // });
});
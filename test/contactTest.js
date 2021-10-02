const chai = require('chai');
const axios = require('axios');
const expect = chai.expect;
const mongoose = require("mongoose");
const Contact = require("../models/contacts");
const router = require("express").Router();
const User = require('../models/users')


describe('Get contacts for user', () => {
    it('Should return the all contacts for a user', async () => {
        const result = await axios.get('http://localhost:8080/contact/getAllContacts/spidertest55');
        expect(result.data.statusCode).to.be.eq(200);
        
    });
    it('Should fail returning all contacts because user invalid', async () => {
        try{
            const result = await axios.get('http://localhost:8080/contact/getAllContacts/spidertest51');
        }catch(err){
            result = err.response;
        }
        expect(result.data.statusCode).to.be.eq(404);
        
    });
    it('Should return one contact for a user', async () => {
        const result = await axios.get('http://localhost:8080/contact/getContact/spidertest55/612e20f5e67c51b4ed06a030');
        expect(result.data.statusCode).to.be.eq(200);
        
    });
    it('Should fail because contact is null', async () => {
        try{
            const result = await axios.get('http://localhost:8080/contact/getContact/spidertest55/612e20f5e67c51b4ed06a039');
        }catch(err){
            result = err.response;
        }
        expect(result.data.statusCode).to.be.eq(404);
        
    });
    it('Should fail because user is null', async () => {
        try{const result = await axios.get('http://localhost:8080/contact/getContact/spidertest51/612e20f5e67c51b4ed06a030');
        }catch(err){
            result = err.response;
        }
        expect(result.data.statusCode).to.be.eq(404);
        
    });
});

describe('Add & Update Contact', () => {
    let newContact;
    it('Should add a contact succesfully', async () => {
        const result = await axios.post('http://localhost:8080/contact/addContact', {
            userName: 'spidertest55',
            email: 'autoTest@autotest.com',
            givenName: 'auto',
            familyName: 'testing'
        });
        newContact = result.data.data._id;
        expect(result.data.statusCode).to.be.eq(200);
    });
    it('Should fail to add a contact', async () => {
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
            });
        } catch (err) {
            result = err.response;
        }
        expect(result.data.statusCode).to.be.eq(404);
    });
    after( async function() {
        const user = await User.findOne({
            userName: 'spidertest55',
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
    before(async function() {
        const user = await User.findOne({
            userName: 'spidertest55',
        });
        if (user === null) {
            // no User found in database
            res.status(404);
            return res.json({
                statusCode: 404,
            });
        }
        const contact = await Contact.create({
            email: 'email',
            familyName: 'familyName',
            givenName: 'givenName',
            tags: [],
        });
        user.contacts.push(contact._id);
        await user.save();
        newContact = contact._id;
    })
    it('Should delete a contact succesfully', async () => {
        const result = await axios.delete('http://localhost:8080/contact/deleteContact', { data: { 
            userName: 'spidertest55',
            contactId: newContact
        }
        });
        expect(result.data.statusCode).to.be.eq(200);
    });
    it('Should fail to delete a contact', async () => {
        try{
            const result = await axios.delete('http://localhost:8080/contact/deleteContact', { data: { 
                userName: 'spidertest54',
                contactId: newContact
            }
            });
        } catch (err) {
            result = err.response;
        }
        expect(result.data.statusCode).to.be.eq(404);
    });
});

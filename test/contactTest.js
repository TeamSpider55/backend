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


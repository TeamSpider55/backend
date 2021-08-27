require("../config/db");
const os = require("os");
const scheduleController = require("./scheduleController");
const eventController = require("./eventController");
const userController = require('./userController');
const Contact = require("../models/contacts");

let contactController = {
    /* Add the contact to the data base
     */
    addContact: async (contact) => {
        try{
            return await Contact.create(contact);
        } catch (err) {
            console.log(`Fail to add contact: ${err.message} !!!`);
        }return null;
    },

    modifyContact: async (mod, contact) => {
        if(mod == null || contact == null ){
            console.log(`Fail to modify contact: error paramater!!!`);
            return false;
        }
        contact.nickName = (mod.nickName != null && mod.nickName != undefined ) ? mod.nickName : contact.nickName; 
        contact.familyName = (mod.familyName != undefined && mod.familyName != null) ? mod.familyName : contact.familyName; 
        contact.middleName = (mod.middleName != undefined && mod.middleName != null) ? mod.middleName : contact.middleName; 
        contact.givenName = (mod.givenName != undefined && mod.givenName != null) ? mod.givenName : contact.givenName; 
        contact.email = (mod.email != undefined && mod.email != null) ? mod.email : contact.email; 
        contact.phone = (mod.phone != undefined && mod.phone != null) ? mod.phone : contact.phone; 
        contact.address = (mod.address!= undefined && mod.address != null) ? mod.address : contact.address; 
        contact.description = (mod.description!= undefined && mod.description != null) ? mod.description : contact.description; 
        
        contact.save()
            .catch((err) =>{
                console.log(`Fail to modify contact: ${err.message}!!!`)
                return false;
            }); 
        return true;
    },

    addParticipatedEvent: async (eventId, contact) => {
        contact.participateEvent.push(eventId);
        await contact.save()
            .catch(err => {
                console.log(`Add Event reference to contact Fail: ${err.message}`);
                return false
            });
        return true;
    },

    removeParticipatedEvent: async (eventId, contact) => {
        for(var i = 0; i < contact.participateEvent.length; i++){
            if(contact.participateEvent[i].match(eventId)){
                contact.participateEvent.splice(i,1);
            }
        }await contact.save()
        .catch(err => {
            console.log(`Remove Event reference from contact Fail: ${err.message}`);
            return false
        });
        return true;
        
    },

    retrieveContact: async (id) => {
        let contact = await contact.findOne({_id:id})
            .catch(err => {
            console.log(`Fail to retrieve contact: ${err.message}!!!`);
            return null;

        }); return contact;
    },

    retrieveContactEvent: async (contactId) => {
        let contact = await contactController.retrieveContact(contactId);
        return (contact!=null)? contact.participateEvent : [];
    }

};

module.exports = contactController;
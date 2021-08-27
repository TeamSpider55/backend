const { model } = require("mongoose");
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
        for(var attribute of Object.getOwnPropertyNames(contact)){
            // ensure it not override _id
            if(attribute === "_id")
                continue;

            if(attribute in mod)
                contact[attribute] = (mod[attribute]!= null) ? mod[attribute] : contact[attribute];
        } try{
            contact.save();
        } catch (err){
            console.log(`Fail to modify contact: ${err.message}!!!`);
        }
    },

    addParticipatedEvent: async (eventId, contact) => {
        contact.push(eventId);
        try{
            contact.save();
        }catch (err){
            console.log(`Add Event reference to contact Fail: ${err.message}`);
        }
    },

    removeParticipatedEvent: async (eventId, contact) => {
        for(var i = 0; i < contact.participateEvent.length; i++){
            if(contact.participateEvent[i].match(eventId)){
                contact.participateEvent.splice(i,1);
            }
        }contact.save();
        
    }

};

let test = async () => {
    /*let variable = await contactController.addContact({
        nickName: "june",
        familyName: "Trinh",
        middleName: "Thanh",
        givenName: "Xuan",
        email: "me@me.com",
        phone: "000000000",
        address:"000000000",
        description: "000000000",
        note: "000000000",
        tags: [],
        participateEvent: []
    });*/
    let variable = await scheduleController.addSchedule(Date.now(), "me");
    console.log(variable);
};

test();
module.exports = contactController;
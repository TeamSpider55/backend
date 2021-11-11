const EventController = require('mongoose');
const emailValidator = require('../lib/emailUtil');
const ParticipantExpiration = require("../models/participantExpiration");
const authUtil = require("../lib/authUtil");
const mailer = require("../config/mailConfig");
const eventController = require("./eventController");

// Manipulate participant
const participantController = {
    checkExist: (email, contacts) => {
        for(var group in contacts){
            for (const participant of group) {
                if(participant.toLowerCase() == email.toLowerCase()){
                    return false;
                }
            }
        }
        return true;
    },
    /**
     * Update the existed event (must)
     * @param {long} start unix value that must be correct up to minute
     * @param {long} end unix value that must be correct up to minute
     * @param {String} user id of the user 
     * @param {String} email 
     * @returns the pre-determined format packet
     */
    pendingParticipant: async(start, end, user, email, status) => {

        let res = await eventController.retrieveEvent(start, end, user);
        let syntaxFlag = true;//emailValidator.validate(email);
        console.log("1");
        if(res.statusCode == 200 
                && syntaxFlag 
                && participantController.checkExist(email, res.data.contacts)){
            console.log("2");
            if(status == 'pending')
            {        
                res.data.contacts.pending.push(email)
                
                // send invitation
                let invitationLink = authUtil.generateConfirmationCode(email);
                mailer.sendInvitationLink(start, email, invitationLink);

                // cache the pending participant.
                await ParticipantExpiration.create(
                    {
                        index: 0,
                        user: user,
                        email: email,
                        start: start,
                        end: end,
                        invitation: invitationLink
                    }
                );
                res.data.contacts.pending.push(email);
                eventController.updateEventParticipant(start, end, user, res.data.contacts.pending, email);
            }
            else {
                res.data.contacts.confirm.push(email);
                eventController.updateEventParticipant(start, end, user, res.data.contacts.pending, email);
            }

        
        }
        return (res.statusCode )
            ? (syntaxFlag) 
                ? {data: 'Successfully modify the participant list!!!', statusCode: 200}
                : {data: 'Invalid email syntax!!!', statusCode: 400}
            : res;
    },  


    /**
     * Update the existed event (must) that one of the pended participant follow their confirm code .
     * @param {long} start unix value that must be correct up to minute
     * @param {long} end unix value that must be correct up to minute
     * @param {String} user id of the user 
     * @param {String} email 
     * @returns the pre-determined format packet
     */
    confirmParticipant: async(invitation) => {

        let result = await ParticipantExpiration.findOne({
            invitation:invitation
        });
        if(result == null){
            return {data: 'The position does not exist!!!', statusCode: 400};
        }
        let start = result.start;
        let end = result.end;
        let user = result.user;
        let res = await this.retrieveEvent(start, end, user);
        let expiredFlag = true
        // search for the participant among the list of all pending
        if(res.statusCode == 200 
            && this.RemovePendingParticipant()){
            
                for(var i =0; i < res.data.contacts.pending.length; i++){
                // if the email is not expired, it will live in pending
                if(res.data.contacts.pending[i].email === email){
                    res.data.contacts.pending.splice(i,1);
                    expiredFlag = false;
                    break;
                }
            }
            //if the confirmed participant accept within the allowed time, their position in event is confirmed
            if(!expiredFlag) {
                res.data.contacts.confirm.push(email);
                res.data.save();
            }
        }
        
        return (res.statusCode == 200)
            ? (expiredFlag) 
                ? {data: 'Since overdue, the position of the user is cancel!!!', statusCode: 400}
                : {data: 'The participant is confirmed to be attend the event!!!', statusCode : 200}
            : res;
    },

    /**
     * Update the existed event (must)
     * @param {long} start unix value that must be correct up to minute
     * @param {long} end unix value that must be correct up to minute
     * @param {String} user id of the user 
     * @param {String} email 
     * @returns the pre-determined format packet
     */
    removeParticipant: async(start, end, user, email, type) => {
        let res = await eventController.retrieveEvent(start, end, user);

        if(res.statusCode == 200
                && type in ['pending', 'confirm']){
            for(var i =0; i < res.data.contacts[type].length; i++){
                if(res.data.contacts[type][i]=== email){
                    // once found attempt to remove the 
                    res.data.contacts[type][i].splice(i,1);
                    eventController.updateEventParticipant(start, end, user, res.data.contract.type, type);
                }
            }
        }
        return (res.statusCode == 200)
            ? (type in ['pending', 'confirm'])
                ? {data: 'Wrong Type!!', statusCode: 400}
                : {data: 'Successfully remove the participant!!', statusCode: 400}
            : res;
    },
    

    /**
     * Update the existed event (must)
     * @param {long} start unix value that must be correct up to minute
     * @param {long} end unix value that must be correct up to minute
     * @param {String} user id of the user 
     * @param {String} newEmail the new email which must be of correct syntax
     * @param {String} email 
     * @returns the pre-determined format packet
     */
    modifiedParticipant: async(start, end, user, email, newEmail, type) => {
        let res = await this.retrieveEvent(start, end, user);
        if(!emailValidator.validate(newEmail))
            return {data:'Invalid email!!!', statusCode: 400};

        if(res.statusCode == 200
                && type in ['pending', 'confirm']){
            for(var i =0; i < res.data.contacts[type].length; i++){
                if(res.data.contacts[type][i]=== email){
                    // once found attempt to remove the 
                    res.data.contacts[type][i].email = newEmail;

                    if(type == 'pending')
                        res.data.contacts[type][i].lifeSpan = '5';
                    res.data.save();
                }
            }
        }
        return (res.statusCode == 200)
            ? (type in ['pending', 'confirm'])
                ? {data: 'Wrong Type!!', statusCode: 400}
                : {data: 'Successfully alter the participant\'s email!!', statusCode: 400}
            : res;
    },
    
    /**
     * retrieve participant detail
     * @param {string} email 
     * @param {string} link 
     * @returns 
     */
    RetrievePendingParticipant: async(email, link) => {
        return await ParticipantExpiration.findOne({
            participant: email,
            invitation: link
        });

    },

    /**
     * remove a participant (and move them to confirm)
     * @param {string} email 
     * @param {string} link 
     */
    RemovePendingParticipant: async(email, link) => {
        let result = await ParticipantExpiration.deleteOne({
            participant: email,
            invitation: link
        });

        return (result && result.ok == 1) ? true : false;
    },

    /**
     * remove all the participant that is pending 5 day ago
     * @param {int} index the index of the expired date (5 day from cur index in .env) 
     */
    PopExpiredParticipant: async(index) => {
        let result = await ParticipantExpiration.find(
            { index: index}
        )
        await ParticipantExpiration.deleteMany({
            index: index
        });

        return result;
    },

}

module.exports = participantController;
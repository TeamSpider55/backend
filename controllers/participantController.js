const EventController = require('mongoose');
const emailValidator = require('../lib/emailUtil');
const EmailUtil = require('../lib/emailUtil');
// Manipulate participant
const participantController = {

    /**
     * Update the existed event (must)
     * @param {long} start unix value that must be correct up to minute
     * @param {long} end unix value that must be correct up to minute
     * @param {String} user id of the user 
     * @param {String} email 
     * @returns the pre-determined format packet
     */
    pendingParticipant: async(start, end, user, email, status) => {

        let res = await this.retrieveEvent(start, end, user);
        let syntaxFlag = EmailUtil.validate(email);
        if(res.statusCode == 200 
                && syntaxFlag){
            (status == 'pending')        
                ? res.data.contacts.pending.push(newParticipants)
                : res.data.contacts.confirm.push(newParticipants);
            res.data.save();
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
    confirmParticipant: async(start, end, user, email) => {

        let res = await this.retrieveEvent(start, end, user);
        let expiredFlag = true
        // search for the participant among the list of all pending
        if(res.statusCode == 200 ){
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
        let res = await this.retrieveEvent(start, end, user);

        if(res.statusCode == 200
                && type in ['pending', 'confirm']){
            for(var i =0; i < res.data.contacts[type].length; i++){
                if(res.data.contacts[type][i]=== email){
                    // once found attempt to remove the 
                    res.data.contacts[type][i].splice(i,1);
                    res.data.save();
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
    }
}

module.exports = participantController;
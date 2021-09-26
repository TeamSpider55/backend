const cron = require('node-cron');
const util = require('../lib/util');
const eventController = require('../controllers/eventController');
const userController = require('../controllers/userController')
const mailer = require("./mailConfig");
const fs = require('fs');
const os = require('os');
require("dotenv").config();


let dailyEmailSchedule = util.extractH_M_S(process.env.DAILY_AUTOMATE_TASK_TIME);
let emailNotification= Boolean(process.env.EMAIL_NOTIFICATION_STATUS);

/* Reference: https://stackoverflow.com/questions/64996008/update-attributes-in-env-file-in-node-js
 */
let replaceVal = (key, val) => {
    const VAR = fs.readFileSync("./.env", "utf-8").split(os.EOL);
    
    for(var i = 0; i < VAR.length; i++){
        
        if( VAR[i].includes(key + "=")){
            VAR[i] = `${key}=${val}`;
            fs.writeFileSync("./.env", VAR.join(os.EOL));
            return true;
        } 
    }return false;
};

let automatorOption = {
    
    /* Set EMAIL_NOTICATION_STATUS to false
     */
    turnOffEmailNotification: () => {
        if(emailNotification){
            if(replaceVal("EMAIL_NOTIFICATION_STATUS", false)){
                emailNotification = false;
                return true;
            }
        }return false
    },

    /* Set EMAIL_NOTIFICATION_STATUS to true
     */
    turnOnEmailNotification: () => {
        if(!emailNotification){
            if(replaceVal("EMAIL_NOTIFICATION_STATUS", true)){
                emailNotification = true;
                return true;
            }
        }return false;
    },

    setDailyEmailTime: (milisSecFromMidNight) => {
        // check the range
        if(milisSecFromMidNight < 0 ||
            milisSecFromMidNight > 84924000){
            console.log("Invalid Time!!!!");
            return false;
        }

        if(replaceVal("DAILY_AUTOMATE_TASK_TIME", milisSecFromMidNight)){
            emailSchedule = util.extractH_M_S(milisSecFromMidNight);
            return true;
        }return false;
    }
};

/* Schedule to run every day @indicated time
 */
cron.schedule(`${emailSchedule.min} ${emailSchedule.hour} * * *`, () => {
    if(emailNotification == false)
        return;

    // this will call method to look at data base for event that is require to send mail
    let notifyingEvents = eventController.autoNotification();

    for(var e of notifyingEvents){
        let userMail = await userController.findUserById(e.user).email;
        for(var contact of e.contacts){
            mailer.sendEventNotification(contact,e.event.start,e.event.end, userMail ,e.event.title);
        }
        // turn off notification for this event
        await eventController.setNotification("No notification", e.start, e.end, e.user);
    }
    
})
module.exports = { automatorOption };
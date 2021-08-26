let Util = {
    /* Turn a unix that store YYYY_MM_DDTHH MM:SS.MS to that of only YYYY-MM-DDT00 00:00.00
        * This will be conventionto store a scheduled date
        * @author June (Xuan Trinh)
        * @param {Number} time in millis second since poxis (Unix time)
        * @return {Number} formatted - bring the time back to the start of the same day, but display in Unix time
        */
    extractUnixOfYYYY_MM_DD: (unixTime) => {
        return Math.floor(unixTime / (86400000)) * 86400000;
    },

    /* Turn a nix that store YYYY_MM_DDTHH MM:SS:MS to that of only YYYY-MM-DDTHH MM:00.00
    * This will be the convention to store start/ end of an event
    * @author June (Xuan Trinh)
    * @param {Number} time in millis second since poxis (Unix time)
    * @return {Number} formatted - remove the second, milis second value. Display in Unix time
    */
    extractUnixOfYYYY_MM_DD_HH_MM: (unixTime) => {
        return Math.floor(unixTime / 60000) * 60000; 
    },

    /* Turn the hour:,  minute into milis second valur
     * @param: {Int} 
     * @param: {Int}
     * @return: {Int} milisecond value
     */
    extractUnixOfTime: (hour, minute) => {
        return hour * 60 *60 * 1000 + miniute * 60 * 1000;
    },

    extractH_M_S: (millisSec) => {
        let hourVal = Math.floor(millisSec/3600000);
        let minVal =  Math.floor((millisSec - hourVal * 3600000) / 60000);
        return {
            hour:hourVal,
            min: minVal
        };
    },

    /* This method is use to get date that is 1 day before of the scheduled day
     */
    getTomorrow: (unixTime) => {
        return unixTime + 86400000;
    }
}

module.exports = Util;
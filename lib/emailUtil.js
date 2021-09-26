let emailValidator = {

    /**
     * Parse and check for email convention
     * @param {String} email 
     * @returns Bool indicate if the email is syntax-wise correct
     */
    validate: (email) => {
        const sub = email.split('@');

        if(sub.length == 2 && sub[0].length > 0 && sub[1].length > 0){
            for(TLDom of [".com", ".co.uk", ".org", ".net", ".gov", ".mil", ".co"]){
                
                if(sub[1].includes(TLDom))
                    return true;
            }
        }
        return false;
    }
}

console.log(emailValidator.validate("@dfsaf.com"));
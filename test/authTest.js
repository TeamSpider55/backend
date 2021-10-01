const chai = require('chai');
const axios = require('axios');
const expect = chai.expect;

describe('Testing Authentication', () => {

    // store the authentication token
    let token;

    // testing log in
    it('Should get the Success message', async () => {
        const result = await axios.post('http://localhost:8080/auth/login', {
            id: '123',
            password: '123'
        }, { 
            withCredentials: true 
        });

        // Extract the token from the cookie
        token = result.headers['set-cookie'][0].split(';')[0].slice(4);

        // Login success
        expect(result.data.success).to.be.eq(true);
    });

    
    // testing getting profile without loggin in
    it('Should give Unauthorized', async () => {
        let result;
        try{
        result = await axios.get('http://localhost:8080/user/profile');
        } catch (err) {
            result = err.response;
        }
        expect(result.data).to.be.eq('Unauthorized');
    });

    // testing GET request to user profile when provided the authentication cookie
    it('Should give the profile', async () => {
        let result;
        result = await axios.get('http://localhost:8080/user/profile', 
        { headers: 
            { 
                Cookie:`CRM=${token}` 
            }
        }, { 
            withCredentials: true 
        });
        // See if it returns the user that logs in
        expect(result.data.data.userName).to.be.eq('123');
    });
});






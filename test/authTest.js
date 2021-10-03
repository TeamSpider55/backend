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

    // testing GET request to profile without loggin in
    it('Should give Unauthorized', async () => {
        let result;
        try{
        result = await axios.get('http://localhost:8080/user/profile');
        } catch (err) {
            result = err.response;
        }
        expect(result.data).to.be.eq('Unauthorized');
    });

    // testing registering with repeated userName
    // testing GET request to profile without loggin in
    it('Registration should fail', async () => {
        result = await axios.post('http://localhost:8080/auth/register', 
            {
                email: '123@123.com',
                userName: '123', // this userName already exists, so registration should fail
                familyName: '123',
                givenName: '123',
                password: '1234',
                phone: '0123456776',
                address: 'University of Procastination'   
            }
        );
        expect(result.data.success).to.be.eq(false);
    });
});
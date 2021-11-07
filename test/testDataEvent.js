const axios = require('axios');
const expect = require('chai').expect;
require('../app');

let hourCollection = [];
//before(() => {
    for(var i= 0; i < 240; i+= 20){
        //console.log((i + 1) * 1000 * 60 * 60 * 24);
        hourCollection.push((i) * 1000 * 60 * 6) ;
    }
//})
describe(
    "Unit testing for the event API!!!", function(){
        // testing GET request to user profile when provided the authentication cookie
        // testing GET request to user profile when provided the authentication cookie
        let dataInCache = (data) => {
            for(var i of inputInDb){
                if(data.length == i.lenth){
                    for(var attribute in i){
                        if(i.attribute != data.attribute){
                            return false;
                        }
                    }return true;
                }
            }return false;
        }
        let inputInDb = [];
        let token;

        
        
        describe(
            
            "Assert the correctness of the 'Add' route",
            function(){
                beforeEach(async function() {
                    const result = await axios.post('http://localhost:8080/auth/login', {
                        id: '123',
                        password: '123'
                    })
                    token = result.headers['set-cookie'][0].split(';')[0].slice(4);
                });
                it(
                    "[Expect: success] Enter an event to a User who does not have that schedule with the same date",
                    async() => {
                        const data = {
                            "title": "test",
                            "note": "test",
                            "start": hourCollection[0] + 1000 * 60 * 6,
                            "end": hourCollection[0] + 1500 * 60 * 6,
                            "type": "personal",
                        };
                        let res = await axios.post(
                            'http://localhost:8080/event/add',
                            data,{
                                headers: { 
                                    Cookie:`CRM=${token}` 
                                }
                            },
                            { withCredentials: true }
                            );
                        
                        expect(res.data.status.statusCode).to.deep.equal(200);
                        inputInDb.push({
                            "start": data.start,
                            "end": data.end
                        });
                    }
                );
                it(
                    "[Expect: fail]  Enter an event which should be existed in database!!",
                    async() => {
                        const data = {
                            "title": "test",
                            "note": "test",
                            "start": hourCollection[0] + 1000 * 60 * 6,
                            "end": hourCollection[0] + 1500 * 60 * 6,
                            "type": "personal",
                        };
                        let res = await axios.post(
                            'http://localhost:8080/event/add',
                            data, {
                                headers: { 
                                    Cookie:`CRM=${token}` 
                                }
                            },
                            { withCredentials: true }
                            );
                        expect(res.data.status.statusCode).to.deep.equal(400);
                    }
                )
                it(
                    "[Expect: success] Enter a list of event of a user",
                    async() => {
                        for (var i =1; i< hourCollection.length;i++){
                            const data = {
                                "title": "test",
                                "note": "test",
                                "start": hourCollection[i] + 1000 * 60 * 6,
                                "end": hourCollection[i] + 1500 * 60 * 6,
                                "type": "personal",
                                "tags": [],
                                "contacts":[]
                            };
                            let res = await axios.post(
                                'http://localhost:8080/event/add',
                                data, {
                                    headers: { 
                                        Cookie:`CRM=${token}` 
                                    }
                                },
                                { withCredentials: true }
                                );
                            
                            expect(res.data.status.statusCode).to.deep.equal(200);
                            inputInDb.push({
                                "start": data.start,
                                "end": data.end
                            });
                        }
                    }
                );
            }
        );
        
        describe(
            'Assert the correctness of "Modified" route',
            function() {
                beforeEach(async function() {
                    const result = await axios.post('http://localhost:8080/auth/login', {
                        id: '123',
                        password: '123'
                    })
                    token = result.headers['set-cookie'][0].split(';')[0].slice(4);
                });
                it(
                    "[Expect: success] modified an events ~!!!!", 
                    async () => {
                        var data = {
                            "title": "",
                            "note": "",
                            "start": inputInDb[0].start,
                            "end": inputInDb[0].end,
                            "type": "personal"
                        };
                        let res = await axios.post(
                            'http://localhost:8080/event/modify/content',
                            data, {
                                headers: { 
                                    Cookie:`CRM=${token}` 
                                }
                            },
                            { withCredentials: true }
                            );
                        // console.log(res.data);
                        expect(res.data.status.statusCode).to.deep.equal(200);
                    }
                );
            }
        );
        describe(
            'Assert the correctness of "Remove" route',
            function() {
                beforeEach(async function() {
                    const result = await axios.post('http://localhost:8080/auth/login', {
                        id: '123',
                        password: '123'
                    })
                    token = result.headers['set-cookie'][0].split(';')[0].slice(4);
                });
                it(
                    "[Expect: success] Remove all the event added to the data base ~!!!!", 
                    async () => {
                        for(var cached of inputInDb){
                            var data = {
                                "start": cached.start,
                                "end":cached.end
                            };
                            let res = await axios.post(
                                'http://localhost:8080/event/remove',
                                data, {
                                    headers: { 
                                        Cookie:`CRM=${token}` 
                                    }
                                },
                                { withCredentials: true }
                                );
                            // console.log(res.data.statusCode);
                            expect(res.data.statusCode).to.deep.equal(200);
                        }
                });
                it(
                    "[Expect: fail] Remove an event that is not in data base ~!!!!", 
                    async () => {
                        
                        var data = {
                            "start": hourCollection[0] + 1000 * 60 * 6,
                            "end": hourCollection[0] + 1500 * 60 * 6,
                        };
                        let res = await axios.post(
                            'http://localhost:8080/event/remove',
                            data, {
                                headers: { 
                                    Cookie:`CRM=${token}` 
                                }
                            },
                            { withCredentials: true }
                            );
                        // console.log(res.data.statusCode);
                        expect(res.data.statusCode).to.deep.equal(400);
                        
                });
            }
        );
    }
);
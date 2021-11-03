const axios = require('axios');
const expect = require('chai').expect;
require('../app');

let token;

describe(
    "Unit testing for the scheduling!!!",  function() {
        
    
        let inputInDb = [];
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

        /* attempt to input a correct packet to the system.
            scenario can happen:
            [1] -> scheudle with the spec is already in the DB: fail
            [2] -> schedule does not exist within the db: successfull
            [3] -> Cant enter in to the database : fail <- one of the independent test.
        */
        // generate 3 different set of date
        let dateCollection = [];
        let userCollection = ["a", "b", "c"];

        before(async function() {
            const result = await axios.post('http://localhost:8080/auth/login', {
                id: '123',
                password: '123'
            }, { 
                withCredentials: true 
            });
            
    
            // Extract the token from the cookie
            token = result.headers['set-cookie'][0].split(';')[0].slice(4);
            for(var i=0; i <3; i++){
                //console.log((i + 1) * 1000 * 60 * 60 * 24);
                dateCollection.push((i + 1) * 1000 * 60 * 60 * 24) ;
            }
        })


        describe(
            "Assertion the correctness of the 'Add' route",
            function(){
                it(
                    "[Expect: success] Enter 3 schedule that is of different date, of a single user",
                    async function() {
                        for(var date of dateCollection){
                            // construct the packet
                            const data = {
                                "date": date,
                                "user": userCollection[0]
                            };

                            let res = await axios.post(
                                'http://localhost:8080/schedule/add',
                                data, 
                                { headers: 
                                    { 
                                        Cookie:`CRM=${token}`
                                    }
                                }, { 
                                    withCredentials: true 
                            });
                        
                            
                            expect(res.data.statusCode).to.deep.equal(200);
                            inputInDb.push(res.data.data);
                        }
                    }
                );

                it(
                    "[Expect: failure] Enter a schedule that is have the same date as one that existed in the database",
                    async ()  => {
                        // construct the packet
                        const data = {
                            "date": dateCollection[0],
                            "user": userCollection[0]
                        };
                        
                        
                        let res = await axios.post(
                            'http://localhost:8080/schedule/add',
                            data
                        , 
                        { headers: 
                            { 
                                Cookie:`CRM=${token}`
                            }
                        }, { 
                            withCredentials: true 
                        });
                            
                        expect(res.data.statusCode).to.deep.equal(400);

                        let errorMessageFlag = res.data.data.includes('E11000');
                        expect(errorMessageFlag).to.deep.equal(true);
                        
                    }
                );
                it(
                    "[Expect: success] Enter a schedule that is have the same date as one that existed in the database, but for different user",
                    async () => {
                        // construct the packet
                        const data = {
                            "date": dateCollection[0],
                            "user": userCollection[1]
                        };
                        
                        
                        let res = await axios.post(
                            'http://localhost:8080/schedule/add',
                            data, 
                        { headers: 
                            { 
                                Cookie:`CRM=${token}`
                            }
                        }, { 
                            withCredentials: true 
                        });
                        
                            
                        expect(res.data.statusCode).to.deep.equal(200);
                        inputInDb.push(res.data.data);
                    }
                );
            }


        );

        describe(
            "Assertion the correcness of the 'Retrieve' route",
            function(){
                
                it(
                    "[Expect: success] Retrieve a schedule of a User at a set date, repeat 3 time while compare against the cached data that has been added to DB.",
                    async () => {
                        let res;
                        
                        for(var date of dateCollection)
                           
                            res = await axios.get(
                                `http://localhost:8080/schedule/retrieve/single/${date}/${userCollection[0]}`, 
                                { headers: 
                                    { 
                                        Cookie:`CRM=${token}`
                                    }
                                }, { 
                                    withCredentials: true 
                            });
                            
                            var i = dataInCache(res.data.data) ;
                            expect(i).to.deep.equal(true);
                        }
                );
                it(
                    "[Expect: failure] Retrieve a schedule of a User at a set date, which is definitely not in data base.",
                    async () => {                       
                        let res = await axios.get(
                            `http://localhost:8080/schedule/retrieve/single/-1/${userCollection[0]}`, 
                            { headers: 
                                { 
                                    Cookie:`CRM=${token}`
                                }
                            }, { 
                                withCredentials: true 
                        });
                        expect(res.data.statusCode).to.deep.equal(400);
                        expect(res.data.data).to.deep.equal('No schedule Wed Dec 31 1969 10:00:00 GMT+1000 (Australian Eastern Daylight Time)!!!');
                    }
                );

                it(
                    "[Expect: success] Retrieve schedule(s) of a User between a date - ensure data of the response is correct",
                    async () => {
                        res = await axios.get(
                            `http://localhost:8080/schedule/retrieve/many/${userCollection[0]}/${(1) * 1000 * 60 * 60 * 24}/${(3) * 1000 * 60 * 60 * 24}`, 
                            { headers: 
                                { 
                                    Cookie:`CRM=${token}`
                                }
                            }, { 
                                withCredentials: true 
                        });
                        
                        expect(res.data.data.length).to.deep.equal(3);
                        
                        for(var data of res.data.data){
                            expect(dataInCache(data)).to.deep.equal(true);
                        }
                    }
                );
                it(
                    "[Expect: failure] Retrieve schedule(s) of a User between a date - who is not in data base",
                    async () => {
                        res = await axios.get(
                            `http://localhost:8080/schedule/retrieve/many/${userCollection[3]}/${(1) * 1000 * 60 * 60 * 24}/${(3) * 1000 * 60 * 60 * 24}`, 
                            { headers: 
                                { 
                                    Cookie:`CRM=${token}`
                                }
                            }, { 
                                withCredentials: true 
                        });
                        
                        expect(res.data.statusCode).to.deep.equal(400);
                        expect(res.data.data).to.deep.equal('No schedule for undefined between the indicate date');
                    }
                );

                it(
                    "[Expect: success] Retrieve schedule(s) of a User - ensure data is correct",

                    async () => {
                        res = await axios.get(
                            `http://localhost:8080/schedule/retrieve/many/${userCollection[0]}`, 
                            { headers: 
                                { 
                                    Cookie:`CRM=${token}`
                                }
                            }, { 
                                withCredentials: true 
                        });

                        expect(res.data.data.length).to.deep.equal(3);

                        for(var data of res.data.data){
                            expect(dataInCache(data)).to.deep.equal(true);
                        }
                    }
                );

                it(
                    "[Expect: failure] Retrieve schedule(s) of a User - who is not in data base",

                    async () => {
                        res = await axios.get(
                            `http://localhost:8080/schedule/retrieve/many/${userCollection[2]}`, 
                            { headers: 
                                { 
                                    Cookie:`CRM=${token}`
                                }
                            }, { 
                                withCredentials: true 
                        });

                        expect(res.data.statusCode).to.deep.equal(400);
                        expect(res.data.data).to.deep.equal('No schedule for c');
                        
                    }
                );
            }
        );
        
        
        describe(
            "Assert the correctness of the 'Remove' route",

            function(){
                it(
                    "[Expect: success] Remove a schedule of a User in database",
                    async () => {
                        const data = {
                            "date": dateCollection[0],
                            "user": userCollection[1]
                        };

                        let res = await axios.post(
                            "http://localhost:8080/schedule/remove/single",
                            data, 
                            { headers: 
                                { 
                                    Cookie:`CRM=${token}`
                                }
                            }, { 
                                withCredentials: true 
                        });

                        expect(res.data.data).to.deep.equal(1);
                    }
                );

                it(
                    "[Expect: success] Remove a schedule of a User in database - which the schedule does not exist",
                    async () => {
                        const data = {
                            "date": dateCollection[0],
                            "user": userCollection[1]
                        };

                        let res = await axios.post(
                            "http://localhost:8080/schedule/remove/single",
                            data, 
                            { headers: 
                                { 
                                    Cookie:`CRM=${token}`
                                }
                            }, { 
                                withCredentials: true 
                        });

                        expect(res.data.data).to.deep.equal(0);
                    }
                );

                it(
                    "[Expect: success] Remove a schedule of a User between a period, (remove the one we add in test 1)",
                    
                    async () => {
                        
                        const data = {
                            "start": (1) * 1000 * 60 * 60 * 24,
                            "end": (3) * 1000 * 60 * 60 * 24,
                            "user": userCollection[0]
                        };

                        let res = await axios.post(
                            "http://localhost:8080/schedule/remove/many/user/between",
                            data, 
                            { headers: 
                                { 
                                    Cookie:`CRM=${token}`
                                }
                            }, { 
                                withCredentials: true 
                        });

                        expect(res.data.data).to.deep.equal(3);
                    }
                );

                it(
                    "[Expect: success] Remove all schedules of a User",
                    async () => {
                        // Add 3 schedule span 3 different dayy t o a user to test remove all scheudle route
             
                        for(var date of dateCollection){
                            // construct the packet
                            const data = {
                                "date": date,
                                "user": userCollection[2]
                            };
    
                            await axios.post(
                                'http://localhost:8080/schedule/add',
                                data, 
                                { headers: 
                                    { 
                                        Cookie:`CRM=${token}`
                                    }
                                }, { 
                                    withCredentials: true 
                            });
                
                        }

                        const data = {
                            "user": userCollection[2]
                        };

                        let res = await axios.post(
                            "http://localhost:8080/schedule/remove/many/user",
                            data, 
                            { headers: 
                                { 
                                    Cookie:`CRM=${token}`
                                }
                            }, { 
                                withCredentials: true 
                        });

                        expect(res.data.data).to.deep.equal(3);
                    }
                );

                it(
                    "[Expect: success] Remove all schedules of a User - who is not in data base",
                    async () => {
                        // Add 3 schedule span 3 different dayy t o a user to test remove all scheudle route

                        const data = {
                            "user": userCollection[2]
                        };

                        let res = await axios.post(
                            "http://localhost:8080/schedule/remove/many/user",
                            data, 
                            { headers: 
                                { 
                                    Cookie:`CRM=${token}`
                                }
                            }, { 
                                withCredentials: true 
                        });
                        
                        expect(res.data.data).to.deep.equal(0);
                    }
                );
            }
        );
    
    }

);
describe(
    "Unit testing for the event API!!!", function(){

        const axios = require('axios');
        const expect = require('chai').expect;

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
        let dateCollection = [];
        let hourCollection = [];
        let userCollection = ["d", "e", "f"];

        before(function(){
            for(var i=0; i <3; i++){
                //console.log((i + 1) * 1000 * 60 * 60 * 24);
                dateCollection.push((i + 1) * 1000 * 60 * 60 * 24) ;
            }

            for(var i= 0; i < 240; i+= 20){
                //console.log((i + 1) * 1000 * 60 * 60 * 24);
                hourCollection.push((i) * 1000 * 60 * 6) ;
            }
        });

        describe(
            "Assert the correctness of the 'Add' route",
            function(){

                it(
                    "[Expect: success] Enter an event to a User who does not have that schedule with the same date",

                    async() => {
                        const data = {
                            "title": "test",
                            "note": "test",
                            "start": hourCollection[0] + 1000 * 60 * 6,
                            "end": hourCollection[0] + 1500 * 60 * 6,
                            "type": "personal",
                            "tags": [],
                            "contacts":[],
                            "user": userCollection[0]
                        };

                        let res = await axios.post(
                            'http://localhost:8080/event/add',
                            data
                        );
                        
                        expect(res.data.statusCode).to.deep.equal(200);
                        inputInDb.push({
                            "start": data.start,
                            "end": data.end,
                            "user": data.user
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
                            "tags": [],
                            "contacts":[],
                            "user": userCollection[0]
                        };

                        let res = await axios.post(
                            'http://localhost:8080/event/add',
                            data
                        );
                        
                        expect(res.data.statusCode).to.deep.equal(400);
                    }
                );

                it(
                    "[Expect: success] Check if i can store an event with same start end as of another user",

                    async() => {
                        const data = {
                            "title": "test",
                            "note": "test",
                            "start": hourCollection[0] + 1000 * 60 * 6,
                            "end": hourCollection[0] + 1500 * 60 * 6,
                            "type": "personal",
                            "tags": [],
                            "contacts":[],
                            "user": userCollection[1]
                        };

                        let res = await axios.post(
                            'http://localhost:8080/event/add',
                            data
                        );
                        
                        expect(res.data.statusCode).to.deep.equal(200);
                        inputInDb.push({
                            "start": data.start,
                            "end": data.end,
                            "user": data.user
                        });
                    }
                );

                it(
                    "[Expect: success] Enter a list of event of a user",

                    async() => {
                        for (var i =0; i< hourCollection.length;i++){
                            const data = {
                                "title": "test",
                                "note": "test",
                                "start": hourCollection[i] + 1000 * 60 * 6,
                                "end": hourCollection[i] + 1500 * 60 * 6,
                                "type": "personal",
                                "tags": [],
                                "contacts":[],
                                "user": userCollection[2]
                            };

                            let res = await axios.post(
                                'http://localhost:8080/event/add',
                                data
                            );
                            
                            expect(res.data.statusCode).to.deep.equal(200);
                            inputInDb.push({
                                "start": data.start,
                                "end": data.end,
                                "user": data.user
                            });
                        }
                    }
                );
            }
        );
        
        describe(
            'Assert the correctness of "Modified" route',

            function() {

                it(
                    "[Expect: success] modified an events ~!!!!", 
                    async () => {

                        var data = {
                            "title": "",
                            "note": "",
                            "start": inputInDb[0].start,
                            "end": inputInDb[0].end,
                            "type": "personal",
                            "user": inputInDb[0].user
                        };
    
                        let res = await axios.post(
                            'http://localhost:8080/event//modify/content',
                            data
                        );
                        expect(res.data.statusCode).to.deep.equal(200);
                    }
                );
            }
        );

        describe(
            'Assert the correctness of "Remove" route',

            function() {

                it(
                    "[Expect: success] Remove all the event added to the data base ~!!!!", 
                    async () => {

                        for(var cached of inputInDb){
                            var data = {
                                "user" : cached.user,
                                "start": cached.start,
                                "end":cached.end
                            };

                            let res = await axios.post(
                                'http://localhost:8080/event/remove',
                                data
                            );
                            expect(res.data.statusCode).to.deep.equal(200);
                        }

                });

                it(
                    "[Expect: fail] Remove an event that is not in data base ~!!!!", 
                    async () => {

                        
                        var data = {
                            "user" : userCollection[2],
                            "start": hourCollection[0] + 1000 * 60 * 6,
                            "end": hourCollection[0] + 1500 * 60 * 6,
                        };

                        let res = await axios.post(
                            'http://localhost:8080/event/remove',
                            data
                        );
                        expect(res.data.statusCode).to.deep.equal(400);
                        

                });
            }
        );

    }
);
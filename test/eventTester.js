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
                            "start": dateCollection[0] + 1000 * 60 * 6,
                            "end": dateCollection[0] + 1500 * 60 * 6,
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
                        inputInDb.push(res.data);
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
                                "user" : cached.data.user,
                                "start": cached.data.start,
                                "end":cached.data.end
                            };

                            let res = await axios.post(
                                'http://localhost:8080/event/remove',
                                data
                            );

                            expect(res.data.statusCode).to.deep.equal(200);
                        }

                });
            }
        );

    }
);
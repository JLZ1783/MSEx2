const {MongoClient} = require('mongodb');
const express = require('express');
const cli = require('nodemon/lib/cli');
const url = require('url');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const { response } = require('express');
const res = require('express/lib/response');
const { assert } = require('console');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const port = 4000;
const mongoUri = "mongodb://ex2_mongodb_1:27017";
const client = new MongoClient(mongoUri);

//+++++++++++++++++++++++++++++++++++++++++++++++++//
//create app.get takes in parameters called LastName and first name 
//use mongodb client functions to interact with database

app.get('/', async (req, res) => {
    
    let firstName = req.query.firstName;
    let lastName = req.query.lastName;
    if(!firstName){
        res.status(400)
        res.send( "Missing required field: firstName");
      
    }
    else if(!lastName){
        res.status(400);
        res.send( "Missing required field: lastName");
      
    }
    else{
        try{
                client.connect();
                const query = {firstName: firstName,lastName: lastName};

                let f = await client.db("Medstar").collection("People").findOne(query)
                if(f){
                res.send(`firstName: ${firstName} <br/> lastName: ${lastName}`)
                res.status(200)
                }
                else{
                const update = {$set: {firstName: firstName, lastName: lastName}};
                const options = {upsert: true};
                await client.db("Medstar").collection("People").updateOne(query,update, options);
                res.send('New Record Created!');
                res.status(201);
            
            }

        }catch (e){
            console.error(e);
            
        }

    }
    client.close();
});
  
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
   





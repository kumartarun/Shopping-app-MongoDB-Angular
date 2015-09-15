express-node-mongo-skeleton
======================

## Installation
- Perform a clone of this repo. 
- Make sure MongoDB is installed (`brew install mongodb`)
- Create a MongoDB database named `crudapp` (`use crudapp`)
- Install packages and start the express.js web service (`npm install && npm start`)
- Navigate to `http://127.0.0.1:3000` to see the express.js welcome page
# EXpress JS Route and REST calls 

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.With a myriad of HTTP utility methods and middleware at your disposal, creating a robust API is quick and easy.

```sh
    var express  = require('express');
    var app      = express();                             
    var mongoose = require('mongoose');                   
    var morgan = require('morgan');  
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var router = express.Router();


```
creating schema 

```sh
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var blobSchema   = new Schema({
  name: String,
  badge: Number,
  dob: { type: Date, default: Date.now },
  isloved: Boolean
});

// the schema is useless so far
// we need to create a model using it
var Blob = mongoose.model('Blob', blobSchema);

// make this available to our users in our Node applications
module.exports = Blob;

```
All different APIcalls on schema object GET/PUT/DELETE/POST
```sh
 var router = express.Router();
router.route('/:id')
  .get(function(req, res) {
    Blob.findById(req.id, function (err, blob) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + blob._id);
              res.json(blob);
     
        }
    });
});
router.route('/:id/edit')
    //GET the individual blob by Mongo ID
    .get(function(req, res) {
        //search for the blob within Mongo
       Blob.findById(req.id, function (err, blob) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            } else {
                //Return the blob
                res.json(blob);
            }
        });
    })
    //PUT to update a blob by ID
    .put(function(req, res) {
        // Get our REST or form values. These rely on the "name" attributes
        var name = req.body.name;
        var badge = req.body.badge;
        var dob = req.body.dob;
        var company = req.body.company;
        var isloved = req.body.isloved;

        //find the document by ID
        Blob.findById(req.id, function (err, blob) {
            //update it
            Blob.update({
                name : name,
                badge : badge,
                dob : dob,
                isloved : isloved
            }, function (err, blobID) {
              if (err) {
                  res.send("There was a problem updating the information to the database: " + err);
              } 
              else {
                     res.json(blob);
               }
            })
        });
    })
```



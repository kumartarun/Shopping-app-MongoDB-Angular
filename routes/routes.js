    // server.js
    var Blob = require('../model/blobs');
    // set up ========================
    var express  = require('express');
    var app      = express();                             
    var mongoose = require('mongoose');                   
    var morgan = require('morgan');  
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var router = express.Router();

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'})); 
               // parse application/x-www-form-urlencoded
    //Any requests to this controller must pass through this 'use' function
    //Copy and pasted from method-override
    router.use(bodyParser.urlencoded({ extended: true }))
    router.use(methodOverride(function(req, res){
          if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            var method = req.body._method
            delete req.body._method
            return method
          }
    }))
    // =============================================================================
    // ROUTES FOR OUR API
    // =============================================================================
    router.route('/')
    .get(function(req, res, next) {
        //retrieve all blobs from Monogo
     // use mongoose to get all todos in the database
        Blob.find(function(err, blobs) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
               res.send(err)

            res.json(blobs); // return all todos in JSON format
        });
    })
    .post(function(req, res) {
       
        // create a todo, information comes from AJAX request from Angular
        Blob.create({
        name : req.body.name,
        badge : req.body.badge,
        dob : req.body.dob,
        company : req.body.company,
        isloved : req.body.isloved
        }, function(err, blobs) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Blob.find(function(err, blobs) {
                if (err)
                    res.send(err)
                res.json(blobs);
            });
        });
    });
    // route middleware to validate :id
    router.param('id', function(req, res, next, id) {
        console.log('validating ' + id + ' exists');
        //find the ID in the Database
        Blob.findById(id, function (err, blob) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;                         
            res.json({message : err.status  + ' ' + err});
                 
            
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});
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
    //DELETE a Blob by ID
    .delete(function (req, res){
        //find blob by ID
       Blob.findById(req.id, function (err, blob) {
            if (err) {
                return console.error(err);
            } else {
                //remove it from Mongo
                console.log(blob);
                Blob.remove({
                    _id: req.id
                     }, function(err, blob) {
                 if (err)
                res.send(err);

               res.json({ message: 'Successfully deleted' });
                 });
            }
        });
    });
    module.exports = router;


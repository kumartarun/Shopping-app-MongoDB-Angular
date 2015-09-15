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
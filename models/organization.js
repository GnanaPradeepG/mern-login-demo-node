let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let passportLocalMongoose = require('passport-local-mongoose');

let Organization = new Schema({
    organization : {
        type : String,
        default : ''
    },
    website: {
      type: String,
        default: ''
    },
    description: {
      type: String,
        default: ''
    },
    address : {
        type : String,
        default : ''
    },
    contactPerson : {
        type : String,
        default : ''
    },
    email : {
        type : String,
        default : ''
    },
    ContactNo:   {
        type: Boolean,
        default: false
    }

});

Organization.plugin(passportLocalMongoose);

module.exports = mongoose.model('Organization', Organization);
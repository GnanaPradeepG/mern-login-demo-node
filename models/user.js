let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let passportLocalMongoose = require('passport-local-mongoose');

let User = new Schema({
    organization : {
        type : String,
        default : ''
    },
    firstname: {
      type: String,
        default: ''
    },
    lastname: {
      type: String,
        default: ''
    },
    email : {
        type : String,
        default : '',
        Unique : true
    },
    contactNo : {
        type : String,
        default : '',
        Unique : true
    },
    address : {
        type : String,
        default : ''
    },
    isAdmin:   {
        type: Boolean,
        default: false
    },
    isSuperAdmin : {
        type : Boolean,
        default : false
    },
    role : {
        type : String,
        default : ''
    }

});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
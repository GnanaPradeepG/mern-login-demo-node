let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let passportLocalMongoose = require('passport-local-mongoose');

let Role = new Schema({
    role : {
        type : String,
        default : ''
    },
    description: {
      type: String,
        default: ''
    },
    organization: {
      type: String,
        default: ''
    }
});

Role.plugin(passportLocalMongoose);

module.exports = mongoose.model('Role', Role);
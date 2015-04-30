var mongoose = require('mongoose');

var Schemda = mongoose.Schema;

var userSchema = new Schemda({

    userName: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        unique: true,
        required: true
    },


    mail: {
        type: String,
        unique: true,
        required: true
    },

    fullName: {
        type: String
    },

    admin: {
        type: Boolean,
        default: false
    },

    sessions: {
        type: Array
    }


});

exports.UserModel = mongoose.model('User', userSchema);
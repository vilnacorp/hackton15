var mongoose = require('mongoose');

var Schemda = mongoose.Schema;

var SESSION = 'Session';
var QUESTION = 'Question';
var USER = 'User';

var userSchema = new Schemda({

    username: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },


    email: {
        type: String,
        unique: true,
        required: true
    },

    name: {
        type: String
    },

    admin: {
        type: Boolean,
        default: false
    },

    sessions: {
        type: [{
            type: Schemda.Types.ObjectId,
            ref: SESSION
        }]
    }


});

var sessions = {

    courseNumber: {
        type: String,
        unique: true
    },

    title: {
        type: String
    },

    createBy: {
        type: String
    }


};

var question = {

    courseNumber: {
        type: Schemda.Types.ObjectId,
        ref: SESSION
    },

    title: {
        type: String,
        required: true
    },

    sender: {
        type: String
    },

    answered: {
        type: Boolean,
        default: false
    },

    date: {
        type: Date,
        default: Date.now()
    },

    votedByUsers: {
        type: [{
            type: String
        }]
    }


};


exports.UserModel = mongoose.model(USER, userSchema);
exports.SessionModel = mongoose.model(SESSION, sessions);
exports.QuestionModel = mongoose.model(QUESTION, question);
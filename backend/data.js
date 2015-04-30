var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');


var schemas = require('./schemas');
var UserModel = schemas.UserModel;
var SessionModel = schemas.SessionModel;
var QuestionModel = schemas.QuestionModel;

exports.validateLogin = function (obj, handler) {

    UserModel.findOne({'username': obj.userName}, function (err, user) {

        if (!err) {

            handler(loginStatus.ERROR.NO_USER);

        } else {

            if (user.password === obj.toObject().password) {

                if (user.admin) {

                    handler(loginStatus.ADMIN);

                } else {

                    handler(loginStatus.USER);

                }

            } else {

                handler(loginStatus.BAD_PASSWORD);

            }
        }
    });

};

exports.register = function (obj, handler) {

    var user = new UserModel(obj);

    user.save(function (err) {
        if (err) {
            handler(registerStatus.ERROR);
        } else {
            handler(registerStatus.OK);
        }
    })
};

exports.isAdmin = function (obj, handler) {

    UserModel.findOne({userName: obj.username}, function (error, user) {

        if (error) {
            handler(false);
        } else {
            handler(user.admin);
        }
    });

};

exports.getSessions = function (obj, handler) {

    UserModel.findOne({userName: obj.username}).populate('sessions').exec(function (error, user) {


        if (err) {
            handler(error);
        } else {
            handler(null, user.toObject().sessions);
        }

    });

};

exports.getQuestionsBySession = function (obj, handler) {

    var username = obj.username;
    var courseNumber = obj.sessionId;

    var now = Date.now();

    QuestionModel.find({
        "courseNumber": courseNumber,
        "date": {
            "$gte": new Date(now.getYear(), now.getMonth(), now.getDay()),
            "$lt": new Date(now.getYear(), now.getMonth(), now.getDay() + 1)
        }
    }).populate("votedByUsers").exec(function (error, questions) {

        if (error) {
            handler(error);
        } else {
            var res = [];
            for (var i = 0; i < questions.length; i++) {
                var question = questions[i];
                res.push({
                    questionTitle: question.title,
                    ranking: question.votedByUsers.length,
                    status: question.status,
                    date: question.date,
                    sender: question.sender,
                    voted: question.votedByUsers.indexOf(username) !== -1
                });
            }
            handler(null, res);
        }

    });

};

exports.addSession = function (obj, handler) {

    var session = new SessionModel({
        courseNumber: obj.sessionId,
        title: obj.title,
        createdBy: mongoose.Types.ObjectId(obj.username)
    });

};

var loginStatus = {
    ADMIN: 0,
    USER: 1,
    ERROR: {
        NO_USER: 0,
        BAD_PASSWORD: 1
    }
};

exports.loginStatus = loginStatus;

var registerStatus = {
    ERROR: 1,
    OK: 0
};

exports.registerStatus = registerStatus;
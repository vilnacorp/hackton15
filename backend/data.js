var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');


var schemas = require('./schemas');
var UserModel = schemas.UserModel;
var SessionModel = schemas.SessionModel;
var QuestionModel = schemas.QuestionModel;

exports.validateLogin = function (obj, handler) {

    UserModel.findOne({
        'username': obj.userName,
        "password": obj.password
    }, function (err, user) {

        if (!err) {

            handler(err);

        } else {

            handler(null, user.admin);

        }
    });

};

exports.register = function (obj, handler) {

    var user = new UserModel(obj);

    user.save(function (err) {
        if (err) {
            handler(err);
        } else {
            handler(null, user.admin);
        }
    })
};

exports.getName = function (obj, handler) {

    UserModel.findOne({'username': obj.userName}, function (err, user) {

        if (!err) {

            handler(loginStatus.ERROR.NO_USER);

        } else {

            handler(null, user.fullName);
        }
    });

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

    session.save(function (err) {

        if (err) {

            handler(err);

        } else {

            handler(null, "saved");

        }
    });

};

exports.joinToSession = function (obj, handler) {

    var sessionId = obj.sessionId;
    var username = obj.username;

    SessionModel.findOne({"courseNumber": sessionId}).exec(function (err, session) {

        if (err) {
            handler(err);
        } else {


            UserModel.findAndUpdate({"username": username},
                {
                    $push: {sessions: mongoose.Types.ObjectId(obj.sessionId)}
                },
                function (err) {
                    handler(err);
                }
            );
        }

    });

};

exports.addQuestion = function (obj, handler) {

    var question = new QuestionModel({
        "courseNumber": obj.sessionId,
        "title": obj.title,
        "sender": obj.sender
    });

    question.save(function (err, q) {

        if (err) {
            handler(err);
        } else {
            handler(null, q._id);
        }
    });

};

exports.voteToQuestion = function (obj, handler) {

    var username = obj.username;
    var questionId = obj.questionId;

    QuestionModel.findById(questionId, function (err, question) {

        if (err) {
            handler(err);
        } else {

            var type = question.votedByUsers.indexOf(username) !== -1 ? $pop : $push;

            var update = {};
            update[type] = {votedByUsers: username};
            QuestionModel.findByIdAndUpdate(questionId, {"username": username},
                update,
                function (err) {
                    handler(err);
                }
            );
        }

    });

};

exports.answerQuestion = function (obj, handler) {

    var questionId = obj.questionId;

    QuestionModel.findByIdAndUpdate(questionId, {"answered": true}, function (err, question) {

        if (err) {

            handler(err);

        } else {

            handler();
        }

    });

};
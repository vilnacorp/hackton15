var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test3', function (err) {

});


var schemas = require('./schemas');
var UserModel = schemas.UserModel;
var SessionModel = schemas.SessionModel;
var QuestionModel = schemas.QuestionModel;

exports.validateLogin = function (obj, handler) {


    UserModel.findOne({
        'username': obj.username,
        "password": obj.password
    }, function (err, user) {

        if (err || !user) {

            console.log(user ? "user exist" : "user don't exist");
            handler(true);

        } else {

            handler(null, user.admin);

        }
    });

};

exports.register = function (obj, handler) {

    var user = new UserModel(obj);

    user.save(function (err, u) {
        if (err || !u) {

            handler(true);
        } else {
            handler(null, u.admin);
        }
    })
};

exports.getName = function (obj, handler) {


    UserModel.findOne({'username': obj.username}, function (err, user) {


        console.log(user)

        if (err || !user) {

            handler(true);

        } else {

            handler(null, user.name);
        }
    });

};

exports.validateUserName = function (obj, handler) {


    UserModel.findOne({
        username: obj.username
    }, function (error, user) {

        if (error || !user) {
            handler(false, false);
        } else {
            handler(true, user.admin);
        }
    });

};

exports.getSessions = function (obj, handler) {


    UserModel.findOne({"userName": obj.username}).populate('sessions').exec(function (err, user) {


        if (err || !user) {
            handler(true);
        } else {

            handler(null, user.toObject().sessions);
        }

    });

};

exports.getQuestionsBySession = function (obj, handler) {

    var username = obj.username;
    var courseNumber = obj.sessionId;

    var now = new Date();

    SessionModel.findOne({"courseNumber": courseNumber}, function (err, session) {

        if (err) {
            handler(false);
            return;
        }

        //
        //,
        //"date": {
        //    "$gte": new Date(now.getFullYear(), now.getMonth(), now.getDay()),
        //        "$lt": new Date(now.getFullYear(), now.getMonth(), now.getDay() + 1)

        QuestionModel.find({
            "courseNumber": session._id
        }).exec(function (error, questions) {

            var res = [];
            for (var i = 0; i < questions.length; i++) {
                var question = questions[i];
                res.push({
                    questionId: question._id,
                    questionTitle: question.title,
                    ranking: question.votedByUsers.length,
                    status: question.status,
                    time: question.date.getHours() + ":" + question.date.getMinutes() + ":" +
                    question.date.getSeconds(),
                    sender: question.sender,
                    answered: question.answered,
                    voted: question.votedByUsers.indexOf(username) !== -1
                });
            }
            handler(null, res);

        });

    });


};

exports.addSession = function (obj, handler) {

    var session = new SessionModel({
        courseNumber: obj.sessionId,
        title: obj.title,
        createdBy: obj.username
    });

    session.save(function (err) {

        if (err) {

            handler(true);

        } else {

            handler(null, "saved");

        }
    });

};

exports.addSession({
    sessionId: 52005,
    username: "vilna",
    title: "vilna"
}, function () {
});

exports.joinToSession = function (obj, handler) {

    var sessionId = obj.sessionId;
    var username = obj.username;

    SessionModel.findOne({"courseNumber": sessionId}).exec(function (err, session) {

        if (err || !session) {

            handler(true);
        } else {


            UserModel.findOneAndUpdate({"username": username},
                {
                    $push: {sessions: session._id}
                },
                function (err) {
                    handler(err);
                }
            );
        }

    });

};

exports.addQuestion = function (obj, handler) {


    SessionModel.findOne({"courseNumber": obj.sessionId}, function (err, session) {

        if (err) {
            handler(false);
            return;
        }
        var question = new QuestionModel({
            "courseNumber": session._id,
            "title": obj.questionTitle,
            "sender": obj.sender,
            "votedByUsers": [obj.username]
        });

        question.save(function (err, q) {

            if (err || !q) {
                handler(true);
            } else {
                handler(null, q._id);
            }
        });
    });

};

exports.voteToQuestion = function (obj, handler) {

    var username = obj.username;
    var questionId = obj.questionId;

    QuestionModel.findById(questionId, function (err, question) {

        if (err || !question) {
            handler(true);
        } else {

            var number = question.votedByUsers.indexOf(username);

            if (number !== -1) {
                question.votedByUsers.splice(number, 1);
            } else {
                question.votedByUsers.push(username);
            }

            question.save(function (err) {

                if (err) {
                    handler(err)
                } else {
                    handler(false)
                }
            });


        }

    });

};

exports.answerQuestion = function (obj, handler) {

    var questionId = obj.questionId;

    QuestionModel.findByIdAndUpdate(questionId, {"answered": true}, function (err, question) {

        if (err || !question) {


            handler(true);

        } else {

            handler();
        }

    });

};
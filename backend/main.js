/**
 * Created by danny on 30/04/15.
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var data = require('./data');

var app = express();

exports.backend = app;

var morgan = require('morgan');


app.use(cookieParser());


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));


app.use(morgan('combined'));

app.use(function (req, res, next) { // check admin cookie

    req.locals = {};
    if (req.cookies.username) {

        data.validateUserName({username: req.cookies.username}, function (validUser, isAdmin) {
            if (validUser) {

                req.locals.username = req.cookies.username;
            }
            req.locals.admin = isAdmin;
            next();
        });
    } else {

        req.locals.admin = false;
        next();

    }

});

app.get("/session", function (req, res) {
    var obj = {username: req.locals.username};

    data.getSessions(obj, function (err, sessions) {
        if (err) {
            res.status(400).send();
        }
        else {
            res.send(sessions);
        }
    });
});

app.post("/session", function (req, res) {
    var responseObj = {};

    if (!req.locals.admin) {
        res.status(401).send();

        return;
    }


    var obj = {
        title: req.param("title"),
        username: req.locals.username,
        sessionId: req.body.sessionId
    };


    data.addSession(obj, function (err, status) {
        if (err) {
            res.status(400);
        }
        else {
            responseObj.status = status;
        }
        res.send(responseObj);
    });
});

app.get("/session/:id", function (req, res) {
    var obj = {
        username: req.locals.username,
        sessionId: req.params.id
    };
    data.getQuestionsBySession(obj, function (err, questions) {
        if (err) {
            res.status(400).send();
        }
        else {
            res.send(questions);
        }
    });
});

app.post("/session/join", function (req, res) {

    var responseObj = {};
    var obj = {
        username: req.locals.username,
        sessionId: req.param("sessionId")
    };
    data.joinToSession(obj, function (err) {

        console.log(err);

        console.log(req.locals);

        if (err) {
            if (req.locals.admin) {

                data.addSession(obj, function (err, status) {
                    if (err) {
                        res.status(400);
                    }
                    else {
                        responseObj.status = status;
                    }
                    res.send(responseObj);
                });
                return;

            } else {

                res.status(400);
            }
        }
        else {
            responseObj.status = "ok";
        }
        res.send(responseObj);
    });
});

app.post("/session/:id/question", function (req, res) {
    var responseObj = {};


    var func = function (err, name) {


        var obj = {
            questionTitle: req.body.questionTitle,
            sessionId: req.params.id,
            sender: name,
            username: req.locals.username
        };

        data.addQuestion(obj, function (err, questionId) {


            if (err) {
                res.send();
                res.status(400);
            }
            else {
                responseObj.questionId = questionId;
            }

            res.send(responseObj);
        });
    };


    if (!req.body.anonymous || req.body.anonymous === "false") {

        data.getName({username: req.locals.username}, func);
    }
    else {
        func(null, "");
    }
});

app.put("/session/:id/question/:qid/vote", function (req, res) {
    var responseObj = {};
    var obj = {
        sessionId: req.params.id,
        questionId: req.params.qid,
        type: req.param("type"),
        username: req.locals.username
    };
    data.voteToQuestion(obj, function (err, newRank) {
        if (err) {
            res.status(400);
        }
        else {
            responseObj.newRank = newRank;
        }
        res.send(responseObj);
    });
});

app.put("/session/:id/question/:qid/answer", function (req, res) {

    var obj = {
        sessionId: req.params.id,
        questionId: req.params.qid
    };

    if (req.locals.admin) {

        data.answerQuestion(obj, function (err) {
            if (err) {
                res.status(400);
            }
        });
    } else {
        res.status(401);
    }

    res.send({});


});

app.post("/login", function (req, res) {
    var username = req.param("username");
    var responseObj = {};
    var obj = {
        username: username,
        password: req.param("password")
    };

    data.validateLogin(obj, function (err, admin) {
        if (err) {
            res.status(400);
        }
        else {
            responseObj.admin = admin;
            res.cookie('username', username);
        }
        res.send(responseObj);
    });
});

app.post("/register", function (req, res) {

    var responseObj = {};
    var username = req.body.username;
    var obj = {
        username: username,
        password: req.body.password,
        email: req.body.email,
        name: req.body.name,
        admin: isValidAdminId(req.body.adminId)
    };
    data.register(obj, function (err, admin) {
        if (err) {
            res.status(400);
        }
        else {
            responseObj.admin = admin;
            res.cookie('username', username);
        }
        res.send(responseObj)
    });
});

app.get("/logged", function (req, res) {

    var obj = {};

    if (req.locals.username) {
        obj.status = true;
        obj.admin = req.locals.admin;
    } else {
        obj.status = false;
    }

    res.send(obj);

});

function isValidAdminId(id) {
    return (id === "555" || id === "666" || id === "vilna");
}

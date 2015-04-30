x
/**
 * Created by danny on 30/04/15.
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var data = require('./data');

var app = express();

app.use(cookieParser());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.get("/session", function (req, res) {
    var obj = {username: res.params.username};

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

    if (!res.params.isAdmin) {
        res.status(401).send();
        return;
    }
    var obj = {
        title: req.param("title"),
        username: res.params.username
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
        username: res.params.username,
        sessionId: res.params.id
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
        username: res.params.username,
        sessionId: req.param("sessionId")
    };

    data.joinToSession(obj, function (err, status) {
        if (err) {
            res.status(400);
        }
        else {
            responseObj.status = status;
        }
        res.send(responseObj);
    });
});

app.post("/session/:id/question", function (req, res) {
    var responseObj = {};
    var func = function (err, name) {
        var obj = {
            questionTitle: req.param("questionTitle"),
            sessionId: req.params.id,
            sender: name
        };
        data.addQuestion(obj, function (err, questionId) {
            if (err) {
                res.status(400);
            }
            else {
                responseObj.questionId = questionId;
                res.send(responseObj);
            }
        });
    };

    if (!req.param("anonymous")) {
        data.getName(userId, func);
    }
    else {
        func(null, "");
    }
});

app.put("/session/:id/question/:qid/vote", function (req, res) {
    var responseObj = {};
    var obj = {
        sessionId: res.params.id,
        questionId: res.params.qid,
        type: req.param("type")
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
    var responseObj = {};
    var obj = {
        sessionId: res.params.id,
        questionId: res.params.qid
    };
    data.answerQuestion(obj, function (err) {
        if (err) {
            res.status(400);
        }
        res.send();
    });


});

app.post("/login", function (req, res) {
    var param = req.param("username");
    var responseObj = {};
    var obj = {
        username: param,
        password: req.param("password")
    };

    data.validateLogin(obj, function (err, admin) {
        if (err) {
            res.status(400);
        }
        else {
            responseObj.admin = admin;
            res.cookie('username', param)
        }
        res.send(responseObj);
    });
});

app.post("/register", function (req, res) {
    var responseObj = {};
    var obj = {
        username: req.param("username"),
        password: req.param("password"),
        email: req.param("email"),
        name: req.param("name"),
        admin: isValidAdminId(req.param("adminId"))
    };
    data.register(obj, function (err, status, admin) {
        if (err) {
            res.status(400);
        }
        else {
            responseObj.admin = admin;
        }
        res.send(responseObj)
    });
});

function isValidAdminId(id) {
    return !!(id === "555" || id === "666" || id === "vilna");
}

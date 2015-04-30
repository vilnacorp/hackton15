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

app.post("/login", function (req, res) {

    var obj = {
        username: req.param("username"),
        password: req.param("password")
    };

    data.validateLogin(obj, function (status) {

        var responseObj = {};
        switch (status) {
            case data.statusLogin.ADMIN:
                responseObj.status = "ok";
                responseObj.admin = true;
                break;

            case data.statusLogin.USER:
                responseObj.status = "ok";
                responseObj.admin = false;
                break;

            case data.statusLogin.ERROR.NO_USER:
                responseObj.status = "no such user";
                break;

            case data.statusLogin.ERROR.BAD_PASSWORD:
                responseObj.status = "bad password";
                break;

        }

        // TODO coookie

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
    data.register(obj, function (status) {
        responseObj.status = status;
        res.send(responseObj)
    });
});

function isValidAdminId(id) {
    return !!(id === "555" || id === "666" || id === "vilna");
}

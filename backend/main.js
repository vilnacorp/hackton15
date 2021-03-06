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

    var username = req.param("username");
    var password = req.param("password");

    var status = data.validateLogin(username, password);

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

    res.send(responseObj);

});
